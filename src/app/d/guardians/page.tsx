import { Suspense } from "react"
import { GuardiansView } from "@/modules/guardians/guardians-view"

// La página solo monta la vista del módulo; toda la lógica (carga, filtros,
// modo de vista) vive en modules/guardians. El Suspense es requisito de
// useSearchParams (filtros en la URL) para el prerender.
export default function GuardiansPage() {
  return (
    <Suspense>
      <GuardiansView />
    </Suspense>
  )
}
