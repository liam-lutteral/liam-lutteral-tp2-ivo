import { supabase } from "../lib/supabase.js";
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
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    window.location.href = "/login";
    return;
  }

  const { data, error } = await supabase
    .from("camisetas")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("equipo", { ascending: true });

  if (error) {
    contenedor.innerHTML = `<p class="empty-state">Error al cargar: ${escapeHtml(error.message)}</p>`;
    cardCount.textContent = "Error";
    return;
  }

  allItems = data ?? [];
  renderCatalog();
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

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { error } = await supabase
        .from("camisetas")
        .delete()
        .eq("id", camisetaId)
        .eq("user_id", userData.user.id);

      if (error) {
        alert(`No se pudo eliminar: ${error.message}`);
        return;
      }

      allItems = allItems.filter((c) => c.id !== camisetaId);
      renderCatalog();
    });
  });
}

refreshBtn.addEventListener("click", cargarCamisetas);
filterTipo.addEventListener("change", renderCatalog);
searchInput.addEventListener("input", renderCatalog);

cargarCamisetas();
