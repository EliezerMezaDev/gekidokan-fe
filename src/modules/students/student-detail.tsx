"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconPencil, IconArrowLeft } from "@tabler/icons-react"
import type { Student } from "@/shared/schemas/students"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"
import { Separator } from "@/shadcn/separator"
import { getStudentBySlug } from "./api"
import { dateFmt } from "./belt"
import { BeltProgress } from "./belt-progress"
import { contentLabel } from "./content-mock"

// Ficha de detalle (solo lectura) del alumno. El hero lidera con la escalera de
// rango (obi); la edición vive en la ruta hermana /edit.

// Eyebrow reutilizado (mismo lenguaje tipográfico que el portal: .disp).
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

function initials(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

function StatCard({ label, value, unit }: { label: string; value?: number; unit: string }) {
  return (
    <Card className="flex flex-col justify-between gap-1 p-6">
      <Eyebrow>{label}</Eyebrow>
      <p className="font-heading text-3xl tracking-tight">
        {value ?? "—"}
        {value ? <span className="ml-1 text-base text-muted-foreground">{unit}</span> : null}
      </p>
    </Card>
  )
}

export function StudentDetail({ slug }: { slug: string }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function fetchStudent() {
    getStudentBySlug(slug)
      .then(setStudent)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchStudent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function retry() {
    setLoading(true)
    setError(null)
    fetchStudent()
  }

  if (loading) return <LoadingState rows={5} />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!student)
    return (
      <EmptyState
        title="Alumno no encontrado"
        description="Puede que haya sido eliminado o el enlace sea incorrecto."
        action={
          <Button asChild variant="outline">
            <Link href="/d/students">Volver a alumnos</Link>
          </Button>
        }
      />
    )

  const s = student
  return (
    <div>
      <ModuleHeader
        title={`${s.firstName} ${s.lastName}`}
        description="Detalle del alumno."
      >
        <Button variant="outline" asChild>
          <Link href="/d/students">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/d/students/${s.slug}/edit`}>
            <IconPencil className="size-4" />
            Editar
          </Link>
        </Button>
      </ModuleHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-6 sm:p-8 md:col-span-2 md:row-span-2">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-foreground/5 font-heading text-lg text-foreground ring-1 ring-border ring-inset">
              {initials(s.firstName, s.lastName)}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-2xl leading-tight tracking-tight">
                {s.firstName} {s.lastName}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Inscrito el {dateFmt.format(new Date(s.enrolledAt))}
              </p>
            </div>
            {s.status === "ACTIVE" ? (
              <Badge className="bg-green-600/15 text-green-700 dark:text-green-400">
                Activo
              </Badge>
            ) : (
              <Badge variant="secondary">Inactivo</Badge>
            )}
          </div>

          <Separator className="my-7" />

          <dl className="grid gap-6 sm:grid-cols-2">
            <Field label="Correo de contacto" value={s.email ?? "—"} />
            <Field label="Teléfono" value={s.phone ?? "—"} />
            <Field label="Representante" value={s.guardianName ?? "—"} />
            <Field label="Correo de acceso" value={s.accessUsername ?? "—"} />
          </dl>
        </Card>

        <Card className="p-6 sm:p-8 md:col-span-2">
          <Eyebrow>Grado</Eyebrow>
          <BeltProgress belt={s.belt} className="mt-3" />
        </Card>

        <StatCard label="Altura" value={s.height} unit="cm" />
        <StatCard label="Peso" value={s.weight} unit="kg" />

        <Card className="p-6 sm:p-8 md:col-span-4">
          <Eyebrow>Contenido habilitado</Eyebrow>
          {s.enabledContent.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Sin contenido habilitado.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {s.enabledContent.map((id) => (
                <Badge key={id} variant="secondary">
                  {contentLabel(id)}
                </Badge>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
