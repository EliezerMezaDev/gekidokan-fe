import { cn } from "@/shared/lib/utils"

// Trama diagonal usada como marcador de foto mientras no hay imágenes reales.
export const stripes = (step = 10) =>
  `repeating-linear-gradient(45deg,var(--stripe-a),var(--stripe-a) ${step}px,var(--stripe-b) ${step}px,var(--stripe-b) ${step * 2}px)`

// Caja con trama y una etiqueta mono opcional al pie. El tamaño, el aspecto y
// el redondeo los define quien la usa vía className.
export function PhotoPlaceholder({
  label,
  className,
  step = 10,
}: {
  label?: string
  className?: string
  step?: number
}) {
  return (
    <div
      className={cn("flex items-end", className)}
      style={{ background: stripes(step) }}
    >
      {label ? (
        <span className="rounded bg-background px-2 py-1 font-mono text-[10px] text-ink-subtle">
          {label}
        </span>
      ) : null}
    </div>
  )
}
