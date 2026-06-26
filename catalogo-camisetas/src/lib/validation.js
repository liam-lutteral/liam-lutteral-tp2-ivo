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
