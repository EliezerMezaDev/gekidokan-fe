"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"
import {
  blogPostInputSchema,
  type BlogPostAdmin,
  type BlogPostInput,
} from "@/shared/schemas/public"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { Separator } from "@/shadcn/separator"
import { getBlogPostBySlug, createBlogPost, updateBlogPost } from "./api"
import {
  MetaFields,
  TagsField,
  VisibilityField,
  BodyField,
} from "./blog-form-fields"

// Formulario de post: sirve tanto para alta como edición (prop `slug` la
// distingue, mismo criterio que "grupos de campos compartidos" de CLAUDE.md).
// En alta no hay slug ni carga previa; en edición se precargan los valores.

const emptyInput: BlogPostInput = {
  title: "",
  category: "",
  excerpt: "",
  bodyMarkdown: "",
  tags: [],
  isPublic: true,
  coverImage: "",
  publishedAt: new Date().toISOString(),
}

function toInput(p: BlogPostAdmin): BlogPostInput {
  return {
    title: p.title,
    category: p.category,
    excerpt: p.excerpt,
    bodyMarkdown: p.bodyMarkdown,
    tags: p.tags,
    isPublic: p.isPublic,
    coverImage: p.coverImage ?? "",
    publishedAt: p.publishedAt,
  }
}

export function BlogEditForm({ slug }: { slug?: string }) {
  const router = useRouter()
  const editing = Boolean(slug)
  const [post, setPost] = useState<BlogPostAdmin | null>(null)
  const [loading, setLoading] = useState(editing)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostInputSchema),
    defaultValues: emptyInput,
  })

  function fetchPost() {
    if (!slug) return
    getBlogPostBySlug(slug)
      .then((p) => {
        setPost(p)
        if (p) form.reset(toInput(p))
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function retry() {
    setLoading(true)
    setError(null)
    fetchPost()
  }

  async function onSubmit(values: BlogPostInput) {
    try {
      const saved =
        editing && slug
          ? await updateBlogPost(slug, values)
          : await createBlogPost(values)
      toast.success(editing ? "Cambios guardados" : "Publicación creada")
      router.push(`/d/blog/${saved.slug}`)
    } catch {
      toast.error("No se pudo guardar la publicación. Intenta de nuevo.")
    }
  }

  if (editing && loading) return <LoadingState rows={5} />
  if (editing && error) return <ErrorState message={error} onRetry={retry} />
  if (editing && !post)
    return (
      <EmptyState
        title="Publicación no encontrada"
        description="Puede que haya sido eliminada o el enlace sea incorrecto."
        action={
          <Button asChild variant="outline">
            <Link href="/d/blog">Volver al blog</Link>
          </Button>
        }
      />
    )

  return (
    <div>
      <ModuleHeader
        title={editing ? `Editar: ${post!.title}` : "Nueva publicación"}
        description={
          editing
            ? "Modifica los datos de la publicación."
            : "Crea una nueva publicación del blog."
        }
      >
        <Button variant="outline" asChild>
          <Link href={editing ? `/d/blog/${slug}` : "/d/blog"}>
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="flex flex-col gap-4 p-6 md:col-span-3">
            <h2 className="disp text-[11px] text-muted-foreground">
              Datos de la publicación
            </h2>
            <MetaFields form={form} />
          </Card>
          <Card className="flex flex-col gap-4 p-6 md:col-span-1">
            <h2 className="disp text-[11px] text-muted-foreground">
              Visibilidad y etiquetas
            </h2>
            <VisibilityField form={form} />
            <TagsField form={form} />
          </Card>
          <Card className="flex flex-col gap-4 p-6 md:col-span-4">
            <h2 className="disp text-[11px] text-muted-foreground">
              Contenido
            </h2>
            <BodyField form={form} />
          </Card>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href={editing ? `/d/blog/${slug}` : "/d/blog"}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Guardando…"
              : editing
                ? "Guardar cambios"
                : "Crear publicación"}
          </Button>
        </div>
      </form>
    </div>
  )
}
