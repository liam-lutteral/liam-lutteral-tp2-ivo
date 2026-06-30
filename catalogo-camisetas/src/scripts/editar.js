import { supabase, withTimeout } from "../lib/supabase.js";
import { getUser } from "../lib/auth.js";
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
  try {
    const user = await withTimeout(getUser());
    if (!user) {
      console.log("[editar] sin sesión, redirigiendo a /login");
      window.location.href = "/login";
      return;
    }

    console.log("[editar] cargando camiseta id:", id);
    const { data, error } = await withTimeout(
      supabase.from("camisetas").select("*").eq("id", id).single()
    );

    if (error || !data) {
      console.error("[editar] no se encontró la camiseta:", id, error?.message);
      mensaje.textContent = "No se encontró la camiseta o no tenés permiso para editarla.";
      return;
    }

    if (data.user_id !== user.id) {
      console.warn("[editar] permiso denegado — usuario", user.id, "≠ dueño", data.user_id);
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
  } catch (err) {
    mensaje.textContent = err.message || "Error de conexión al cargar los datos.";
  }
}

["equipo", "tipo", "imagen_url"].forEach((fieldId) => {
  document.getElementById(fieldId).addEventListener("input", updatePreview);
  document.getElementById(fieldId).addEventListener("change", updatePreview);
});

const submitBtn = form?.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensaje.textContent = "";

  let user;
  try {
    user = await withTimeout(getUser());
  } catch (err) {
    console.error("[editar] error al obtener usuario:", err.message, err);
    mensaje.textContent = err.message || "Error de conexión. Verificá tu conexión e intentá de nuevo.";
    return;
  }

  if (!user) {
    console.log("[editar] sin sesión, redirigiendo a /login");
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

  try {
    const { error } = await withTimeout(
      supabase
        .from("camisetas")
        .update(actualizacion)
        .eq("id", id)
        .eq("user_id", user.id)
    );

    if (error) {
      console.error("[editar] error al guardar:", error.message, error);
      mensaje.textContent = error.message || "Error al guardar los cambios.";
    } else {
      console.log("[editar] cambios guardados correctamente, redirigiendo");
      window.location.href = "/dashboard";
      return;
    }
  } catch (err) {
    console.error("[editar] error al guardar:", err.message, err);
    mensaje.textContent = err.message || "Error de conexión al guardar los cambios.";
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Guardar cambios";
  }
});

cargarDatos();
