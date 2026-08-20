export const FALLBACK_IMAGE = "/camisetas/front-slim.svg";

export function isValidImageUrl(url) {
  const trimmed = url?.trim();
  if (!trimmed) return true;
  return /^https?:\/\//i.test(trimmed);
}

export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Mapea errores de Supabase a mensajes amigables.
 * Evita filtrar detalles del backend al usuario.
 */
export function friendlyError(err) {
  const msg = err?.message || "";
  if (/invalid.*credentials|invalid.*login/i.test(msg))
    return "Email o contraseña incorrectos.";
  if (/already.*registered|already.*exist/i.test(msg))
    return "Ya existe una cuenta con ese email.";
  if (/password.*short|password.*minimum|at least/i.test(msg))
    return "La contraseña debe tener al menos 8 caracteres.";
  if (/email.*invalid|valid.*email/i.test(msg))
    return "El email ingresado no es válido.";
  return "Ocurrió un error. Intentá de nuevo.";
}
