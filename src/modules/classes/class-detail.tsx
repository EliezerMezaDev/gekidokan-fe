"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { IconPencil, IconArrowLeft, IconUser } from "@tabler/icons-react"
import { toast } from "sonner"
import type { KarateClass, AttendanceRecord } from "@/shared/schemas/classes"
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
import { Label } from "@/shadcn/label"
import { Checkbox } from "@/shadcn/checkbox"
import { Separator } from "@/shadcn/separator"
import { getClassBySlug, saveAttendance } from "./api"
import { getStudents } from "@/modules/students/api"
import { styleLabel, formatSchedule } from "./class-labels"

// Ficha de detalle (solo lectura salvo la asistencia) de la clase. Bento
// full-width; la edición vive en la ruta hermana /edit.

function Eyebrow({ children }: { children: string }) {
  return <p className="disp text-[11px] text-muted-foreground">{children}</p>
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function ClassDetail({ slug }: { slug: string }) {
  const [karateClass, setKarateClass] = useState<KarateClass | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ponytail: asistencia en estado local; no persiste entre recargas (el mock
  // solo hace eco + toast).
  const [date, setDate] = useState(todayISO())
  const [present, setPresent] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)

  function fetchClass() {
    Promise.all([getClassBySlug(slug), getStudents()])
      .then(([c, allStudents]) => {
        setKarateClass(c)
        setStudents(allStudents)
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

  async function handleSaveAttendance() {
    if (!karateClass) return
    setSaving(true)
    try {
      const records: AttendanceRecord[] = enrolled.map((s) => ({
        studentId: s.id,
        present: present[s.id] ?? false,
      }))
      await saveAttendance(karateClass.id, date, records)
    } catch {
      toast.error("No se pudo guardar la asistencia. Intenta de nuevo.")
    } finally {
      setSaving(false)
    }
  }

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
        <Card className="p-6 sm:p-8 md:col-span-2 md:row-span-2">
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

          <Separator className="my-7" />

          <dl className="grid gap-6 sm:grid-cols-2">
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

        <Card className="p-6 sm:p-8 md:col-span-2 md:row-span-2">
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

        <Card className="p-6 sm:p-8 md:col-span-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>Asistencia</Eyebrow>
              <p className="mt-1 text-sm text-muted-foreground">
                Marca los alumnos presentes para la fecha seleccionada.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="attendance-date">Fecha</Label>
              <input
                id="attendance-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 rounded-md border bg-transparent px-2 text-sm"
              />
            </div>
          </div>

          {enrolled.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No hay alumnos inscritos para tomar asistencia.
            </p>
          ) : (
            <>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {enrolled.map((s) => (
                  <label
                    key={s.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm"
                  >
                    <Checkbox
                      checked={present[s.id] ?? false}
                      onCheckedChange={(on) =>
                        setPresent((prev) => ({ ...prev, [s.id]: on === true }))
                      }
                    />
                    {s.firstName} {s.lastName}
                  </label>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleSaveAttendance} disabled={saving}>
                  {saving ? "Guardando…" : "Guardar asistencia"}
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
