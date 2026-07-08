import type { Metadata } from "next"
import { getBlogPosts } from "@/modules/public/api"
import { EmptyState } from "@/shared/components/states"
import { BlogList } from "./blog-list"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Historia, técnica, salud y vida en el tatami. Artículos del Bushidō Dōjō para acompañar tu camino en las artes marciales.",
}

export default async function BlogListPage() {
  const posts = await getBlogPosts()

  return (
    <div>
      <section className="mx-auto max-w-[1180px] px-8 pt-9 pb-2.5">
        <p className="disp mb-3 flex items-center gap-2 text-sm font-semibold text-[#eb1c24]">
          <span className="h-0.5 w-[22px] bg-[#eb1c24]" />
          Artículos y noticias
        </p>
        <h1 className="disp mb-3.5 text-[46px] leading-[1.05] font-bold">
          Blog del dōjō
        </h1>
        <p className="max-w-[560px] text-base leading-relaxed text-[#6b6363]">
          Historia, técnica, salud y vida en el tatami. Lecturas para acompañar
          tu camino en las artes marciales.
        </p>
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
