import type { Metadata } from "next"
import Link from "next/link"
import { getBlogPosts } from "@/modules/public/api"
import { formatShortDate } from "@/modules/public/format"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Karate y Kobudo de Okinawa",
  description:
    "Bushidō Dōjō: Karate y Kobudo tradicional de Okinawa. Clases para niños, jóvenes y adultos. Disciplina, respeto y comunidad. Inscríbete hoy.",
  openGraph: {
    title: "Bushidō Dōjō — Karate y Kobudo de Okinawa",
    description:
      "Karate y Kobudo tradicional de Okinawa para niños, jóvenes y adultos. Desde tu primera clase hasta el cinturón negro.",
  },
}

const audiences = ["Niños", "Jóvenes", "Adultos", "Familias"]

const programs = [
  {
    img: "foto · grupo de niños",
    title: "Karate infantil",
    desc: "Programa diseñado especialmente para los más pequeños: coordinación, valores y confianza en un entorno seguro.",
  },
  {
    img: "foto · kumite adultos",
    title: "Jóvenes y adultos",
    desc: "Entrenamiento de kata y kumite para adolescentes y adultos que buscan superarse física y mentalmente.",
  },
  {
    img: "foto · bo y sai",
    title: "Kobudo de Okinawa",
    desc: "Aprende el arte de las armas tradicionales — bo, sai, tonfa y nunchaku — con instructores certificados.",
  },
]

const stripes =
  "repeating-linear-gradient(45deg,#efe7e7,#efe7e7 10px,#e7dede 10px,#e7dede 20px)"

function PhotoTag({ label }: { label: string }) {
  return (
    <span className="rounded bg-[#f7f1f1] px-2 py-1 font-mono text-[10px] text-[#8a8080]">
      {label}
    </span>
  )
}

