const express = require('express');
const router  = express.Router();

const RAILWAY_GQL = 'https://backboard.railway.app/graphql/v2';

// POST /api/railway  — proxy hacia Railway GraphQL
// El token vive en RAILWAY_TOKEN (variable de entorno en Railway).
// El navegador llama a /api/railway y nunca ve el token.
router.post('/', express.json(), async (req, res) => {
  const token = process.env.RAILWAY_TOKEN;

  if (!token) {
    return res.status(503).json({ error: 'RAILWAY_TOKEN no configurado en el servidor' });
  }

  try {
    const upstream = await fetch(RAILWAY_GQL, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: `Error al contactar Railway: ${err.message}` });
  }
});

module.exports = router;
