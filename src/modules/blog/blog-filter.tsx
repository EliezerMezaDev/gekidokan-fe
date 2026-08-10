"use client"

import { useState } from "react"
import { TableFilters } from "@/shared/components/table-filters"
import {
  parseFilterInput,
  stringifyFilters,
  buildFilterChips,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"
import { blogFilterSchema, blogFieldSuggestions } from "./filters"

// Filtro dedicado del blog: inyecta el schema/sugerencias/ayuda al input
// genérico. Solo maneja los campos de texto (title/category/tag); la
// visibilidad va por tabs en la vista.

const HELP = (
  <div className="space-y-3">
    <div>
      <h4 className="text-sm font-semibold">Sintaxis de filtros</h4>
      <p className="mt-1 text-xs text-muted-foreground">
        Escribe <code>campo=valor</code> separados por espacio. Usa coma para
        varios valores (OR).
      </p>
    </div>
    <div className="space-y-1 rounded bg-muted p-2 font-mono text-xs">
      <div>dojo</div>
      <div>category=noticias,eventos</div>
      <div>title=torneo tag=kata</div>
    </div>
    <p className="text-xs text-muted-foreground">
      Un término sin <code>=</code> filtra por título.
    </p>
  </div>
)

// Solo los campos de texto (excluye isPublic, que no vive en este input).
function textFilters(filters: ParsedFilter): ParsedFilter {
  const out: ParsedFilter = {}
  for (const key of Object.keys(blogFilterSchema)) {
    if (filters[key]) out[key] = filters[key]
  }
  return out
}

export function BlogFilter({
  filters,
  onApply,
}: {
  filters: ParsedFilter
  onApply: (filters: ParsedFilter) => void
}) {
  const external = stringifyFilters(textFilters(filters))
  const [value, setValue] = useState(external)

  // Refleja cambios externos de la URL (p. ej. quitar un chip) en el input,
  // ajustando el estado durante el render (sin efecto ni renders en cascada).
  const [prevExternal, setPrevExternal] = useState(external)
  if (external !== prevExternal) {
    setPrevExternal(external)
    setValue(external)
  }

  const apply = () => onApply(parseFilterInput(value, blogFilterSchema))

  const removeChip = (field: string) => {
    const next = { ...textFilters(filters) }
    delete next[field]
    onApply(next)
  }

  return (
    <TableFilters
      value={value}
      onChange={setValue}
      onApply={apply}
      onClear={() => onApply({})}
      placeholder="Buscar publicaciones… (usa: campo=valor)"
      suggestions={blogFieldSuggestions}
      onInsertField={(field) =>
        setValue((v) => (v.trim() ? `${v.trim()} ${field}=` : `${field}=`))
      }
      helpContent={HELP}
      activeFilters={buildFilterChips(filters, blogFieldSuggestions)}
      onRemoveFilter={removeChip}
    />
  )
}
