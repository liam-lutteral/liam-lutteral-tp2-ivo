export const fitOptions = [
  "Todos",
  "Oversized",
  "Slim fit",
  "Regular",
  "Boxy",
];

export const shirtAssets = {
  titular: {
    front: "/camisetas/front-slim.svg",
    back: "/camisetas/back-slim.svg",
    colors: ["#111111", "#f5f1e9", "#d13b3b"],
    fit: "Slim fit",
    collar: "Redondo",
    sleeve: "Mangas cortas",
    description: "Corte ajustado y detalle gráfico moderno.",
  },
  suplente: {
    front: "/camisetas/front-oversized.svg",
    back: "/camisetas/back-oversized.svg",
    colors: ["#1f1f1f", "#ded8ce", "#5b5b5b"],
    fit: "Oversized",
    collar: "Cuello V",
    sleeve: "Mangas caídas",
    description: "Diseño cómodo con caída amplia y texturas suaves.",
  },
  arquero: {
    front: "/camisetas/front-slim.svg",
    back: "/camisetas/back-slim.svg",
    colors: ["#0b3b4f", "#50718c", "#d4c9b1"],
    fit: "Boxy",
    collar: "Redondo",
    sleeve: "Mangas largas",
    description: "Estilo urbano con silueta relajada y detalles técnicos.",
  },
  default: {
    front: "/camisetas/front-slim.svg",
    back: "/camisetas/back-oversized.svg",
    colors: ["#222222", "#efefef", "#ad2f2f"],
    fit: "Regular",
    collar: "Redondo",
    sleeve: "Mangas cortas",
    description: "Silueta limpia y mínima para cualquier colección.",
  },
};

export function metadataFor(camiseta) {
  const key = camiseta.tipo?.toLowerCase();

  if (key?.includes("titular")) return shirtAssets.titular;
  if (key?.includes("suplente")) return shirtAssets.suplente;
  if (key?.includes("arquero")) return shirtAssets.arquero;
  if (key?.includes("oversized")) return shirtAssets.suplente;
  if (key?.includes("slim")) return shirtAssets.titular;
  if (key?.includes("boxy")) return shirtAssets.arquero;
  return shirtAssets.default;
}
