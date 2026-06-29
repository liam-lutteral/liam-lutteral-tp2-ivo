# Catálogo de Camisetas de Fútbol

Aplicación web para gestionar colecciones de camisetas de fútbol con autenticación y base de datos.

## 🚀 Configuración de Supabase

1. **Crear proyecto en Supabase:**
   - Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo
   - Copia tu `Project URL` y `anon public key`

2. **Crear tabla `camisetas`:**
   - En el dashboard de Supabase, ve a SQL Editor
   - Ejecuta este script:
   ```sql
   create table camisetas (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users not null,
     equipo text not null,
     temporada text,
     tipo text,
     marca text,
     imagen_url text,
     descripcion text,
     created_at timestamp with time zone default now()
   );
   ```

3. **Configurar Row Level Security (RLS):**
   ```sql
   alter table camisetas enable row level security;

   create policy "Users can view own camisetas"
   on camisetas for select
   using (auth.uid() = user_id);

   create policy "Users can insert own camisetas"
   on camisetas for insert
   with check (auth.uid() = user_id);

   create policy "Users can update own camisetas"
   on camisetas for update
   using (auth.uid() = user_id);

   create policy "Users can delete own camisetas"
   on camisetas for delete
   using (auth.uid() = user_id);
   ```

4. **Configurar autenticación:**
   - Ve a Authentication > Providers > Email
   - Asegúrate de que "Enable Email provider" esté activado
   - Desactiva "Confirm email" si quieres registro sin confirmación (opcional)

5. **Configurar variables de entorno:**
   - Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   - Agrega tus credenciales de Supabase:
   ```
   PUBLIC_SUPABASE_URL=tu_url_de_supabase
   PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```

## 🌐 Despliegue en Vercel

1. **Subir código a GitHub:**
   - Crea un repositorio en GitHub
   - Sube tu código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin tu-repo-url
   git push -u origin main
   ```

2. **Conectar con Vercel:**
   - Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
   - Clic en "Add New Project"
   - Importa tu repositorio de GitHub

3. **Configurar variables de entorno en Vercel:**
   - En la configuración del proyecto, ve a Settings > Environment Variables
   - Agrega:
     - `PUBLIC_SUPABASE_URL` = tu URL de Supabase
     - `PUBLIC_SUPABASE_ANON_KEY` = tu anon key de Supabase

4. **Desplegar:**
   - Clic en "Deploy"
   - Vercel detectará automáticamente que es un proyecto Astro
   - Espera a que termine el despliegue

## 🧞 Comandos de desarrollo

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala dependencias                            |
| `npm run dev`             | Inicia servidor local en `localhost:4321`      |
| `npm run build`           | Build para producción en `./dist/`          |
| `npm run preview`         | Previsualiza el build localmente               |

## 📁 Estructura del proyecto

```
/
├── public/
│   └── favicon.svg
├── src
│   ├── components/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── supabase.js
│   │   └── validation.js
│   ├── pages/
│   │   ├── index.astro (landing)
│   │   ├── login.astro
│   │   ├── register.astro
│   │   ├── dashboard.astro
│   │   ├── nueva.astro
│   │   └── editar/[id].astro
│   └── data/
└── package.json
```
