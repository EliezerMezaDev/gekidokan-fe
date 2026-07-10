"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import {
  tuitionSchemeInputSchema,
  type TuitionScheme,
  type TuitionSchemeInput,
} from "@/shared/schemas/billing"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { Separator } from "@/shadcn/separator"
import { getSchemeBySlug, updateScheme } from "./api"
import { SchemeFormFields } from "./scheme-form-fields"

// Edición de esquema de mensualidad: mismos campos que el alta, en una sola
// vista, con los valores precargados.

function toInput(s: TuitionScheme): TuitionSchemeInput {
  return {
    name: s.name,
    amountUsd: s.amountUsd,
    cutoffDay: s.cutoffDay,
    dueDay: s.dueDay,
    status: s.status,
  }
}

export function SchemeEditForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [scheme, setScheme] = useState<TuitionScheme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<TuitionSchemeInput>({
    resolver: zodResolver(tuitionSchemeInputSchema),
  })

  function fetchScheme() {
    getSchemeBySlug(slug)
      .then((s) => {
        setScheme(s)
        if (s) form.reset(toInput(s))
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchScheme()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function retry() {
    setLoading(true)
    setError(null)
    fetchScheme()
  }

  async function onSubmit(values: TuitionSchemeInput) {
    try {
      const updated = await updateScheme(slug, values)
      toast.success("Cambios guardados")
      router.push(`/d/billing/schemes`)
      void updated
    } catch {
      toast.error("No se pudieron guardar los cambios. Intenta de nuevo.")
    }
  }

  if (loading) return <LoadingState rows={5} />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!scheme)
    return (
      <EmptyState
        title="Esquema no encontrado"
        description="Puede que haya sido eliminado o el enlace sea incorrecto."
        action={
          <Button asChild variant="outline">
            <Link href="/d/billing/schemes">Volver a esquemas</Link>
          </Button>
        }
      />
    )

  return (
    <div>
      <ModuleHeader
        title={`Editar: ${scheme.name}`}
        description="Modifica los datos del esquema de mensualidad."
      >
        <Button variant="outline" asChild>
          <Link href="/d/billing/schemes">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="flex flex-col gap-4 p-6 md:col-span-4">
            <h2 className="disp text-[11px] text-muted-foreground">
              Datos del esquema
            </h2>
            <SchemeFormFields form={form} />
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href="/d/billing/schemes">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}
