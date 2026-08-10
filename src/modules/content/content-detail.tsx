"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconPencil, IconArrowLeft, IconVideo } from "@tabler/icons-react"
import type { SyllabusItem } from "@/shared/schemas/content"
import { beltRankSchema } from "@/shared/schemas/students"
import { getStudents } from "@/modules/students/api"
import { beltLabel, beltDot, dateFmt } from "@/modules/students/belt"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"
import { getSyllabusItemBySlug } from "./api"
import { syllabusTypeLabel, contentStyleLabel } from "./content-labels"

// Ficha de detalle (solo lectura) del contenido, a ancho completo con bento
// grid (ver students/student-detail.tsx). El bloque "Alumnos con acceso"
// deriva el conteo por rango de cinta acumulativo, no por asignación explícita.

function Eyebrow({ children }: { children: string }) {
  return <p className="disp text-[11px] text-muted-foreground">{children}</p>
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="disp text-[10px] text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="flex flex-col justify-between gap-1 p-6">
      <Eyebrow>{label}</Eyebrow>
      <p className="font-heading text-3xl tracking-tight">{value}</p>
    </Card>
  )
}

export function ContentDetail({ slug }: { slug: string }) {
  const [item, setItem] = useState<SyllabusItem | null>(null)
  const [studentsWithAccess, setStudentsWithAccess] = useState<number | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function fetchItem() {
    getSyllabusItemBySlug(slug)
      .then(async (c) => {
        setItem(c)
        if (!c) return
        // ponytail: acceso derivado por rango acumulativo (DT-05 tentativo);
        // se recalcula aquí en vez de vivir en el modelo del alumno.
        const students = await getStudents()
        const minIndex = beltRankSchema.options.indexOf(c.minBeltRank)
        setStudentsWithAccess(
          students.filter(
            (s) => beltRankSchema.options.indexOf(s.belt) >= minIndex
          ).length
        )
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchItem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function retry() {
    setLoading(true)
    setError(null)
    fetchItem()
  }

  if (loading) return <LoadingState rows={5} />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!item)
    return (
      <EmptyState
        title="Contenido no encontrado"
        description="Puede que haya sido eliminado o el enlace sea incorrecto."
        action={
          <Button asChild variant="outline">
            <Link href="/d/content">Volver a contenido</Link>
          </Button>
        }
      />
    )

  const c = item
  return (
    <div>
      <ModuleHeader title={c.title} description="Detalle del contenido.">
        <Button variant="outline" asChild>
          <Link href="/d/content">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/d/content/${c.slug}/edit`}>
            <IconPencil className="size-4" />
            Editar
          </Link>
        </Button>
      </ModuleHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-6 sm:p-8 md:col-span-2 md:row-span-2">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-2xl leading-tight tracking-tight">
                {c.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Creado el {dateFmt.format(new Date(c.createdAt))}
              </p>
            </div>
            <Badge variant="secondary">{syllabusTypeLabel[c.type]}</Badge>
          </div>

          <dl className="mt-7 grid gap-6 sm:grid-cols-2">
            <Field label="Cinta mínima" value={beltLabel[c.minBeltRank]} />
            <Field label="Estilo" value={contentStyleLabel[c.style]} />
            <Field
              label="Enlace de video"
              value={c.videoUrl ? c.videoUrl : "—"}
            />
          </dl>
        </Card>

        <Card className="p-6 sm:p-8 md:col-span-2">
          <Eyebrow>Cinta mínima</Eyebrow>
          <span className="mt-3 flex items-center gap-2 text-sm">
            <span
              className={`size-2.5 rounded-full ${beltDot[c.minBeltRank]}`}
            />
            {beltLabel[c.minBeltRank]}
          </span>
        </Card>

        <StatCard label="Alumnos con acceso" value={studentsWithAccess ?? 0} />
        <StatCard label="Video" value={c.videoUrl ? 1 : 0} />

        <Card className="p-6 sm:p-8 md:col-span-4">
          <Eyebrow>Cuerpo</Eyebrow>
          {c.videoUrl ? (
            <a
              href={c.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-fit items-center gap-2 text-sm text-primary underline underline-offset-4"
            >
              <IconVideo className="size-4" />
              Ver video
            </a>
          ) : null}
          {/* ponytail: texto plano (sin lib de markdown). */}
          <p className="mt-4 text-sm whitespace-pre-wrap text-muted-foreground">
            {c.bodyMarkdown || "Sin contenido."}
          </p>
        </Card>
      </div>
    </div>
  )
}
