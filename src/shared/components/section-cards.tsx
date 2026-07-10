"use client"

import { Badge } from "@/shadcn/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/card"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

// Tarjetas de resumen del dashboard. ponytail: valores de ejemplo; conectar a
// GET /dashboard/summary cuando exista el endpoint.

const cards = [
  {
    label: "Alumnos activos",
    value: "128",
    delta: "+6",
    up: true,
    title: "Crecimiento este mes",
    note: "6 inscripciones nuevas",
  },
  {
    label: "Nuevos este mes",
    value: "6",
    delta: "-2",
    up: false,
    title: "Menos que el mes pasado",
    note: "Reforzar captación",
  },
  {
    label: "Asistencia promedio",
    value: "82%",
    delta: "+3.5%",
    up: true,
    title: "Buena participación",
    note: "Últimas 4 semanas",
  },
  {
    label: "Facturas por cobrar",
    value: "$1,240",
    delta: "+12.5%",
    up: true,
    title: "Cobros al día",
    note: "4 pendientes de pago",
  },
]

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((c) => {
        const Trend = c.up ? IconTrendingUp : IconTrendingDown
        return (
          <Card key={c.label} className="@container/card">
            <CardHeader>
              <CardDescription>{c.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {c.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Trend />
                  {c.delta}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {c.title} <Trend className="size-4" />
              </div>
              <div className="text-muted-foreground">{c.note}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
