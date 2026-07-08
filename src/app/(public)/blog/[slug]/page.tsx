import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getBlogPost, getBlogPosts } from "@/modules/public/api"
import { formatShortDate } from "@/modules/public/format"

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

const stripes =
  "repeating-linear-gradient(45deg,#efe7e7,#efe7e7 12px,#e7dede 12px,#e7dede 24px)"

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-[760px] px-8 pt-[30px] pb-15">
      <Link
        href="/blog"
        className="disp mb-[26px] inline-block text-[13px] font-semibold text-[#eb1c24]"
      >
        ← Volver al blog
      </Link>

      <div className="mb-4 flex items-center gap-3">
        <span className="disp rounded-md bg-[#eb1c24] px-3 py-[5px] text-[11px] font-semibold text-white">
          {post.category}
        </span>
        <span className="text-[13px] text-[#9a9090]">
          {formatShortDate(post.publishedAt)}
        </span>
      </div>

      <h1 className="disp mb-6 text-[38px] leading-[1.12] font-bold text-balance">
        {post.title}
      </h1>

      <div
        className="mb-[30px] flex aspect-16/8 items-end rounded-xl p-3.5"
        style={{ background: stripes }}
      >
        <span className="rounded bg-[#f7f1f1] px-2 py-1 font-mono text-[11px] text-[#8a8080]">
          foto · {post.category.toLowerCase()}
        </span>
      </div>

      <div className="text-[16.5px] leading-[1.8] text-[#3a3333] [&_a]:text-[#eb1c24] [&_a]:underline [&_h2]:disp [&_h2]:mt-[34px] [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1c1717] [&_li]:ml-1 [&_ol]:mb-[18px] [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-[18px] [&_strong]:font-semibold [&_ul]:mb-[18px] [&_ul]:list-disc [&_ul]:pl-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.bodyMarkdown}
        </ReactMarkdown>
      </div>
    </article>
  )
}
