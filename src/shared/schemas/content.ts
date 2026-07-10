import { z } from "zod"
import { beltRankSchema } from "@/shared/schemas/students"

// Espejo de backend/src/shared/schemas (ver CLAUDE.md — tipado derivado con
// z.infer). Contenido programático (syllabus) por cinta, modelo acumulativo
// (DT-05 tentativo): minBeltRank define el rango mínimo requerido.

export const syllabusTypeSchema = z.enum(["KATA", "BUNKAI", "PROGRAM"])
export type SyllabusType = z.infer<typeof syllabusTypeSchema>

// ponytail: enum de estilo duplicado a propósito (no se importa de classes,
// que se escribe en paralelo); si diverge, unificar cuando exista el backend.
export const contentStyleSchema = z.enum(["SHOTOKAN", "KOBUDO", "OTRO"])
export type ContentStyle = z.infer<typeof contentStyleSchema>

export const syllabusItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  type: syllabusTypeSchema,
  title: z.string(),
  bodyMarkdown: z.string().optional(),
  videoUrl: z.literal("").or(z.url()).optional(),
  minBeltRank: beltRankSchema,
  style: contentStyleSchema,
  createdAt: z.iso.datetime(),
})
export type SyllabusItem = z.infer<typeof syllabusItemSchema>

// Datos que captura el alta/edición (una sola vista, sin wizard).
export const syllabusItemInputSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  type: syllabusTypeSchema,
  minBeltRank: beltRankSchema,
  style: contentStyleSchema,
  videoUrl: z.literal("").or(z.url("URL de video inválida")),
  bodyMarkdown: z.string().optional(),
})
export type SyllabusItemInput = z.infer<typeof syllabusItemInputSchema>
