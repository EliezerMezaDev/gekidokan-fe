"use client"

import { useEffect, useState } from "react"
import { Controller, useWatch, type UseFormReturn } from "react-hook-form"
import type { StudentInput } from "@/shared/schemas/students"
import { beltRankSchema } from "@/shared/schemas/students"
import {
  relationshipTypeSchema,
  type Guardian,
} from "@/shared/schemas/guardians"
import { isMinor } from "@/shared/lib/age"
import { getGuardians } from "@/modules/guardians/api"
import { relationshipLabel } from "@/modules/guardians/relationship"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import { Checkbox } from "@/shadcn/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/select"
import { beltLabel } from "./belt"
import { mockContent } from "./content-mock"

// Grupos de campos del alumno, reutilizados por el wizard de alta y el
// formulario de edición. Cada grupo recibe el form de react-hook-form; el
// contenedor decide si los muestra como pasos o en una sola vista.

type Props = { form: UseFormReturn<StudentInput> }

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

export function BasicFields({ form }: Props) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form
  const birthDate = useWatch({ control, name: "birthDate" })
  const minor = isMinor(birthDate)

  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [loadingGuardians, setLoadingGuardians] = useState(false)
  useEffect(() => {
    if (!minor) return
    setLoadingGuardians(true)
    getGuardians()
      .then(setGuardians)
      .finally(() => setLoadingGuardians(false))
  }, [minor])

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
        <Label htmlFor="email">Correo de contacto</Label>
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="birthDate">Fecha de nacimiento</Label>
        <Input id="birthDate" type="date" {...register("birthDate")} />
        <FieldError message={errors.birthDate?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="height">Altura (cm)</Label>
        <Input
          id="height"
          type="number"
          placeholder="opcional"
          {...register("height", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
        />
        <FieldError message={errors.height?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="weight">Peso (kg)</Label>
        <Input
          id="weight"
          type="number"
          placeholder="opcional"
          {...register("weight", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
        />
        <FieldError message={errors.weight?.message} />
      </div>

      {minor ? (
        <div className="flex flex-col gap-4 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="guardianId">Representante</Label>
            <Controller
              control={control}
              name="guardianId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(id) => {
                    field.onChange(id)
                    // ponytail: snapshot de display para evitar fetch en tablas.
                    const g = guardians.find((g) => g.id === id)
                    setValue(
                      "guardianName",
                      g ? `${g.firstName} ${g.lastName}` : ""
                    )
                  }}
                >
                  <SelectTrigger id="guardianId" className="w-full">
                    <SelectValue
                      placeholder={
                        loadingGuardians
                          ? "Cargando…"
                          : "Selecciona un representante"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {guardians.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.firstName} {g.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.guardianId?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="guardianRelationship">Relación</Label>
            <Controller
              control={control}
              name="guardianRelationship"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="guardianRelationship" className="w-full">
                    <SelectValue placeholder="Selecciona la relación" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipTypeSchema.options.map((r) => (
                      <SelectItem key={r} value={r}>
                        {relationshipLabel[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.guardianRelationship?.message} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function AcademicFields({ form }: Props) {
  const {
    control,
    formState: { errors },
  } = form
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="belt">Cinta</Label>
          <Controller
            control={control}
            name="belt"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="belt" className="w-full">
                  <SelectValue placeholder="Selecciona una cinta" />
                </SelectTrigger>
                <SelectContent>
                  {beltRankSchema.options.map((b) => (
                    <SelectItem key={b} value={b}>
                      {beltLabel[b]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
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
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Contenido programático habilitado</Label>
        {/* ponytail: catálogo mock; el acceso real por cinta llega con DT-05. */}
        <Controller
          control={control}
          name="enabledContent"
          render={({ field }) => (
            <div className="flex flex-col gap-4">
              {beltRankSchema.options.map((belt) => {
                const items = mockContent.filter((c) => c.belt === belt)
                if (items.length === 0) return null
                return (
                  <div key={belt} className="flex flex-col gap-2">
                    <p className="disp text-[10px] text-muted-foreground">
                      {beltLabel[belt]}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {items.map((c) => {
                        const checked = field.value.includes(c.id)
                        return (
                          <label
                            key={c.id}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(on) =>
                                field.onChange(
                                  on
                                    ? [...field.value, c.id]
                                    : field.value.filter((id) => id !== c.id)
                                )
                              }
                            />
                            {c.label}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        />
      </div>

      <FieldError message={errors.belt?.message} />
    </div>
  )
}

export function AccessFields({
  form,
  readOnlyAccess = false,
}: Props & { readOnlyAccess?: boolean }) {
  const {
    register,
    getValues,
    formState: { errors },
  } = form
  // ponytail: "deshabilitar acceso" es un control mock (no hay campo en el
  // schema aún); solo estado local hasta que el backend lo soporte.
  const [accessDisabled, setAccessDisabled] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="accessUsername">Correo / usuario de acceso</Label>
        <Input
          id="accessUsername"
          type="email"
          placeholder="alumno@correo.com"
          autoComplete="off"
          readOnly={readOnlyAccess}
          disabled={readOnlyAccess}
          {...register("accessUsername")}
        />
        <FieldError message={errors.accessUsername?.message} />
        <p className="text-xs text-muted-foreground">
          {readOnlyAccess
            ? "El correo de acceso no se edita aquí; usa el toggle para deshabilitarlo."
            : "Con este correo el alumno ingresará a su área personal."}
        </p>
      </div>
      {readOnlyAccess ? (
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm">
          <Checkbox
            checked={accessDisabled}
            onCheckedChange={(on) => setAccessDisabled(on === true)}
          />
          Deshabilitar acceso del alumno ({getValues("accessUsername")})
        </label>
      ) : null}
    </div>
  )
}
