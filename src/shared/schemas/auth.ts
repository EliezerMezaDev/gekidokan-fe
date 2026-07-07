import { z } from "zod"

// Espejo de backend/src/shared/schemas. Los tipos se derivan con z.infer, no se
// escriben a mano (ver CLAUDE.md — tipado como fuente de verdad derivada).

export const roleSchema = z.enum(["ADMIN", "PROFESSOR", "STUDENT", "GUARDIAN"])
export type Role = z.infer<typeof roleSchema>

export const loginSchema = z.object({
  email: z.email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
})
export type LoginInput = z.infer<typeof loginSchema>

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  role: roleSchema,
})
export type SessionUser = z.infer<typeof sessionUserSchema>

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: sessionUserSchema,
})
export type LoginResponse = z.infer<typeof loginResponseSchema>
