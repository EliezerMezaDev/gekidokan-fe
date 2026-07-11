"use client"

import { useEffect, useState } from "react"
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import type { ClassInput } from "@/shared/schemas/classes"
import { classStyleSchema, dayOfWeekSchema } from "@/shared/schemas/classes"
import type { Student } from "@/shared/schemas/students"
import { getStudents } from "@/modules/students/api"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import { Button } from "@/shadcn/button"
import { Checkbox } from "@/shadcn/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/select"
import { styleLabel, dayLabel } from "./class-labels"

// Grupos de campos de la clase, reutilizados por el alta y la edición (una
// sola vista en ambos casos, sin wizard, igual que representantes).

type Props = { form: UseFormReturn<ClassInput> }

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

export function ClassBasicFields({ form }: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = form
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="style">Estilo</Label>
        <Controller
          control={control}
          name="style"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="style" className="w-full">
                <SelectValue placeholder="Selecciona un estilo" />
              </SelectTrigger>
              <SelectContent>
                {classStyleSchema.options.map((s) => (
                  <SelectItem key={s} value={s}>
                    {styleLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="instructorName">Instructor</Label>
        <Input id="instructorName" {...register("instructorName")} />
        <FieldError message={errors.instructorName?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="capacity">Cupo (opcional)</Label>
        <Input
          id="capacity"
          type="number"
          placeholder="opcional"
          {...register("capacity", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)),
          })}
        />
        <FieldError message={errors.capacity?.message} />
      </div>
    </div>
  )
}

// Editor de horarios: filas add/remove con Select de día + inputs nativos de
// hora. ponytail: <input type="time"> nativo en vez de un time-picker propio.
export function ClassScheduleFields({ form }: Props) {
  const {
    control,
    formState: { errors },
  } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  })

  return (
    <div className="flex flex-col gap-3">
      <Label>Horarios</Label>
      <FieldError message={errors.schedules?.message as string | undefined} />
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-wrap items-end gap-3 rounded-lg border p-3"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor={`day-${index}`}>Día</Label>
              <Controller
                control={control}
                name={`schedules.${index}.dayOfWeek`}
                render={({ field: f }) => (
                  <Select value={f.value} onValueChange={f.onChange}>
                    <SelectTrigger id={`day-${index}`} className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dayOfWeekSchema.options.map((d) => (
                        <SelectItem key={d} value={d}>
                          {dayLabel[d]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`start-${index}`}>Inicio</Label>
              <Controller
                control={control}
                name={`schedules.${index}.startTime`}
                render={({ field: f }) => (
                  <input
                    id={`start-${index}`}
                    type="time"
                    value={f.value}
                    onChange={f.onChange}
                    className="h-9 rounded-md border bg-transparent px-2 text-sm"
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`end-${index}`}>Fin</Label>
              <Controller
                control={control}
                name={`schedules.${index}.endTime`}
                render={({ field: f }) => (
                  <input
                    id={`end-${index}`}
                    type="time"
                    value={f.value}
                    onChange={f.onChange}
                    className="h-9 rounded-md border bg-transparent px-2 text-sm"
                  />
                )}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={() => remove(index)}
              aria-label="Quitar horario"
            >
              <IconTrash className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() =>
          append({ dayOfWeek: "MON", startTime: "18:00", endTime: "19:00" })
        }
      >
        <IconPlus className="size-4" />
        Agregar horario
      </Button>
    </div>
  )
}

// Inscripción de alumnos: lista de checkboxes cargando getStudents() (mismo
// patrón que enabledContent en el módulo de alumnos).
export function ClassEnrollmentFields({ form }: Props) {
  const { control } = form
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <Label>Alumnos inscritos</Label>
      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando alumnos…</p>
      ) : (
        <Controller
          control={control}
          name="enrolledStudentIds"
          render={({ field }) => (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {students.map((s) => {
                const checked = field.value.includes(s.id)
                return (
                  <label
                    key={s.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(on) =>
                        field.onChange(
                          on
                            ? [...field.value, s.id]
                            : field.value.filter((id) => id !== s.id)
                        )
                      }
                    />
                    {s.firstName} {s.lastName}
                  </label>
                )
              })}
            </div>
          )}
        />
      )}
    </div>
  )
}
