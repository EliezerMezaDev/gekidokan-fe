"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft, IconCheck } from "@tabler/icons-react"
import {
  studentInputSchema,
  type StudentInput,
} from "@/shared/schemas/students"
import { cn } from "@/shared/lib/utils"
import { ModuleHeader } from "@/shared/components/module-header"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { createStudent } from "./api"
import {
  BasicFields,
  AcademicFields,
  AccessFields,
} from "./student-form-fields"

// Alta de alumno en 3 pasos. Cada paso valida solo sus campos (trigger) antes de
// avanzar; el submit final crea el alumno y vuelve al listado. El stepper es
// numerado porque los pasos son una secuencia real.

const steps = [
  {
    label: "Datos básicos",
    fields: [
      "firstName",
      "lastName",
      "email",
      "birthDate",
      "guardianId",
      "guardianRelationship",
    ],
  },
  { label: "Datos académicos", fields: ["belt", "status", "enabledContent"] },
  { label: "Datos de acceso", fields: ["accessUsername"] },
] as const

function Stepper({
  step,
  onBackTo,
}: {
  step: number
  onBackTo: (i: number) => void
}) {
  return (
    <ol className="flex flex-col">
      {steps.map((s, i) => {
        const done = i < step
        const current = i === step
        return (
          <li key={s.label} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => (done ? onBackTo(i) : undefined)}
                disabled={!done}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full font-heading text-sm transition-colors",
                  current && "bg-primary text-primary-foreground",
                  done && "bg-foreground text-background hover:opacity-80",
                  !current && !done && "bg-muted text-muted-foreground"
                )}
              >
                {done ? <IconCheck className="size-4" /> : i + 1}
              </button>
              {i < steps.length - 1 ? (
                <span
                  className={cn(
                    "my-1 w-px flex-1",
                    i < step ? "bg-foreground" : "bg-border"
                  )}
                />
              ) : null}
            </div>
            <span
              className={cn(
                "disp pt-2 text-[10px] leading-tight",
                current ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function StudentWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const form = useForm<StudentInput>({
    resolver: zodResolver(studentInputSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      belt: "BLANCO",
      status: "ACTIVE",
      email: "",
      phone: "",
      birthDate: "",
      guardianId: undefined,
      guardianRelationship: undefined,
      guardianName: "",
      enabledContent: [],
      accessUsername: "",
    },
  })

  const isLast = step === steps.length - 1

  async function next() {
    const ok = await form.trigger(steps[step].fields)
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  async function onSubmit(values: StudentInput) {
    try {
      const student = await createStudent(values)
      toast.success(
        `Alumno registrado: ${student.firstName} ${student.lastName}`
      )
      router.push("/d/students")
    } catch {
      toast.error("No se pudo registrar el alumno. Intenta de nuevo.")
    }
  }

  return (
    <div>
      <ModuleHeader
        title="Nuevo alumno"
        description="Registra un alumno en tres pasos."
      >
        <Button variant="outline" asChild>
          <Link href="/d/students">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <Card className="grid gap-8 p-6 sm:p-8 md:grid-cols-[220px_1fr]">
        <Stepper step={step} onBackTo={setStep} />

        {/* noValidate: la validación la maneja Zod, no el navegador. */}
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          {step === 0 ? <BasicFields form={form} /> : null}
          {step === 1 ? <AcademicFields form={form} /> : null}
          {step === 2 ? <AccessFields form={form} /> : null}

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              disabled={step === 0}
            >
              Atrás
            </Button>
            {isLast ? (
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Registrando…"
                  : "Registrar alumno"}
              </Button>
            ) : (
              <Button type="button" onClick={next}>
                Siguiente
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}
