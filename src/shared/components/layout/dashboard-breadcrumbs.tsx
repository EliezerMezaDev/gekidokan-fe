"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shadcn/breadcrumb"

// Breadcrumbs del dashboard derivados del pathname. Siempre visibles en el
// layout de /d. Mapea cada segmento a una etiqueta legible; los desconocidos
// (IDs de detalle) caen a "Detalle".

const labels: Record<string, string> = {
  d: "Inicio",
  students: "Alumnos",
  classes: "Clases",
  billing: "Facturación",
  invoices: "Facturas",
  content: "Contenido",
  add: "Nuevo alumno",
  edit: "Editar",
}
// ponytail: el segmento slug cae a "Detalle"; label dinámico del alumno si hace falta.

function labelFor(segment: string) {
  return labels[segment] ?? "Detalle"
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean) // p. ej. ["d","students"]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/")
          const isLast = i === segments.length - 1
          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{labelFor(seg)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{labelFor(seg)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {isLast ? null : <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
