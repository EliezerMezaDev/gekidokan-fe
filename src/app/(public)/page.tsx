import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { IconArrowRight, IconKarate } from "@tabler/icons-react"
import { getBlogPosts, getClasses } from "@/modules/public/api"
import { formatDate, styleLabel } from "@/modules/public/format"
import { Button } from "@/shadcn/button"
import { Badge } from "@/shadcn/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shadcn/card"

export const metadata: Metadata = {
  title: "Academia de Karate y Kobudo",
  description:
    "Gekidokan: academia de Karate Shotokan y Kobudo de Okinawa. Clases para niños y adultos, disciplina y tradición. Conoce nuestros horarios e inscríbete.",
  openGraph: {
    title: "Gekidokan — Academia de Karate y Kobudo",
    description:
      "Karate Shotokan y Kobudo de Okinawa. Clases para niños y adultos, disciplina y tradición.",
    images: ["/images/brand/isologo.png"],
  },
}

export default async function LandingPage() {
  const [classes, posts] = await Promise.all([getClasses(), getBlogPosts()])

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: "url(/images/brand/pattern-dark.svg)",
            backgroundSize: "480px",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <Badge className="mb-4">Karate · Kobudo</Badge>
            <h1 className="font-heading text-4xl leading-tight font-bold text-balance md:text-5xl">
              Disciplina, respeto y superación en cada entrenamiento
            </h1>
            <p className="mt-4 max-w-md text-lg text-background/70">
              Academia Gekidokan: Karate Shotokan y Kobudo de Okinawa para
              niños, jóvenes y adultos. Encuentra tu camino en el dojo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contacto">
                  Conócenos <IconArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/clases">Ver clases y horarios</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <Image
              src="/images/brand/spectacular.png"
              alt="Practicantes de Gekidokan"
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Estilos */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-heading text-2xl font-semibold">
          Nuestras disciplinas
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconKarate className="size-5 text-primary" /> Karate Shotokan
              </CardTitle>
              <CardDescription>
                Kihon, kata y kumite. El estilo de Karate más practicado del
                mundo, con énfasis en técnica, potencia y disciplina.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconKarate className="size-5 text-primary" /> Kobudo de Okinawa
              </CardTitle>
              <CardDescription>
                Manejo tradicional de armas de Okinawa (bo, sai, tonfa),
                complemento histórico del Karate.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Clases (teaser) */}
      <section className="border-y bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-2xl font-semibold">
              Horarios de clases
            </h2>
            <Button asChild variant="link" size="sm">
              <Link href="/clases">
                Ver todos <IconArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.slice(0, 3).map((c) => (
              <Card key={c.id} size="sm">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {styleLabel(c.style)}
                  </Badge>
                  <CardTitle className="mt-1">{c.name}</CardTitle>
                  <CardDescription>{c.instructor}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog (teaser) */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold">Del blog</h2>
          <Button asChild variant="link" size="sm">
            <Link href="/blog">
              Ver todo <IconArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {post.category}
                  </Badge>
                  <CardTitle className="mt-1">{post.title}</CardTitle>
                  <CardDescription>
                    {formatDate(post.publishedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA contacto */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center">
          <h2 className="font-heading text-3xl font-bold">
            ¿Listo para empezar?
          </h2>
          <p className="max-w-md opacity-90">
            Escríbenos y te contamos cómo dar tus primeros pasos en Gekidokan.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-2">
            <Link href="/contacto">Contáctanos</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
