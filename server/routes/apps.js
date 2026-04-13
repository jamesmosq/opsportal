const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ─── GET /api/apps ────────────────────────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM apps ORDER BY platform, name ASC',
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/apps ───────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, initials, platform, status = 'ok', description = '', url, github = '' } = req.body;

  if (!name?.trim() || !initials?.trim() || !platform || !url?.trim()) {
    return res.status(400).json({ error: 'name, initials, platform y url son obligatorios' });
  }

  try {
    const [[{ c }]] = await db.query(
      'SELECT COUNT(*) AS c FROM apps WHERE LOWER(name) = LOWER(?)',
      [name.trim()],
    );
    if (Number(c) > 0) {
      return res.status(409).json({ error: `"${name}" ya existe` });
    }

    const [result] = await db.query(
      `INSERT INTO apps (name, initials, platform, status, description, url, github)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        initials.trim().toUpperCase().slice(0, 2),
        platform,
        status,
        description.trim(),
        url.trim(),
        github.trim(),
      ],
    );

    const [[app]] = await db.query('SELECT * FROM apps WHERE id = ?', [result.insertId]);
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PUT /api/apps/:id ────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, initials, platform, status, description, url, github } = req.body;

  try {
    const [[app]] = await db.query('SELECT * FROM apps WHERE id = ?', [id]);
    if (!app) return res.status(404).json({ error: 'App no encontrada' });

    await db.query(
      `UPDATE apps SET
        name        = COALESCE(?, name),
        initials    = COALESCE(?, initials),
        platform    = COALESCE(?, platform),
        status      = COALESCE(?, status),
        description = COALESCE(?, description),
        url         = COALESCE(?, url),
        github      = COALESCE(?, github)
       WHERE id = ?`,
      [name, initials, platform, status, description, url, github, id],
    );

    const [[updated]] = await db.query('SELECT * FROM apps WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/apps/:id ─────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [[app]] = await db.query('SELECT * FROM apps WHERE id = ?', [id]);
    if (!app) return res.status(404).json({ error: 'App no encontrada' });

    await db.query('DELETE FROM apps WHERE id = ?', [id]);
    res.json({ ok: true, deleted: app.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
