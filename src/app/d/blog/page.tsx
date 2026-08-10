import { Suspense } from "react"
import { BlogView } from "@/modules/blog/blog-view"

// La página solo monta la vista del módulo; toda la lógica (carga, filtros,
// modo de vista) vive en modules/blog. Ver blog-view.tsx. El Suspense es
// requisito de useSearchParams (filtros en la URL) para el prerender.
export default function BlogPage() {
  return (
    <Suspense>
      <BlogView />
    </Suspense>
  )
}
