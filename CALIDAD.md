# CALIDAD.md — Catálogo de Camisetas

> **TP3 - Calidad y Automatización (CI/CD)**  
> Fecha: 29 de junio de 2026  
> Rama principal: `fix/vercel-deployment`

---

## 1. Estrategia de Calidad

La estrategia de calidad se basa en cuatro pilares fundamentales:

| Pilar | Descripción |
|-------|-------------|
| **Control de Versiones** | Flujo basado en Git con branches, Pull Requests y code reviews obligatorios |
| **Pruebas Automatizadas** | Tests unitarios + test E2E del flujo crítico |
| **Integración Continua (CI)** | GitHub Actions que ejecuta lint, test y build en cada push/PR a `main` |
| **Despliegue Continuo (CD)** | Deploy automático a Vercel tras merge a `main` |

---

## 2. Herramientas y Stack

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **Astro** | ^6.2.1 | Framework web SSR |
| **Supabase** | ^2.105.1 | Backend como servicio (auth + base de datos) |
| **Vitest** | ^3.x | Testing unitario |
| **Playwright** | ^1.x | Testing E2E |
| **GitHub Actions** | — | Pipeline CI/CD |
| **Vercel** | — | Hosting y despliegue |
| **@astrojs/vercel** | ^10.x | Adaptador SSR para Vercel |

---

## 3. Flujo de Trabajo (Workflow)

### 3.1 Convención de Branches

Basado en el historial del repositorio:

```
main           → Producción (protegida, no se pushea directo)
feature/*      → Nuevas funcionalidades (ej. feature/ux-dashboard, feature/setup-supabase)
fix/*          → Corrección de bugs (ej. fix/editar-camiseta, fix/vercel-deployment)
```

### 3.2 Pull Requests

- Todo cambio debe pasar por un Pull Request
- El PR debe referenciar el issue que resuelve (ej. `closes #12`)
- Requiere al menos 1 approval del otro integrante del equipo
- Mínimo 1 comentario de revisión real (no aprobaciones vacías)
- Ejemplos del historial:
  - `#5` — fix/editar-camiseta
  - `#4` — feature/catalogo-spec-tp2
  - `#3` — feature/setup-supabase
  - `#2` — fix/editar-dynamic-routes
  - `#1` — feature/ux-dashboard

### 3.3 Commits

