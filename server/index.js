require('dotenv').config();

const express = require('express');
const path    = require('path');
const db      = require('./db');
const { initDB } = require('./seed');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ─── API ──────────────────────────────────────────────────────────────────────
app.use('/api/apps',    require('./routes/apps'));
app.use('/api/railway', require('./routes/railway'));

// ─── SPA fallback ────────────────────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ─── Arranque ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initDB(db);
    app.listen(PORT, () => {
      console.log(`OpsPortal ▶  http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('─── ERROR AL INICIAR ───────────────────────');
    console.error(err);
    console.error('Variables DB:', {
      MYSQLHOST:     process.env.MYSQLHOST     || '(no definida)',
      MYSQLPORT:     process.env.MYSQLPORT     || '(no definida)',
      MYSQLUSER:     process.env.MYSQLUSER     || '(no definida)',
      MYSQLDATABASE: process.env.MYSQLDATABASE || '(no definida)',
      MYSQLPASSWORD: process.env.MYSQLPASSWORD ? '(definida)' : '(no definida)',
    });
    console.error('────────────────────────────────────────────');
    process.exit(1);
  }
})();
