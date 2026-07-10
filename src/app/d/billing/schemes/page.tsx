import { Suspense } from "react"
import { SchemesView } from "@/modules/billing/schemes-view"

// La página solo monta la vista del módulo; la lógica vive en modules/billing.
export default function SchemesPage() {
  return (
    <Suspense>
      <SchemesView />
    </Suspense>
  )
}
