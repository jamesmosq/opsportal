// Apps iniciales — se insertan solo si la tabla está vacía al primer arranque.
const BASE_APPS = [
  // Railway
  { name: 'NominaeduN',            initials: 'NN', platform: 'railway', status: 'ok',    description: 'SaaS educativo — NestJS + Prisma',      url: 'https://railway.app', github: 'https://github.com/jamesmosq' },
  { name: 'Secretaria Salud',      initials: 'SS', platform: 'railway', status: 'ok',    description: '2/2 servicios online',                  url: 'https://railway.app', github: '' },
  { name: 'ContaEdu',              initials: 'CE', platform: 'railway', status: 'ok',    description: 'Contabilidad educativa',                url: 'https://railway.app', github: 'https://github.com/jamesmosq/contaedu' },
  { name: 'SstEdu',                initials: 'SE', platform: 'railway', status: 'ok',    description: '2/2 servicios online',                  url: 'https://railway.app', github: '' },
  { name: 'saar-CRM',              initials: 'SC', platform: 'railway', status: 'ok',    description: 'CRM en Ruby on Rails',                 url: 'https://railway.app', github: '' },
  { name: 'Comparador',            initials: 'CO', platform: 'railway', status: 'ok',    description: 'Agrupador llamadas de asistencia',      url: 'https://railway.app', github: 'https://github.com/jamesmosq/comparador' },
  { name: 'Lacarta',               initials: 'LC', platform: 'railway', status: 'ok',    description: 'Primera SaaS con Laravel',             url: 'https://railway.app', github: 'https://github.com/jamesmosq/lacarta' },
  { name: 'Diagnóstico Comercial', initials: 'DC', platform: 'railway', status: 'crash', description: '1/2 servicio caído',                   url: 'https://railway.app', github: '' },

  // Laravel Cloud
  { name: 'cfitam',     initials: 'CF', platform: 'laravel', status: 'ok',    description: 'Sitio institucional CEFIT — Statamic CMS', url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/cfitam' },
  { name: 'contaedu',   initials: 'CE', platform: 'laravel', status: 'ok',    description: 'Actualizado hace 20 horas',               url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/contaedu' },
  { name: 'lacarta',    initials: 'LC', platform: 'laravel', status: 'ok',    description: 'Avances controllers, models, views',      url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/lacarta' },
  { name: 'comparador', initials: 'CO', platform: 'laravel', status: 'never', description: 'Nunca desplegado',                        url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/comparador' },
  { name: 'completo',   initials: 'CP', platform: 'laravel', status: 'ok',    description: 'Sembrando seeder y listo',                url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/completo' },
  { name: 'diplomado',  initials: 'DI', platform: 'laravel', status: 'ok',    description: 'First commit',                           url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/diplomado' },
  { name: 'produccion', initials: 'PR', platform: 'laravel', status: 'ok',    description: 'Subiendo proyecto a cloud',              url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/produccion' },
  { name: 'subiendo',   initials: 'SU', platform: 'laravel', status: 'ok',    description: 'Update admin credentials',               url: 'https://cloud.laravel.com/org/james-mosquera-renteria/applications', github: 'https://github.com/jamesmosq/subiendo' },
];

async function initDB(db) {
  // Crear tabla si no existe
  await db.query(`
    CREATE TABLE IF NOT EXISTS apps (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(100)  NOT NULL,
      initials    CHAR(2)       NOT NULL,
      platform    VARCHAR(50)   NOT NULL,
      status      ENUM('ok','crash','never','building') NOT NULL DEFAULT 'ok',
      description VARCHAR(255)  NOT NULL DEFAULT '',
      url         VARCHAR(500)  NOT NULL,
      github      VARCHAR(500)  NOT NULL DEFAULT '',
      created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Sembrar solo si la tabla está vacía
  const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM apps');
  if (Number(total) > 0) {
    console.log(`DB lista — ${total} apps registradas`);
    return;
  }

  const values = BASE_APPS.map(a => [
    a.name, a.initials, a.platform, a.status, a.description, a.url, a.github,
  ]);

  await db.query(
    'INSERT INTO apps (name, initials, platform, status, description, url, github) VALUES ?',
    [values],
  );

  console.log(`DB sembrada — ${values.length} apps insertadas`);
}

module.exports = { initDB };
