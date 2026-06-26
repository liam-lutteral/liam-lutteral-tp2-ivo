export const tipoOptions = ["Todos", "Titular", "Suplente", "Alternativa"];

export const shirtAssets = {
  titular: {
    front: "/camisetas/front-slim.svg",
    back: "/camisetas/back-slim.svg",
    colors: ["#111111", "#f5f1e9", "#d13b3b"],
    collar: "Redondo",
    sleeve: "Mangas cortas",
    description: "Equipación principal del club.",
  },
  suplente: {
    front: "/camisetas/front-oversized.svg",
    back: "/camisetas/back-oversized.svg",
    colors: ["#1f1f1f", "#ded8ce", "#5b5b5b"],
    collar: "Cuello V",
    sleeve: "Mangas cortas",
    description: "Segunda equipación alternativa.",
  },
  alternativa: {
    front: "/camisetas/front-slim.svg",
    back: "/camisetas/back-oversized.svg",
    colors: ["#0b3b4f", "#50718c", "#d4c9b1"],
    collar: "Redondo",
    sleeve: "Mangas cortas",
    description: "Tercera equipación o edición especial.",
  },
  default: {
    front: "/camisetas/front-slim.svg",
    back: "/camisetas/back-oversized.svg",
    colors: ["#222222", "#efefef", "#ad2f2f"],
    collar: "Redondo",
    sleeve: "Mangas cortas",
    description: "Camiseta de colección.",
  },
};

export function metadataFor(camiseta) {
  const key = camiseta.tipo?.toLowerCase() ?? "";

  if (key.includes("titular")) return shirtAssets.titular;
  if (key.includes("suplente")) return shirtAssets.suplente;
  if (key.includes("alternativa")) return shirtAssets.alternativa;
  return shirtAssets.default;
}
