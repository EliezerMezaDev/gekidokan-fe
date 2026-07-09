import type { Metadata } from "next"
import { getBlogPosts } from "@/modules/public/api"
import { SectionHeader } from "@/modules/public/components/section-header"
import { EmptyState } from "@/shared/components/states"
import { BlogList } from "./blog-list"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Historia, técnica, salud y vida en el tatami. Artículos del Gekidokan para acompañar tu camino en las artes marciales.",
}

export default async function BlogListPage() {
  const posts = await getBlogPosts()

  return (
    <div className="my-20">
      <section className="mx-auto max-w-[1180px] px-8 pt-9 pb-2.5">
        <SectionHeader
          eyebrow="Artículos y noticias"
          title="Blog del dōjō"
          lead="Historia, técnica, salud y vida en el tatami. Lecturas para acompañar tu camino en las artes marciales."
        />
      </section>

      <section className="mx-auto max-w-[1180px] px-8 pt-4 pb-15">
        {posts.length === 0 ? (
          <EmptyState
            title="Aún no hay publicaciones"
            description="Estamos preparando contenido. Vuelve pronto."
          />
        ) : (
          <BlogList posts={posts} />
        )}
      </section>
    </div>
  )
}
