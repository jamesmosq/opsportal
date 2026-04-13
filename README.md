# OpsPortal

Panel de monitoreo personal para todas las apps desplegadas en Railway y Laravel Cloud. Diseñado para usarse desde el celular como PWA.

## Features

- Listado de apps agrupadas por plataforma con secciones colapsables
- Búsqueda en tiempo real y filtros por plataforma / estado
- Badges de estado: `● online` `✖ crashed` `○ no deploy`
- Banner de alerta automático cuando hay servicios caídos
- Agregar nuevas apps desde la UI (se guardan en localStorage)
- Integración con Railway GraphQL API para estado en tiempo real
- Sistema de plataformas extensible — agrega Vercel, Render, Fly.io editando un objeto
- Instalable como PWA en móvil (manifest + service worker)
- Dark / light mode automático

## Estructura

```
├── index.html      markup semántico
├── style.css       design system con tokens CSS
├── app.js          datos (PLATFORMS, BASE_APPS) y lógica
├── manifest.json   configuración PWA
└── sw.js           service worker (cache offline)
```

## Agregar una plataforma

En `app.js`, dentro del objeto `PLATFORMS`:

```js
vercel: {
  label:      'Vercel',
  color:      '#ffffff',
  avatarBg:   'rgba(255,255,255,.1)',
  avatarText: '#e2e8f0',
},
```

El filtro, el select del modal y la sección del listado se generan automáticamente.

## Agregar una app (código)

En `app.js`, dentro del array `BASE_APPS`:

```js
{ name: 'Mi App', initials: 'MA', platform: 'railway', status: 'ok', desc: 'Descripción', url: 'https://...', github: '' },
```

O desde la UI con el botón **+**.

## Railway API

Para ver el estado real de deployments, ingresa tu token desde el ícono de ajustes en el header. Se guarda en `localStorage` del dispositivo.

Token: `railway.app/account/tokens`

## Correr localmente

```bash
npx serve .
# o
python -m http.server 8080
```

## Deploy

**GitHub Pages** — activar en Settings › Pages › Branch: `main`

**Railway** — el archivo `nixpacks.toml` ya está configurado:
```bash
railway up
```

---

Desarrollado por [JamesDev](https://github.com/jamesmosq)
