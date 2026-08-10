import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getBlogPost } from "@/modules/public/api"
import { formatShortDate } from "@/modules/public/format"
import { PhotoPlaceholder } from "@/modules/public/components/photo-placeholder"
import { Badge } from "@/shadcn/badge"

// Detalle de un post del blog dentro del área de alumno.
export default async function StudentBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  return (
    <article className="flex flex-col gap-4">
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt=""
          className="aspect-16/9 w-full rounded-xl object-cover"
        />
      ) : (
        <PhotoPlaceholder
          label={`foto · ${post.category.toLowerCase()}`}
          className="aspect-16/9 rounded-xl p-3"
        />
      )}

      <div className="flex items-center gap-2">
        <Badge>{post.category}</Badge>
        <span className="text-xs text-muted-foreground">
          {formatShortDate(post.publishedAt)}
        </span>
      </div>

      <h1 className="text-xl leading-tight font-bold text-balance">
        {post.title}
      </h1>

      <div className="text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_li]:ml-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.bodyMarkdown}
        </ReactMarkdown>
      </div>
    </article>
  )
}
