"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  IconPencil,
  IconArrowLeft,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react"
import type { Student } from "@/shared/schemas/students"
import type { Measurement, AttendanceSession } from "@/shared/schemas/attendance"
import type { KarateClass } from "@/shared/schemas/classes"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"
import { relationshipLabel } from "@/modules/guardians/relationship"
import { calcAge } from "@/shared/lib/age"
import { getMeasurements, getAttendanceByStudent } from "@/modules/attendance/api"
import { getClasses } from "@/modules/classes/api"
import { formatSchedule } from "@/modules/classes/class-labels"
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

// Indicador de variación entre la última y penúltima medición (flecha + delta).
function DeltaBadge({ delta, unit }: { delta: number; unit: string }) {
  if (delta === 0) return null
  const up = delta > 0
  const Icon = up ? IconArrowUp : IconArrowDown
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs ${up ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
    >
      <Icon className="size-3.5" />
      {Math.abs(delta).toFixed(1)} {unit} desde la última medición
    </span>
  )
}

// Card fusionada Altura/Peso: snapshot actual + varianza vs. la medición previa.
function MeasuresCard({
  height,
  weight,
  measurements,
}: {
  height?: number
  weight?: number
  measurements: Measurement[]
}) {
  const sorted = [...measurements].sort((a, b) => a.date.localeCompare(b.date))
  const last = sorted.at(-1)
  const prev = sorted.at(-2)
  const heightDelta =
    prev && last?.height !== undefined && prev.height !== undefined
      ? last.height - prev.height
      : undefined
  const weightDelta =
    prev && last?.weight !== undefined && prev.weight !== undefined
      ? last.weight - prev.weight
      : undefined

  return (
    <Card className="flex flex-col gap-3 p-4 sm:p-6">
      <Eyebrow>Medidas</Eyebrow>
      <div className="flex items-end gap-6">
        <p className="font-heading text-3xl tracking-tight">
          {height ?? "—"}
          {height ? (
            <span className="ml-1 text-base text-muted-foreground">cm</span>
          ) : null}
        </p>
        <p className="font-heading text-3xl tracking-tight">
          {weight ?? "—"}
          {weight ? (
            <span className="ml-1 text-base text-muted-foreground">kg</span>
          ) : null}
        </p>
      </div>
      {heightDelta !== undefined ? (
        <DeltaBadge delta={heightDelta} unit="cm" />
      ) : null}
      {weightDelta !== undefined ? (
        <DeltaBadge delta={weightDelta} unit="kg" />
      ) : null}
    </Card>
  )
}

// Clases en las que aparece inscrito el alumno (según enrolledStudentIds).
function ClassesCard({ classes }: { classes: KarateClass[] }) {
  return (
    <Card className="flex flex-col gap-3 p-4 sm:p-6">
      <Eyebrow>Clases inscritas</Eyebrow>
      {classes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sin clases inscritas.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {classes.map((c) => (
            <li key={c.id}>
              <Link
                href={`/d/classes/${c.slug}`}
                className="block text-sm hover:underline"
              >
                {c.name}
                <span className="block text-xs text-muted-foreground">
                  {c.instructorName} · {formatSchedule(c.schedules)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

// Últimas ~5 asistencias del alumno, con link al historial completo.
function AttendanceCard({
  sessions,
  studentId,
  studentSlug,
}: {
  sessions: AttendanceSession[]
  studentId: string
  studentSlug: string
}) {
  const recent = [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <Card className="flex flex-col gap-3 p-4 sm:p-6 md:col-span-2">
      <Eyebrow>Últimas asistencias</Eyebrow>
      {recent.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin registros aún.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recent.map((session) => {
            const record = session.records.find(
              (r) => r.studentId === studentId
            )
            return (
              <li
                key={session.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span>{dateFmt.format(new Date(session.date))}</span>
                <span className="flex items-center gap-2">
                  {record?.notes ? (
                    <span className="text-xs text-muted-foreground">
                      {record.notes}
                    </span>
                  ) : null}
                  <Badge
                    variant={record?.present ? "default" : "secondary"}
                    className={
                      record?.present
                        ? "bg-green-600/15 text-green-700 dark:text-green-400"
                        : ""
                    }
                  >
                    {record?.present ? "Presente" : "Ausente"}
                  </Badge>
                </span>
              </li>
            )
          })}
        </ul>
      )}
      <Link
        href={`/d/students/${studentSlug}/attendance`}
        className="text-xs text-muted-foreground hover:underline"
      >
        Ver historial completo →
      </Link>
    </Card>
  )
}

export function StudentDetail({ slug }: { slug: string }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [classes, setClasses] = useState<KarateClass[]>([])
  const [attendance, setAttendance] = useState<AttendanceSession[]>([])

  function fetchStudent() {
    getStudentBySlug(slug)
      .then((s) => {
        setStudent(s)
        // ponytail: se cargan en paralelo, no bloquean el estado de loading
        // principal (que solo depende del alumno).
        if (s) {
          Promise.all([
            getMeasurements(s.id),
            getClasses(),
            getAttendanceByStudent(s.id),
          ]).then(([m, c, a]) => {
            setMeasurements(m)
            setClasses(c)
            setAttendance(a)
          })
        }
      })
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
        <Card className="p-4 sm:p-6 md:col-span-2 md:row-span-2">
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

          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field label="Correo de contacto" value={s.email ?? "—"} />
            <Field label="Teléfono" value={s.phone ?? "—"} />
            <Field
              label="Fecha de nacimiento"
              value={`${dateFmt.format(new Date(s.birthDate))} (${calcAge(s.birthDate)} años)`}
            />
            <Field
              label="Representante"
              value={
                s.guardianName
                  ? `${s.guardianName}${s.guardianRelationship ? ` (${relationshipLabel[s.guardianRelationship]})` : ""}`
                  : "—"
              }
            />
            <Field label="Correo de acceso" value={s.accessUsername ?? "—"} />
          </dl>
        </Card>

        <Card className="p-4 sm:p-6 md:col-span-2">
          <Eyebrow>Grado</Eyebrow>
          <BeltProgress belt={s.belt} className="mt-3" />
        </Card>

        <MeasuresCard
          height={s.height}
          weight={s.weight}
          measurements={measurements}
        />
        <ClassesCard classes={classes.filter((c) => c.enrolledStudentIds.includes(s.id))} />

        <AttendanceCard
          sessions={attendance}
          studentId={s.id}
          studentSlug={s.slug}
        />

        <Card className="p-4 sm:p-6 md:col-span-4">
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
