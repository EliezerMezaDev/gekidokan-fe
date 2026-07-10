import { api } from "./api"
import { setTokens, clearTokens } from "./tokens"
import {
  loginResponseSchema,
  type LoginInput,
  type Role,
  type SessionUser,
} from "@/shared/schemas/auth"
import { useSession } from "@/shared/store/session"

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"

const mockUsers: SessionUser[] = [
  {
    id: "u-admin",
    email: "admin@gekidokan.test",
    name: "Sensei Admin",
    role: "ADMIN",
  },
  {
    id: "u-prof",
    email: "profe@gekidokan.test",
    name: "Profe Demo",
    role: "PROFESSOR",
  },
  {
    id: "u-student",
    email: "alumno@gekidokan.test",
    name: "Alumno Demo",
    role: "STUDENT",
  },
]

// Forja un JWT sin firma cuyo payload leen middleware.ts y userFromToken. Solo
// para UX en modo mock; el backend real emite el token verdadero.
function fakeJwt(user: SessionUser): string {
  const b64 = (o: unknown) =>
    btoa(JSON.stringify(o))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
  return `${b64({ alg: "none", typ: "JWT" })}.${b64(payload)}.mock`
}

export async function login(input: LoginInput): Promise<SessionUser> {
  if (USE_MOCKS) {
    const user = mockUsers.find((u) => u.email === input.email) ?? mockUsers[0]
    const token = fakeJwt(user)
    setTokens(token, token)
    useSession.getState().setUser(user)
    return user
  }
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
