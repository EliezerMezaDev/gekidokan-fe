"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  IconPencil,
  IconArrowLeft,
  IconUser,
  IconCalendarEvent,
  IconClipboardCheck,
} from "@tabler/icons-react"
import type { KarateClass } from "@/shared/schemas/classes"
import type { Student } from "@/shared/schemas/students"
import type { AttendanceSession } from "@/shared/schemas/attendance"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"
import { getClassBySlug } from "./api"
import { getStudents } from "@/modules/students/api"
import { getAttendanceByClass } from "@/modules/attendance/api"
import { styleLabel, formatSchedule, nextSessionDate } from "./class-labels"

// Ficha de detalle (solo lectura) de la clase. Bento full-width; la edición
// vive en la ruta hermana /edit y la toma de asistencia en /attendance.

function Eyebrow({ children }: { children: string }) {
  return <p className="disp text-[11px] text-muted-foreground">{children}</p>
}

export function ClassDetail({ slug }: { slug: string }) {
  const [karateClass, setKarateClass] = useState<KarateClass | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [lastSession, setLastSession] = useState<AttendanceSession | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function fetchClass() {
    Promise.all([getClassBySlug(slug), getStudents()])
      .then(([c, allStudents]) => {
        setKarateClass(c)
        setStudents(allStudents)
        if (c) {
          getAttendanceByClass(c.id).then((sessions) => {
            const list = Array.isArray(sessions) ? sessions : []
            const latest = [...list].sort((a, b) =>
              b.date.localeCompare(a.date)
            )[0]
            setLastSession(latest ?? null)
          })
        }
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchClass()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function retry() {
    setLoading(true)
    setError(null)
    fetchClass()
  }

  const enrolled = useMemo(
    () =>
      karateClass
        ? students.filter((s) => karateClass.enrolledStudentIds.includes(s.id))
        : [],
    [karateClass, students]
  )

  if (loading) return <LoadingState rows={5} />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!karateClass)
    return (
      <EmptyState
        title="Clase no encontrada"
        description="Puede que haya sido eliminada o el enlace sea incorrecto."
        action={
          <Button asChild variant="outline">
            <Link href="/d/classes">Volver a clases</Link>
          </Button>
        }
      />
    )

  const c = karateClass
  const nextSession = nextSessionDate(c.schedules)
  const presentCount =
    lastSession?.records.filter((r) => r.present).length ?? 0
  const absentCount = (lastSession?.records.length ?? 0) - presentCount

  return (
    <div>
      <ModuleHeader title={c.name} description="Detalle de la clase.">
        <Button variant="outline" asChild>
          <Link href="/d/classes">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/d/classes/${c.slug}/edit`}>
            <IconPencil className="size-4" />
            Editar
          </Link>
        </Button>
      </ModuleHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4 sm:p-6 md:col-span-2 md:row-span-2">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-2xl leading-tight tracking-tight">
                {c.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Instructor: {c.instructorName}
              </p>
            </div>
            <Badge variant="secondary">{styleLabel[c.style]}</Badge>
          </div>

          <dl className="mt-7 grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <dt className="disp text-[10px] text-muted-foreground">
                Horario
              </dt>
              <dd className="text-sm">{formatSchedule(c.schedules)}</dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="disp text-[10px] text-muted-foreground">Cupo</dt>
              <dd className="text-sm">
                {c.enrolledStudentIds.length}
                {c.capacity ? ` / ${c.capacity}` : ""}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="p-4 sm:p-6 md:col-span-2 md:row-span-2">
          <Eyebrow>Alumnos inscritos</Eyebrow>
          {enrolled.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Sin alumnos inscritos.
            </p>
          ) : (
            <div className="mt-4 flex flex-col divide-y">
              {enrolled.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <IconUser className="size-4" />
                  </span>
                  <p className="min-w-0 flex-1 truncate font-medium">
                    {s.firstName} {s.lastName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 sm:p-6 md:col-span-2">
          <Eyebrow>Próxima clase</Eyebrow>
          {nextSession ? (
            <>
              <p className="mt-3 text-sm">
                {nextSession.toLocaleDateString("es", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                ·{" "}
                {nextSession.toLocaleTimeString("es", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <Button className="mt-4" asChild>
                <Link href={`/d/classes/${c.slug}/attendance`}>
                  <IconCalendarEvent className="size-4" />
                  Iniciar toma de asistencia
                </Link>
              </Button>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Sin horarios configurados.
            </p>
          )}
        </Card>

        <Card className="p-4 sm:p-6 md:col-span-2">
          <Eyebrow>Asistencia</Eyebrow>
          {lastSession ? (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                Última sesión registrada: {lastSession.date}
              </p>
              <p className="mt-1 text-sm">
                {presentCount} presentes · {absentCount} ausentes
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <Link href={`/d/classes/${c.slug}/attendance`}>
                  <IconClipboardCheck className="size-4" />
                  Ver / editar
                </Link>
              </Button>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Aún no hay asistencia registrada para esta clase.
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
