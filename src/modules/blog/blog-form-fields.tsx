"use client"

import { useState } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"
import type { BlogPostInput } from "@/shared/schemas/public"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import { Badge } from "@/shadcn/badge"
import { Switch } from "@/shadcn/switch"
import { IconX } from "@tabler/icons-react"
import { MarkdownEditor } from "./markdown-editor"

// Grupos de campos del post, reutilizados por el alta y la edición. Cada
// grupo recibe el form de react-hook-form; el contenedor decide el layout.

type Props = { form: UseFormReturn<BlogPostInput> }

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

// Datos básicos: título, categoría, resumen, portada, fecha de publicación.
export function MetaFields({ form }: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = form
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          placeholder="Título de la publicación"
          {...register("title")}
        />
        <FieldError message={errors.title?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Categoría</Label>
        <Input
          id="category"
          placeholder="p. ej. Noticias, Técnica, Eventos"
          {...register("category")}
        />
        <FieldError message={errors.category?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="publishedAt">Fecha de publicación</Label>
        {/* z.iso.datetime() exige ISO completo; el <input type="date"> solo
            entrega YYYY-MM-DD, así que se convierte en ambas direcciones. */}
        <Controller
          control={control}
          name="publishedAt"
          render={({ field }) => (
            <Input
              id="publishedAt"
              type="date"
              value={field.value ? field.value.slice(0, 10) : ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value
                    ? new Date(`${e.target.value}T00:00:00.000Z`).toISOString()
                    : ""
                )
              }
            />
          )}
        />
        <FieldError message={errors.publishedAt?.message} />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="coverImage">Imagen de portada (URL)</Label>
        <Input
          id="coverImage"
          placeholder="opcional"
          {...register("coverImage")}
        />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="excerpt">Resumen</Label>
        <Input
          id="excerpt"
          placeholder="Resumen corto para el listado"
          {...register("excerpt")}
        />
        <FieldError message={errors.excerpt?.message} />
      </div>
    </div>
  )
}

// Etiquetas: input de texto que agrega chips removibles con Enter/coma.
export function TagsField({ form }: Props) {
  const { control } = form
  const [draft, setDraft] = useState("")

  return (
    <Controller
      control={control}
      name="tags"
      render={({ field }) => {
        function addTag() {
          const tag = draft.trim()
          if (tag && !field.value.includes(tag)) {
            field.onChange([...field.value, tag])
          }
          setDraft("")
        }
        return (
          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">Etiquetas</Label>
            <Input
              id="tags"
              placeholder="Escribe y presiona Enter"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault()
                  addTag()
                }
              }}
              onBlur={addTag}
            />
            {field.value.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {field.value.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      aria-label={`Quitar ${tag}`}
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                      onClick={() =>
                        field.onChange(field.value.filter((t) => t !== tag))
                      }
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        )
      }}
    />
  )
}

// Visibilidad: switch público/privado.
export function VisibilityField({ form }: Props) {
  const { control } = form
  return (
    <Controller
      control={control}
      name="isPublic"
      render={({ field }) => (
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm">
          <Switch checked={field.value} onCheckedChange={field.onChange} />
          {field.value ? "Público (visible en el portal)" : "Privado (borrador)"}
        </label>
      )}
    />
  )
}

// Contenido: editor markdown con vista previa.
export function BodyField({ form }: Props) {
  const {
    control,
    formState: { errors },
  } = form
  return (
    <Controller
      control={control}
      name="bodyMarkdown"
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <Label>Contenido</Label>
          <MarkdownEditor value={field.value} onChange={field.onChange} />
          <FieldError message={errors.bodyMarkdown?.message} />
        </div>
      )}
    />
  )
}
