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

// Esquemas del CMS de blog (panel admin /d/blog). blogPostAdminSchema suma los
// campos que solo ve el admin (id, tags, visibilidad, fecha de alta) sobre el
// mismo post público.
export const blogPostAdminSchema = blogPostSummarySchema.extend({
  id: z.string(),
  bodyMarkdown: z.string(),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true),
  createdAt: z.iso.datetime(),
})
export type BlogPostAdmin = z.infer<typeof blogPostAdminSchema>

export const blogPostInputSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  category: z.string().min(1, "La categoría es obligatoria"),
  excerpt: z.string().min(1, "El resumen es obligatorio"),
  bodyMarkdown: z.string().min(1, "El contenido es obligatorio"),
  tags: z.array(z.string()),
  isPublic: z.boolean(),
  coverImage: z.string().optional(),
  publishedAt: z.iso.datetime(),
})
export type BlogPostInput = z.infer<typeof blogPostInputSchema>

// Opciones del formulario de contacto (selects del diseño). interest = tipo de
// clase de interés; source = cómo nos conoció. Opcionales.
export const contactInterestSchema = z.enum([
  "INFANTIL",
  "JOVENES_ADULTOS",
  "KOBUDO",
  "FAMILIAS",
])
export type ContactInterest = z.infer<typeof contactInterestSchema>

export const contactSourceSchema = z.enum([
  "RECOMENDACION",
  "REDES",
  "BUSQUEDA",
  "PASO_DOJO",
])
export type ContactSource = z.infer<typeof contactSourceSchema>

// interest/source son opcionales. El <select> vacío envía "" ; el formulario lo
// normaliza a undefined con setValueAs en el register (ver contacto/page.tsx).
export const contactSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre"),
  lastName: z.string().min(2, "Ingresa tu apellido"),
  email: z.email("Correo electrónico inválido"),
  phone: z.string().min(7, "Ingresa un teléfono válido"),
  interest: contactInterestSchema.optional(),
  source: contactSourceSchema.optional(),
  message: z.string().optional(),
})
export type ContactInput = z.infer<typeof contactSchema>
