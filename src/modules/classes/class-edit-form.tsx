"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import {
  classInputSchema,
  type KarateClass,
  type ClassInput,
} from "@/shared/schemas/classes"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { Separator } from "@/shadcn/separator"
import { getClassBySlug, updateClass } from "./api"
import {
  ClassBasicFields,
  ClassScheduleFields,
  ClassEnrollmentFields,
} from "./class-form-fields"

// Edición de clase: mismos campos que el alta, en una sola vista, con los
// valores precargados.

function toInput(c: KarateClass): ClassInput {
  return {
    name: c.name,
    style: c.style,
    instructorName: c.instructorName,
    capacity: c.capacity,
    schedules: c.schedules,
    enrolledStudentIds: c.enrolledStudentIds,
  }
}

export function ClassEditForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [karateClass, setKarateClass] = useState<KarateClass | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ClassInput>({
    resolver: zodResolver(classInputSchema),
  })

  function fetchClass() {
    getClassBySlug(slug)
      .then((c) => {
        setKarateClass(c)
        if (c) form.reset(toInput(c))
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

  async function onSubmit(values: ClassInput) {
    try {
      const updated = await updateClass(slug, values)
      toast.success("Cambios guardados")
      router.push(`/d/classes/${updated.slug}`)
    } catch {
      toast.error("No se pudieron guardar los cambios. Intenta de nuevo.")
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

  return (
    <div>
      <ModuleHeader
        title={`Editar: ${karateClass.name}`}
        description="Modifica los datos, el horario y los inscritos de la clase."
      >
        <Button variant="outline" asChild>
          <Link href={`/d/classes/${karateClass.slug}`}>
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="flex flex-col gap-4 p-6 md:col-span-4">
            <h2 className="disp text-[11px] text-muted-foreground">Datos</h2>
            <ClassBasicFields form={form} />
          </Card>
          <Card className="flex flex-col gap-4 p-6 md:col-span-4">
            <h2 className="disp text-[11px] text-muted-foreground">Horarios</h2>
            <ClassScheduleFields form={form} />
          </Card>
          <Card className="flex flex-col gap-4 p-6 md:col-span-4">
            <h2 className="disp text-[11px] text-muted-foreground">
              Inscripción
            </h2>
            <ClassEnrollmentFields form={form} />
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href={`/d/classes/${karateClass.slug}`}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}
