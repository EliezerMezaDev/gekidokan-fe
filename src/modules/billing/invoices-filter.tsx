"use client"

import { useState } from "react"
import { TableFilters } from "@/shared/components/table-filters"
import {
  parseFilterInput,
  stringifyFilters,
  buildFilterChips,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"
import { invoicesFilterSchema, invoicesFieldSuggestions } from "./filters"

// Filtro dedicado de facturas: inyecta el schema/sugerencias/ayuda al input
// genérico. Solo maneja los campos de texto (student/period); el estado va
// por tabs en la vista.

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
      <div>period=2026-06</div>
      <div>student=diaz period=2026-05</div>
    </div>
    <p className="text-xs text-muted-foreground">
      Un término sin <code>=</code> filtra por alumno.
    </p>
  </div>
)

function textFilters(filters: ParsedFilter): ParsedFilter {
  const out: ParsedFilter = {}
  for (const key of Object.keys(invoicesFilterSchema)) {
    if (filters[key]) out[key] = filters[key]
  }
  return out
}

export function InvoicesFilter({
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

  const apply = () => onApply(parseFilterInput(value, invoicesFilterSchema))

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
      placeholder="Buscar facturas… (usa: campo=valor)"
      suggestions={invoicesFieldSuggestions}
      onInsertField={(field) =>
        setValue((v) => (v.trim() ? `${v.trim()} ${field}=` : `${field}=`))
      }
      helpContent={HELP}
      activeFilters={buildFilterChips(filters, invoicesFieldSuggestions)}
      onRemoveFilter={removeChip}
    />
  )
}
