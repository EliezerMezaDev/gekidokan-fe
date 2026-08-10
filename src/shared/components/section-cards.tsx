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
import { getStudents } from "@/modules/students/api"
import { dateFmt } from "@/modules/students/belt"
import { getClasses } from "@/modules/classes/api"
import { getInvoices } from "@/modules/billing/api"
import { getLatestAttendanceSession } from "@/modules/attendance/api"

// Tarjetas de resumen del dashboard: conteos reales derivados de los mocks de
// cada módulo (GET /dashboard/summary reemplazará este Promise.all cuando
// exista el endpoint agregador en el backend).

export async function SectionCards() {
  const [students, classes, invoices, latestSession] = await Promise.all([
    getStudents(),
    getClasses(),
    getInvoices(),
    getLatestAttendanceSession(),
  ])

  const activeStudents = students.filter((s) => s.status === "ACTIVE")

  const currentPeriod = new Date().toISOString().slice(0, 7)
  const monthInvoices = invoices.filter((i) => i.period === currentPeriod)
  const paidInvoices = monthInvoices.filter((i) => i.status === "PAID")
  const overdueInvoices = monthInvoices.filter((i) => i.status === "OVERDUE")

  const present = latestSession
    ? latestSession.records.filter((r) => r.present).length
    : 0
  const totalRecords = latestSession ? latestSession.records.length : 0

  const cards = [
    {
      label: "Alumnos activos",
      value: String(activeStudents.length),
      delta: `${activeStudents.length}/${students.length}`,
      up: activeStudents.length >= students.length / 2,
      title: "Alumnos con estatus activo",
      note: `${students.length} alumnos en total`,
    },
    {
      label: "Clases activas",
      // ponytail: todas las clases se consideran activas, no hay isActive en el modelo aún
      value: String(classes.length),
      delta: String(classes.length),
      up: true,
      title: "Clases dictadas",
      note: `${classes.length} clases registradas`,
    },
    {
      label: "Asistencia a la última clase",
      value: latestSession ? `${present}/${totalRecords}` : "—",
      delta: latestSession ? `${present}/${totalRecords}` : "—",
      up: latestSession ? present >= totalRecords / 2 : true,
      title: "Asistencia de la última sesión",
      note: latestSession
        ? dateFmt.format(new Date(latestSession.date))
        : "Sin registros",
    },
    {
      label: "Facturas del mes",
      value: `${paidInvoices.length}/${monthInvoices.length}`,
      delta: `${paidInvoices.length}/${monthInvoices.length}`,
      up: overdueInvoices.length === 0,
      title: "Facturas pagadas del mes actual",
      note: `${overdueInvoices.length} vencidas`,
    },
  ]

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
