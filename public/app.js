// ─── PLATAFORMAS ─────────────────────────────────────────────────────────────
// Para agregar una nueva plataforma basta con añadir una entrada aquí.
// No hay que tocar CSS ni HTML — colores, filtros y secciones se generan solos.
const PLATFORMS = {
  railway: {
    label:      'Railway',
    color:      '#7C3AED',
    avatarBg:   'rgba(124,58,237,.15)',
    avatarText: '#A78BFA',
  },
  laravel: {
    label:      'Laravel Cloud',
    color:      '#FF2D20',
    avatarBg:   'rgba(255,45,32,.15)',
    avatarText: '#FCA5A5',
  },
  // vercel: { label: 'Vercel',       color: '#ffffff', avatarBg: 'rgba(255,255,255,.1)',  avatarText: '#e2e8f0' },
  // render: { label: 'Render',       color: '#46E3B7', avatarBg: 'rgba(70,227,183,.12)',  avatarText: '#46E3B7' },
  // flyio:  { label: 'Fly.io',       color: '#7E5BEF', avatarBg: 'rgba(126,91,239,.15)',  avatarText: '#a78bfa' },
};

const PLATFORM_FALLBACK = {
  label: 'Otro', color: '#64748B', avatarBg: 'rgba(100,116,139,.15)', avatarText: '#94A3B8',
};

function getPlatform(key) { return PLATFORMS[key] ?? PLATFORM_FALLBACK; }

// ─── ESTADO ──────────────────────────────────────────────────────────────────
let apps             = null;  // null = cargando, [] = vacío, [...] = listo
let activeFilter     = 'all';
let liveStatuses     = JSON.parse(localStorage.getItem('ops_live_statuses')      || '{}');
let collapsedSections = JSON.parse(localStorage.getItem('ops_collapsed_sections') || '{}');

// ─── API ──────────────────────────────────────────────────────────────────────
async function loadApps() {
  try {
    const res = await fetch('/api/apps');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    apps = await res.json();
  } catch {
    apps = [];
    showToast('No se pudo conectar con la API');
  }
  render();
}

async function apiPost(data) {
  const res = await fetch('/api/apps', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al guardar');
  return json;
}

async function apiPut(id, data) {
  const res = await fetch(`/api/apps/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al actualizar');
  return json;
}

async function apiDelete(id) {
  const res = await fetch(`/api/apps/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || 'Error al eliminar');
  }
}

// ─── RENDER HELPERS ──────────────────────────────────────────────────────────
function badge(status) {
  const map = {
    ok:       '<span class="badge badge-ok">● online</span>',
    crash:    '<span class="badge badge-crash">✖ crashed</span>',
    building: '<span class="badge badge-ok" style="opacity:.75">⟳ building</span>',
    never:    '<span class="badge badge-never">○ no deploy</span>',
  };
  return map[status] ?? map.never;
}

function ghIcon(url) {
  if (!url) return '';
  return `<a class="gh-link" href="${url}" target="_blank" rel="noopener" title="Ver en GitHub" onclick="event.stopPropagation()">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483
        0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
        -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
        .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
        -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0
        012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595
        1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012
        2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  </a>`;
}

function skeletonHTML() {
  const card = `
    <div class="skeleton-card">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-info">
        <div class="skeleton-line" style="width:38%"></div>
        <div class="skeleton-line" style="width:22%;margin-top:6px"></div>
      </div>
      <div class="skeleton-badge"></div>
    </div>`;
  return `
    <div class="platform-section">
      <div class="skeleton-label"></div>
      ${card.repeat(4)}
    </div>
    <div class="platform-section">
      <div class="skeleton-label"></div>
      ${card.repeat(4)}
    </div>`;
}

