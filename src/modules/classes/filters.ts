import type { KarateClass } from "@/shared/schemas/classes"
import {
  type FilterSchema,
  type FieldSuggestion,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"
import { styleLabel } from "./class-labels"

// Configuración de filtrado del módulo de clases (dedicada). `style` vive en
// el mismo schema de texto que usan los tabs de la vista: ambos leen/escriben
// el query param `style`, así que no hace falta la separación textOnly que
// usa alumnos (allí el estado solo vive en tabs). ponytail: filtrado en
// cliente hasta que el backend pagine/filtre.

export const classesFilterSchema: FilterSchema = {
  name: { type: "text" },
  style: { type: "text" },
  instructor: { type: "text" },
}

export const classesQuerySchema: FilterSchema = classesFilterSchema

export const classesFieldSuggestions: FieldSuggestion[] = [
  { field: "name", label: "Nombre", type: "text", example: "shotokan" },
  { field: "style", label: "Estilo", type: "text", example: "shotokan,kobudo" },
  { field: "instructor", label: "Instructor", type: "text", example: "carlos" },
]

// ¿Alguno de los términos OR (separados por coma) aparece en el texto? (ci).
function matchesText(haystack: string, term: string): boolean {
  const hay = haystack.toLowerCase()
  return term
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .some((t) => hay.includes(t))
}

export function applyClassFilters(
  classes: KarateClass[],
  filters: ParsedFilter
): KarateClass[] {
  return classes.filter((c) => {
    if (filters.name && !matchesText(c.name, filters.name)) return false
    if (
      filters.style &&
      !matchesText(`${c.style} ${styleLabel[c.style]}`, filters.style)
    )
      return false
    if (
      filters.instructor &&
      !matchesText(c.instructorName, filters.instructor)
    )
      return false
    return true
  })
}
