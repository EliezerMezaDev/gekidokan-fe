"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import { classInputSchema, type ClassInput } from "@/shared/schemas/classes"
import { ModuleHeader } from "@/shared/components/module-header"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { Separator } from "@/shadcn/separator"
import { createClass } from "./api"
import {
  ClassBasicFields,
  ClassScheduleFields,
  ClassEnrollmentFields,
} from "./class-form-fields"

// Alta de clase en una sola vista (sin wizard, estilo representantes).

export function ClassRegisterForm() {
  const router = useRouter()
  const form = useForm<ClassInput>({
    resolver: zodResolver(classInputSchema),
    defaultValues: {
      name: "",
      style: "SHOTOKAN",
      instructorName: "",
      schedules: [{ dayOfWeek: "MON", startTime: "18:00", endTime: "19:00" }],
      enrolledStudentIds: [],
    },
  })

  async function onSubmit(values: ClassInput) {
    try {
      await createClass(values)
      toast.success("Clase registrada")
      router.push("/d/classes")
    } catch {
      toast.error("No se pudo registrar la clase. Intenta de nuevo.")
    }
  }

  return (
    <div>
      <ModuleHeader
        title="Nueva clase"
        description="Registra una clase con su horario e inscritos."
      >
        <Button variant="outline" asChild>
          <Link href="/d/classes">
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
            <Link href="/d/classes">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Registrando…" : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  )
}
