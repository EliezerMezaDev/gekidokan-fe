import type { SyllabusItem } from "@/shared/schemas/content"
import {
  type FilterSchema,
  type FieldSuggestion,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"
import { beltLabel } from "@/modules/students/belt"
import { syllabusTypeLabel, contentStyleLabel } from "./content-labels"

// Configuración de filtrado del módulo de contenido (dedicada). El texto libre
// (title/belt/style) va por el input avanzado; el tipo va por tabs. Filtrado en
// cliente sobre los mocks. ponytail: mover al backend cuando pagine/filtre.

export const contentFilterSchema: FilterSchema = {
  title: { type: "text" },
  belt: { type: "text" },
  style: { type: "text" },
}

// Schema completo para la URL: suma el tipo (controlado por tabs).
export const contentQuerySchema: FilterSchema = {
  ...contentFilterSchema,
  type: { type: "text" },
}

export const contentFieldSuggestions: FieldSuggestion[] = [
  { field: "title", label: "Título", type: "text", example: "heian" },
  { field: "belt", label: "Cinta mínima", type: "text", example: "azul" },
  { field: "style", label: "Estilo", type: "text", example: "shotokan" },
]

function matchesText(haystack: string, term: string): boolean {
  const hay = haystack.toLowerCase()
  return term
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .some((t) => hay.includes(t))
}

export function applyContentFilters(
  items: SyllabusItem[],
  filters: ParsedFilter
): SyllabusItem[] {
  return items.filter((c) => {
    if (filters.title && !matchesText(c.title, filters.title)) return false
    if (
      filters.belt &&
      !matchesText(`${c.minBeltRank} ${beltLabel[c.minBeltRank]}`, filters.belt)
    )
      return false
    if (
      filters.style &&
      !matchesText(`${c.style} ${contentStyleLabel[c.style]}`, filters.style)
    )
      return false
    if (filters.type && c.type !== filters.type) return false
    return true
  })
}
