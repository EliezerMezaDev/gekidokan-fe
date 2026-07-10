// Mini-lenguaje de filtros `campo=valor` compartido por los módulos de tabla.
// Genérico: no conoce ningún módulo. Cada módulo declara su FilterSchema y sus
// FieldSuggestion; aquí solo se parsea el texto a un ParsedFilter (que luego se
// vuelca a query params de la URL) y se reconstruye el texto desde la URL.
//
// Sintaxis: términos separados por espacio; cada término `campo=valor`. Un
// número admite operador (`>=1000`). Varios valores con coma = OR
// (`belt=AZUL,NEGRO`). Un término sin `=` filtra el primer campo del schema.

export type FieldType = "text" | "number" | "boolean" | "relation"

export type FilterSchema = Record<string, { type: FieldType }>

export type ParsedFilter = Record<string, string | undefined>

export interface FieldSuggestion {
  field: string
  label: string
  type: FieldType
  example: string
}

export interface FilterChip {
  field: string
  label: string
  value: string
}

function parseValue(type: FieldType, raw: string): string | undefined {
  const value = raw.trim()
  if (!value) return undefined

  if (type === "number") {
    const op = value.match(/^(>=|<=|>|<|=)/)
    const numStr = op ? value.slice(op[0].length) : value
    if (isNaN(parseFloat(numStr))) return undefined
    return value
  }

  return value
}

export function parseFilterInput(
  input: string,
  schema: FilterSchema
): ParsedFilter {
  const filters: ParsedFilter = {}
  if (!input.trim()) return filters

  const firstField = Object.keys(schema)[0]

  for (const term of input.split(" ").filter((t) => t.trim())) {
    const eq = term.indexOf("=")
    const field = eq === -1 ? firstField : term.slice(0, eq)
    const rawValue = eq === -1 ? term : term.slice(eq + 1)
    if (!field || !schema[field]) continue

    const { type } = schema[field]
    const values = rawValue
      .split(",")
      .map((v) => parseValue(type, v))
      .filter((v): v is string => v !== undefined)
    if (values.length > 0) filters[field] = values.join(",")
  }

  return filters
}

// ParsedFilter → texto editable ("name=juan belt=AZUL,NEGRO"). Inverso de parse.
export function stringifyFilters(filters: ParsedFilter): string {
  return Object.entries(filters)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}=${v}`)
    .join(" ")
}

// ParsedFilter → chips visibles, usando las etiquetas de las sugerencias del
// módulo. Los campos sin sugerencia (p. ej. el estado, que va en tabs) se omiten.
export function buildFilterChips(
  filters: ParsedFilter,
  suggestions: FieldSuggestion[]
): FilterChip[] {
  const labels = Object.fromEntries(suggestions.map((s) => [s.field, s.label]))
  return Object.entries(filters)
    .filter(([field, v]) => v != null && v !== "" && field in labels)
    .map(([field, value]) => ({ field, label: labels[field], value: value! }))
}

// Compara un valor numérico contra un término con operador (">=1000", "50").
export function matchesNumber(actual: number, term: string): boolean {
  const m = term.match(/^(>=|<=|>|<|=)?(.+)$/)
  if (!m) return false
  const expected = parseFloat(m[2])
  if (isNaN(expected)) return false
  switch (m[1]) {
    case ">":
      return actual > expected
    case ">=":
      return actual >= expected
    case "<":
      return actual < expected
    case "<=":
      return actual <= expected
    default:
      return actual === expected
  }
}
