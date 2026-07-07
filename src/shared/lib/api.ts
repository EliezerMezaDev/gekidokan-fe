import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./tokens"

// Cliente HTTP único. Adjunta Authorization: Bearer, reintenta una vez tras
// refrescar el token en un 401, y traduce los errores del API a un mensaje no
// técnico (PRD §16.2). La lógica de negocio no vive aquí.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

function translateError(status: number, data: unknown): string {
  const message = (data as { message?: unknown } | null)?.message
  if (status < 500 && typeof message === "string" && message) return message
  if (status === 401) return "Tu sesión expiró. Vuelve a iniciar sesión."
  if (status === 403) return "No tienes permiso para realizar esta acción."
  if (status === 404) return "No encontramos lo que buscas."
  if (status >= 500)
    return "Ocurrió un problema. Intenta de nuevo en un momento."
  return "No pudimos completar la operación."
}

async function refreshToken(): Promise<boolean> {
  const rt = getRefreshToken()
  if (!rt) return false
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    })
    if (!res.ok) {
      clearTokens()
      return false
    }
    const data = (await res.json()) as {
      accessToken: string
      refreshToken?: string
    }
    setTokens(data.accessToken, data.refreshToken ?? rt)
    return true
  } catch {
    clearTokens()
    return false
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = getAccessToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401 && retry && getRefreshToken()) {
    if (await refreshToken()) return request<T>(path, options, false)
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, translateError(res.status, data), data)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
