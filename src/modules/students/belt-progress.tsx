import { beltRankSchema, type BeltRank } from "@/shared/schemas/students"
import { cn } from "@/shared/lib/utils"
import { beltBar, beltLabel } from "./belt"

// Escalera de rango (obi). Pieza firma del alumno: representa la progresión real
// de cintas (blanco → negro) como una banda segmentada en los colores reales de
// cada cinta. Los tramos alcanzados van sólidos; el actual sobresale con un nudo.
// No es una barra de progreso genérica: los colores SON las cintas.

export function BeltProgress({
  belt,
  className,
}: {
  belt: BeltRank
  className?: string
}) {
  const order = beltRankSchema.options
  const current = order.indexOf(belt)

  return (
    <div className={className}>
      <div className="flex items-end gap-1.5">
        {order.map((b, i) => {
          const reached = i <= current
          const isCurrent = i === current
          return (
            <div key={b} className="relative flex-1">
              <div
                className={cn(
                  "rounded-sm transition-all",
                  isCurrent ? "h-4" : "h-2.5",
                  reached ? beltBar[b] : "bg-muted"
                )}
                aria-hidden
              />
              {isCurrent ? (
                // El nudo del obi: marca la cinta vigente.
                <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-foreground ring-2 ring-card" />
              ) : null}
            </div>
          )
        })}
      </div>
      <p className="mt-3.5 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{beltLabel[belt]}</span>
        {" · "}
        {current + 1}.ª de {order.length} cintas
      </p>
    </div>
  )
}
