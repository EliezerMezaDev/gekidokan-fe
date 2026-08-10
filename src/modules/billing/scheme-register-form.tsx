"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import {
  tuitionSchemeInputSchema,
  type TuitionSchemeInput,
} from "@/shared/schemas/billing"
import { ModuleHeader } from "@/shared/components/module-header"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { createScheme } from "./api"
import { SchemeFormFields } from "./scheme-form-fields"

// Alta de esquema de mensualidad en una sola vista (sin wizard, estilo
// guardians).

export function SchemeRegisterForm() {
  const router = useRouter()
  const form = useForm<TuitionSchemeInput>({
    resolver: zodResolver(tuitionSchemeInputSchema),
    defaultValues: {
      name: "",
      amountUsd: 0,
      cutoffDay: 25,
      dueDay: 5,
      status: "DRAFT",
    },
  })

  async function onSubmit(values: TuitionSchemeInput) {
    try {
      await createScheme(values)
      toast.success("Esquema registrado")
      router.push("/d/billing/schemes")
    } catch {
      toast.error("No se pudo registrar el esquema. Intenta de nuevo.")
    }
  }

  return (
    <div>
      <ModuleHeader
        title="Nuevo esquema de mensualidad"
        description="Define un plan de cobro para asignarlo a alumnos."
      >
        <Button variant="outline" asChild>
          <Link href="/d/billing/schemes">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Card className="flex flex-col gap-4 p-6">
          <SchemeFormFields form={form} />
        </Card>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href="/d/billing/schemes">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Registrando…" : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  )
}
