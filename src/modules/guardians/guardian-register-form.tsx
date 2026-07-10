"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import { guardianInputSchema, type GuardianInput } from "@/shared/schemas/guardians"
import { ModuleHeader } from "@/shared/components/module-header"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { Separator } from "@/shadcn/separator"
import { createGuardian } from "./api"
import { GuardianFormFields } from "./guardian-form-fields"

// Alta de representante en una sola vista (sin wizard, a diferencia de
// alumnos): el modelo es más simple, no hay cintas ni contenido.

export function GuardianRegisterForm() {
  const router = useRouter()
  const form = useForm<GuardianInput>({
    resolver: zodResolver(guardianInputSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationalId: "",
    },
  })

  async function onSubmit(values: GuardianInput) {
    try {
      await createGuardian(values)
      toast.success("Representante registrado")
      router.push("/d/guardians")
    } catch {
      toast.error("No se pudo registrar al representante. Intenta de nuevo.")
    }
  }

  return (
    <div>
      <ModuleHeader
        title="Nuevo representante"
        description="Registra un representante para vincularlo a un alumno."
      >
        <Button variant="outline" asChild>
          <Link href="/d/guardians">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Card className="flex flex-col gap-4 p-6">
          <GuardianFormFields form={form} />
        </Card>

        <Separator className="my-6" />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href="/d/guardians">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Registrando…" : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  )
}
