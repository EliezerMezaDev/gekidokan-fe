import Link from "next/link"
import type { BlogPostSummary } from "@/shared/schemas/public"
import { cn } from "@/shared/lib/utils"
import { formatShortDate } from "@/modules/public/format"
import { PhotoPlaceholder, stripes } from "./photo-placeholder"

// Tarjeta de artículo. `compact` es la variante del home (sin excerpt ni CTA);
// la completa es la del listado de blog. Presentacional: sirve en Server y
// Client Components.
export function BlogCard({
  post,
  compact = false,
}: {
  post: BlogPostSummary
  compact?: boolean
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col overflow-hidden rounded-xl border border-line bg-white text-inherit"
    >
      {compact ? (
        <div className="aspect-16/10" style={{ background: stripes() }} />
      ) : (
        <PhotoPlaceholder
          label={`foto · ${post.category.toLowerCase()}`}
          className="aspect-16/10 p-3"
        />
      )}
      <div className={cn("flex flex-col", compact ? "p-5" : "flex-1 p-[22px]")}>
        {compact ? (
          <>
            <span className="disp text-[11px] font-semibold text-primary">
              {post.category}
            </span>
            <h3 className="disp mt-2 mb-1.5 text-[17px] leading-[1.25] font-bold">
              {post.title}
            </h3>
            <span className="text-[12.5px] text-ink-subtle">
              {formatShortDate(post.publishedAt)}
            </span>
          </>
        ) : (
          <>
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="disp text-[11px] font-semibold text-primary">
                {post.category}
              </span>
              <span className="text-ink-hint">·</span>
              <span className="text-[12.5px] text-ink-subtle">
                {formatShortDate(post.publishedAt)}
              </span>
            </div>
            <h3 className="disp mb-2.5 text-lg leading-[1.25] font-bold">
              {post.title}
            </h3>
            <p className="mb-4 flex-1 text-[13.5px] leading-relaxed text-ink-muted">
              {post.excerpt}
            </p>
            <span className="disp text-[12.5px] font-semibold text-primary">
              Leer artículo →
            </span>
          </>
        )}
      </div>
    </Link>
  )
}
