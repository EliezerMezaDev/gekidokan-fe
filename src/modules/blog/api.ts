import { api } from "@/shared/lib/api"
import {
  blogPostAdminSchema,
  type BlogPostAdmin,
  type BlogPostInput,
} from "@/shared/schemas/public"
import { mockBlogPosts } from "./mock-data"
import { slugify } from "./slug"

// Capa de acceso al módulo de blog (CMS admin). Único punto de swap: con
// USE_MOCKS devuelve los mocks; con el backend real enruta a /blog (distinto
// del GET /public/blog que consume el portal). Las páginas no cambian al hacer
// el swap.

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export async function getBlogPosts(): Promise<BlogPostAdmin[]> {
  if (USE_MOCKS) {
    await delay()
    return mockBlogPosts
  }
  return blogPostAdminSchema.array().parse(await api.get("/blog"))
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostAdmin | null> {
  if (USE_MOCKS) {
    await delay()
    return mockBlogPosts.find((p) => p.slug === slug) ?? null
  }
  return blogPostAdminSchema.parse(await api.get(`/blog/${slug}`))
}

export async function createBlogPost(
  input: BlogPostInput
): Promise<BlogPostAdmin> {
  if (USE_MOCKS) {
    await delay()
    // ponytail: alta local simulada; no persiste entre recargas.
    return {
      id: `bl-${Date.now()}`,
      slug: slugify(input.title),
      createdAt: new Date().toISOString(),
      ...input,
    }
  }
  return blogPostAdminSchema.parse(await api.post("/blog", input))
}

export async function updateBlogPost(
  slug: string,
  input: BlogPostInput
): Promise<BlogPostAdmin> {
  if (USE_MOCKS) {
    await delay()
    const current = mockBlogPosts.find((p) => p.slug === slug)
    return {
      id: current?.id ?? `bl-${Date.now()}`,
      slug: slugify(input.title),
      createdAt: current?.createdAt ?? new Date().toISOString(),
      ...input,
    }
  }
  return blogPostAdminSchema.parse(await api.patch(`/blog/${slug}`, input))
}
