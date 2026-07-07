// Almacenamiento de tokens en cookies del cliente para que middleware.ts (edge)
// pueda leer el rol. El middleware NO verifica la firma: solo gobierna la UX; el
// backend valida en cada request.
// ponytail: cookies escritas por el cliente (no httpOnly). Cuando el backend
// exista, que él setee cookies httpOnly + Secure y este módulo solo las lea.

const ACCESS = "gk_at"
const REFRESH = "gk_rt"

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 7}`
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; SameSite=Lax; max-age=0`
}

export function getAccessToken() {
  return readCookie(ACCESS)
}

export function getRefreshToken() {
  return readCookie(REFRESH)
}

export function setTokens(accessToken: string, refreshToken: string) {
  writeCookie(ACCESS, accessToken)
  writeCookie(REFRESH, refreshToken)
}

export function clearTokens() {
  deleteCookie(ACCESS)
  deleteCookie(REFRESH)
}
