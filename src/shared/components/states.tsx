import type { ReactNode } from "react"
import { IconInbox, IconAlertTriangle } from "@tabler/icons-react"
import { Skeleton } from "@/shadcn/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/shadcn/alert"
import { Button } from "@/shadcn/button"

// Patrones de estado reutilizables (loading / empty / error). Se usan en todas
// las etapas en vez de reinventar el estado por página.

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Cargando">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
      <div className="text-muted-foreground">{icon ?? <IconInbox className="size-8" />}</div>
      <div>
        <p className="font-medium">{title}</p>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function ErrorState({
  message = "Ocurrió un problema. Intenta de nuevo en un momento.",
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <Alert variant="destructive">
      <IconAlertTriangle className="size-4" />
      <AlertTitle>No se pudo cargar</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-2">
        <span>{message}</span>
        {onRetry ? (
          <Button size="sm" variant="outline" onClick={onRetry}>
            Reintentar
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  )
}
