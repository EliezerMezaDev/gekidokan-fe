import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { IconArrowLeft } from "@tabler/icons-react"
import { getBlogPost, getBlogPosts } from "@/modules/public/api"
import { formatDate } from "@/modules/public/format"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"

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
    <article className="mx-auto max-w-2xl px-4 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/blog">
          <IconArrowLeft /> Volver al blog
        </Link>
      </Button>

      <Badge variant="secondary">{post.category}</Badge>
      <h1 className="mt-3 font-heading text-3xl font-bold text-balance">
        {post.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {formatDate(post.publishedAt)}
      </p>

      <div className="mt-8 flex flex-col gap-4 text-[15px] leading-relaxed [&_a]:text-primary [&_a]:underline [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-medium [&_li]:ml-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.bodyMarkdown}
        </ReactMarkdown>
      </div>
    </article>
  )
}
