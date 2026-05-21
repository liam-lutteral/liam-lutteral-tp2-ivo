# Catálogo de Camisetas (Astro + Supabase)

Aplicación web para registrar y administrar un catálogo de camisetas de fútbol.
Incluye autenticación (registro/login) y operaciones CRUD para que cada usuario vea y edite **solo sus camisetas**.

> Stack: **Astro (frontend)** + **Supabase (Auth + Postgres)**

---

## Características

- Página pública:
  - `/` (inicio)
  - `/register` (registro)
  - `/login` (login)
- Área privada:
  - `/dashboard` (lista de camisetas del usuario)
  - `/nueva` (crear camiseta)
  - `/editar/[id]` (editar camiseta)
- Filtrado por usuario usando `user_id` en la tabla `camisetas`.

---

## Requisitos

- Node.js (recomendado): **>= 22.12.0**
- Cuenta y proyecto en **Supabase**

---

## Configuración de Supabase

El proyecto usa estas variables de entorno (expuestas al cliente por prefijo `PUBLIC_`):

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

Crea un archivo `.env` en la raíz del proyecto (si aplica en tu entorno):

```bash
PUBLIC_SUPABASE_URL="https://TU-PROYECTO.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="TU-ANON_KEY"
```

> Importante: en este repo `supabase.js` lee `import.meta.env.PUBLIC_SUPABASE_URL` y `import.meta.env.PUBLIC_SUPABASE_ANON_KEY`.

---

## Esquema de base de datos (tabla `camisetas`)

Desde el frontend se consulta/actualiza/insertan estos campos:

- `id` (Primary key)
- `user_id` (UUID del usuario de Supabase)
- `equipo` (string)
- `temporada` (string, opcional)
- `tipo` (string, ejemplo: Titular / Suplente / Arquero, opcional)
- `marca` (string, opcional)
- `imagen_url` (string, opcional)
- `descripcion` (string, opcional)

Además, el dashboard hace:

- `.select('*').eq('user_id', userData.user.id)`

---

## Rutas principales

- `/` : Home
- `/register` : Registrar usuario con `supabase.auth.signUp`
- `/login` : Iniciar sesión con `supabase.auth.signInWithPassword`
- `/dashboard` : Lista del usuario + logout
- `/nueva` : Inserta una fila en `camisetas`
- `/editar/[id]` : Carga una fila por `id` y luego hace `update`

---

## Instalación y ejecución

Desde la carpeta `catalogo-camisetas`:

```bash
npm install
npm run dev
```

- Desarrollo: `astro dev`
- Producción:

```bash
npm run build
npm run preview
```

---

## Notas de seguridad (RLS)

Para que el sistema sea realmente seguro, configura **Row Level Security (RLS)** en Supabase.

Aunque el frontend filtra por `user_id`, la seguridad debe aplicarse en la base de datos.

---

## Estructura de carpetas (resumen)

- `src/lib/supabase.js`: crea el cliente de Supabase
- `src/pages/*`: páginas Astro (login, register, dashboard, nueva, editar)
- `src/components/*`: componentes (ej. tarjeta)
- `public/*`: assets estáticos

