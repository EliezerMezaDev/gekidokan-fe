import { Controller, type UseFormReturn } from "react-hook-form"
import {
  tuitionStatusSchema,
  type TuitionSchemeInput,
} from "@/shared/schemas/billing"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/select"
import { tuitionStatusLabel } from "./invoice-status"

// Grupo de campos del esquema de mensualidad, reutilizado por el alta y la
// edición (una sola vista en ambos casos, sin wizard).

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

export function SchemeFormFields({
  form,
}: {
  form: UseFormReturn<TuitionSchemeInput>
}) {
  const {
    register,
    control,
    formState: { errors },
  } = form
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="amountUsd">Monto (USD)</Label>
        <Input
          id="amountUsd"
          type="number"
          step="0.01"
          {...register("amountUsd", { valueAsNumber: true })}
        />
        <FieldError message={errors.amountUsd?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="status">Estado</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {tuitionStatusSchema.options.map((s) => (
                  <SelectItem key={s} value={s}>
                    {tuitionStatusLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="cutoffDay">Día de corte</Label>
        <Input
          id="cutoffDay"
          type="number"
          min={1}
          max={28}
          {...register("cutoffDay", { valueAsNumber: true })}
        />
        <FieldError message={errors.cutoffDay?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="dueDay">Día de vencimiento</Label>
        <Input
          id="dueDay"
          type="number"
          min={1}
          max={28}
          {...register("dueDay", { valueAsNumber: true })}
        />
        <FieldError message={errors.dueDay?.message} />
      </div>
    </div>
  )
}
