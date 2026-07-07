import {
  blogPostSchema,
  blogPostSummarySchema,
  classSchema,
  type BlogPost,
  type BlogPostSummary,
  type ContactInput,
  type PublicClass,
} from "@/shared/schemas/public"
import { mockBlogPosts, mockClasses } from "./mock-data"

// Capa de acceso al portal público. Mientras el backend no exista, devuelve los
// mocks; cuando exista, USE_MOCKS=false enruta a los endpoints públicos reales.
// Es el ÚNICO punto de swap: las páginas no cambian. Los endpoints públicos no
// requieren auth, así que se usa fetch plano (no el cliente lib/api con token).

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ""
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"

async function getJson(path: string): Promise<unknown> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`)
  return res.json()
}

export async function getClasses(): Promise<PublicClass[]> {
  if (USE_MOCKS) return mockClasses
  return classSchema.array().parse(await getJson("/public/classes"))
}

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  // parse descarta bodyMarkdown (clave fuera del esquema de resumen).
  if (USE_MOCKS) return mockBlogPosts.map((p) => blogPostSummarySchema.parse(p))
  return blogPostSummarySchema.array().parse(await getJson("/public/blog"))
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (USE_MOCKS) return mockBlogPosts.find((p) => p.slug === slug) ?? null
  const res = await fetch(`${API_URL}/public/blog/${slug}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GET /public/blog/${slug} → ${res.status}`)
  return blogPostSchema.parse(await res.json())
}

export async function submitContact(input: ContactInput): Promise<void> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 500))
    return
  }
  const res = await fetch(`${API_URL}/public/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`POST /public/contact → ${res.status}`)
}
