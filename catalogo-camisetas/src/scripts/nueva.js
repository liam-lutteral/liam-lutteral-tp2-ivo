import { supabase, withTimeout } from "../lib/supabase.js";
import { getUser } from "../lib/auth.js";
import { isValidImageUrl } from "../lib/validation.js";

const form = document.getElementById("form-camiseta");
const mensaje = document.getElementById("mensaje");
const submitBtn = form?.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensaje.textContent = "";

  let user;
  try {
    user = await withTimeout(getUser());
  } catch (err) {
    console.error("[nueva] error al obtener usuario:", err.message, err);
    mensaje.textContent = err.message || "Error de conexión. Verificá tu conexión e intentá de nuevo.";
    return;
  }

  if (!user) {
    console.log("[nueva] sin sesión, redirigiendo a /login");
    window.location.href = "/login";
    return;
  }

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
      console.error("[nueva] error al guardar:", error.message, error);
      mensaje.textContent = error.message || "Error al guardar.";
    } else {
      console.log("[nueva] camiseta creada, redirigiendo a /dashboard");
      window.location.href = "/dashboard";
      return;
    }
  } catch (err) {
    console.error("[nueva] error al guardar:", err.message, err);
    mensaje.textContent = err.message || "Error de conexión al guardar.";
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Guardar camiseta";
  }
});
