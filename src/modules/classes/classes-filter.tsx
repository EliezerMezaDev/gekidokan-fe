"use client"

import { useState } from "react"
import { TableFilters } from "@/shared/components/table-filters"
import {
  parseFilterInput,
  stringifyFilters,
  buildFilterChips,
  type ParsedFilter,
} from "@/shared/lib/filter-parser"
import { classesFilterSchema, classesFieldSuggestions } from "./filters"

// Filtro dedicado de clases: inyecta el schema/sugerencias/ayuda al input
// genérico. `style` también lo controlan los tabs de la vista; ambos comparten
// el mismo query param, así que no hace falta excluirlo aquí.

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
      <div>shotokan</div>
      <div>style=kobudo,otro</div>
      <div>name=infantil instructor=carlos</div>
    </div>
    <p className="text-xs text-muted-foreground">
      Un término sin <code>=</code> filtra por nombre.
    </p>
  </div>
)

export function ClassesFilter({
  filters,
  onApply,
}: {
  filters: ParsedFilter
  onApply: (filters: ParsedFilter) => void
}) {
  const external = stringifyFilters(filters)
  const [value, setValue] = useState(external)

  // Refleja cambios externos de la URL (tabs, chips) en el input, ajustando el
  // estado durante el render (sin efecto ni renders en cascada).
  const [prevExternal, setPrevExternal] = useState(external)
  if (external !== prevExternal) {
    setPrevExternal(external)
    setValue(external)
  }

  const apply = () => onApply(parseFilterInput(value, classesFilterSchema))

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
      placeholder="Buscar clases… (usa: campo=valor)"
      suggestions={classesFieldSuggestions}
      onInsertField={(field) =>
        setValue((v) => (v.trim() ? `${v.trim()} ${field}=` : `${field}=`))
      }
      helpContent={HELP}
      activeFilters={buildFilterChips(filters, classesFieldSuggestions)}
      onRemoveFilter={removeChip}
    />
  )
}
