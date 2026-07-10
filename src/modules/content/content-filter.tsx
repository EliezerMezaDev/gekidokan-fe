"use client"

import { useState } from "react"
import { TableFilters } from "@/shared/components/table-filters"
import {
  parseFilterInput,
  stringifyFilters,
  buildFilterChips,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"
import { contentFilterSchema, contentFieldSuggestions } from "./filters"

// Filtro dedicado de contenido: inyecta el schema/sugerencias/ayuda al input
// genérico. Solo maneja los campos de texto (title/belt/style); el tipo va por
// tabs en la vista.

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
      <div>heian</div>
      <div>belt=azul,negro</div>
      <div>title=kata style=shotokan</div>
    </div>
    <p className="text-xs text-muted-foreground">
      Un término sin <code>=</code> filtra por título.
    </p>
  </div>
)

function textFilters(filters: ParsedFilter): ParsedFilter {
  const out: ParsedFilter = {}
  for (const key of Object.keys(contentFilterSchema)) {
    if (filters[key]) out[key] = filters[key]
  }
  return out
}

export function ContentFilter({
  filters,
  onApply,
}: {
  filters: ParsedFilter
  onApply: (filters: ParsedFilter) => void
}) {
  const external = stringifyFilters(textFilters(filters))
  const [value, setValue] = useState(external)

  const [prevExternal, setPrevExternal] = useState(external)
  if (external !== prevExternal) {
    setPrevExternal(external)
    setValue(external)
  }

  const apply = () => onApply(parseFilterInput(value, contentFilterSchema))

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
      placeholder="Buscar contenido… (usa: campo=valor)"
      suggestions={contentFieldSuggestions}
      onInsertField={(field) =>
        setValue((v) => (v.trim() ? `${v.trim()} ${field}=` : `${field}=`))
      }
      helpContent={HELP}
      activeFilters={buildFilterChips(filters, contentFieldSuggestions)}
      onRemoveFilter={removeChip}
    />
  )
}
