import { z } from "zod"

// Esquemas del portal público. Espejo de los futuros endpoints públicos del
// backend (GET /public/blog, fuente pública de clases, POST /public/contact).
// Los tipos se derivan con z.infer (ver CLAUDE.md — tipado como fuente derivada).

export const classStyleSchema = z.enum(["SHOTOKAN", "KOBUDO", "OTRO"])
export type ClassStyle = z.infer<typeof classStyleSchema>

export const weekdaySchema = z.enum([
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
])
export type Weekday = z.infer<typeof weekdaySchema>

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida (HH:MM)")

export const classScheduleSchema = z.object({
  weekday: weekdaySchema,
  startTime: timeSchema,
  endTime: timeSchema,
})
export type ClassSchedule = z.infer<typeof classScheduleSchema>

export const classSchema = z.object({
  id: z.string(),
  name: z.string(),
  style: classStyleSchema,
  instructor: z.string(),
  description: z.string(),
  schedules: z.array(classScheduleSchema),
})
export type PublicClass = z.infer<typeof classSchema>

export const blogPostSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  excerpt: z.string(),
  publishedAt: z.iso.datetime(),
  coverImage: z.string().optional(),
})
export type BlogPostSummary = z.infer<typeof blogPostSummarySchema>

export const blogPostSchema = blogPostSummarySchema.extend({
  bodyMarkdown: z.string(),
})
export type BlogPost = z.infer<typeof blogPostSchema>

export const contactSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre"),
  email: z.email("Correo electrónico inválido"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})
export type ContactInput = z.infer<typeof contactSchema>
