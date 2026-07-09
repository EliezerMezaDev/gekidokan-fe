"use client"

import { useMemo, useState } from "react"
import type { BlogPostSummary } from "@/shared/schemas/public"
import { BlogCard } from "@/modules/public/components/blog-card"

// Listado de blog con filtro por categoría (cliente). Recibe los posts ya
// cargados por el Server Component; solo filtra en memoria.

export function BlogList({ posts }: { posts: BlogPostSummary[] }) {
  const [filter, setFilter] = useState("Todos")

  const cats = useMemo(() => {
    const seen: string[] = []
    for (const p of posts) if (!seen.includes(p.category)) seen.push(p.category)
    return ["Todos", ...seen]
  }, [posts])

  const visible = posts.filter(
    (p) => filter === "Todos" || p.category === filter
  )

  return (
    <>
      <div className="mb-[26px] flex flex-wrap gap-2.5">
        {cats.map((label) => {
          const active = filter === label
          return (
            <button
              key={label}
              type="button"
              onClick={() => setFilter(label)}
              className="disp rounded-[40px] border px-5 py-[9px] text-[12.5px] font-semibold transition-colors"
              style={{
                borderColor: active ? "var(--primary)" : "var(--line)",
                background: active ? "var(--primary)" : "var(--card)",
                color: active ? "var(--card)" : "var(--foreground)",
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {visible.map((b) => (
          <BlogCard key={b.slug} post={b} />
        ))}
      </div>
    </>
  )
}
