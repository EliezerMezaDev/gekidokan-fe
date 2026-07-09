import type { Metadata } from "next"
import { SectionHeader } from "@/modules/public/components/section-header"

export const metadata: Metadata = {
  title: "Clases y horarios",
  description:
    "Programación semanal de las clases de Karate y Kobudo en Gekidokan: estilo, instructor y horario de cada sesión.",
}

const K = { bg: "var(--stripe-a)", fg: "var(--foreground)" }
const H = { bg: "var(--primary)", fg: "var(--card)" }
const B = { bg: "var(--foreground)", fg: "var(--card)" }

type Cell = {
  title: string
  range: string
  inst: string
  bg: string
  fg: string
} | null

const cell = (
  title: string,
  range: string,
  inst: string,
  s: { bg: string; fg: string }
): Cell => ({ title, range, inst, ...s })

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const rows: { time: string; cells: Cell[] }[] = [
  {
    time: "9:00",
    cells: [
      cell("Fuerza y velocidad", "9:00 – 10:30", "Sensei Tanaka", K),
      null,
      cell("Karate fundamentos", "9:30 – 11:00", "Sensei Ríos", K),
      null,
      null,
      cell("Cinturón negro", "9:00 – 11:00", "Sensei Ito", K),
    ],
  },
  {
    time: "10:00",
    cells: [
      null,
      cell("Karate: enfoque dan", "10:00 – 12:00", "Sensei Ito", H),
      null,
      cell("Kobudo · Bo", "10:00 – 12:00", "Sensei Ito", B),
      null,
      null,
    ],
  },
  {
    time: "11:00",
    cells: [
      null,
      null,
      null,
      null,
      cell("Karate fundamentos", "11:00 – 12:30", "Sensei Ríos", K),
      null,
    ],
  },
  {
    time: "12:00",
    cells: [
      cell("Karate fundamentos", "12:30 – 14:00", "Sensei Ríos", K),
      cell("Fuerza y velocidad", "12:00 – 13:20", "Sensei Tanaka", K),
      null,
      null,
      null,
      null,
    ],
  },
  {
    time: "17:00",
    cells: [
      cell("Karate infantil", "17:00 – 18:00", "Sensei Mora", K),
      cell("Kobudo · Sai", "17:00 – 18:30", "Sensei Ito", B),
      cell("Karate infantil", "17:00 – 18:00", "Sensei Mora", K),
      cell("Kobudo · Tonfa", "17:00 – 18:30", "Sensei Ito", B),
      cell("Karate infantil", "17:00 – 18:00", "Sensei Mora", K),
      null,
    ],
  },
  {
    time: "18:30",
    cells: [
      cell("Jóvenes y adultos", "18:30 – 20:00", "Sensei Tanaka", H),
      cell("Jóvenes y adultos", "18:30 – 20:00", "Sensei Ríos", K),
      cell("Jóvenes y adultos", "18:30 – 20:00", "Sensei Tanaka", K),
      cell("Jóvenes y adultos", "18:30 – 20:00", "Sensei Ríos", K),
      cell("Kumite libre", "18:30 – 20:30", "Sensei Ito", B),
      null,
    ],
  },
]

const gridCols = "88px repeat(6,1fr)"

export default function ClassesPage() {
  return (
    <div className="my-20">
      <section className="mx-auto max-w-[1180px] px-8 pt-9 pb-2.5">
        <SectionHeader
          eyebrow="Programa semanal"
          title="Clases y horarios"
          lead="Consulta la programación semanal de nuestras clases de Karate y Kobudo. Cada sesión indica el estilo, el instructor y el rango horario."
        />
      </section>

      <section className="mx-auto max-w-[1180px] overflow-x-auto px-8 pt-5 pb-10">
        <div className="min-w-[820px] overflow-hidden rounded-xl border border-line-strong bg-white">
          <div className="grid" style={{ gridTemplateColumns: gridCols }}>
            <div className="bg-primary" />
            {days.map((d) => (
              <div
                key={d}
                className="disp bg-primary px-1.5 py-4 text-center text-[13px] font-bold text-white"
              >
                {d}
              </div>
            ))}
          </div>
          {rows.map((row) => (
            <div
              key={row.time}
              className="grid border-t border-line-soft"
              style={{ gridTemplateColumns: gridCols }}
            >
              <div className="disp flex items-center justify-center border-r border-line-soft px-2 py-[18px] text-[13px] font-bold">
                {row.time}
              </div>
              {row.cells.map((c, i) => (
                <div
                  key={i}
                  className="min-h-[78px] border-r border-line-soft p-1.5"
                >
                  {c ? (
                    <div
                      className="h-full rounded-lg p-3"
                      style={{ background: c.bg, color: c.fg }}
                    >
                      <div className="disp mb-1.5 text-[12.5px] leading-[1.2] font-bold">
                        {c.title}
                      </div>
                      <div className="text-[11px] opacity-85">{c.range}</div>
                      <div className="mt-1 text-[10.5px] opacity-70">
                        {c.inst}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-[12.5px] text-ink-muted">
          <span className="flex items-center gap-[7px]">
            <span className="h-3.5 w-3.5 rounded-[3px] bg-primary" />
            Clase destacada
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="h-3.5 w-3.5 rounded-[3px] border border-line-strong bg-[var(--stripe-a)]" />
            Karate
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="h-3.5 w-3.5 rounded-[3px] bg-foreground" />
            Kobudo
          </span>
        </div>
      </section>
    </div>
  )
}
