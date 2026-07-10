import { z } from "zod"
import { relationshipTypeSchema } from "@/shared/schemas/guardians"
import { isMinor } from "@/shared/lib/age"

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
  birthDate: z.iso.date(),
  // Representante: obligatorio si el alumno es menor de edad (ver
  // superRefine de studentInputSchema). guardianName es el snapshot de
  // display, derivado del representante elegido.
  guardianId: z.string().optional(),
  guardianRelationship: relationshipTypeSchema.optional(),
  guardianName: z.string().optional(),
  // Email/usuario de acceso al área de alumno (/s).
  accessUsername: z.email().optional(),
  // Altura (cm) y peso (kg); opcionales porque no todos los alumnos los tienen
  // capturados aún.
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  // ponytail: contenido habilitado como ids sueltos; el modelo real (minBeltRank
  // vs. tabla de acceso) queda bloqueado por DT-05.
  enabledContent: z.array(z.string()).default([]),
  enrolledAt: z.iso.datetime(),
})
export type Student = z.infer<typeof studentSchema>

// Datos que captura el alta/edición (wizard y formulario de edición). El slug,
// id y fecha de inscripción los deriva la capa de datos, no el formulario.
export const studentInputSchema = z
  .object({
    firstName: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "El apellido es obligatorio"),
    belt: beltRankSchema,
    status: studentStatusSchema,
    email: z.literal("").or(z.email("Correo inválido")),
    phone: z.string(),
    birthDate: z.iso.date("Fecha de nacimiento inválida"),
    // Solo si es menor (validado abajo); guardianName es el snapshot de
    // display que setea el Select de representante, no un input libre.
    guardianId: z.string().optional(),
    guardianRelationship: relationshipTypeSchema.optional(),
    guardianName: z.string().optional(),
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    enabledContent: z.array(z.string()),
    accessUsername: z.email("Correo de acceso inválido"),
  })
  .superRefine((val, ctx) => {
    if (isMinor(val.birthDate)) {
      if (!val.guardianId)
        ctx.addIssue({
          code: "custom",
          path: ["guardianId"],
          message: "Selecciona un representante",
        })
      if (!val.guardianRelationship)
        ctx.addIssue({
          code: "custom",
          path: ["guardianRelationship"],
          message: "Selecciona la relación",
        })
    }
  })
export type StudentInput = z.infer<typeof studentInputSchema>
