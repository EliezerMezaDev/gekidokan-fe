import { SectionCards } from "@/shared/components/section-cards"
import { ChartAreaInteractive } from "@/shared/components/chart-area-interactive"

// Home del dashboard (bloque shadcn dashboard-01 adaptado al dojo): tarjetas de
// resumen + gráfico de asistencia. El @container/main habilita las columnas
// responsivas de SectionCards.

export default function DashboardHome() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
      <ChartAreaInteractive />
    </div>
  )
}
