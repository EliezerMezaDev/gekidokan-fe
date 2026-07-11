"use client"

import {
  IconLayoutGrid,
  IconLayoutList,
  IconBinaryTree,
} from "@tabler/icons-react"
import { ToggleGroup, ToggleGroupItem } from "@/shadcn/toggle-group"

// Alterna la vista de un módulo entre tabla, grilla y (opcional) árbol. Genérico:
// el módulo mantiene el estado y decide qué renderiza cada modo.
export type ViewMode = "table" | "grid" | "syllabus"

export function ViewToggle({
  value,
  onChange,
  showSyllabus = false,
}: {
  value: ViewMode
  onChange: (value: ViewMode) => void
  // Solo el módulo de contenido habilita el tercer modo (árbol de progresión).
  showSyllabus?: boolean
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
      {showSyllabus ? (
        <ToggleGroupItem value="syllabus" aria-label="Árbol de progresión">
          <IconBinaryTree className="size-4" />
        </ToggleGroupItem>
      ) : null}
    </ToggleGroup>
  )
}
