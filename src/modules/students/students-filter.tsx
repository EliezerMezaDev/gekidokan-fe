"use client"

import { useState } from "react"
import { TableFilters } from "@/shared/components/table-filters"
import {
  parseFilterInput,
  stringifyFilters,
  buildFilterChips,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"
import { studentsFilterSchema, studentsFieldSuggestions } from "./filters"

// Filtro dedicado de alumnos: inyecta el schema/sugerencias/ayuda al input
// genérico. Solo maneja los campos de texto (name/belt/contact); el estado va
// por tabs en la vista. El texto editable se deriva de `filters` (que viene de
// la URL) y al aplicar se reparsea y se devuelve como ParsedFilter.

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
      <div>mateo</div>
      <div>belt=azul,negro</div>
      <div>name=sofia contact=412</div>
    </div>
    <p className="text-xs text-muted-foreground">
      Un término sin <code>=</code> filtra por nombre.
    </p>
  </div>
)

// Solo los campos de texto (excluye status, que no vive en este input).
function textFilters(filters: ParsedFilter): ParsedFilter {
  const out: ParsedFilter = {}
  for (const key of Object.keys(studentsFilterSchema)) {
    if (filters[key]) out[key] = filters[key]
  }
  return out
}

export function StudentsFilter({
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

  const apply = () => onApply(parseFilterInput(value, studentsFilterSchema))

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
      placeholder="Buscar alumnos… (usa: campo=valor)"
      suggestions={studentsFieldSuggestions}
      onInsertField={(field) =>
        setValue((v) => (v.trim() ? `${v.trim()} ${field}=` : `${field}=`))
      }
      helpContent={HELP}
      activeFilters={buildFilterChips(filters, studentsFieldSuggestions)}
      onRemoveFilter={removeChip}
    />
  )
}
