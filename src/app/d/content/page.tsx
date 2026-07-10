import { Suspense } from "react"
import { ContentView } from "@/modules/content/content-view"

// La página solo monta la vista del módulo; toda la lógica (carga, filtros,
// modo de vista) vive en modules/content. El Suspense es requisito de
// useSearchParams (filtros en la URL) para el prerender.
export default function ContentPage() {
  return (
    <Suspense>
      <ContentView />
    </Suspense>
  )
}
