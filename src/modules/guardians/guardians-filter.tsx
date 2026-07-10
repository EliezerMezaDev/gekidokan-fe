"use client"

import { useState } from "react"
import { TableFilters } from "@/shared/components/table-filters"
import {
  parseFilterInput,
  stringifyFilters,
  buildFilterChips,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"
import { guardiansFilterSchema, guardiansFieldSuggestions } from "./filters"

// Filtro dedicado de representantes: inyecta el schema/sugerencias/ayuda al
// input genérico. El texto editable se deriva de `filters` (que viene de la
// URL) y al aplicar se reparsea y se devuelve como ParsedFilter.

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
      <div>carla</div>
      <div>relationship=padre,madre</div>
      <div>name=luis contact=412</div>
    </div>
    <p className="text-xs text-muted-foreground">
      Un término sin <code>=</code> filtra por nombre.
    </p>
  </div>
)

export function GuardiansFilter({
  filters,
  onApply,
}: {
  filters: ParsedFilter
  onApply: (filters: ParsedFilter) => void
}) {
  const external = stringifyFilters(filters)
  const [value, setValue] = useState(external)

  // Refleja cambios externos de la URL (p. ej. quitar un chip) en el input,
  // ajustando el estado durante el render (sin efecto ni renders en cascada).
  const [prevExternal, setPrevExternal] = useState(external)
  if (external !== prevExternal) {
    setPrevExternal(external)
    setValue(external)
  }

  const apply = () => onApply(parseFilterInput(value, guardiansFilterSchema))

  const removeChip = (field: string) => {
    const next = { ...filters }
    delete next[field]
    onApply(next)
  }

  return (
    <TableFilters
      value={value}
      onChange={setValue}
      onApply={apply}
      onClear={() => onApply({})}
      placeholder="Buscar representantes… (usa: campo=valor)"
      suggestions={guardiansFieldSuggestions}
      onInsertField={(field) =>
        setValue((v) => (v.trim() ? `${v.trim()} ${field}=` : `${field}=`))
      }
      helpContent={HELP}
      activeFilters={buildFilterChips(filters, guardiansFieldSuggestions)}
      onRemoveFilter={removeChip}
    />
  )
}
