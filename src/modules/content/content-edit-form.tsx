"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import {
  syllabusItemInputSchema,
  type SyllabusItem,
  type SyllabusItemInput,
} from "@/shared/schemas/content"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { Separator } from "@/shadcn/separator"
import { getSyllabusItemBySlug, updateSyllabusItem } from "./api"
import { ContentFormFields } from "./content-form-fields"

// Edición de contenido: mismos campos que el alta, en una sola vista, con los
// valores precargados.

function toInput(c: SyllabusItem): SyllabusItemInput {
  return {
    title: c.title,
    type: c.type,
    minBeltRank: c.minBeltRank,
    style: c.style,
    videoUrl: c.videoUrl ?? "",
    bodyMarkdown: c.bodyMarkdown ?? "",
  }
}

export function ContentEditForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [item, setItem] = useState<SyllabusItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SyllabusItemInput>({
    resolver: zodResolver(syllabusItemInputSchema),
  })

  function fetchItem() {
    getSyllabusItemBySlug(slug)
      .then((c) => {
        setItem(c)
        if (c) form.reset(toInput(c))
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchItem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function retry() {
    setLoading(true)
    setError(null)
    fetchItem()
  }

  async function onSubmit(values: SyllabusItemInput) {
    try {
      const updated = await updateSyllabusItem(slug, values)
      toast.success("Cambios guardados")
      router.push(`/d/content/${updated.slug}`)
    } catch {
      toast.error("No se pudieron guardar los cambios. Intenta de nuevo.")
    }
  }

  if (loading) return <LoadingState rows={5} />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!item)
    return (
      <EmptyState
        title="Contenido no encontrado"
        description="Puede que haya sido eliminado o el enlace sea incorrecto."
        action={
          <Button asChild variant="outline">
            <Link href="/d/content">Volver a contenido</Link>
          </Button>
        }
      />
    )

  return (
    <div>
      <ModuleHeader
        title={`Editar: ${item.title}`}
        description="Modifica los datos del contenido."
      >
        <Button variant="outline" asChild>
          <Link href={`/d/content/${item.slug}`}>
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="flex flex-col gap-4 p-6 md:col-span-4">
            <h2 className="disp text-[11px] text-muted-foreground">
              Datos del contenido
            </h2>
            <ContentFormFields form={form} />
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href={`/d/content/${item.slug}`}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  )
}
