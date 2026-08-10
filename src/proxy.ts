import { NextResponse, type NextRequest } from "next/server"

// Guard de rutas por rol leyendo el JWT de la cookie. NO verifica la firma: solo
// gobierna la UX (a qué área puede entrar el usuario); el backend valida cada
// request. /d es para ADMIN/PROFESSOR, /s para STUDENT/GUARDIAN.

const COOKIE = "gk_at"

function roleFromToken(token: string): string | null {
  try {
    const segment = token.split(".")[1]
    if (!segment) return null
    const json = atob(segment.replace(/-/g, "+").replace(/_/g, "/"))
    const data = JSON.parse(json) as { role?: unknown }
    return typeof data.role === "string" ? data.role : null
  } catch {
    return null
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get(COOKIE)?.value
  const role = token ? roleFromToken(token) : null

  if (!role) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  const isStaff = role === "ADMIN" || role === "PROFESSOR"
  const isLearner = role === "STUDENT" || role === "GUARDIAN"

  if (pathname.startsWith("/d") && !isStaff) {
    const url = req.nextUrl.clone()
    url.pathname = "/s"
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith("/s") && !isLearner) {
    const url = req.nextUrl.clone()
    url.pathname = "/d"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/d/:path*", "/s/:path*"],
}
