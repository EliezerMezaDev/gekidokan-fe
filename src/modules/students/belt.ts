import type { BeltRank } from "@/shared/schemas/students"

// Presentación de cintas (etiqueta + color del punto), compartida por la vista
// de tabla (columns) y la de grilla (student-card).

export const beltLabel: Record<BeltRank, string> = {
  BLANCO: "Blanco",
  AMARILLO: "Amarillo",
  NARANJA: "Naranja",
  VERDE: "Verde",
  AZUL: "Azul",
  MARRON: "Marrón",
  NEGRO: "Negro",
}

// El blanco y el negro llevan borde para verse sobre el fondo.
export const beltDot: Record<BeltRank, string> = {
  BLANCO: "bg-white ring-1 ring-border",
  AMARILLO: "bg-yellow-400",
  NARANJA: "bg-orange-500",
  VERDE: "bg-green-500",
  AZUL: "bg-blue-500",
  MARRON: "bg-amber-800",
  NEGRO: "bg-neutral-900 ring-1 ring-border dark:bg-neutral-950",
}

// Color sólido de la cinta como banda (obi) para la escalera de rango. El blanco
// lleva borde interno para verse sobre la card.
export const beltBar: Record<BeltRank, string> = {
  BLANCO: "bg-neutral-100 ring-1 ring-inset ring-border",
  AMARILLO: "bg-yellow-400",
  NARANJA: "bg-orange-500",
  VERDE: "bg-green-500",
  AZUL: "bg-blue-500",
  MARRON: "bg-amber-800",
  NEGRO: "bg-neutral-900 dark:bg-neutral-700",
}

export const dateFmt = new Intl.DateTimeFormat("es", { dateStyle: "medium" })
