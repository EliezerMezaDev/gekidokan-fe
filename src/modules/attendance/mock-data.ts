import type {
  AttendanceSession,
  Measurement,
} from "@/shared/schemas/attendance"
import type { AttendanceRecord, DayOfWeek } from "@/shared/schemas/classes"
import { mockClasses } from "@/modules/classes/mock-data"
import { mockStudents } from "@/modules/students/mock-data"

// Datos mock de asistencia y mediciones. Sesiones derivadas de mockClasses
// (ids reales) y mediciones derivadas de mockStudents (ids reales), generadas
// de forma determinista (sin Math.random) para que el resultado no cambie
// entre recargas del módulo.

const DAY_INDEX: Record<DayOfWeek, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
}

// "Hoy" fijo del mock, para que las fechas generadas sean estables.
const TODAY = new Date("2026-08-09T00:00:00.000Z")

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// Últimas `weeksBack` fechas (incluida la más reciente) que caen en el
// día de la semana dado, contando hacia atrás desde TODAY.
function recentDatesForWeekday(
  dayOfWeek: DayOfWeek,
  weeksBack: number
): string[] {
  const target = DAY_INDEX[dayOfWeek]
  const diff = (TODAY.getUTCDay() - target + 7) % 7
  const mostRecent = new Date(TODAY)
  mostRecent.setUTCDate(TODAY.getUTCDate() - diff)

  const dates: string[] = []
  for (let i = 0; i < weeksBack; i++) {
    const d = new Date(mostRecent)
    d.setUTCDate(mostRecent.getUTCDate() - i * 7)
    dates.push(toISODate(d))
  }
  return dates
}

const WEEKS_BACK = 3

export const mockAttendanceSessions: AttendanceSession[] = mockClasses
  .filter((c) => c.enrolledStudentIds.length > 0)
  .flatMap((c) =>
    c.schedules.flatMap((schedule) =>
      recentDatesForWeekday(schedule.dayOfWeek, WEEKS_BACK).map(
        (date, weekIdx) => {
          const records: AttendanceRecord[] = c.enrolledStudentIds.map(
            (studentId, studentIdx) => {
              // Ausencia ocasional determinista: ~1 de cada 6 combinaciones.
              const absent = (studentIdx + weekIdx) % 6 === 0
              return {
                studentId,
                present: !absent,
                notes: absent ? "Faltó (justificado)" : undefined,
              }
            }
          )
          return {
            id: `att-${c.id}-${schedule.dayOfWeek}-${date}`,
            classId: c.id,
            date,
            records,
            instructorNotes:
              weekIdx === 0 ? "Buena disposición del grupo" : undefined,
          } satisfies AttendanceSession
        }
      )
    )
  )

const MEASUREMENTS_PER_STUDENT = 3

// ponytail: si el alumno aún no tiene height/weight capturado en su perfil,
// usamos una base sintética solo para poder generar historial de mediciones
// mock (no se escribe de vuelta al studentSchema).
function baseHeight(s: (typeof mockStudents)[number]): number {
  return s.height ?? 150
}
function baseWeight(s: (typeof mockStudents)[number]): number {
  return s.weight ?? 45
}

export const mockMeasurements: Measurement[] = mockStudents.flatMap((s) => {
  const measurements: Measurement[] = []
  for (let i = 0; i < MEASUREMENTS_PER_STUDENT; i++) {
    // i=0 es la más antigua, i=MEASUREMENTS_PER_STUDENT-1 la más reciente.
    const monthsAgo = (MEASUREMENTS_PER_STUDENT - 1 - i) * 2
    const d = new Date(TODAY)
    d.setUTCMonth(TODAY.getUTCMonth() - monthsAgo) // una medición cada ~2 meses
    // Pequeño crecimiento hacia el presente (dato más reciente = valor base).
    const growthSteps = MEASUREMENTS_PER_STUDENT - 1 - i
    measurements.push({
      id: `ms-${s.id}-${i}`,
      studentId: s.id,
      date: toISODate(d),
      height: Number((baseHeight(s) - growthSteps * 0.8).toFixed(1)),
      weight: Number((baseWeight(s) - growthSteps * 0.6).toFixed(1)),
    })
  }
  return measurements
})
