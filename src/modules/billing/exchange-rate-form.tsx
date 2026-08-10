"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  exchangeRateInputSchema,
  type ExchangeRate,
  type ExchangeRateInput,
} from "@/shared/schemas/billing"
import { Card } from "@/shadcn/card"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import { Button } from "@/shadcn/button"
import { createExchangeRate } from "./api"

// Alta inline de tasa de cambio. Al crear, avisa a la vista para refrescar la
// lista. Usa inputs de fecha nativos (ponytail: sin date-picker propio).

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

export function ExchangeRateForm({
  onCreated,
}: {
  onCreated: (rate: ExchangeRate) => void
}) {
  const form = useForm<ExchangeRateInput>({
    resolver: zodResolver(exchangeRateInputSchema),
    defaultValues: {
      rate: 0,
      validFrom: new Date().toISOString().slice(0, 10),
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  async function onSubmit(values: ExchangeRateInput) {
    try {
      const created = await createExchangeRate(values)
      toast.success("Tasa registrada")
      reset({ rate: 0, validFrom: values.validFrom, validUntil: undefined })
      onCreated(created)
    } catch {
      toast.error("No se pudo registrar la tasa. Intenta de nuevo.")
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rate">Tasa (local por USD)</Label>
            <Input
              id="rate"
              type="number"
              step="0.0001"
              placeholder="Ej. 36.50"
              {...register("rate", { valueAsNumber: true })}
            />
            <FieldError message={errors.rate?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="validFrom">Vigente desde</Label>
            <Input
              id="validFrom"
              type="date"
              placeholder="aaaa-mm-dd"
              {...register("validFrom")}
            />
            <FieldError message={errors.validFrom?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="validUntil">Vigente hasta (opcional)</Label>
            <Input
              id="validUntil"
              type="date"
              placeholder="aaaa-mm-dd"
              {...register("validUntil", {
                setValueAs: (v) => (v === "" ? undefined : v),
              })}
            />
            <FieldError message={errors.validUntil?.message} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando…" : "Registrar tasa"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
