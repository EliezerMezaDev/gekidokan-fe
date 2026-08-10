import { z } from "zod"
import { attendanceRecordSchema } from "@/shared/schemas/classes"

// Espejo de backend/src/shared/schemas (ver CLAUDE.md — tipado derivado con
// z.infer). attendanceRecordSchema se reusa de ./classes, no se duplica.

export const attendanceSessionSchema = z.object({
  id: z.string(),
  classId: z.string(),
  date: z.iso.date(),
  records: z.array(attendanceRecordSchema),
  instructorNotes: z.string().optional(),
})
export type AttendanceSession = z.infer<typeof attendanceSessionSchema>

export const measurementSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  date: z.iso.date(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
})
export type Measurement = z.infer<typeof measurementSchema>
