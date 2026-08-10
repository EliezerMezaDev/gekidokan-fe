import Link from "next/link"
import { getBlogPosts } from "@/modules/public/api"
import { formatShortDate } from "@/modules/public/format"
import { PhotoPlaceholder } from "@/modules/public/components/photo-placeholder"
import { Badge } from "@/shadcn/badge"
import { EmptyState } from "@/shared/components/states"

// Listado de blog dentro del área de alumno. Server component simple, cards
// apiladas (el shell /s ya es angosto, no hace falta grilla).
export default async function StudentBlogPage() {
  const posts = await getBlogPosts()

  if (posts.length === 0) {
    return (
      <EmptyState
        title="Aún no hay publicaciones"
        description="Estamos preparando contenido. Vuelve pronto."
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/s/blog/${post.slug}`}
          className="flex flex-col overflow-hidden rounded-xl border bg-card text-inherit"
        >
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt=""
              className="aspect-16/9 w-full object-cover"
            />
          ) : (
            <PhotoPlaceholder
              label={`foto · ${post.category.toLowerCase()}`}
              className="aspect-16/9 p-3"
            />
          )}
          <div className="flex flex-col gap-1.5 p-4">
            <div className="flex items-center gap-2">
              <Badge>{post.category}</Badge>
              <span className="text-xs text-muted-foreground">
                {formatShortDate(post.publishedAt)}
              </span>
            </div>
            <h2 className="font-semibold leading-snug">{post.title}</h2>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
