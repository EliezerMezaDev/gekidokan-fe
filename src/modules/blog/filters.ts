import type { BlogPostAdmin } from "@/shared/schemas/public"
import {
  type FilterSchema,
  type FieldSuggestion,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"

// Configuración de filtrado del módulo de blog (dedicada). El texto libre
// (title/category/tag) va por el input avanzado; la visibilidad va por tabs.
// Todos se vuelcan a query params. `applyBlogFilters` es el matcher cliente que
// hoy filtra los mocks. ponytail: filtrado en cliente hasta que el backend
// pagine/filtre (mismo criterio que students/filters.ts).

export const blogFilterSchema: FilterSchema = {
  title: { type: "text" },
  category: { type: "text" },
  tag: { type: "text" },
}

// Schema completo para la URL: suma la visibilidad (controlada por tabs).
export const blogQuerySchema: FilterSchema = {
  ...blogFilterSchema,
  isPublic: { type: "text" },
}

export const blogFieldSuggestions: FieldSuggestion[] = [
  { field: "title", label: "Título", type: "text", example: "dojo" },
  { field: "category", label: "Categoría", type: "text", example: "noticias" },
  { field: "tag", label: "Etiqueta", type: "text", example: "kata" },
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

export function applyBlogFilters(
  posts: BlogPostAdmin[],
  filters: ParsedFilter
): BlogPostAdmin[] {
  return posts.filter((p) => {
    if (filters.title && !matchesText(p.title, filters.title)) return false
    if (filters.category && !matchesText(p.category, filters.category))
      return false
    if (filters.tag && !matchesText(p.tags.join(" "), filters.tag))
      return false
    if (
      filters.isPublic &&
      p.isPublic !== (filters.isPublic === "true")
    )
      return false
    return true
  })
}
