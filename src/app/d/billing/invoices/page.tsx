import { Suspense } from "react"
import { InvoicesView } from "@/modules/billing/invoices-view"

// La página solo monta la vista del módulo; la lógica (carga, filtros, tabs,
// modo de vista) vive en modules/billing. El Suspense es requisito de
// useSearchParams (filtros en la URL) para el prerender.
export default function InvoicesPage() {
  return (
    <Suspense>
      <InvoicesView />
    </Suspense>
  )
}
