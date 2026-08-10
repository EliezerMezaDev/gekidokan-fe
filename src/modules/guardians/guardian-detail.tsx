"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconPencil, IconArrowLeft, IconUser } from "@tabler/icons-react"
import type { Guardian } from "@/shared/schemas/guardians"
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
import { getGuardianBySlug } from "./api"
import { getStudents } from "@/modules/students/api"
import { relationshipLabel } from "./relationship"
import { dateFmt } from "./date-fmt"

// Ficha de detalle (solo lectura) del representante. Bento full-width (sin
// mx-auto max-w-*); la edición vive en la ruta hermana /edit.

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

export function GuardianDetail({ slug }: { slug: string }) {
  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function fetchGuardian() {
    Promise.all([getGuardianBySlug(slug), getStudents()])
      .then(([g, allStudents]) => {
        setGuardian(g)
        setStudents(allStudents)
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchGuardian()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function retry() {
    setLoading(true)
    setError(null)
    fetchGuardian()
  }

  if (loading) return <LoadingState rows={5} />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!guardian)
    return (
      <EmptyState
        title="Representante no encontrado"
        description="Puede que haya sido eliminado o el enlace sea incorrecto."
        action={
          <Button asChild variant="outline">
            <Link href="/d/guardians">Volver a representantes</Link>
          </Button>
        }
      />
    )

  const g = guardian
  // ponytail: vínculo derivado del alumno (única fuente); no se duplica en guardian.
  const linkedStudents = students.filter((s) => s.guardianId === g.id)

  return (
    <div>
      <ModuleHeader
        title={`${g.firstName} ${g.lastName}`}
        description="Detalle del representante."
      >
        <Button variant="outline" asChild>
          <Link href="/d/guardians">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/d/guardians/${g.slug}/edit`}>
            <IconPencil className="size-4" />
            Editar
          </Link>
        </Button>
      </ModuleHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-6 sm:p-8 md:col-span-4">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-foreground/5 font-heading text-lg text-foreground ring-1 ring-border ring-inset">
              {initials(g.firstName, g.lastName)}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-2xl leading-tight tracking-tight">
                {g.firstName} {g.lastName}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Registrado el {dateFmt.format(new Date(g.createdAt))}
              </p>
            </div>
          </div>

          <dl className="mt-7 grid gap-6 sm:grid-cols-3">
            <Field label="Correo" value={g.email ?? "—"} />
            <Field label="Teléfono" value={g.phone ?? "—"} />
            <Field label="Cédula" value={g.nationalId ?? "—"} />
          </dl>
        </Card>

        <Card className="p-6 sm:p-8 md:col-span-4">
          <Eyebrow>Alumnos vinculados</Eyebrow>
          {linkedStudents.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Sin alumnos vinculados.
            </p>
          ) : (
            <div className="mt-4 flex flex-col divide-y">
              {linkedStudents.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <IconUser className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {s.firstName} {s.lastName}
                    </p>
                  </div>
                  {s.guardianRelationship && (
                    <Badge variant="secondary">
                      {relationshipLabel[s.guardianRelationship]}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
