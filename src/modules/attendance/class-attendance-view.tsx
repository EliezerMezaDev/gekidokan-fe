"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import type { KarateClass, AttendanceRecord } from "@/shared/schemas/classes"
import type { Student } from "@/shared/schemas/students"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { Label } from "@/shadcn/label"
import { Checkbox } from "@/shadcn/checkbox"
import { Input } from "@/shadcn/input"
import { Textarea } from "@/shadcn/textarea"
import { getClassBySlug } from "@/modules/classes/api"
import { getStudents } from "@/modules/students/api"
import { getAttendanceByClass, saveClassAttendance } from "./api"

// Vista dedicada de toma de asistencia de una clase. Migra la lógica que
// antes vivía embebida en class-detail.tsx, más el campo de notas del
// instructor a nivel de sesión (no existía en la UI anterior).

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function ClassAttendanceView({ slug }: { slug: string }) {
  const [karateClass, setKarateClass] = useState<KarateClass | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [date, setDate] = useState(todayISO())
  const [present, setPresent] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [instructorNotes, setInstructorNotes] = useState("")
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

  // Al cambiar la fecha (o cargar la clase), trae la sesión existente para
  // esa fecha si hay, así se puede editar en vez de sobreescribir.
  useEffect(() => {
    if (!karateClass) return
    getAttendanceByClass(karateClass.id, date).then((session) => {
      const s = Array.isArray(session) ? undefined : session
      if (s) {
        setPresent(
          Object.fromEntries(s.records.map((r) => [r.studentId, r.present]))
        )
        setNotes(
          Object.fromEntries(s.records.map((r) => [r.studentId, r.notes ?? ""]))
        )
        setInstructorNotes(s.instructorNotes ?? "")
      } else {
        setPresent({})
        setNotes({})
        setInstructorNotes("")
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [karateClass, date])

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

  async function handleSave() {
    if (!karateClass) return
    setSaving(true)
    try {
      const records: AttendanceRecord[] = enrolled.map((s) => ({
        studentId: s.id,
        present: present[s.id] ?? false,
        notes: notes[s.id]?.trim() || undefined,
      }))
      await saveClassAttendance(
        karateClass.id,
        date,
        records,
        instructorNotes.trim() || undefined
      )
      toast.success("Asistencia guardada.")
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
      <ModuleHeader
        title={`Asistencia · ${c.name}`}
        description="Marca los alumnos presentes y agrega notas de la sesión."
      >
        <Button variant="outline" asChild>
          <Link href={`/d/classes/${c.slug}`}>
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <div className="grid grid-cols-1 gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="text-sm text-muted-foreground">Fecha de la sesión.</p>
            <div className="flex flex-col gap-2">
              <Label htmlFor="attendance-date">Fecha</Label>
              <Input
                id="attendance-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-40"
              />
            </div>
          </div>

          {enrolled.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No hay alumnos inscritos para tomar asistencia.
            </p>
          ) : (
            <div className="mt-4 flex flex-col divide-y">
              {enrolled.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <label className="flex flex-1 cursor-pointer items-center gap-2.5 text-sm">
                    <Checkbox
                      checked={present[s.id] ?? false}
                      onCheckedChange={(on) =>
                        setPresent((prev) => ({ ...prev, [s.id]: on === true }))
                      }
                    />
                    {s.firstName} {s.lastName}
                  </label>
                  <Input
                    placeholder="Nota (p. ej. llegó tarde)"
                    value={notes[s.id] ?? ""}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [s.id]: e.target.value }))
                    }
                    className="sm:w-64"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <Label htmlFor="instructor-notes">Notas del instructor</Label>
            <Textarea
              id="instructor-notes"
              placeholder="Observaciones generales de la sesión…"
              value={instructorNotes}
              onChange={(e) => setInstructorNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving || enrolled.length === 0}
            >
              {saving ? "Guardando…" : "Guardar asistencia"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
