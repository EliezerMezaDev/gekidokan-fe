import { api } from "@/shared/lib/api"
import {
  studentSchema,
  type Student,
  type StudentInput,
} from "@/shared/schemas/students"
import { mockStudents } from "./mock-data"
import { slugify } from "./slug"

// Capa de acceso al módulo de alumnos. Único punto de swap: con USE_MOCKS
// devuelve los mocks; con el backend real enruta a /students (requiere auth, por
// eso usa el cliente lib/api con token, no fetch plano). Las páginas no cambian
// al hacer el swap.

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export async function getStudents(): Promise<Student[]> {
  if (USE_MOCKS) {
    await delay()
    return mockStudents
  }
  return studentSchema.array().parse(await api.get("/students"))
}

export async function getStudentBySlug(slug: string): Promise<Student | null> {
  if (USE_MOCKS) {
    await delay()
    return mockStudents.find((s) => s.slug === slug) ?? null
  }
  return studentSchema.parse(await api.get(`/students/${slug}`))
}

// Normaliza los campos opcionales que el formulario entrega como "".
function toStudentFields(input: StudentInput) {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    belt: input.belt,
    status: input.status,
    email: input.email || undefined,
    phone: input.phone || undefined,
    guardianName: input.guardianName || undefined,
    accessUsername: input.accessUsername,
    enabledContent: input.enabledContent,
  }
}

export async function createStudent(input: StudentInput): Promise<Student> {
  if (USE_MOCKS) {
    await delay()
    // ponytail: alta local simulada; no persiste entre recargas.
    return {
      id: `st-${Date.now()}`,
      slug: slugify(input.firstName, input.lastName),
      enrolledAt: new Date().toISOString(),
      ...toStudentFields(input),
    }
  }
  return studentSchema.parse(
    await api.post("/students", toStudentFields(input))
  )
}

export async function updateStudent(
  slug: string,
  input: StudentInput
): Promise<Student> {
  if (USE_MOCKS) {
    await delay()
    const current = mockStudents.find((s) => s.slug === slug)
    return {
      id: current?.id ?? `st-${Date.now()}`,
      slug: slugify(input.firstName, input.lastName),
      enrolledAt: current?.enrolledAt ?? new Date().toISOString(),
      ...toStudentFields(input),
    }
  }
  return studentSchema.parse(
    await api.patch(`/students/${slug}`, toStudentFields(input))
  )
}
