// ─── EDITA AQUÍ TUS APPS ────────────────────────────────────────────────────
// platform: 'railway' | 'laravel'
// status:   'ok' | 'crash' | 'never'
// url:      URL directa al dashboard en Railway o Laravel Cloud
// github:   URL al repo en GitHub ('' si no aplica)
const APPS = [
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
// ────────────────────────────────────────────────────────────────────────────

let activeFilter = 'all';

function setFilter(f, btn) {
  activeFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function badge(status) {
  const map = {
    ok:    '<span class="badge badge-ok">● online</span>',
    crash: '<span class="badge badge-crash">✖ crashed</span>',
    never: '<span class="badge badge-never">○ no deploy</span>',
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

function renderStats(apps) {
  const total   = APPS.length;
  const online  = APPS.filter(a => a.status === 'ok').length;
  const crashed = APPS.filter(a => a.status === 'crash').length;
  const never   = APPS.filter(a => a.status === 'never').length;

  document.getElementById('stats-bar').innerHTML = `
    <span class="stat-chip">${total} apps</span>
    <span class="stat-chip chip-ok">${online} online</span>
    ${crashed ? `<span class="stat-chip chip-crash">${crashed} crashed</span>` : ''}
    ${never   ? `<span class="stat-chip">${never} sin deploy</span>` : ''}
  `;
}

function render() {
  const q = document.getElementById('search').value.toLowerCase().trim();

  const filtered = APPS.filter(a => {
    const matchQ = !q || a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
    const matchF = activeFilter === 'all'
      || activeFilter === a.platform
      || (activeFilter === 'crash' && a.status === 'crash');
    return matchQ && matchF;
  });

  // Crash banner
  const crashed = APPS.filter(a => a.status === 'crash');
  const banner  = document.getElementById('crash-banner');
  if (crashed.length > 0) {
    banner.classList.add('visible');
    document.getElementById('crash-msg').textContent =
      crashed.length === 1
        ? `${crashed[0].name} — 1 servicio caído`
        : `${crashed.length} apps con servicios caídos`;
  } else {
    banner.classList.remove('visible');
  }

  const railway = filtered.filter(a => a.platform === 'railway');
  const laravel  = filtered.filter(a => a.platform === 'laravel');

  let html = '';

  function renderSection(label, dotClass, apps) {
    if (!apps.length) return '';
    let s = `<div class="platform-section">
      <div class="platform-label"><span class="platform-dot ${dotClass}"></span>${label}</div>`;
    apps.forEach(a => {
      s += `<a class="app-card status-${a.status}" href="${a.url}" target="_blank" rel="noopener">
        <div class="app-left">
          <div class="app-avatar av-${a.platform}" aria-hidden="true">${a.initials}</div>
          <div class="app-info">
            <div class="app-name">${a.name}</div>
            <div class="app-desc">${a.desc}</div>
          </div>
        </div>
        <div class="app-right">
          ${ghIcon(a.github)}
          ${badge(a.status)}
          <span class="arrow" aria-hidden="true">›</span>
        </div>
      </a>`;
    });
    return s + '</div>';
  }

  html += renderSection('Railway', 'dot-railway', railway);
  html += renderSection('Laravel Cloud', 'dot-laravel', laravel);

  if (!html) {
    html = `<div class="empty">
      <div class="empty-label">// sin resultados</div>
      <span>ninguna app coincide con "<strong>${q}</strong>"</span>
    </div>`;
  }

  document.getElementById('app-list').innerHTML = html;
  renderStats();
}

// Init
const now = new Date();
document.getElementById('last-updated').textContent =
  now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

render();
