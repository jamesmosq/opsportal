// ─── APPS BASE ───────────────────────────────────────────────────────────────
// Edita este array para agregar/modificar apps permanentes.
// Las apps agregadas desde la UI (+) se guardan en localStorage.
//
// platform: 'railway' | 'laravel'
// status:   'ok' | 'crash' | 'never'
// url:      URL directa al dashboard en Railway o Laravel Cloud
// github:   URL al repo ('' si no aplica)
const BASE_APPS = [
  // Railway
  { name: 'NominaeduN',            initials: 'NN', platform: 'railway', status: 'ok',    desc: 'SaaS educativo — NestJS + Prisma',      url: 'https://railway.app', github: 'https://github.com/jamesmosq' },
  { name: 'Secretaria Salud',      initials: 'SS', platform: 'railway', status: 'ok',    desc: '2/2 servicios online',                  url: 'https://railway.app', github: '' },
  { name: 'ContaEdu',              initials: 'CE', platform: 'railway', status: 'ok',    desc: 'Contabilidad educativa',                url: 'https://railway.app', github: 'https://github.com/jamesmosq/contaedu' },
  { name: 'SstEdu',                initials: 'SE', platform: 'railway', status: 'ok',    desc: '2/2 servicios online',                  url: 'https://railway.app', github: '' },
  { name: 'saar-CRM',              initials: 'SC', platform: 'railway', status: 'ok',    desc: 'CRM en Ruby on Rails',                 url: 'https://railway.app', github: '' },
  { name: 'Comparador',            initials: 'CO', platform: 'railway', status: 'ok',    desc: 'Agrupador llamadas de asistencia',      url: 'https://railway.app', github: 'https://github.com/jamesmosq/comparador' },
  { name: 'Lacarta',               initials: 'LC', platform: 'railway', status: 'ok',    desc: 'Primera SaaS con Laravel',             url: 'https://railway.app', github: 'https://github.com/jamesmosq/lacarta' },
  { name: 'Diagnóstico Comercial', initials: 'DC', platform: 'railway', status: 'crash', desc: '1/2 servicio caído',                   url: 'https://railway.app', github: '' },

  // Laravel Cloud
  { name: 'cfitam',     initials: 'CF', platform: 'laravel', status: 'ok',    desc: 'Sitio institucional CEFIT — Statamic CMS', url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/cfitam' },
  { name: 'contaedu',   initials: 'CE', platform: 'laravel', status: 'ok',    desc: 'Actualizado hace 20 horas',               url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/contaedu' },
  { name: 'lacarta',    initials: 'LC', platform: 'laravel', status: 'ok',    desc: 'Avances controllers, models, views',      url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/lacarta' },
  { name: 'comparador', initials: 'CO', platform: 'laravel', status: 'never', desc: 'Nunca desplegado',                        url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/comparador' },
  { name: 'completo',   initials: 'CP', platform: 'laravel', status: 'ok',    desc: 'Sembrando seeder y listo',                url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/completo' },
  { name: 'diplomado',  initials: 'DI', platform: 'laravel', status: 'ok',    desc: 'First commit',                           url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/diplomado' },
  { name: 'produccion', initials: 'PR', platform: 'laravel', status: 'ok',    desc: 'Subiendo proyecto a cloud',              url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/produccion' },
  { name: 'subiendo',   initials: 'SU', platform: 'laravel', status: 'ok',    desc: 'Update admin credentials',               url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/subiendo' },
];
// ─────────────────────────────────────────────────────────────────────────────

// ─── ESTADO ──────────────────────────────────────────────────────────────────
let activeFilter   = 'all';
let customApps     = JSON.parse(localStorage.getItem('ops_custom_apps')    || '[]');
let liveStatuses   = JSON.parse(localStorage.getItem('ops_live_statuses')  || '{}');

function allApps()      { return [...BASE_APPS, ...customApps]; }
function saveCustom()   { localStorage.setItem('ops_custom_apps', JSON.stringify(customApps)); }

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

// ─── RENDER PRINCIPAL ────────────────────────────────────────────────────────
function render() {
  const q    = document.getElementById('search').value.toLowerCase().trim();
  const apps = allApps();

  const filtered = apps.filter(a => {
    const s      = liveStatuses[a.name] || a.status;
    const matchQ = !q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
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

  // secciones
  const railway = filtered.filter(a => a.platform === 'railway');
  const laravel  = filtered.filter(a => a.platform === 'laravel');

  const renderSection = (label, dotClass, list) => {
    if (!list.length) return '';
    let s = `<div class="platform-section">
      <div class="platform-label"><span class="platform-dot ${dotClass}"></span>${label}</div>`;

    list.forEach(a => {
      const s_status   = liveStatuses[a.name] || a.status;
      const isCustom   = customApps.some(c => c.name === a.name);
      const deleteBtn  = isCustom
        ? `<button class="gh-link" title="Eliminar app" onclick="deleteApp('${a.name}', event)" style="color:var(--text-muted)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
           </button>`
        : '';

      s += `<a class="app-card status-${s_status}" href="${a.url}" target="_blank" rel="noopener">
        <div class="app-left">
          <div class="app-avatar av-${a.platform}" aria-hidden="true">${a.initials}</div>
          <div class="app-info">
            <div class="app-name">${a.name}${isCustom ? '<span class="custom-marker" title="App agregada manualmente">★</span>' : ''}</div>
            <div class="app-desc">${a.desc}</div>
          </div>
        </div>
        <div class="app-right">
          ${deleteBtn}
          ${ghIcon(a.github)}
          ${badge(s_status)}
          <span class="arrow" aria-hidden="true">›</span>
        </div>
      </a>`;
    });

    return s + '</div>';
  };

  let html = renderSection('Railway', 'dot-railway', railway)
           + renderSection('Laravel Cloud', 'dot-laravel', laravel);

  if (!html) {
    html = `<div class="empty">
      <div class="empty-label">// sin resultados</div>
      <span>${q ? `ninguna app coincide con "<strong>${q}</strong>"` : 'sin apps en este filtro'}</span>
    </div>`;
  }

  document.getElementById('app-list').innerHTML = html;
}

// ─── FILTROS ─────────────────────────────────────────────────────────────────
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
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
  fetchRailwayStatus().finally(() => {
    setTimeout(() => btn.classList.remove('spinning'), 800);
  });
  updateTimestamp();
}

// ─── MODAL: RAILWAY TOKEN ────────────────────────────────────────────────────
function showTokenModal() {
  const has = !!localStorage.getItem('ops_railway_token');
  document.getElementById('token-input').value = has ? '••••••••' : '';
  document.getElementById('token-modal').removeAttribute('hidden');
}

function closeTokenModal() {
  document.getElementById('token-modal').setAttribute('hidden', '');
}

function saveToken() {
  const val = document.getElementById('token-input').value.trim();
  if (val && val !== '••••••••') {
    localStorage.setItem('ops_railway_token', val);
    showToast('Token guardado — conectando...');
    closeTokenModal();
    fetchRailwayStatus();
  } else {
    closeTokenModal();
  }
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

function saveApp() {
  const name     = document.getElementById('add-name').value.trim();
  const initials = document.getElementById('add-initials').value.trim().toUpperCase().slice(0, 2);
  const platform = document.getElementById('add-platform').value;
  const desc     = document.getElementById('add-desc').value.trim();
  const url      = document.getElementById('add-url').value.trim();
  const github   = document.getElementById('add-github').value.trim();

  if (!name || !initials || !url) {
    showToast('nombre, iniciales y URL son obligatorios');
    return;
  }

  if (allApps().some(a => a.name.toLowerCase() === name.toLowerCase())) {
    showToast(`"${name}" ya existe`);
    return;
  }

  customApps.push({ name, initials, platform, status: 'ok', desc: desc || platform, url, github });
  saveCustom();
  closeAddModal();
  render();
  showToast(`"${name}" agregada`);
}

function deleteApp(name, event) {
  event.preventDefault();
  event.stopPropagation();
  customApps = customApps.filter(a => a.name !== name);
  saveCustom();
  render();
  showToast(`"${name}" eliminada`);
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
document.getElementById('token-modal').addEventListener('click', e => {
  if (e.target.id === 'token-modal') closeTokenModal();
});
document.getElementById('add-modal').addEventListener('click', e => {
  if (e.target.id === 'add-modal') closeAddModal();
});

// ─── PWA SERVICE WORKER ──────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ─── INIT ────────────────────────────────────────────────────────────────────
// Ocultar modales al inicio (usando hidden attribute)
document.getElementById('token-modal').setAttribute('hidden', '');
document.getElementById('add-modal').setAttribute('hidden', '');

updateTimestamp();
render();

if (localStorage.getItem('ops_railway_token')) fetchRailwayStatus();
