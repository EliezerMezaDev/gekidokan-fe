import { z } from "zod"

// Espejo de backend/src/shared/schemas (ver CLAUDE.md — tipado derivado con
// z.infer). Modelo mínimo de alumno para el listado del dashboard; se ampliará
// (representante, inscripciones) cuando exista el módulo real del backend.

export const beltRankSchema = z.enum([
  "BLANCO",
  "AMARILLO",
  "NARANJA",
  "VERDE",
  "AZUL",
  "MARRON",
  "NEGRO",
])
export type BeltRank = z.infer<typeof beltRankSchema>

export const studentStatusSchema = z.enum(["ACTIVE", "INACTIVE"])
export type StudentStatus = z.infer<typeof studentStatusSchema>

export const studentSchema = z.object({
  id: z.string(),
  slug: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  belt: beltRankSchema,
  status: studentStatusSchema,
  email: z.email().optional(),
  phone: z.string().optional(),
  guardianName: z.string().optional(),
  // Email/usuario de acceso al área de alumno (/s).
  accessUsername: z.email().optional(),
  // ponytail: contenido habilitado como ids sueltos; el modelo real (minBeltRank
  // vs. tabla de acceso) queda bloqueado por DT-05.
  enabledContent: z.array(z.string()).default([]),
  enrolledAt: z.iso.datetime(),
})
export type Student = z.infer<typeof studentSchema>

// Datos que captura el alta/edición (wizard y formulario de edición). El slug,
// id y fecha de inscripción los deriva la capa de datos, no el formulario.
export const studentInputSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  belt: beltRankSchema,
  status: studentStatusSchema,
  email: z.literal("").or(z.email("Correo inválido")),
  phone: z.string(),
  guardianName: z.string(),
  enabledContent: z.array(z.string()),
  accessUsername: z.email("Correo de acceso inválido"),
})
export type StudentInput = z.infer<typeof studentInputSchema>
