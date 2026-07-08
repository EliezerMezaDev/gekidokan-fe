import type { ClassStyle, Weekday } from "@/shared/schemas/public"

// Formateo y etiquetas del portal en español. Fechas deterministas (UTC) para
// evitar desajustes de hidratación entre servidor y cliente.

const dateFormatter = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

// Fecha corta del diseño: "28 Feb, 2026". Determinista (UTC) y con abreviatura
// capitalizada, que Intl no da en español.
const shortMonths = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
]

export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${day} ${shortMonths[d.getUTCMonth()]}, ${d.getUTCFullYear()}`
}

const weekdayLabels: Record<Weekday, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
}

const styleLabels: Record<ClassStyle, string> = {
  SHOTOKAN: "Karate Shotokan",
  KOBUDO: "Kobudo",
  OTRO: "Otro",
}

export const weekdayLabel = (w: Weekday): string => weekdayLabels[w]
export const styleLabel = (s: ClassStyle): string => styleLabels[s]
