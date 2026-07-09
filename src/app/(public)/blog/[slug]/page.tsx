import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getBlogPost, getBlogPosts } from "@/modules/public/api"
import { formatShortDate } from "@/modules/public/format"
import { PhotoPlaceholder } from "@/modules/public/components/photo-placeholder"

export const revalidate = 3600

// Pre-genera las rutas estáticas de los posts conocidos en build.
export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: "Publicación no encontrada" }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-[760px] px-8 pt-[80px] pb-15">
      <Link
        href="/blog"
        className="disp mb-[26px] inline-block text-[13px] font-semibold text-primary"
      >
        ← Volver al blog
      </Link>

      <div className="mb-4 flex items-center gap-3">
        <span className="disp rounded-md bg-primary px-3 py-[5px] text-[11px] font-semibold text-white">
          {post.category}
        </span>
        <span className="text-[13px] text-ink-subtle">
          {formatShortDate(post.publishedAt)}
        </span>
      </div>

      <h1 className="disp mb-6 text-[38px] leading-[1.12] font-bold text-balance">
        {post.title}
      </h1>

      <PhotoPlaceholder
        label={`foto · ${post.category.toLowerCase()}`}
        step={12}
        className="mb-[30px] aspect-16/8 rounded-xl p-3.5"
      />

      <div className="[&_h2]:disp text-[16.5px] leading-[1.8] text-ink [&_a]:text-primary [&_a]:underline [&_h2]:mt-[34px] [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:ml-1 [&_ol]:mb-[18px] [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-[18px] [&_strong]:font-semibold [&_ul]:mb-[18px] [&_ul]:list-disc [&_ul]:pl-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.bodyMarkdown}
        </ReactMarkdown>
      </div>
    </article>
  )
}
