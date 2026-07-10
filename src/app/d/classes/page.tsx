import { Suspense } from "react"
import { ClassesView } from "@/modules/classes/classes-view"

// La página solo monta la vista del módulo; toda la lógica (carga, filtros,
// modo de vista) vive en modules/classes. El Suspense es requisito de
// useSearchParams (filtros en la URL) para el prerender.
export default function ClassesPage() {
  return (
    <Suspense>
      <ClassesView />
    </Suspense>
  )
}
