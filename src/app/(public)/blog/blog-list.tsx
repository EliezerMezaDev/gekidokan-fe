"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import type { BlogPostSummary } from "@/shared/schemas/public"
import { formatShortDate } from "@/modules/public/format"

// Listado de blog con filtro por categoría (cliente). Recibe los posts ya
// cargados por el Server Component; solo filtra en memoria.

const stripes =
  "repeating-linear-gradient(45deg,#efe7e7,#efe7e7 10px,#e7dede 10px,#e7dede 20px)"

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
                borderColor: active ? "#eb1c24" : "#ece3e3",
                background: active ? "#eb1c24" : "#fff",
                color: active ? "#fff" : "#1c1717",
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {visible.map((b) => (
          <Link
            key={b.slug}
            href={`/blog/${b.slug}`}
            className="flex flex-col overflow-hidden rounded-xl border border-[#ece3e3] bg-white text-inherit"
          >
            <div
              className="flex aspect-16/10 items-end p-3"
              style={{ background: stripes }}
            >
              <span className="rounded bg-[#f7f1f1] px-[7px] py-[3px] font-mono text-[10px] text-[#8a8080]">
                foto · {b.category.toLowerCase()}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-[22px]">
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="disp text-[11px] font-semibold text-[#eb1c24]">
                  {b.category}
                </span>
                <span className="text-[#c3b9b9]">·</span>
                <span className="text-[12.5px] text-[#9a9090]">
                  {formatShortDate(b.publishedAt)}
                </span>
              </div>
              <h3 className="disp mb-2.5 text-lg leading-[1.25] font-bold">
                {b.title}
              </h3>
              <p className="mb-4 flex-1 text-[13.5px] leading-relaxed text-[#6b6363]">
                {b.excerpt}
              </p>
              <span className="disp text-[12.5px] font-semibold text-[#eb1c24]">
                Leer artículo →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
