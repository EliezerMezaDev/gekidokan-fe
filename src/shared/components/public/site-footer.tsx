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
    <footer className="bg-[#1c1717] px-8 pt-14 pb-7 text-[#f7f1f1]">
      <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="disp mb-[18px] flex items-center gap-[9px] text-[26px] font-bold text-white">
            <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-md bg-[#eb1c24] text-[17px]">
              武
            </span>
            BUSHIDŌ
          </div>
          <p className="max-w-[280px] text-sm leading-relaxed text-[#a89f9f]">
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
                className="text-[#a89f9f] transition-colors hover:text-white"
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
          <div className="flex flex-col gap-[11px] text-sm text-[#a89f9f]">
            <span>+52 55 1234 5678</span>
            <a
              href="mailto:hola@bushidodojo.mx"
              className="transition-colors hover:text-white"
            >
              hola@bushidodojo.mx
            </a>
            <span>Av. del Dojo 58, CDMX</span>
          </div>
        </div>

        <div>
          <h4 className="disp mb-4 text-sm font-semibold tracking-[0.05em] text-white">
            Horario
          </h4>
          <div className="flex flex-col gap-[11px] text-sm text-[#a89f9f]">
            <span>Lun a Vie · 9:00 – 20:30</span>
            <span>Sábado · 9:00 – 14:00</span>
            <span>Domingo · Descanso</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-[38px] max-w-[1180px] border-t border-[#332b2b] pt-[22px] text-center text-[13px] text-[#6f6666]">
        © 2026 Bushidō Dōjō. Todos los derechos reservados.
      </div>
    </footer>
  )
}