// ─── RENDER PRINCIPAL ────────────────────────────────────────────────────────
function render() {
  if (apps === null) {
    document.getElementById('app-list').innerHTML = skeletonHTML();
    document.getElementById('stats-bar').innerHTML = '';
    return;
  }

  const q = document.getElementById('search').value.toLowerCase().trim();

  const filtered = apps.filter(a => {
    const s      = liveStatuses[a.name] || a.status;
    const matchQ = !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    const matchF = activeFilter === 'all'
      || activeFilter === a.platform
      || (activeFilter === 'crash' && s === 'crash')
      || (activeFilter === 'never' && s === 'never');
    return matchQ && matchF;
  });

  // stats bar
  const online  = apps.filter(a => (liveStatuses[a.name] || a.status) === 'ok').length;
  const crashed = apps.filter(a => (liveStatuses[a.name] || a.status) === 'crash').length;
  const never   = apps.filter(a => (liveStatuses[a.name] || a.status) === 'never').length;

  document.getElementById('stats-bar').innerHTML = `
    <span class="stat-chip">${apps.length} apps</span>
    <span class="stat-chip chip-ok">${online} online</span>
    ${crashed ? `<span class="stat-chip chip-crash">${crashed} crashed</span>` : ''}
    ${never   ? `<span class="stat-chip">${never} sin deploy</span>` : ''}
  `;

  // crash banner
  const crashedApps = apps.filter(a => (liveStatuses[a.name] || a.status) === 'crash');
  const banner = document.getElementById('crash-banner');
  if (crashedApps.length) {
    banner.classList.add('visible');
    document.getElementById('crash-msg').textContent = crashedApps.length === 1
      ? `${crashedApps[0].name} — servicio caído`
      : `${crashedApps.length} apps con servicios caídos`;
  } else {
    banner.classList.remove('visible');
  }

  // agrupar por plataforma en orden de PLATFORMS
  const byPlatform = {};
  Object.keys(PLATFORMS).forEach(k => { byPlatform[k] = []; });
  filtered.forEach(a => {
    if (!byPlatform[a.platform]) byPlatform[a.platform] = [];
    byPlatform[a.platform].push(a);
  });

  const renderSection = (platformKey, list) => {
    if (!list.length) return '';
    const p          = getPlatform(platformKey);
    const isCollapsed = !!collapsedSections[platformKey];
    const hasCrash   = list.some(a => (liveStatuses[a.name] || a.status) === 'crash');

    let s = `<div class="platform-section">
      <button class="section-header" onclick="toggleSection('${platformKey}')" aria-expanded="${!isCollapsed}">
        <svg class="section-chevron ${isCollapsed ? 'rotated' : ''}" data-section="${platformKey}"
             width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="m6 9 6 6 6-6"/>
        </svg>
        <span class="platform-dot" style="background:${p.color}"></span>
        <span class="section-label">${p.label}</span>
        <span class="section-count">${list.length}</span>
        ${hasCrash ? '<span class="section-crash-dot" title="Hay servicios caídos"></span>' : ''}
      </button>
      <div class="section-body ${isCollapsed ? 'collapsed' : ''}" data-section="${platformKey}">
        <div class="section-inner">`;

    list.forEach(a => {
      const s_status = liveStatuses[a.name] || a.status;

      s += `<a class="app-card status-${s_status}" href="${a.url}" target="_blank" rel="noopener">
        <div class="app-left">
          <div class="app-avatar" style="background:${p.avatarBg};color:${p.avatarText};border-color:${p.color}33" aria-hidden="true">${a.initials}</div>
          <div class="app-info">
            <div class="app-name">${a.name}</div>
            <div class="app-desc">${a.description}</div>
          </div>
        </div>
        <div class="app-right">
          <button class="gh-link" title="Editar app" onclick="showEditModal(${a.id}, event)" style="color:var(--text-muted)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="gh-link" title="Eliminar app" onclick="deleteApp(${a.id}, '${a.name.replace(/'/g, "\\'")}', event)" style="color:var(--text-muted)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
          </button>
          ${ghIcon(a.github)}
          ${badge(s_status)}
          <span class="arrow" aria-hidden="true">›</span>
        </div>
      </a>`;
    });

    return s + '</div></div></div>';
  };

  let html = Object.keys(byPlatform).map(k => renderSection(k, byPlatform[k])).join('');

  if (!html) {
    html = `<div class="empty">
      <div class="empty-label">// sin resultados</div>
      <span>${q ? `ninguna app coincide con "<strong>${q}</strong>"` : 'sin apps en este filtro'}</span>
    </div>`;
  }

  document.getElementById('app-list').innerHTML = html;
}

// ─── SECCIONES COLAPSABLES ────────────────────────────────────────────────────
function toggleSection(key) {
  collapsedSections[key] = !collapsedSections[key];
  localStorage.setItem('ops_collapsed_sections', JSON.stringify(collapsedSections));
  const body    = document.querySelector(`.section-body[data-section="${key}"]`);
  const chevron = document.querySelector(`.section-chevron[data-section="${key}"]`);
  if (!body) return;
  collapsedSections[key] ? body.classList.add('collapsed')    : body.classList.remove('collapsed');
  collapsedSections[key] ? chevron?.classList.add('rotated')  : chevron?.classList.remove('rotated');
}

