import { api } from "@/shared/lib/api"
import {
  attendanceSessionSchema,
  measurementSchema,
  type AttendanceSession,
  type Measurement,
} from "@/shared/schemas/attendance"
import type { AttendanceRecord } from "@/shared/schemas/classes"
import { mockAttendanceSessions, mockMeasurements } from "./mock-data"

// Capa de acceso al módulo de asistencia y mediciones. Mismo patrón USE_MOCKS
// que los demás api.ts del proyecto. Las páginas no cambian al hacer el swap.

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// ponytail: arrays mock en memoria (no persisten entre recargas), mismo
// criterio que el resto de los módulos mock de este proyecto.
const attendanceSessions = [...mockAttendanceSessions]
const measurements = [...mockMeasurements]

export async function getAttendanceByStudent(
  studentId: string
): Promise<AttendanceSession[]> {
  if (USE_MOCKS) {
    await delay()
    return attendanceSessions.filter((s) =>
      s.records.some((r) => r.studentId === studentId)
    )
  }
  return attendanceSessionSchema
    .array()
    .parse(await api.get(`/attendance/by-student/${studentId}`))
}

export async function getAttendanceByClass(
  classId: string,
  date?: string
): Promise<AttendanceSession | AttendanceSession[] | undefined> {
  if (USE_MOCKS) {
    await delay()
    if (date) {
      return attendanceSessions.find(
        (s) => s.classId === classId && s.date === date
      )
    }
    return attendanceSessions.filter((s) => s.classId === classId)
  }
  if (date) {
    const res = await api.get(`/classes/${classId}/attendance?date=${date}`)
    return res ? attendanceSessionSchema.parse(res) : undefined
  }
  return attendanceSessionSchema
    .array()
    .parse(await api.get(`/classes/${classId}/attendance`))
}

export async function saveClassAttendance(
  classId: string,
  date: string,
  records: AttendanceRecord[],
  instructorNotes?: string
): Promise<AttendanceSession> {
  if (USE_MOCKS) {
    await delay()
    // ponytail: upsert en el array mock en memoria; no persiste entre recargas.
    const existingIdx = attendanceSessions.findIndex(
      (s) => s.classId === classId && s.date === date
    )
    const session: AttendanceSession = {
      id:
        existingIdx >= 0
          ? attendanceSessions[existingIdx].id
          : `att-${classId}-${date}-${Date.now()}`,
      classId,
      date,
      records,
      instructorNotes,
    }
    if (existingIdx >= 0) {
      attendanceSessions[existingIdx] = session
    } else {
      attendanceSessions.push(session)
    }
    return session
  }
  return attendanceSessionSchema.parse(
    await api.post(`/classes/${classId}/attendance`, {
      date,
      records,
      instructorNotes,
    })
  )
}

export async function getLatestAttendanceSession(): Promise<AttendanceSession | null> {
  if (USE_MOCKS) {
    await delay()
    if (attendanceSessions.length === 0) return null
    return [...attendanceSessions].sort((a, b) =>
      b.date.localeCompare(a.date)
    )[0]
  }
  // ponytail: endpoint real de "última sesión" pendiente de definir en backend
  const sessions = attendanceSessionSchema
    .array()
    .parse(await api.get("/attendance?limit=1&sort=-date"))
  return sessions[0] ?? null
}

export async function getMeasurements(
  studentId?: string
): Promise<Measurement[]> {
  if (USE_MOCKS) {
    await delay()
    return studentId
      ? measurements.filter((m) => m.studentId === studentId)
      : measurements
  }
  return measurementSchema
    .array()
    .parse(
      await api.get(
        studentId ? `/measurements?studentId=${studentId}` : "/measurements"
      )
    )
}

export async function saveMeasurements(
  records: { studentId: string; height?: number; weight?: number }[]
): Promise<Measurement[]> {
  if (USE_MOCKS) {
    await delay()
    // ponytail: alta local simulada; no persiste entre recargas.
    const today = new Date().toISOString().slice(0, 10)
    const created: Measurement[] = records.map((r) => ({
      id: `ms-${r.studentId}-${Date.now()}`,
      studentId: r.studentId,
      date: today,
      height: r.height,
      weight: r.weight,
    }))
    measurements.push(...created)
    return created
  }
  return measurementSchema
    .array()
    .parse(await api.post("/measurements", records))
}
