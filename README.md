# Maria Jose Portfolio

Portafolio personal construido con Angular y NestJS. El frontend muestra proyectos, experiencia, tecnologias, perfil y contacto. El backend expone una API protegida para administrar contenido desde un panel privado y usa Supabase como base de datos.

## Stack

- Angular 20
- Tailwind CSS
- NestJS 11
- Supabase
- Devicon
- Vercel para frontend
- Render para backend

## Estructura

```txt
src/                 Frontend Angular
server/src/          Backend NestJS
server/database/     Esquema SQL de Supabase
public/              Assets publicos
```

## Funcionalidades

- Home responsive con secciones de perfil, tecnologias, proyectos, experiencia y contacto.
- Proyectos destacados con opcion de ver todos sin salir de la seccion.
- Experiencia profesional compacta con botones de ver mas/ver menos.
- Login de administrador.
- Panel admin para gestionar proyectos, imagenes, tecnologias y experiencia.
- Catalogo de iconos Devicon para tecnologias.
- API protegida con bearer token para rutas administrativas.
- Rutas publicas para mostrar datos del portafolio.

## Requisitos

- Node.js
- npm
- Cuenta/proyecto de Supabase
- Variables de entorno del backend configuradas

## Variables de entorno

Crea un archivo `.env` en la raiz para desarrollo local del backend:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
FRONTEND_URL=http://localhost:4200,https://mariajose-portfolio.vercel.app
PORT=3000
```

En Render deben existir estas variables:

```txt
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://mariajose-portfolio.vercel.app
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## Desarrollo Local

Instalar dependencias:

```bash
npm install
```

Levantar el backend:

```bash
npm run start:api:dev
```

Levantar el frontend con proxy local:

```bash
npm run start:web
```

El frontend queda en:

```txt
http://localhost:4200
```

El backend queda en:

```txt
http://localhost:3000/api
```

## Comandos

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run build:api
```

Backend en modo produccion local:

```bash
npm run start:api:prod
```

Tests:

```bash
npm test
```

## API Principal

Rutas publicas:

```txt
GET /api/health
GET /api/projects
GET /api/experience
GET /api/technologies
GET /api/portfolio/profile
GET /api/portfolio/skills
```

Rutas administrativas:

```txt
POST /api/auth/login
GET /api/projects/admin
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
POST /api/projects/:id/images
DELETE /api/projects/:id/images/:imageId
POST /api/projects/:id/technologies
DELETE /api/projects/:id/technologies/:technologyId
POST /api/technologies
PUT /api/technologies/:id
DELETE /api/technologies/:id
POST /api/experience
PUT /api/experience/:id
DELETE /api/experience/:id
```

Las rutas administrativas requieren:

```txt
Authorization: Bearer <token>
```

## Base de Datos

El esquema inicial esta en:

```txt
server/database/schema.sql
```

Incluye tablas para:

- perfil
- proyectos
- imagenes de proyectos
- tecnologias
- relacion proyecto-tecnologia
- experiencia
- skills
- mensajes de contacto
- eventos de analitica

## Deploy

Frontend en Vercel:

```bash
npm run build
```

Directorio de salida:

```txt
dist/portfolio/browser
```

Backend en Render:

```bash
npm ci && npm run build:api
npm run start:api:prod
```

El archivo `render.yaml` contiene la configuracion base del servicio.

## Notas

- El frontend usa `src/app/core/api.config.ts` para decidir si consume `/api` local o el backend de Render.
- El interceptor solo agrega el token de autenticacion a requests del API.
- CORS permite el dominio principal de Vercel y previews del proyecto.
- Si cambian endpoints del backend, se debe redeployar Render antes de probarlos desde Vercel.
