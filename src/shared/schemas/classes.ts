import { z } from "zod"

// Espejo de backend/src/shared/schemas (ver CLAUDE.md — tipado derivado con
// z.infer). El estilo de karate se define local a este módulo (no se importa
// de content, que se construye en paralelo).

export const classStyleSchema = z.enum(["SHOTOKAN", "KOBUDO", "OTRO"])
export type ClassStyle = z.infer<typeof classStyleSchema>

export const dayOfWeekSchema = z.enum([
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
])
export type DayOfWeek = z.infer<typeof dayOfWeekSchema>

export const classScheduleSchema = z.object({
  dayOfWeek: dayOfWeekSchema,
  startTime: z.string(), // "HH:mm"
  endTime: z.string(), // "HH:mm"
})
export type ClassSchedule = z.infer<typeof classScheduleSchema>

export const classSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  style: classStyleSchema,
  instructorName: z.string(),
  capacity: z.number().int().positive().optional(),
  schedules: z.array(classScheduleSchema),
  enrolledStudentIds: z.array(z.string()).default([]),
  createdAt: z.iso.datetime(),
})
// Nombre "KarateClass" para no colisionar con la palabra reservada `class`.
export type KarateClass = z.infer<typeof classSchema>

// Datos que captura el alta/edición (una sola vista, sin wizard). El slug, id
// y fecha de creación los deriva la capa de datos, no el formulario.
export const classInputSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  style: classStyleSchema,
  instructorName: z.string().min(1, "El instructor es obligatorio"),
  capacity: z.number().int().positive().optional(),
  schedules: z.array(classScheduleSchema).min(1, "Agrega al menos un horario"),
  enrolledStudentIds: z.array(z.string()),
})
export type ClassInput = z.infer<typeof classInputSchema>

export const attendanceRecordSchema = z.object({
  studentId: z.string(),
  present: z.boolean(),
  notes: z.string().optional(),
})
export type AttendanceRecord = z.infer<typeof attendanceRecordSchema>
