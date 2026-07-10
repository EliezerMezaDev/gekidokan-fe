"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import {
  syllabusItemInputSchema,
  type SyllabusItemInput,
} from "@/shared/schemas/content"
import { ModuleHeader } from "@/shared/components/module-header"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { Separator } from "@/shadcn/separator"
import { createSyllabusItem } from "./api"
import { ContentFormFields } from "./content-form-fields"

// Alta de contenido en una sola vista (sin wizard, estilo guardians).

export function ContentRegisterForm() {
  const router = useRouter()
  const form = useForm<SyllabusItemInput>({
    resolver: zodResolver(syllabusItemInputSchema),
    defaultValues: {
      title: "",
      type: "KATA",
      minBeltRank: "BLANCO",
      style: "SHOTOKAN",
      videoUrl: "",
      bodyMarkdown: "",
    },
  })

  async function onSubmit(values: SyllabusItemInput) {
    try {
      await createSyllabusItem(values)
      toast.success("Contenido registrado")
      router.push("/d/content")
    } catch {
      toast.error("No se pudo registrar el contenido. Intenta de nuevo.")
    }
  }

  return (
    <div>
      <ModuleHeader
        title="Nuevo contenido"
        description="Registra un elemento del syllabus programático."
      >
        <Button variant="outline" asChild>
          <Link href="/d/content">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Card className="flex flex-col gap-4 p-6">
          <ContentFormFields form={form} />
        </Card>

        <Separator className="my-6" />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href="/d/content">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Registrando…" : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  )
}
