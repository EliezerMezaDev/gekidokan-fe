"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import {
  guardianInputSchema,
  type Guardian,
  type GuardianInput,
} from "@/shared/schemas/guardians"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { getGuardianBySlug, updateGuardian } from "./api"
import { GuardianFormFields } from "./guardian-form-fields"

// Edición de representante: mismos campos que el alta, en una sola vista, con
// los valores precargados.

function toInput(g: Guardian): GuardianInput {
  return {
    firstName: g.firstName,
    lastName: g.lastName,
    email: g.email ?? "",
    phone: g.phone ?? "",
    nationalId: g.nationalId ?? "",
  }
}

export function GuardianEditForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<GuardianInput>({
    resolver: zodResolver(guardianInputSchema),
  })

  function fetchGuardian() {
    getGuardianBySlug(slug)
      .then((g) => {
        setGuardian(g)
        if (g) form.reset(toInput(g))
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

  async function onSubmit(values: GuardianInput) {
    try {
      const updated = await updateGuardian(slug, values)
      toast.success("Cambios guardados")
      router.push(`/d/guardians/${updated.slug}`)
    } catch {
      toast.error("No se pudieron guardar los cambios. Intenta de nuevo.")
    }
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

  return (
    <div>
      <ModuleHeader
        title={`Editar: ${guardian.firstName} ${guardian.lastName}`}
        description="Modifica los datos del representante."
      >
        <Button variant="outline" asChild>
          <Link href={`/d/guardians/${guardian.slug}`}>
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="flex flex-col gap-4 p-6 md:col-span-4">
            <h2 className="disp text-[11px] text-muted-foreground">
              Datos del representante
            </h2>
            <GuardianFormFields form={form} />
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href={`/d/guardians/${guardian.slug}`}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}
