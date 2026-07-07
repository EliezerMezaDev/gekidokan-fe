import { api } from "./api"
import { setTokens, clearTokens } from "./tokens"
import { loginResponseSchema, type LoginInput, type Role, type SessionUser } from "@/shared/schemas/auth"
import { useSession } from "@/shared/store/session"

// Orquesta login/logout: llama al API, guarda tokens y actualiza la sesión.

export async function login(input: LoginInput): Promise<SessionUser> {
  const res = loginResponseSchema.parse(await api.post("/auth/login", input))
  setTokens(res.accessToken, res.refreshToken)
  useSession.getState().setUser(res.user)
  return res.user
}

export function logout() {
  clearTokens()
  useSession.getState().clear()
}

export function homeForRole(role: Role): string {
  return role === "STUDENT" || role === "GUARDIAN" ? "/s" : "/d"
}
