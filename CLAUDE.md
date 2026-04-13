# Ops Portal — CLAUDE.md

## Qué es este proyecto
Portal web mobile-first para que James administre todas sus apps desplegadas en Railway y Laravel Cloud desde el celular o tablet.

## Estado actual (abril 2026)
- Backend Express + MySQL en Railway (producción funcional)
- CRUD completo de apps vía API REST (`/api/apps`)
- PWA instalable: manifest.json + service worker + íconos 192/512
- Proxy Railway GraphQL en `/api/railway` — evita CORS del navegador
- Modal de edición por app (nombre, URL, estado, plataforma, etc.)
- Secciones colapsables por plataforma
- Skeleton loader, toast, crash banner, stats bar

## Stack
- **Frontend**: HTML + CSS + Vanilla JS (sin frameworks, sin bundler)
- **Backend**: Express.js + mysql2
- **Base de datos**: MySQL (Railway plugin)
- **Despliegue**: Railway (Railpack auto-detected)

## Estructura del proyecto
```
OpsPortal/
├── public/
│   ├── index.html       ← portal principal
│   ├── style.css        ← design system completo con variables CSS
│   ├── app.js           ← lógica frontend (PLATFORMS, render, modales, API)
│   ├── manifest.json    ← PWA manifest
│   ├── sw.js            ← service worker (cache offline)
│   └── icons/
│       ├── icon-192.png ← generado por scripts/gen-icons.js
│       └── icon-512.png
├── server/
│   ├── index.js         ← Express entry point
│   ├── db.js            ← mysql2 pool (trim() en todas las vars)
│   ├── seed.js          ← CREATE TABLE + seed inicial si vacía
│   └── routes/
│       ├── apps.js      ← CRUD /api/apps
│       └── railway.js   ← proxy /api/railway → backboard.railway.app
├── scripts/
│   └── gen-icons.js     ← genera PNGs sin dependencias externas
├── package.json
└── CLAUDE.md
```

## Variables de entorno en Railway (servicio opsportal)
```
MYSQLHOST     → ${{MySQL.MYSQLHOST}}
MYSQLPORT     → ${{MySQL.MYSQLPORT}}
MYSQLUSER     → ${{MySQL.MYSQLUSER}}
MYSQLPASSWORD → ${{MySQL.MYSQLPASSWORD}}
MYSQLDATABASE → ${{MySQL.MYSQLDATABASE}}
RAILWAY_TOKEN → [token account-level de jamesmosq, nombre: "monitorear"]
```

## PROBLEMA RESUELTO: Railway API CORS
El navegador bloqueaba fetch() directo a `backboard.railway.app`.
**Solución**: proxy en `server/routes/railway.js` — el token vive en el servidor
como `RAILWAY_TOKEN`, el frontend llama a `/api/railway` sin exponer el token.

## PLATFORMS — cómo agregar plataformas
En `public/app.js`, objeto `PLATFORMS`. Solo agregar una entrada:
```js
vercel: { label: 'Vercel', color: '#ffffff', avatarBg: 'rgba(255,255,255,.1)', avatarText: '#e2e8f0' },
```
Los filtros, secciones y selects se generan automáticamente.

## Project IDs conocidos en Railway
- SstEdu: `4d503b2d-171e-4997-ba2c-5f2edb4ef2b4`
- ops-portal: ver Settings → General en Railway
- Diagnóstico Comercial: ver Settings → General en Railway
- Resto: obtener vía query `me { projects }` con el token

## Query GraphQL — estado de deployments
```graphql
{ me { projects { edges { node { id name services { edges { node {
  name serviceInstances { edges { node {
    latestDeployment { status createdAt url }
  } } }
} } } } } } } }
```

## Query GraphQL — logs de un deployment
```graphql
query deploymentLogs($deploymentId: String!) {
  deploymentLogs(deploymentId: $deploymentId, limit: 50) {
    timestamp message severity
  }
}
```

## Contexto del desarrollador
- **James** — desarrollador y docente en CEFIT-SENA, Medellín, Colombia
- IDE: WebStorm (JetBrains)
- Stack principal: Laravel, NestJS, Ruby on Rails
- Deployment: Railway (paid plan) + Laravel Cloud
- Objetivo: monitorear todo desde el celular sin abrir múltiples pestañas

## Reglas para Claude Code en este proyecto
1. No agregar npm/webpack/frameworks salvo que James lo pida explícitamente
2. Todo cambio de estilo debe respetar el sistema de variables CSS ya definido
3. Mantener compatibilidad con Safari móvil (iOS)
4. Los textos de la UI van en español
5. Nunca commitear tokens, contraseñas ni secretos — usar variables de entorno
