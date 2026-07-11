import { Controller, type UseFormReturn } from "react-hook-form"
import type { SyllabusItemInput } from "@/shared/schemas/content"
import {
  syllabusTypeSchema,
  contentStyleSchema,
} from "@/shared/schemas/content"
import { beltRankSchema } from "@/shared/schemas/students"
import { beltLabel } from "@/modules/students/belt"
import { mockSyllabusItems } from "./mock-data"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import { Textarea } from "@/shadcn/textarea"
import { Checkbox } from "@/shadcn/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/select"
import { syllabusTypeLabel, contentStyleLabel } from "./content-labels"

// Grupo de campos del contenido, reutilizado por el alta y la edición (una
// sola vista en ambos casos, sin wizard, estilo guardians).

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

export function ContentFormFields({
  form,
  excludeId,
}: {
  form: UseFormReturn<SyllabusItemInput>
  // En edición, el propio ítem se excluye para no permitir autoreferencia.
  excludeId?: string
}) {
  const {
    register,
    control,
    formState: { errors },
  } = form
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" {...register("title")} />
        <FieldError message={errors.title?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="type">Tipo</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {syllabusTypeSchema.options.map((t) => (
                    <SelectItem key={t} value={t}>
                      {syllabusTypeLabel[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="minBeltRank">Cinta mínima</Label>
          <Controller
            control={control}
            name="minBeltRank"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="minBeltRank" className="w-full">
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
                  {contentStyleSchema.options.map((s) => (
                    <SelectItem key={s} value={s}>
                      {contentStyleLabel[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="videoUrl">Enlace de video</Label>
        <Input
          id="videoUrl"
          type="url"
          placeholder="opcional"
          {...register("videoUrl")}
        />
        <FieldError message={errors.videoUrl?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bodyMarkdown">Cuerpo</Label>
        {/* ponytail: texto plano (sin lib de markdown); se renderiza con
            whitespace-pre-wrap en el detalle. */}
        <Textarea
          id="bodyMarkdown"
          rows={8}
          placeholder="opcional"
          {...register("bodyMarkdown")}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label>Prerrequisitos</Label>
        <p className="text-sm text-muted-foreground">
          Ítems que preceden a este en el árbol de progresión.
        </p>
        {/* ponytail: catálogo desde el mock; cambiar a fetch del backend cuando
            exista /content. Mismo patrón de checkbox por cinta que alumnos. */}
        <Controller
          control={control}
          name="prerequisites"
          render={({ field }) => (
            <div className="flex flex-col gap-4">
              {beltRankSchema.options.map((belt) => {
                const items = mockSyllabusItems.filter(
                  (c) => c.minBeltRank === belt && c.id !== excludeId
                )
                if (items.length === 0) return null
                return (
                  <div key={belt} className="flex flex-col gap-2">
                    <p className="disp text-[10px] text-muted-foreground">
                      {beltLabel[belt]}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {items.map((c) => {
                        const checked = field.value?.includes(c.id) ?? false
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
                                    ? [...(field.value ?? []), c.id]
                                    : (field.value ?? []).filter(
                                        (id) => id !== c.id
                                      )
                                )
                              }
                            />
                            {c.title}
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
    </div>
  )
}
