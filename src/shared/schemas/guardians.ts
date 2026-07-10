import { z } from "zod"

// Espejo de backend/src/shared/schemas (ver CLAUDE.md — tipado derivado con
// z.infer). Modelo mínimo de representante para el listado del dashboard.

export const relationshipTypeSchema = z.enum(["PADRE", "MADRE", "TUTOR", "OTRO"])
export type RelationshipType = z.infer<typeof relationshipTypeSchema>

export const guardianSchema = z.object({
  id: z.string(),
  slug: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email().optional(),
  phone: z.string().optional(),
  nationalId: z.string().optional(),
  createdAt: z.iso.datetime(),
})
export type Guardian = z.infer<typeof guardianSchema>

// Datos que captura el alta/edición. El slug, id y fecha de creación los
// deriva la capa de datos, no el formulario.
export const guardianInputSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.literal("").or(z.email("Correo inválido")),
  phone: z.string(),
  nationalId: z.string(),
})
export type GuardianInput = z.infer<typeof guardianInputSchema>
