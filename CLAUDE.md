# Ops Portal — CLAUDE.md

## Qué es este proyecto
Portal web mobile-first para que James administre todas sus apps desplegadas en Railway y Laravel Cloud desde el celular o tablet. HTML puro, sin frameworks, sin build tools, sin dependencias externas.

## Estado actual
- `index.html` — portal funcional con lista de apps, búsqueda, filtros por plataforma y badges de estado
- Sin backend aún — los datos de las apps están hardcodeados en el array `APPS` dentro del `<script>`
- Soporte dark/light mode automático vía `prefers-color-scheme`
- Responsive y táctil — optimizado para móvil

## Stack decidido
- **Frontend**: HTML + CSS + Vanilla JS (sin frameworks, sin bundler)
- **Despliegue objetivo**: Railway (estático con Nginx o Caddy) o GitHub Pages
- **Futuro**: integración con Railway GraphQL API y Laravel Cloud API para estado en tiempo real

## Estructura del proyecto
```
ops-portal/
├── CLAUDE.md          ← este archivo
├── index.html         ← portal principal
├── manifest.json      ← (pendiente) para instalarlo como PWA en móvil
├── sw.js              ← (pendiente) service worker para PWA offline
├── icons/             ← (pendiente) íconos PWA 192x192 y 512x512
└── README.md
```

## Array APPS — cómo agregar o editar apps
Dentro de `index.html`, busca el bloque marcado con:
```
// ─── EDITA AQUÍ TUS APPS ───
```

Cada app tiene esta forma:
```js
{
  name: 'NominaeduN',       // nombre visible
  initials: 'NN',           // 2 letras para el avatar
  platform: 'railway',      // 'railway' | 'laravel'
  status: 'ok',             // 'ok' | 'crash' | 'never'
  desc: 'SaaS educativo',   // descripción corta
  url: 'https://...',       // URL directa al dashboard de la app
  github: 'https://...',    // URL al repo (deja '' si no aplica)
}
```

## Apps actuales registradas

### Railway
| nombre | estado | notas |
|--------|--------|-------|
| NominaeduN | ok | SaaS educativo NestJS + Prisma — proyecto principal |
| Secretaria Salud | ok | 2/2 servicios online |
| ContaEdu | ok | Contabilidad educativa |
| SstEdu | ok | 2/2 servicios online |
| saar-CRM | ok | CRM Ruby on Rails |
| Comparador | ok | Agrupador llamadas de asistencia |
| Lacarta | ok | Primera SaaS Laravel |
| Diagnóstico Comercial | crash | 1/2 servicio caído — requiere atención |

### Laravel Cloud (org: james-mosquera-renteria)
| nombre | estado | notas |
|--------|--------|-------|
| cfitam | ok | Sitio institucional CEFIT — Statamic CMS |
| contaedu | ok | Actualizado hace 20 horas |
| lacarta | ok | Avances controllers, models, views |
| comparador | never | Nunca desplegado |
| completo | ok | Sembrando seeder |
| diplomado | ok | First commit |
| produccion | ok | Subiendo a cloud |
| subiendo | ok | Update admin credentials |

## Diseño y estilo
- **Dark mode** por defecto con `prefers-color-scheme: light` para modo claro
- **Colores Railway**: purple `#7C3AED` / avatares `#2e1065` bg + `#c4b5fd` texto en dark
- **Colores Laravel**: red `#FF2D20` / avatares `#450a0a` bg + `#fca5a5` texto en dark
- **Tipografía**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui` — nativa del dispositivo
- **Border radius**: 8px elementos, 12px cards
- **Badges de estado**: verde (online), rojo (caído), gris (sin deploy)
- **Banner de alerta**: aparece automáticamente si hay apps con status `crash`

## Próximas features planeadas (en orden de prioridad)

### 1. PWA instalable en móvil
- Crear `manifest.json` con íconos
- Crear `sw.js` (service worker) para cache offline
- Agregar `<link rel="manifest">` en `index.html`
- El usuario quiere abrirlo como app nativa en su celular

### 2. URLs directas por app
- Reemplazar las URLs genéricas de Railway por las URLs exactas de cada proyecto
- Railway URL pattern: `https://railway.app/project/{project-id}`
- Laravel Cloud URL pattern: `https://cloud.laravel.com/org/james-mosquera-renteria/applications/{app-name}`

### 3. Health check real vía Railway API
- Railway expone GraphQL en `https://backboard.railway.app/graphql/v2`
- Requiere token de API de Railway (variable de entorno o localStorage)
- Query para obtener estado de deployments:
```graphql
query {
  me {
    projects {
      edges {
        node {
          id
          name
          services {
            edges {
              node {
                id
                name
                serviceInstances {
                  edges {
                    node {
                      latestDeployment {
                        status
                        createdAt
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 4. Health check Laravel Cloud
- Investigar si Laravel Cloud tiene API pública o webhooks
- Alternativa: hacer ping HTTP a cada URL de producción y verificar status 200

### 5. Notificaciones push
- Cuando una app pasa a estado `crash`, notificar al celular
- Requiere service worker + Push API

### 6. Links rápidos por app
- Botones dentro de cada card: Ver logs / Ver deployments / Abrir app
- Abrir la app en producción directo desde el portal

## Comandos útiles

### Servir localmente
```bash
# Con Python
python3 -m http.server 8080

# Con Node
npx serve .

# Con PHP (si tienes Laravel Herd activo)
php -S localhost:8080
```

### Desplegar en Railway como sitio estático
```bash
# Crear nixpacks.toml en la raíz
echo '[phases.build]
cmds = []

[start]
cmd = "caddy file-server --root . --listen :$PORT"' > nixpacks.toml

railway up
```

### Desplegar en GitHub Pages
```bash
git init
git add .
git commit -m "feat: ops portal inicial"
gh repo create ops-portal --public
git push -u origin main
# Activar Pages en Settings > Pages > Branch: main
```

## Contexto del desarrollador
- **James** — desarrollador y docente en CEFIT-SENA, Medellín, Colombia
- IDE: WebStorm (JetBrains)
- Stack principal: Laravel, NestJS, Ruby on Rails
- Deployment: Railway (paid plan) + Laravel Cloud
- Objetivo: monitorear todo desde el celular sin abrir múltiples pestañas

## Reglas para Claude Code en este proyecto
1. Mantener el proyecto como HTML puro — no agregar npm, webpack, ni frameworks salvo que James lo pida explícitamente
2. Todo cambio de estilo debe respetar el sistema de variables CSS ya definido
3. Si se agrega JS externo, usar solo CDN de `cdnjs.cloudflare.com` o `cdn.jsdelivr.net`
4. Mantener compatibilidad con Safari móvil (iOS) — evitar APIs no soportadas
5. Siempre probar que dark mode y light mode funcionen correctamente
6. Los textos de la UI van en español
