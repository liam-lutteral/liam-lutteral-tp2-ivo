import { supabase } from "../lib/supabase.js";
import { metadataFor } from "../data/camisetas.js";
import { isValidImageUrl, FALLBACK_IMAGE } from "../lib/validation.js";

const id = window.__CAMISETA_ID__;
const form = document.getElementById("form-editar");
const mensaje = document.getElementById("mensaje");
const previewImage = document.getElementById("preview-image");
const previewEquipo = document.getElementById("preview-equipo");
const previewTipo = document.getElementById("preview-tipo");

function updatePreview() {
  const equipo = document.getElementById("equipo").value.trim();
  const tipo = document.getElementById("tipo").value;
  const imagenUrl = document.getElementById("imagen_url").value.trim();
  const metadata = metadataFor({ tipo });

  previewEquipo.textContent = equipo || "Equipo";
  previewTipo.textContent = `Tipo: ${tipo}`;
  previewImage.src = imagenUrl || metadata.front || FALLBACK_IMAGE;
}

async function cargarDatos() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    window.location.href = "/login";
    return;
  }

  const { data, error } = await supabase
    .from("camisetas")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    mensaje.textContent = "No se encontró la camiseta o no tenés permiso para editarla.";
    return;
  }

  if (data.user_id !== userData.user.id) {
    mensaje.textContent = "No tenés permiso para editar esta camiseta.";
    form.querySelector("button[type='submit']").disabled = true;
    return;
  }

  document.getElementById("equipo").value = data.equipo ?? "";
  document.getElementById("temporada").value = data.temporada ?? "";
  document.getElementById("tipo").value = data.tipo || "Titular";
  document.getElementById("marca").value = data.marca ?? "";
  document.getElementById("imagen_url").value = data.imagen_url ?? "";
  document.getElementById("descripcion").value = data.descripcion ?? "";

  updatePreview();
}

["equipo", "tipo", "imagen_url"].forEach((fieldId) => {
  document.getElementById(fieldId).addEventListener("input", updatePreview);
  document.getElementById(fieldId).addEventListener("change", updatePreview);
});

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

  const actualizacion = {
    equipo: document.getElementById("equipo").value.trim(),
    temporada: document.getElementById("temporada").value.trim() || null,
    tipo: document.getElementById("tipo").value,
    marca: document.getElementById("marca").value.trim() || null,
    imagen_url: imagenUrl || null,
    descripcion: document.getElementById("descripcion").value.trim() || null,
  };

  const { error } = await supabase
    .from("camisetas")
    .update(actualizacion)
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) {
    mensaje.textContent = error.message || "Error al guardar los cambios.";
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Guardar cambios";
    }
  } else {
    window.location.href = "/dashboard";
  }
});

cargarDatos();
