import { toast } from "sonner"
import { api } from "@/shared/lib/api"
import {
  classSchema,
  type KarateClass,
  type ClassInput,
  type AttendanceRecord,
} from "@/shared/schemas/classes"
import { mockClasses } from "./mock-data"
import { slugify } from "./slug"

// Capa de acceso al módulo de clases. Único punto de swap: con USE_MOCKS
// devuelve los mocks; con el backend real enruta a /classes. Las páginas no
// cambian al hacer el swap.

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export async function getClasses(): Promise<KarateClass[]> {
  if (USE_MOCKS) {
    await delay()
    return mockClasses
  }
  return classSchema.array().parse(await api.get("/classes"))
}

export async function getClassBySlug(
  slug: string
): Promise<KarateClass | null> {
  if (USE_MOCKS) {
    await delay()
    return mockClasses.find((c) => c.slug === slug) ?? null
  }
  return classSchema.parse(await api.get(`/classes/${slug}`))
}

function toClassFields(input: ClassInput) {
  return {
    name: input.name,
    style: input.style,
    instructorName: input.instructorName,
    capacity: input.capacity,
    schedules: input.schedules,
    enrolledStudentIds: input.enrolledStudentIds,
  }
}

export async function createClass(input: ClassInput): Promise<KarateClass> {
  if (USE_MOCKS) {
    await delay()
    // ponytail: alta local simulada; no persiste entre recargas.
    return {
      id: `cl-${Date.now()}`,
      slug: slugify(input.name),
      createdAt: new Date().toISOString(),
      ...toClassFields(input),
    }
  }
  return classSchema.parse(await api.post("/classes", toClassFields(input)))
}

export async function updateClass(
  slug: string,
  input: ClassInput
): Promise<KarateClass> {
  if (USE_MOCKS) {
    await delay()
    const current = mockClasses.find((c) => c.slug === slug)
    return {
      id: current?.id ?? `cl-${Date.now()}`,
      slug: slugify(input.name),
      createdAt: current?.createdAt ?? new Date().toISOString(),
      ...toClassFields(input),
    }
  }
  return classSchema.parse(
    await api.patch(`/classes/${slug}`, toClassFields(input))
  )
}

// ponytail: la asistencia no persiste en mocks (eco + toast); el backend real
// guardará el registro por fecha en /classes/:id/attendance.
export async function saveAttendance(
  classId: string,
  date: string,
  records: AttendanceRecord[]
): Promise<void> {
  if (USE_MOCKS) {
    await delay()
    toast.success(
      `Asistencia guardada para ${date} (${records.length} alumnos)`
    )
    return
  }
  await api.post(`/classes/${classId}/attendance`, { date, records })
}