// ─── FILTROS ─────────────────────────────────────────────────────────────────
function renderFilters() {
  const row      = document.getElementById('filter-row');
  const crashBtn = row.querySelector('[data-filter="crash"]');
  row.querySelectorAll('[data-platform-filter]').forEach(b => b.remove());

  Object.entries(PLATFORMS).forEach(([key, p]) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = key;
    btn.dataset.platformFilter = '1';
    btn.textContent = p.label.toLowerCase();
    btn.onclick = () => setFilter(key, btn);
    row.insertBefore(btn, crashBtn);
  });

  const select = document.getElementById('add-platform');
  select.innerHTML = Object.entries(PLATFORMS)
    .map(([key, p]) => `<option value="${key}">${p.label}</option>`).join('');
}

function setFilter(f, btn) {
  activeFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  (btn || document.querySelector(`[data-filter="${f}"]`))?.classList.add('active');
  render();
}

// ─── RAILWAY API ─────────────────────────────────────────────────────────────
async function fetchRailwayStatus() {
  const token = localStorage.getItem('ops_railway_token');
  if (!token) return;

  try {
    const res = await fetch('https://backboard.railway.app/graphql/v2', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body:    JSON.stringify({
        query: `{ me { projects { edges { node { name services { edges { node {
          serviceInstances { edges { node { latestDeployment { status } } } } } } } } } } } }`,
      }),
    });

    if (!res.ok) { showToast('Error al conectar con Railway API'); return; }

    const { data } = await res.json();
    const statuses = {};

    data?.me?.projects?.edges?.forEach(({ node: p }) => {
      let st = 'ok';
      p.services?.edges?.forEach(({ node: svc }) => {
        svc.serviceInstances?.edges?.forEach(({ node: inst }) => {
          const ds = inst.latestDeployment?.status;
          if (ds === 'FAILED' || ds === 'CRASHED') st = 'crash';
          else if ((ds === 'BUILDING' || ds === 'DEPLOYING') && st !== 'crash') st = 'building';
        });
      });
      statuses[p.name] = st;
    });

    liveStatuses = statuses;
    localStorage.setItem('ops_live_statuses', JSON.stringify(liveStatuses));
    render();
    showToast('Estado actualizado desde Railway');
  } catch {
    showToast('No se pudo conectar con Railway API');
  }
}

function refreshAll() {
  const btn = document.getElementById('refresh-btn');
  btn.classList.add('spinning');
  fetchRailwayStatus().finally(() => setTimeout(() => btn.classList.remove('spinning'), 800));
  updateTimestamp();
}

// ─── MODAL: RAILWAY TOKEN ────────────────────────────────────────────────────
function showTokenModal() {
  document.getElementById('token-input').value = localStorage.getItem('ops_railway_token') ? '••••••••' : '';
  document.getElementById('token-modal').removeAttribute('hidden');
}
function closeTokenModal() { document.getElementById('token-modal').setAttribute('hidden', ''); }
function saveToken() {
  const val = document.getElementById('token-input').value.trim();
  if (val && val !== '••••••••') {
    localStorage.setItem('ops_railway_token', val);
    showToast('Token guardado — conectando...');
    closeTokenModal();
    fetchRailwayStatus();
  } else { closeTokenModal(); }
}
function clearToken() {
  localStorage.removeItem('ops_railway_token');
  liveStatuses = {};
  localStorage.removeItem('ops_live_statuses');
  showToast('Token eliminado');
  closeTokenModal();
  render();
}

// ─── MODAL: AGREGAR APP ──────────────────────────────────────────────────────
function showAddModal() {
  document.getElementById('add-modal').removeAttribute('hidden');
  document.getElementById('add-name').focus();
}
function closeAddModal() {
  document.getElementById('add-modal').setAttribute('hidden', '');
  ['add-name', 'add-initials', 'add-desc', 'add-url', 'add-github']
    .forEach(id => { document.getElementById(id).value = ''; });
}

