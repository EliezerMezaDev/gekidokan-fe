"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import {
  studentInputSchema,
  type Student,
  type StudentInput,
} from "@/shared/schemas/students"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { Separator } from "@/shadcn/separator"
import { getStudentBySlug, updateStudent } from "./api"
import {
  BasicFields,
  AcademicFields,
  AccessFields,
} from "./student-form-fields"

// Edición de alumno: mismos grupos de campos que el alta, pero en una sola vista
// (sin pasos) y con los valores precargados del alumno.

function toInput(s: Student): StudentInput {
  return {
    firstName: s.firstName,
    lastName: s.lastName,
    belt: s.belt,
    status: s.status,
    email: s.email ?? "",
    phone: s.phone ?? "",
    birthDate: s.birthDate,
    guardianId: s.guardianId,
    guardianRelationship: s.guardianRelationship,
    guardianName: s.guardianName ?? "",
    height: s.height,
    weight: s.weight,
    enabledContent: s.enabledContent,
    accessUsername: s.accessUsername ?? "",
  }
}

export function StudentEditForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<StudentInput>({
    resolver: zodResolver(studentInputSchema),
  })

  function fetchStudent() {
    getStudentBySlug(slug)
      .then((s) => {
        setStudent(s)
        if (s) form.reset(toInput(s))
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

  async function onSubmit(values: StudentInput) {
    try {
      const updated = await updateStudent(slug, values)
      toast.success("Cambios guardados")
      router.push(`/d/students/${updated.slug}`)
    } catch {
      toast.error("No se pudieron guardar los cambios. Intenta de nuevo.")
    }
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

  return (
    <div>
      <ModuleHeader
        title={`Editar: ${student.firstName} ${student.lastName}`}
        description="Modifica los datos del alumno."
      >
        <Button variant="outline" asChild>
          <Link href={`/d/students/${student.slug}`}>
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="flex flex-col gap-4 p-6 md:col-span-2">
            <h2 className="disp text-[11px] text-muted-foreground">
              Datos básicos
            </h2>
            <BasicFields form={form} />
          </Card>
          <Card className="flex flex-col gap-4 p-6 md:col-span-2">
            <h2 className="disp text-[11px] text-muted-foreground">
              Datos académicos
            </h2>
            <AcademicFields form={form} />
          </Card>
          <Card className="flex flex-col gap-4 p-6 md:col-span-4">
            <h2 className="disp text-[11px] text-muted-foreground">
              Datos de acceso
            </h2>
            <AccessFields form={form} readOnlyAccess />
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href={`/d/students/${student.slug}`}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}
