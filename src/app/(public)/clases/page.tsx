import type { Metadata } from "next"
import { getClasses } from "@/modules/public/api"
import { styleLabel, weekdayLabel } from "@/modules/public/format"
import { Badge } from "@/shadcn/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shadcn/card"
import { EmptyState } from "@/shared/components/states"

// Datos futuros del backend: revalidación incremental sin rebuild.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Clases y horarios",
  description:
    "Horarios de las clases de Karate Shotokan y Kobudo en Gekidokan, para niños y adultos.",
}

export default async function ClassesPage() {
  const classes = await getClasses()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Clases y horarios</h1>
        <p className="text-muted-foreground mt-2">
          Encuentra la clase que se ajusta a tu nivel y disponibilidad.
        </p>
      </header>

      {classes.length === 0 ? (
        <EmptyState
          title="Aún no hay clases publicadas"
          description="Vuelve pronto o escríbenos para conocer la oferta actual."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {classes.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <Badge variant="secondary" className="w-fit">{styleLabel(c.style)}</Badge>
                <CardTitle className="mt-1">{c.name}</CardTitle>
                <CardDescription>{c.instructor}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-muted-foreground text-sm">{c.description}</p>
                <ul className="flex flex-col gap-1 text-sm">
                  {c.schedules.map((s, i) => (
                    <li key={i} className="flex justify-between border-t py-1.5 first:border-t-0">
                      <span className="font-medium">{weekdayLabel(s.weekday)}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {s.startTime} – {s.endTime}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
