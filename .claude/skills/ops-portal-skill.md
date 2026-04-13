# SKILL: ops-portal

## Cuándo usar esta skill
Úsala SIEMPRE que trabajes en el proyecto `ops-portal` — cualquier modificación a `index.html`, adición de features, PWA, integración con APIs de Railway o Laravel Cloud, o cualquier cambio de estilo o estructura.

## Contexto rápido
Portal HTML puro mobile-first. Sin frameworks. Sin bundler. Sin npm. El usuario lo abre en el celular para ver el estado de sus apps en Railway y Laravel Cloud.

Archivo principal: `index.html`
Datos de apps: array `APPS` dentro del `<script>` en `index.html`

## Reglas absolutas
- NO agregar npm / node_modules / webpack / vite / react salvo que James lo pida
- NO romper dark mode — cada color nuevo debe tener variante `prefers-color-scheme: light`
- NO usar APIs del navegador sin verificar soporte Safari iOS (caniuse.com)
- NO agregar CDNs que no sean `cdnjs.cloudflare.com` o `cdn.jsdelivr.net`
- SIEMPRE mantener el HTML válido y semántico
- SIEMPRE usar variables CSS ya definidas (ver sección colores)

## Variables CSS del sistema
```css
--bg, --bg-card, --bg-card-hover, --bg-secondary
--border, --border-hover
--text-primary, --text-secondary, --text-muted
--accent-railway: #7C3AED
--accent-laravel: #FF2D20
--green-bg, --green-text   /* status ok */
--red-bg, --red-text       /* status crash */
--gray-bg, --gray-text     /* status never */
--radius-sm: 8px, --radius-md: 12px, --radius-lg: 16px
--font: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
```

## Cómo agregar una app nueva
Agregar un objeto al array `APPS`:
```js
{ name: '', initials: 'XX', platform: 'railway'|'laravel', status: 'ok'|'crash'|'never', desc: '', url: '', github: '' }
```

## Cómo agregar una plataforma nueva
1. Agregar color en `:root` y `prefers-color-scheme: light`
2. Agregar clase `.dot-{plataforma}` y `.av-{plataforma}`
3. Agregar filtro en `.filter-row`
4. Agregar sección en la función `render()`

## PWA — pasos pendientes
1. Crear `manifest.json`:
```json
{
  "name": "Ops Portal",
  "short_name": "Ops",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f0f",
  "theme_color": "#0f0f0f",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```
2. Crear `sw.js` con cache de `index.html` para offline
3. Registrar el SW al final de `index.html`:
```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## Railway API — health check real
Endpoint: `https://backboard.railway.app/graphql/v2`
Header: `Authorization: Bearer {RAILWAY_TOKEN}`
El token se puede pedir al usuario vía `localStorage` la primera vez.

Query GraphQL para deployments:
```graphql
query { me { projects { edges { node {
  id name
  services { edges { node { serviceInstances { edges { node {
    latestDeployment { status createdAt }
  }}}}}}
}}}}}
```
Mapeo de status Railway → badge:
- `SUCCESS` → ok
- `FAILED` / `CRASHED` → crash
- `BUILDING` / `DEPLOYING` → building (agregar badge amarillo)
- Sin deployment → never

## Estructura de archivos esperada
```
ops-portal/
├── CLAUDE.md
├── index.html       ← único archivo obligatorio ahora
├── manifest.json    ← pendiente PWA
├── sw.js            ← pendiente PWA
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

## Deploy rápido Railway (estático)
```bash
# nixpacks.toml en raíz:
[start]
cmd = "caddy file-server --root . --listen :$PORT"

railway up
```

## Deploy GitHub Pages
```bash
git add . && git commit -m "feat: ops portal" && git push
# Activar en Settings > Pages > Branch: main
```
