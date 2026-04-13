require('dotenv').config();

const express = require('express');
const path    = require('path');
const db      = require('./db');
const { initDB } = require('./seed');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ─── API ──────────────────────────────────────────────────────────────────────
app.use('/api/apps', require('./routes/apps'));

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
    console.error('Error al iniciar:', err.message);
    process.exit(1);
  }
})();
