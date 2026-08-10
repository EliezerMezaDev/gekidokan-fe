"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  paymentInputSchema,
  type PaymentInput,
} from "@/shared/schemas/billing"
import { paymentMethodLabel } from "@/modules/billing/invoice-status"
import { createPayment } from "@/modules/billing/api"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import { Button } from "@/shadcn/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/select"

// Formulario controlado para que el alumno reporte un pago contra una
// factura. La validación real (marcar validated: true) es tarea del admin.

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

export function ReportPaymentForm({
  invoiceId,
  onReported,
}: {
  invoiceId: string
  onReported: () => void
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentInput>({
    resolver: zodResolver(paymentInputSchema),
    defaultValues: { method: "TRANSFER", reference: "", amount: 0, receiptUrl: "" },
  })

  async function onSubmit(values: PaymentInput) {
    try {
      await createPayment(invoiceId, values)
      toast.success("Pago reportado. Queda pendiente de validación.")
      onReported()
    } catch {
      toast.error("No se pudo reportar el pago. Intenta de nuevo.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="method">Método de pago</Label>
        <Controller
          control={control}
          name="method"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="method" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(paymentMethodLabel).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.method?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reference">Referencia</Label>
        <Input id="reference" placeholder="Nº de operación, recibo…" {...register("reference")} />
        <FieldError message={errors.reference?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Monto</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
        />
        <FieldError message={errors.amount?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="receiptUrl">Comprobante (URL, opcional)</Label>
        <Input id="receiptUrl" placeholder="https://…" {...register("receiptUrl")} />
        <FieldError message={errors.receiptUrl?.message} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? "Enviando…" : "Reportar pago"}
      </Button>
    </form>
  )
}