Los mensajes siguen la convención [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(catalogo): alinear formularios y dashboard con especificación TP2
fix(editar): corregir carga y guardado de camisetas por id de ruta
feat(supabase): agregar schema RLS, .env.example y utilidades de validación
feat(ui): modernizar layout, auth y catálogo principal
fix: mejoro la calidad del deployment en vercel
```

---

## 4. Tests

### 4.1 Tests Unitarios (Vitest)

Se implementarán **2 tests unitarios** sobre las funciones de utilidad:

**Test 1 — `validation.js`: Validación de URLs de imagen**
```javascript
// Verifica que isValidImageUrl acepte http/https y rechace formatos inválidos
describe('isValidImageUrl', () => {
  it('debe aceptar URLs con http:// y https://', () => { ... });
  it('debe rechazar URLs sin protocolo o protocolo inválido', () => { ... });
  it('debe retornar true si la URL está vacía (opcional)', () => { ... });
});
```

**Test 2 — `validation.js`: Escape de HTML**
```javascript
// Verifica que escapeHtml sanitice caracteres peligrosos
describe('escapeHtml', () => {
  it('debe escapar &, <, >, ", y \'', () => { ... });
  it('debe retornar string vacío para null/undefined', () => { ... });
});
```

**Test 3 — `camisetas.js`: Metadatos por tipo**
```javascript
// Verifica que metadataFor retorne assets correctos según el tipo
describe('metadataFor', () => {
  it('debe retornar assets de titular para tipo "Titular"', () => { ... });
  it('debe retornar default para tipo desconocido', () => { ... });
});
```

### 4.2 Tests E2E (Playwright)

**Flujo principal — Registro, login y CRUD de camiseta:**

1. Navegar a `/register`
2. Crear una cuenta nueva con email y contraseña
3. Verificar redirección a dashboard
4. Crear una nueva camiseta desde `/nueva`
5. Verificar que aparece en el dashboard
6. Editar la camiseta desde `/editar/[id]`
7. Eliminar la camiseta desde el dashboard
8. Cerrar sesión

---

## 5. Pipeline CI/CD (GitHub Actions)

El pipeline se ejecuta en cada push o PR a `main`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./catalogo-camisetas

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: ./catalogo-camisetas/package-lock.json

      - name: Instalar dependencias
        run: npm ci

      - name: Lint (Biome / ESLint)
        run: npm run lint

      - name: Tests unitarios
        run: npm run test

      - name: Tests E2E
        run: npm run test:e2e

      - name: Build
        run: npm run build

      - name: Deploy a Vercel
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Secretos requeridos en GitHub:**
| Secreto | Descripción |
|---------|-------------|
| `VERCEL_TOKEN` | Token de deploy de Vercel |
| `PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `PUBLIC_SUPABASE_ANON_KEY` | Anon key pública de Supabase |

---

## 6. Casos de Uso Críticos

| # | Caso de Uso | Riesgo | Mitigación |
|---|-------------|--------|------------|
| 1 | Registro de usuario | Error 500 si Supabase no responde | Manejo de errores con mensaje al usuario |
| 2 | Login con credenciales inválidas | Exposición de información sensible | Mensaje genérico de error, sin detalle técnico |
| 3 | Crear camiseta sin autenticación | Inserción no autorizada | RLS en Supabase + verificación `user_id` en frontend |
| 4 | Editar camiseta de otro usuario | Violación de permisos | Doble validación: RLS + verificación `user_id === data.user_id` |
| 5 | Eliminar camiseta | Pérdida de datos | Confirmación `confirm()` antes de delete |
| 6 | Sesión expirada durante uso | Operaciones fallidas | Redirect a `/login` si `getUser()` retorna null |
| 7 | URL de imagen inválida | Imagen rota en UI | `onerror` con fallback a imagen por defecto |
| 8 | Build fallido en Vercel | Site caído | Pipeline CI detecta errores antes del deploy |

---

## 7. Diseño del Pipeline

```
[Push/PR a main]
       │
       ▼
┌─────────────────┐
│  checkout code  │
└────────┬────────┘
         ▼
┌─────────────────┐
│  npm ci         │
└────────┬────────┘
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Lint           │ ──► │  ¿Fallo? → ❌    │
└────────┬────────┘     └──────────────────┘
         ▼ (OK)
┌─────────────────┐     ┌──────────────────┐
│  Unit tests     │ ──► │  ¿Fallo? → ❌    │
└────────┬────────┘     └──────────────────┘
         ▼ (OK)
┌─────────────────┐     ┌──────────────────┐
│  E2E tests      │ ──► │  ¿Fallo? → ❌    │
└────────┬────────┘     └──────────────────┘
         ▼ (OK)
┌─────────────────┐     ┌──────────────────┐
│  Build Astro    │ ──► │  ¿Fallo? → ❌    │
└────────┬────────┘     └──────────────────┘
         ▼ (OK y es push a main)
┌─────────────────┐
│  Deploy Vercel  │
└─────────────────┘
```

---

## 8. Deuda Técnica Identificada

### 🔴 Alta Prioridad

| Deuda | Descripción | Solución Propuesta |
|-------|-------------|--------------------|
| **Adaptador Vercel incorrecto** | Se usaba `@astrojs/node` en vez de `@astrojs/vercel`, causando fallo en deployment | Migrar a `@astrojs/vercel` con configuración SSR |
| **Falta de tests** | No existen tests automatizados de ningún tipo | Implementar Vitest + Playwright |
| **Falta de CI/CD** | No hay pipeline automatizado para validar cambios | Crear GitHub Actions workflow |
| **Sin archivo `.env`** | Las credenciales de Supabase no están configuradas localmente | Crear `.env` con `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` |

### 🟡 Media Prioridad

| Deuda | Descripción | Solución Propuesta |
|-------|-------------|--------------------|
| **Componente `CamisetaCard.astro` vacío** | El componente existe pero está vacío; el card se renderiza desde HTML inline en `dashboard.astro` | Migrar el template del card al componente |
| **Validación solo client-side** | `isValidImageUrl` solo se ejecuta en el navegador | Agregar validación server-side en endpoints SSR de Astro |
| **Sin loading states visuales** | El dashboard muestra texto plano "Cargando camisetas..." sin skeleton ni spinner | Agregar skeleton UI durante carga |

### 🟢 Baja Prioridad

| Deuda | Descripción | Solución Propuesta |
|-------|-------------|--------------------|
| **Sin TypeScript estricto** | Los archivos `.js` no tienen tipado estricto | Migrar a `.ts` con interfaces definidas |
| **Sin manejo de sesión expirada** | No hay interceptor global para tokens expirados | Agregar listener de `onAuthStateChange` con redirect |
| **Auditoría de dependencias** | 5 vulnerabilidades detectadas (3 low, 2 high) | Ejecutar `npm audit fix` |

---

## 9. Monitoreo y Observabilidad (Opcional — Extra)

Para mejorar la observabilidad en producción, se recomienda:

- **Sentry**: Monitoreo de errores del lado del frontend y server
- **Supabase Logs**: Revisar logs de autenticación y queries en dashboard de Supabase
- **Vercel Analytics**: Analizar rendimiento y uso de la aplicación

---

## 10. Decisiones Arquitectónicas

Las siguientes decisiones fueron tomadas durante el desarrollo y están reflejadas en el historial de commits:

| Decisión | Commits Relacionados | Justificación |
|----------|---------------------|---------------|
| SSR en vez de SSG | `Disable prerender for dynamic edit page` | Las rutas dinámicas (`/editar/[id]`) requieren datos del usuario autenticado |
| Supabase como BaaS | `feat(supabase): agregar schema RLS, .env.example y utilidades de validación` | Backend serverless con auth y DB integradas, ideal para proyectos pequeños |
| Row Level Security | `supabase/schema.sql` | Cada usuario solo ve/edita sus propios datos; seguridad a nivel DB |
| Validación client-side con fallback | `feat(supabase): ... utilidades de validación` | `isValidImageUrl` valida antes de enviar; RLS protege en backend |
| Navegación reactiva | `feat(ui): modernizar layout, auth y catálogo principal` | `onAuthStateChange` actualiza la navbar sin recargar página |
| Despliegue en Vercel | `fix: mejoro la calidad del deployment en vercel` | Hosting serverless con soporte nativo para Astro SSR |

---

*Documento generado como parte del TP3 - Calidad y Automatización (CI/CD)*
