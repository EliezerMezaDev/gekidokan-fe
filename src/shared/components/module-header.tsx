import type { ReactNode } from "react"

// Encabezado estándar de un módulo del dashboard: título, descripción y una
// zona de acciones a la derecha (botón "Nuevo", filtros…). Los módulos de tabla
// lo montan encima del DataTable para tener una cabecera consistente.

export function ModuleHeader({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex items-center gap-2">{children}</div>
      ) : null}
    </div>
  )
}
