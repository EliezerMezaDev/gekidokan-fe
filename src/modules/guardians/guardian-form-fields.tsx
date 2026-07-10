import type { UseFormReturn } from "react-hook-form"
import type { GuardianInput } from "@/shared/schemas/guardians"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"

// Grupo de campos del representante, reutilizado por el alta y la edición
// (una sola vista en ambos casos, sin wizard).

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

export function GuardianFormFields({
  form,
}: {
  form: UseFormReturn<GuardianInput>
}) {
  const {
    register,
    formState: { errors },
  } = form
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="firstName">Nombre</Label>
        <Input id="firstName" {...register("firstName")} />
        <FieldError message={errors.firstName?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="lastName">Apellido</Label>
        <Input id="lastName" {...register("lastName")} />
        <FieldError message={errors.lastName?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          type="email"
          placeholder="opcional"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input id="phone" placeholder="opcional" {...register("phone")} />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="nationalId">Cédula</Label>
        <Input
          id="nationalId"
          placeholder="opcional"
          {...register("nationalId")}
        />
      </div>
    </div>
  )
}
