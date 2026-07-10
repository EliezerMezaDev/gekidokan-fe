"use client"

import { useState } from "react"
import {
  IconSearch,
  IconX,
  IconHelpCircle,
  IconFilter,
} from "@tabler/icons-react"
import { Input } from "@/shadcn/input"
import { Button } from "@/shadcn/button"
import { Badge } from "@/shadcn/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/popover"
import type { FieldSuggestion, FilterChip } from "@/shared/lib/filter-parser"

// Input de filtrado avanzado, genérico para cualquier módulo de tabla. El
// módulo aporta las sugerencias de campos, el contenido de ayuda y los chips
// activos; aquí solo se maquetan el input, el menú de campos, la ayuda y los
// chips removibles. La sintaxis la parsea filter-parser (campo=valor).

interface TableFiltersProps {
  value: string
  onChange: (value: string) => void
  onApply: () => void
  onClear: () => void
  placeholder?: string
  suggestions: FieldSuggestion[]
  onInsertField: (field: string) => void
  helpContent?: React.ReactNode
  activeFilters: FilterChip[]
  onRemoveFilter: (field: string) => void
}

export function TableFilters({
  value,
  onChange,
  onApply,
  onClear,
  placeholder = "Buscar… (usa: campo=valor)",
  suggestions,
  onInsertField,
  helpContent,
  activeFilters,
  onRemoveFilter,
}: TableFiltersProps) {
  const [openFields, setOpenFields] = useState(false)

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                onApply()
              }
            }}
            placeholder={placeholder}
            className="pr-8 pl-8"
          />
          {value ? (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 size-6 -translate-y-1/2 text-muted-foreground"
              onClick={onClear}
              aria-label="Limpiar"
            >
              <IconX className="size-4" />
            </Button>
          ) : null}
        </div>

        {/* Menú de campos disponibles: inserta `campo=` en el input. */}
        <Popover open={openFields} onOpenChange={setOpenFields}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Campos">
              <IconFilter className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-2">
            <p className="px-2 py-1 text-xs text-muted-foreground">
              Campos disponibles
            </p>
            <div className="space-y-0.5">
              {suggestions.map((s) => (
                <button
                  key={s.field}
                  className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    onInsertField(s.field)
                    setOpenFields(false)
                  }}
                >
                  <span>
                    <span className="font-medium">{s.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({s.field})
                    </span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {s.example}
                  </span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {helpContent ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ayuda">
                <IconHelpCircle className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              {helpContent}
            </PopoverContent>
          </Popover>
        ) : null}

        <Button size="sm" onClick={onApply}>
          Aplicar
        </Button>
      </div>

      {activeFilters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-xs text-muted-foreground">Filtros:</span>
          {activeFilters.map((f) => (
            <Badge key={f.field} variant="secondary" className="gap-1 pr-1">
              <span className="font-medium">{f.label}:</span>
              <span>{f.value}</span>
              <button
                className="ml-0.5 rounded hover:bg-muted-foreground/20"
                onClick={() => onRemoveFilter(f.field)}
                aria-label={`Quitar ${f.label}`}
              >
                <IconX className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}