export default async function LandingPage() {
  const posts = await getBlogPosts()

  return (
    <div>
      {/* HERO */}
      <section className="mx-auto grid max-w-[1180px] items-center gap-10 px-8 pt-9 pb-5 md:grid-cols-2">
        <div>
          <h1 className="disp mb-[22px] text-[44px] leading-[1.02] font-bold md:text-[62px]">
            Karate para la mente, el cuerpo y el espíritu
          </h1>
          <p className="mb-[30px] max-w-[400px] text-base leading-relaxed text-[#6b6363]">
            Vive la fuerza y la disciplina del Karate y el Kobudo de Okinawa.
            Desde tu primera clase hasta el cinturón negro, te acompañamos en
            cada paso del camino.
          </p>
          <div className="inline-flex items-center gap-4 rounded-[10px] bg-[#1c1717] py-3.5 pr-3.5 pl-6 shadow-[6px_6px_0_#eb1c24]">
            <span className="text-[14.5px] font-medium text-white">
              Más de 1.500 alumnos activos
            </span>
            <Link
              href="/contacto"
              className="disp rounded-[7px] bg-[#eb1c24] px-[22px] py-[11px] text-[13px] font-semibold text-white"
            >
              Únete ya
            </Link>
          </div>
        </div>
        <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center">
          <div
            className="absolute inset-[8%] rounded-full opacity-90"
            style={{
              background:
                "radial-gradient(circle,#eb1c24 0%,#eb1c24 62%,transparent 63%)",
            }}
          />
          <div className="absolute inset-[4%] animate-[spin_40s_linear_infinite] rounded-full border-[14px] border-[#1c1717] border-r-transparent border-b-transparent motion-reduce:animate-none" />
          <div
            className="relative z-10 flex h-[88%] w-[78%] items-end justify-center rounded-xl p-4"
            style={{ background: stripes }}
          >
            <PhotoTag label="foto · karateka en kamae" />
          </div>
        </div>
      </section>

      {/* OFRECEMOS CLASES PARA */}
      <section className="mx-auto max-w-[1180px] px-8 py-9 text-center">
        <h2 className="disp mb-[22px] text-2xl font-semibold">
          Ofrecemos clases para
        </h2>
        <div className="flex flex-wrap justify-center gap-3.5">
          {audiences.map((a) => (
            <span
              key={a}
              className="disp rounded-[40px] border border-[#ece3e3] bg-white px-[30px] py-3 text-sm font-semibold"
            >
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="mx-auto grid max-w-[1180px] items-center gap-13 px-8 py-10 md:grid-cols-[0.85fr_1fr]">
        <div
          className="relative flex aspect-4/5 items-end justify-center overflow-hidden rounded-t-[220px] rounded-b-xl bg-[#1c1717] p-[18px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,#262020,#262020 12px,#211b1b 12px,#211b1b 24px)",
          }}
        >
          <span className="relative rounded bg-black/40 px-2 py-1 font-mono text-[11px] text-[#aa9999]">
            foto · maestro en zenkutsu-dachi
          </span>
        </div>
        <div>
          <p className="disp mb-3.5 flex items-center gap-2 text-sm font-semibold text-[#eb1c24]">
            <span className="h-0.5 w-[22px] bg-[#eb1c24]" />
            Sobre nosotros
          </p>
          <h2 className="disp mb-5 text-[38px] leading-[1.1] font-bold">
            Fortalecer el cuerpo, enriquecer la mente
          </h2>
          <p className="mb-3.5 text-[15.5px] leading-[1.7] text-[#6b6363]">
            Bienvenido a Bushidō Dōjō — tu camino hacia el autodescubrimiento y
            el crecimiento personal a través del Karate tradicional y el Kobudo
            de Okinawa.
          </p>
          <p className="mb-[22px] text-[15.5px] leading-[1.7] text-[#6b6363]">
            Creemos que convertirse en artista marcial no se trata solo de
            aprender defensa personal, sino también de cultivar una mente
            fuerte, disciplina y respeto.
          </p>
          <Link
            href="/contacto"
            className="disp inline-flex items-center gap-1.5 text-sm font-semibold text-[#eb1c24]"
          >
            Conoce más →
          </Link>
        </div>
      </section>

      {/* PROGRAMAS */}
      <section className="mx-auto max-w-[1180px] px-8 py-10">
        <h2 className="disp mb-3.5 max-w-[640px] text-[34px] leading-[1.12] font-bold">
          Va más allá de la fuerza física y la disciplina
        </h2>
        <p className="mb-[34px] max-w-[560px] text-[15.5px] leading-[1.7] text-[#6b6363]">
          Nuestros programas de entrenamiento están diseñados para mejorar tus
          habilidades, desarrollar confianza y alcanzar la mejor versión de ti
          mismo.
        </p>
        <div className="grid gap-[22px] md:grid-cols-3">
          {programs.map((p) => (
            <div
              key={p.title}
              className="flex flex-col overflow-hidden rounded-xl border border-[#ece3e3] bg-white"
            >
              <div
                className="flex aspect-16/10 items-end p-3"
                style={{ background: stripes }}
              >
                <PhotoTag label={p.img} />
              </div>
              <div className="p-[22px]">
                <h3 className="disp mb-2.5 text-[19px] font-bold">{p.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-[#6b6363]">
                  {p.desc}
                </p>
                <Link
                  href="/clases"
                  className="disp text-[13px] font-semibold text-[#eb1c24]"
                >
                  Conoce más →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRÓXIMO EVENTO */}
      <section className="mx-auto max-w-[1180px] px-8 py-6.5">
        <div className="grid items-center gap-[34px] rounded-[14px] border-[1.5px] border-[#dfd4d4] bg-white px-[38px] py-[34px] md:grid-cols-[1.3fr_auto_auto]">
          <div>
            <p className="disp mb-2.5 text-[15px] font-semibold">
              Próximo evento
            </p>
            <h3 className="disp mb-2 text-[22px] font-bold text-[#eb1c24]">
              Torneo Anual 2026
            </h3>
            <p className="max-w-[420px] text-sm leading-relaxed text-[#6b6363]">
              Prepárate para una experiencia única: reúne a los competidores más
              hábiles en una jornada de kata, kumite y kobudo.
            </p>
          </div>
          <div className="border-l border-[#eeeeee] px-5 text-center">
            <div className="disp text-[52px] leading-none font-bold">12</div>
            <div className="disp mt-1 text-sm font-semibold text-[#eb1c24]">
              Sep · Sábado
            </div>
          </div>
          <Link
            href="/contacto"
            className="disp rounded-lg bg-[#eb1c24] px-[26px] py-3.5 text-center text-sm font-semibold whitespace-nowrap text-white"
          >
            Ver detalles
          </Link>
        </div>
      </section>

      {/* DEL BLOG */}
      <section className="mx-auto max-w-[1180px] px-8 pt-10 pb-15">
        <div className="mb-[26px] flex items-end justify-between">
          <h2 className="disp text-[30px] font-bold">Del blog</h2>
          <Link
            href="/blog"
            className="disp text-sm font-semibold text-[#eb1c24]"
          >
            Ver todo →
          </Link>
        </div>
        <div className="grid gap-[22px] md:grid-cols-3">
          {posts.slice(0, 3).map((b) => (
            <Link
              key={b.slug}
              href={`/blog/${b.slug}`}
              className="flex flex-col overflow-hidden rounded-xl border border-[#ece3e3] bg-white text-inherit"
            >
              <div className="aspect-16/10" style={{ background: stripes }} />
              <div className="p-5">
                <span className="disp text-[11px] font-semibold text-[#eb1c24]">
                  {b.category}
                </span>
                <h3 className="disp mt-2 mb-1.5 text-[17px] leading-[1.25] font-bold">
                  {b.title}
                </h3>
                <span className="text-[12.5px] text-[#9a9090]">
                  {formatShortDate(b.publishedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
