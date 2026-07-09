import Link from "next/link"

// Footer del portal público. Fiel al diseño de la landing: 4 columnas
// (marca + enlaces + contacto + horario) sobre fondo oscuro.

const links = [
  { href: "/", label: "Inicio" },
  { href: "/clases", label: "Clases y horarios" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
]

export function SiteFooter() {
  return (
    <footer className="bg-foreground px-8 pt-14 pb-7 text-background">
      <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="disp mb-[18px] flex items-center gap-[9px] text-[26px] font-bold text-white">
            <span className="h-10 w-10">
              <img
                src="/images/brand/isologo.png"
                alt="Gekidokan - Logo"
                className="h-full w-full rounded-full object-contain"
              />
            </span>
            Gekidokan
          </div>
          <p className="max-w-[280px] text-sm leading-relaxed text-ink-subtle">
            Karate y Kobudo tradicional de Okinawa. Disciplina, respeto y
            comunidad desde 2005.
          </p>
        </div>

        <div>
          <h4 className="disp mb-4 text-sm font-semibold tracking-[0.05em] text-white">
            Enlaces
          </h4>
          <div className="flex flex-col gap-[11px] text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-ink-subtle transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="disp mb-4 text-sm font-semibold tracking-[0.05em] text-white">
            Contacto
          </h4>
          <div className="flex flex-col gap-[11px] text-sm text-ink-subtle">
            <a
              href="http://wa.me/+584143210449"
              className="transition-colors hover:text-white"
            >
              (+58) 414-3210449
            </a>
            <a
              href="mailto:contacto@gekidokan.com.ve"
              className="transition-colors hover:text-white"
            >
              contacto@gekidokan.com.ve
            </a>
            <span>Av. del Dojo 58, CDMX</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-[38px] max-w-[1180px] border-t border-line-inverse pt-[22px] text-center text-[13px] text-ink-muted">
        © 2026 Gekidokan. Todos los derechos reservados.
      </div>
    </footer>
  )
}
