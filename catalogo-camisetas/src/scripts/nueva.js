import { supabase, withTimeout } from "../lib/supabase.js";
import { getUser } from "../lib/auth.js";
import { isValidImageUrl, friendlyError } from "../lib/validation.js";

const form = document.getElementById("form-camiseta");
const mensaje = document.getElementById("mensaje");
const submitBtn = form?.querySelector("button[type='submit']");

/**
 * Verifica la sesión y redirige a /login si no hay usuario autenticado.
 * Retorna el usuario o null (si no hay sesión o hubo un error).
 */
async function obtenerUsuarioOIrAlLogin() {
  let user;
  try {
    user = await withTimeout(getUser());
  } catch (err) {
    if (mensaje) mensaje.textContent = friendlyError(err) || "Error de conexión. Verificá tu conexión e intentá de nuevo.";
    return null;
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return user;
}

// Guard de sesión al entrar a la página
obtenerUsuarioOIrAlLogin();

if (!form || !mensaje) {
  console.error("[nueva] Required DOM elements not found");
} else {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensaje.textContent = "";

    const user = await obtenerUsuarioOIrAlLogin();
    if (!user) return;

    const imagenUrl = document.getElementById("imagen_url").value.trim();
    if (!isValidImageUrl(imagenUrl)) {
      mensaje.textContent = "La URL de imagen debe comenzar con http:// o https://.";
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Guardando...";
    }

    const nuevaCamiseta = {
      user_id: user.id,
      equipo: document.getElementById("equipo").value.trim(),
      temporada: document.getElementById("temporada").value.trim() || null,
      tipo: document.getElementById("tipo").value,
      marca: document.getElementById("marca").value.trim() || null,
      imagen_url: imagenUrl || null,
      descripcion: document.getElementById("descripcion").value.trim() || null,
    };

    try {
      const { error } = await withTimeout(
        supabase.from("camisetas").insert([nuevaCamiseta])
      );

      if (error) {
        mensaje.textContent = friendlyError(error) || "Error al guardar.";
      } else {
        window.location.href = "/dashboard";
        return;
      }
    } catch (err) {
      mensaje.textContent = friendlyError(err) || "Error de conexión al guardar.";
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Guardar camiseta";
    }
  });
}
