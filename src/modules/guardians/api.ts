import { api } from "@/shared/lib/api"
import {
  guardianSchema,
  type Guardian,
  type GuardianInput,
} from "@/shared/schemas/guardians"
import { mockGuardians } from "./mock-data"
import { slugify } from "./slug"

// Capa de acceso al módulo de representantes. Único punto de swap: con
// USE_MOCKS devuelve los mocks; con el backend real enruta a /guardians. Las
// páginas no cambian al hacer el swap.

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export async function getGuardians(): Promise<Guardian[]> {
  if (USE_MOCKS) {
    await delay()
    return mockGuardians
  }
  return guardianSchema.array().parse(await api.get("/guardians"))
}

export async function getGuardianBySlug(
  slug: string
): Promise<Guardian | null> {
  if (USE_MOCKS) {
    await delay()
    return mockGuardians.find((g) => g.slug === slug) ?? null
  }
  return guardianSchema.parse(await api.get(`/guardians/${slug}`))
}

export async function getGuardianById(id: string): Promise<Guardian | null> {
  if (USE_MOCKS) {
    await delay()
    return mockGuardians.find((g) => g.id === id) ?? null
  }
  return guardianSchema.parse(await api.get(`/guardians/by-id/${id}`))
}

// Normaliza los campos opcionales que el formulario entrega como "".
function toGuardianFields(input: GuardianInput) {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email || undefined,
    phone: input.phone || undefined,
    nationalId: input.nationalId || undefined,
  }
}

export async function createGuardian(input: GuardianInput): Promise<Guardian> {
  if (USE_MOCKS) {
    await delay()
    // ponytail: alta local simulada; no persiste entre recargas.
    return {
      id: `gd-${Date.now()}`,
      slug: slugify(input.firstName, input.lastName),
      createdAt: new Date().toISOString(),
      ...toGuardianFields(input),
    }
  }
  return guardianSchema.parse(
    await api.post("/guardians", toGuardianFields(input))
  )
}

export async function updateGuardian(
  slug: string,
  input: GuardianInput
): Promise<Guardian> {
  if (USE_MOCKS) {
    await delay()
    const current = mockGuardians.find((g) => g.slug === slug)
    return {
      id: current?.id ?? `gd-${Date.now()}`,
      slug: slugify(input.firstName, input.lastName),
      createdAt: current?.createdAt ?? new Date().toISOString(),
      ...toGuardianFields(input),
    }
  }
  return guardianSchema.parse(
    await api.patch(`/guardians/${slug}`, toGuardianFields(input))
  )
}
