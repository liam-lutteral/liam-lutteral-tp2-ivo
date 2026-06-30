import { supabase, withTimeout } from "../lib/supabase.js";
import { getUser } from "../lib/auth.js";
import { metadataFor } from "../data/camisetas.js";
import { escapeHtml, FALLBACK_IMAGE } from "../lib/validation.js";

const contenedor = document.getElementById("camisetas");
const filterTipo = document.getElementById("filter-tipo");
const searchInput = document.getElementById("search");
const cardCount = document.getElementById("card-count");
const refreshBtn = document.getElementById("refresh");
const emptyHint = document.getElementById("empty-hint");

let allItems = [];

async function cargarCamisetas() {
  try {
    const user = await withTimeout(getUser());
    if (!user) {
      console.log("[dashboard] sin sesión, redirigiendo a /login");
      window.location.href = "/login";
      return;
    }

    console.log("[dashboard] cargando camisetas para usuario", user.id);
    const { data, error } = await withTimeout(
      supabase
        .from("camisetas")
        .select("*")
        .eq("user_id", user.id)
        .order("equipo", { ascending: true })
    );

    if (error) {
      console.error("[dashboard] error al cargar camisetas:", error.message, error);
      contenedor.innerHTML = `<p class="empty-state">Error al cargar: ${escapeHtml(error.message)}</p>`;
      cardCount.textContent = "Error";
      return;
    }

    allItems = data ?? [];
    console.log("[dashboard] camisetas cargadas:", allItems.length);
    renderCatalog();
  } catch (err) {
    console.error("[dashboard] error:", err.message, err);
    contenedor.innerHTML = `<p class="empty-state">${escapeHtml(err.message || "Error de conexión.")}</p>`;
    cardCount.textContent = "Error";
  }
}

function getFilteredItems() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedTipo = filterTipo.value;

  return allItems.filter((item) => {
    const text = `${item.equipo} ${item.tipo} ${item.marca} ${item.temporada} ${item.descripcion}`.toLowerCase();
    const tipoMatch = selectedTipo === "Todos" || item.tipo === selectedTipo;
    const searchMatch = query.length === 0 || text.includes(query);
    return tipoMatch && searchMatch;
  });
}

function renderCard(item) {
  const metadata = metadataFor(item);
  const imageSrc = item.imagen_url || metadata.front || FALLBACK_IMAGE;

  return `
    <article class="product-card" data-id="${escapeHtml(item.id)}">
      <div class="card-image">
        <img
          src="${escapeHtml(imageSrc)}"
          alt="${escapeHtml(item.equipo)}"
          loading="lazy"
          onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
        />
        <span class="image-tag">${escapeHtml(item.tipo || "Sin tipo")}</span>
      </div>
      <div class="card-body">
        <h2>${escapeHtml(item.equipo)}</h2>
        <p class="card-desc">${escapeHtml(item.descripcion || metadata.description)}</p>
        <div class="meta-row">
          <span>${escapeHtml(item.marca || "Sin marca")}</span>
          <span>${escapeHtml(item.temporada || "—")}</span>
        </div>
        <div class="action-row">
          <a class="secondary-button" href="/editar/${escapeHtml(item.id)}">Editar</a>
          <button type="button" class="danger-button" data-delete="${escapeHtml(item.id)}">Eliminar</button>
        </div>
      </div>
    </article>
  `;
}

function renderCatalog() {
  const filtered = getFilteredItems();

  if (allItems.length === 0) {
    contenedor.innerHTML = "";
    emptyHint.hidden = false;
    cardCount.textContent = "0 camisetas";
    return;
  }

  emptyHint.hidden = true;

  if (filtered.length === 0) {
    contenedor.innerHTML = `<p class="empty-state">No hay camisetas que coincidan con los filtros.</p>`;
    cardCount.textContent = "0 resultados";
    return;
  }

  contenedor.innerHTML = filtered.map(renderCard).join("");
  attachDeleteHandlers();
  cardCount.textContent = `${filtered.length} camiseta${filtered.length === 1 ? "" : "s"}`;
}

function attachDeleteHandlers() {
  document.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const camisetaId = btn.dataset.delete;
      const item = allItems.find((c) => c.id === camisetaId);
      const nombre = item?.equipo ?? "esta camiseta";

      if (!confirm(`¿Eliminar "${nombre}" del catálogo?`)) return;

      try {
        const user = await withTimeout(getUser());
        if (!user) return;

        const { error } = await withTimeout(
          supabase
            .from("camisetas")
            .delete()
            .eq("id", camisetaId)
            .eq("user_id", user.id)
        );

        if (error) {
          console.error("[dashboard] error al eliminar:", error.message, error);
          alert(`No se pudo eliminar: ${error.message}`);
          return;
        }

        console.log("[dashboard] camiseta eliminada:", camisetaId);
        allItems = allItems.filter((c) => c.id !== camisetaId);
        renderCatalog();
      } catch (err) {
        console.error("[dashboard] error al eliminar:", err.message, err);
        alert(err.message || "Error de conexión al eliminar.");
      }
    });
  });
}

refreshBtn.addEventListener("click", cargarCamisetas);
filterTipo.addEventListener("change", renderCatalog);
searchInput.addEventListener("input", renderCatalog);

cargarCamisetas();
