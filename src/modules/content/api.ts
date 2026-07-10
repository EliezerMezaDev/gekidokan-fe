import { api } from "@/shared/lib/api"
import {
  syllabusItemSchema,
  type SyllabusItem,
  type SyllabusItemInput,
} from "@/shared/schemas/content"
import { mockSyllabusItems } from "./mock-data"
import { slugify } from "./slug"

// Capa de acceso al módulo de contenido. Único punto de swap: con USE_MOCKS
// devuelve los mocks; con el backend real enruta a /content.

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export async function getSyllabusItems(): Promise<SyllabusItem[]> {
  if (USE_MOCKS) {
    await delay()
    return mockSyllabusItems
  }
  return syllabusItemSchema.array().parse(await api.get("/content"))
}

export async function getSyllabusItemBySlug(
  slug: string
): Promise<SyllabusItem | null> {
  if (USE_MOCKS) {
    await delay()
    return mockSyllabusItems.find((c) => c.slug === slug) ?? null
  }
  return syllabusItemSchema.parse(await api.get(`/content/${slug}`))
}

export async function createSyllabusItem(
  input: SyllabusItemInput
): Promise<SyllabusItem> {
  if (USE_MOCKS) {
    await delay()
    // ponytail: alta local simulada; no persiste entre recargas.
    return {
      id: `syl-${Date.now()}`,
      slug: slugify(input.title),
      createdAt: new Date().toISOString(),
      ...input,
    }
  }
  return syllabusItemSchema.parse(await api.post("/content", input))
}

export async function updateSyllabusItem(
  slug: string,
  input: SyllabusItemInput
): Promise<SyllabusItem> {
  if (USE_MOCKS) {
    await delay()
    const current = mockSyllabusItems.find((c) => c.slug === slug)
    return {
      id: current?.id ?? `syl-${Date.now()}`,
      slug: slugify(input.title),
      createdAt: current?.createdAt ?? new Date().toISOString(),
      ...input,
    }
  }
  return syllabusItemSchema.parse(await api.patch(`/content/${slug}`, input))
}
