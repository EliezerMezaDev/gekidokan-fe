import type { Metadata } from "next"
import Link from "next/link"
import { getBlogPosts } from "@/modules/public/api"
import { Eyebrow } from "@/modules/public/components/section-header"
import { PhotoPlaceholder } from "@/modules/public/components/photo-placeholder"
import { BlogCard } from "@/modules/public/components/blog-card"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Karate y Kobudo de Okinawa",
  description:
    "Gekidokan: Karate y Kobudo tradicional de Okinawa. Clases para niños, jóvenes y adultos. Disciplina, respeto y comunidad. Inscríbete hoy.",
  openGraph: {
    title: "Gekidokan — Karate y Kobudo de Okinawa",
    description:
      "Karate y Kobudo tradicional de Okinawa para niños, jóvenes y adultos. Desde tu primera clase hasta el cinturón negro.",
  },
}

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

export default async function LandingPage() {
  const posts = await getBlogPosts()

  return (
    <div>
      {/* HERO */}
      <section className="mx-auto grid min-h-[100dvh] max-w-[1180px] items-center gap-10 px-8 pt-9 pb-5 max-sm:mt-12 md:grid-cols-2">
        <div>
          <h1 className="disp mb-[22px] text-[44px] leading-[1.02] font-bold md:text-[62px]">
            Karate para la mente, el cuerpo y el espíritu
          </h1>
          <p className="mb-[30px] max-w-[400px] text-base leading-relaxed text-ink-muted">
            Vive la fuerza y la disciplina del Karate y el Kobudo de Okinawa.
            Desde tu primera clase hasta el cinturón negro, te acompañamos en
            cada paso del camino.
          </p>
          <div className="inline-flex items-center gap-4 rounded-[10px] bg-foreground py-3.5 pr-3.5 pl-6 shadow-[6px_6px_0_var(--primary)]">
            <span className="text-[14.5px] font-medium text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing.
            </span>
            <Link
              href="/contacto"
              className="disp rounded-[7px] bg-primary px-[22px] py-[11px] text-[13px] font-semibold text-white"
            >
              Únete ya
            </Link>
          </div>
        </div>
        <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center">
          <img src="images/brand/spectacular.png" alt="Gekidokan" />
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="mx-auto grid min-h-[100dvh] max-w-[1180px] items-center gap-13 px-8 py-10 md:grid-cols-[0.85fr_1fr]">
        <div
          className="relative flex aspect-4/5 items-end justify-center overflow-hidden rounded-t-[220px] rounded-b-xl bg-foreground p-[18px] max-sm:order-2"
          style={{
            backgroundImage: "url(images/assets/funakoshi-gichin-sensei.jpg)",
            backgroundSize: "cover",
          }}
        >
          <span className="relative rounded bg-black/80 px-2 py-1 font-mono text-[11px] text-ink-inverse">
            Maestro en Funakoshi Gichin
          </span>
        </div>
        <div className="max-sm:order-1">
          <Eyebrow className="mb-3.5">Sobre nosotros</Eyebrow>
          <h2 className="disp mb-5 text-[38px] leading-[1.1] font-bold">
            Fortalecer el cuerpo, enriquecer la mente
          </h2>
          <p className="mb-3.5 text-[15.5px] leading-[1.7] text-ink-muted">
            Bienvenido a Gekidokan — tu camino hacia el autodescubrimiento y el
            crecimiento personal a través del Karate tradicional y el Kobudo de
            Okinawa.
          </p>
          <p className="mb-[22px] text-[15.5px] leading-[1.7] text-ink-muted">
            Creemos que convertirse en artista marcial no se trata solo de
            aprender defensa personal, sino también de cultivar una mente
            fuerte, disciplina y respeto.
          </p>
          <Link
            href="/contacto"
            className="disp inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            Conoce más →
          </Link>
        </div>
      </section>

      {/* PROGRAMAS */}
      <section className="mx-auto flex min-h-[100dvh] max-w-[1180px] flex-col justify-center px-8 py-10">
        <h2 className="disp mb-3.5 max-w-[640px] text-[34px] leading-[1.12] font-bold">
          Va más allá de la fuerza física y la disciplina
        </h2>
        <p className="mb-[34px] max-w-[560px] text-[15.5px] leading-[1.7] text-ink-muted">
          Nuestros programas de entrenamiento están diseñados para mejorar tus
          habilidades, desarrollar confianza y alcanzar la mejor versión de ti
          mismo.
        </p>
        <div className="grid gap-[22px] md:grid-cols-3">
          {programs.map((p) => (
            <div
              key={p.title}
              className="flex flex-col overflow-hidden rounded-xl border border-line bg-white"
            >
              <PhotoPlaceholder label={p.img} className="aspect-16/10 p-3" />
              <div className="p-[22px]">
                <h3 className="disp mb-2.5 text-[19px] font-bold">{p.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-ink-muted">
                  {p.desc}
                </p>
                <Link
                  href="/clases"
                  className="disp text-[13px] font-semibold text-primary"
                >
                  Conoce más →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRÓXIMO EVENTO */}
      <section className="mx-auto flex min-h-[30dvh] max-w-[1180px] flex-col justify-center px-8 py-6.5">
        <div className="grid items-center gap-[34px] rounded-[14px] border-[1.5px] border-line-strong bg-white px-[38px] py-[34px] md:grid-cols-[1.3fr_auto_auto]">
          <div>
            <p className="disp mb-2.5 text-[15px] font-semibold">
              Próximo evento
            </p>
            <h3 className="disp mb-2 text-[22px] font-bold text-primary">
              Torneo Anual 2026
            </h3>
            <p className="max-w-[420px] text-sm leading-relaxed text-ink-muted">
              Prepárate para una experiencia única: reúne a los competidores más
              hábiles en una jornada de kata, kumite y kobudo.
            </p>
          </div>
          <div className="border-l border-line-strong px-5 text-center">
            <div className="disp text-[52px] leading-none font-bold">12</div>
            <div className="disp mt-1 text-sm font-semibold text-primary">
              Sep · Sábado
            </div>
          </div>
          <Link
            href="/contacto"
            className="disp rounded-lg bg-primary px-[26px] py-3.5 text-center text-sm font-semibold whitespace-nowrap text-white"
          >
            Ver detalles
          </Link>
        </div>
      </section>

      {/* DEL BLOG */}
      <section className="mx-auto flex min-h-[100dvh] max-w-[1180px] flex-col justify-center px-8 pt-10 pb-15">
        <div className="mb-[26px] flex items-end justify-between">
          <h2 className="disp text-[30px] font-bold">Del blog</h2>
          <Link
            href="/blog"
            className="disp text-sm font-semibold text-primary"
          >
            Ver todo →
          </Link>
        </div>
        <div className="grid gap-[22px] md:grid-cols-3">
          {posts.slice(0, 3).map((b) => (
            <BlogCard key={b.slug} post={b} compact />
          ))}
        </div>
      </section>
    </div>
  )
}
