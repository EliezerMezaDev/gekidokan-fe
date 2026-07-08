import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Clases y horarios",
  description:
    "Programación semanal de las clases de Karate y Kobudo en Bushidō Dōjō: estilo, instructor y horario de cada sesión.",
}

// Paletas de celda del diseño: K = Karate, H = destacada, B = Kobudo.
const K = { bg: "#efe7e7", fg: "#1c1717" }
const H = { bg: "#eb1c24", fg: "#ffffff" }
const B = { bg: "#1c1717", fg: "#ffffff" }

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

const styles = [
  {
    k: "空",
    name: "Karate fundamentos",
    desc: "Base de kihon, kata y kumite para todos los niveles.",
  },
  {
    k: "武",
    name: "Kobudo Okinawa",
    desc: "Armas tradicionales: bo, sai, tonfa y nunchaku.",
  },
  {
    k: "力",
    name: "Fuerza y velocidad",
    desc: "Acondicionamiento físico orientado al combate.",
  },
  {
    k: "黒",
    name: "Cinturón negro",
    desc: "Preparación avanzada para grados dan.",
  },
]

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
    <div>
      {/* CABECERA */}
      <section className="mx-auto max-w-[1180px] px-8 pt-9 pb-2.5">
        <p className="disp mb-3 flex items-center gap-2 text-sm font-semibold text-[#eb1c24]">
          <span className="h-0.5 w-[22px] bg-[#eb1c24]" />
          Programa semanal
        </p>
        <h1 className="disp mb-3.5 text-[46px] leading-[1.05] font-bold">
          Clases y horarios
        </h1>
        <p className="max-w-[560px] text-base leading-relaxed text-[#6b6363]">
          Consulta la programación semanal de nuestras clases de Karate y
          Kobudo. Cada sesión indica el estilo, el instructor y el rango
          horario.
        </p>
      </section>

      {/* TARJETAS DE ESTILO */}
      <section className="mx-auto grid max-w-[1180px] gap-4 px-8 py-6.5 sm:grid-cols-2 lg:grid-cols-4">
        {styles.map((s) => (
          <div
            key={s.name}
            className="rounded-xl border border-[#ece3e3] bg-white p-[22px]"
          >
            <div className="disp mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eb1c24] text-lg font-bold text-white">
              {s.k}
            </div>
            <h3 className="disp mb-1.5 text-base font-bold">{s.name}</h3>
            <p className="text-[13px] leading-[1.5] text-[#6b6363]">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* GRID SEMANAL */}
      <section className="mx-auto max-w-[1180px] overflow-x-auto px-8 pt-5 pb-10">
        <div className="min-w-[820px] overflow-hidden rounded-xl border border-[#e6dcdc] bg-white">
          {/* fila de encabezado */}
          <div className="grid" style={{ gridTemplateColumns: gridCols }}>
            <div className="bg-[#eb1c24]" />
            {days.map((d) => (
              <div
                key={d}
                className="disp bg-[#eb1c24] px-1.5 py-4 text-center text-[13px] font-bold text-white"
              >
                {d}
              </div>
            ))}
          </div>
          {/* filas */}
          {rows.map((row) => (
            <div
              key={row.time}
              className="grid border-t border-[#f0e8e8]"
              style={{ gridTemplateColumns: gridCols }}
            >
              <div className="disp flex items-center justify-center border-r border-[#f0e8e8] px-2 py-[18px] text-[13px] font-bold">
                {row.time}
              </div>
              {row.cells.map((c, i) => (
                <div
                  key={i}
                  className="min-h-[78px] border-r border-[#f6efef] p-1.5"
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
        <div className="mt-4 flex flex-wrap gap-5 text-[12.5px] text-[#6b6363]">
          <span className="flex items-center gap-[7px]">
            <span className="h-3.5 w-3.5 rounded-[3px] bg-[#eb1c24]" />
            Clase destacada
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="h-3.5 w-3.5 rounded-[3px] border border-[#dddddd] bg-[#efe7e7]" />
            Karate
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="h-3.5 w-3.5 rounded-[3px] bg-[#1c1717]" />
            Kobudo
          </span>
        </div>
      </section>
    </div>
  )
}
