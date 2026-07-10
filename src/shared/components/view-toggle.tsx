"use client"

import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react"
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/toggle-group"

// Alterna la vista de un módulo entre tabla y grilla. Genérico: el módulo
// mantiene el estado y decide qué renderiza cada modo.
export type ViewMode = "table" | "grid"

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode
  onChange: (value: ViewMode) => void
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as ViewMode)}
      variant="outline"
      size="sm"
    >
      <ToggleGroupItem value="table" aria-label="Vista de tabla">
        <IconLayoutList className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Vista de grilla">
        <IconLayoutGrid className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
