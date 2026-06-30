import { supabase } from "../lib/supabase.js";
import { isValidImageUrl } from "../lib/validation.js";

const form = document.getElementById("form-camiseta");
const mensaje = document.getElementById("mensaje");
const submitBtn = form?.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensaje.textContent = "";

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
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
    user_id: userData.user.id,
    equipo: document.getElementById("equipo").value.trim(),
    temporada: document.getElementById("temporada").value.trim() || null,
    tipo: document.getElementById("tipo").value,
    marca: document.getElementById("marca").value.trim() || null,
    imagen_url: imagenUrl || null,
    descripcion: document.getElementById("descripcion").value.trim() || null,
  };

  const { error } = await supabase.from("camisetas").insert([nuevaCamiseta]);

  if (error) {
    mensaje.textContent = error.message || "Error al guardar.";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Guardar camiseta";
    }
  } else {
    window.location.href = "/dashboard";
  }
});
