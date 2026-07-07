import Link from "next/link"

// Footer estático del portal público.

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-heading text-lg font-semibold">Gekidokan</p>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            Academia de Karate Shotokan y Kobudo de Okinawa. Disciplina, respeto y
            superación en cada entrenamiento.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Explorar</p>
          <ul className="text-muted-foreground mt-3 flex flex-col gap-2 text-sm">
            <li><Link href="/clases" className="hover:text-foreground">Clases y horarios</Link></li>
            <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link href="/contacto" className="hover:text-foreground">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Acceso</p>
          <ul className="text-muted-foreground mt-3 flex flex-col gap-2 text-sm">
            <li><Link href="/login" className="hover:text-foreground">Ingresar</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="text-muted-foreground mx-auto max-w-6xl px-4 py-4 text-xs">
          © {year} Gekidokan S.A. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
