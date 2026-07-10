import { Suspense } from "react"
import { StudentsView } from "@/modules/students/students-view"

// La página solo monta la vista del módulo; toda la lógica (carga, filtros,
// modo de vista) vive en modules/students. Ver students-view.tsx. El Suspense
// es requisito de useSearchParams (filtros en la URL) para el prerender.
export default function StudentsPage() {
  return (
    <Suspense>
      <StudentsView />
    </Suspense>
  )
}