async function saveApp() {
  const name        = document.getElementById('add-name').value.trim();
  const initials    = document.getElementById('add-initials').value.trim().toUpperCase().slice(0, 2);
  const platform    = document.getElementById('add-platform').value;
  const description = document.getElementById('add-desc').value.trim();
  const url         = document.getElementById('add-url').value.trim();
  const github      = document.getElementById('add-github').value.trim();

  if (!name || !initials || !url) {
    showToast('nombre, iniciales y URL son obligatorios');
    return;
  }

  const saveBtn = document.querySelector('#add-modal .btn-primary');
  saveBtn.disabled = true;
  saveBtn.textContent = 'guardando...';

  try {
    const newApp = await apiPost({ name, initials, platform, description, url, github });
    apps.push(newApp);
    closeAddModal();
    render();
    showToast(`"${name}" agregada`);
  } catch (err) {
    showToast(err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'agregar';
  }
}

// ─── MODAL: EDITAR APP ───────────────────────────────────────────────────────
function showEditModal(id, event) {
  event.preventDefault();
  event.stopPropagation();
  const a = apps.find(x => x.id === id);
  if (!a) return;

  document.getElementById('edit-id').value         = a.id;
  document.getElementById('edit-name').value       = a.name;
  document.getElementById('edit-initials').value   = a.initials;
  document.getElementById('edit-desc').value       = a.description;
  document.getElementById('edit-url').value        = a.url;
  document.getElementById('edit-github').value     = a.github || '';
  document.getElementById('edit-status').value     = a.status;

  const sel = document.getElementById('edit-platform');
  sel.innerHTML = Object.entries(PLATFORMS)
    .map(([key, p]) => `<option value="${key}" ${key === a.platform ? 'selected' : ''}>${p.label}</option>`).join('');

  document.getElementById('edit-modal').removeAttribute('hidden');
  document.getElementById('edit-name').focus();
}

function closeEditModal() {
  document.getElementById('edit-modal').setAttribute('hidden', '');
}

async function saveEditApp() {
  const id          = Number(document.getElementById('edit-id').value);
  const name        = document.getElementById('edit-name').value.trim();
  const initials    = document.getElementById('edit-initials').value.trim().toUpperCase().slice(0, 2);
  const platform    = document.getElementById('edit-platform').value;
  const status      = document.getElementById('edit-status').value;
  const description = document.getElementById('edit-desc').value.trim();
  const url         = document.getElementById('edit-url').value.trim();
  const github      = document.getElementById('edit-github').value.trim();

  if (!name || !initials || !url) {
    showToast('nombre, iniciales y URL son obligatorios');
    return;
  }

  const saveBtn = document.querySelector('#edit-modal .btn-primary');
  saveBtn.disabled = true;
  saveBtn.textContent = 'guardando...';

  try {
    const updated = await apiPut(id, { name, initials, platform, status, description, url, github });
    apps = apps.map(a => a.id === id ? updated : a);
    closeEditModal();
    render();
    showToast(`"${name}" actualizada`);
  } catch (err) {
    showToast(err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'guardar';
  }
}

async function deleteApp(id, name, event) {
  event.preventDefault();
  event.stopPropagation();
  try {
    await apiDelete(id);
    apps = apps.filter(a => a.id !== id);
    render();
    showToast(`"${name}" eliminada`);
  } catch (err) {
    showToast(err.message);
  }
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── TIMESTAMP ───────────────────────────────────────────────────────────────
function updateTimestamp() {
  document.getElementById('last-updated').textContent =
    new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ─── CERRAR MODALES AL TOCAR EL FONDO ────────────────────────────────────────
document.getElementById('token-modal').addEventListener('click', e => { if (e.target.id === 'token-modal') closeTokenModal(); });
document.getElementById('add-modal').addEventListener('click',   e => { if (e.target.id === 'add-modal')   closeAddModal();   });
document.getElementById('edit-modal').addEventListener('click',  e => { if (e.target.id === 'edit-modal')  closeEditModal();  });

// ─── PWA ─────────────────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});

// ─── INIT ────────────────────────────────────────────────────────────────────
document.getElementById('token-modal').setAttribute('hidden', '');
document.getElementById('add-modal').setAttribute('hidden', '');
document.getElementById('edit-modal').setAttribute('hidden', '');

renderFilters();
updateTimestamp();
render();       // muestra skeleton inmediatamente
loadApps();     // carga data desde la API

if (localStorage.getItem('ops_railway_token')) fetchRailwayStatus();
