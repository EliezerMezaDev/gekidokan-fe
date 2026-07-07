import { sessionUserSchema, type SessionUser } from "@/shared/schemas/auth"

// Decodifica el payload de un JWT SIN verificar la firma. Solo para leer el rol
// y datos del usuario en el cliente (UX). La verificación real es del backend.

function decodePayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split(".")[1]
    if (!segment) return null
    const json = atob(segment.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

export function roleFromToken(token: string): string | null {
  const payload = decodePayload(token)
  return payload && typeof payload.role === "string" ? payload.role : null
}

export function userFromToken(token: string): SessionUser | null {
  const payload = decodePayload(token)
  if (!payload) return null
  const parsed = sessionUserSchema.safeParse({
    id: payload.sub ?? payload.id,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
  return parsed.success ? parsed.data : null
}
