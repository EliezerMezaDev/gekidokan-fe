"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { IconPencil, IconArrowLeft, IconArticle } from "@tabler/icons-react"
import type { BlogPostAdmin } from "@/shared/schemas/public"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"
import { getBlogPostBySlug } from "./api"
import { dateFmt } from "./labels"

// Ficha de detalle (solo lectura) del post. Ancho completo con bento grid; la
// edición vive en la ruta hermana /edit.

function Eyebrow({ children }: { children: string }) {
  return <p className="disp text-[11px] text-muted-foreground">{children}</p>
}

export function BlogDetail({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPostAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function fetchPost() {
    getBlogPostBySlug(slug)
      .then(setPost)
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

  if (loading) return <LoadingState rows={5} />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!post)
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

  const p = post
  return (
    <div>
      <ModuleHeader title={p.title} description="Detalle de la publicación.">
        <Button variant="outline" asChild>
          <Link href="/d/blog">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/d/blog/${p.slug}/edit`}>
            <IconPencil className="size-4" />
            Editar
          </Link>
        </Button>
      </ModuleHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="overflow-hidden p-0 md:col-span-4">
          <div className="relative aspect-16/6 w-full bg-muted">
            {p.coverImage ? (
              <Image
                src={p.coverImage}
                alt={p.title}
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-muted-foreground">
                <IconArticle className="size-10" />
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 p-4 sm:p-6">
            <Badge variant="secondary">{p.category}</Badge>
            {p.isPublic ? (
              <Badge className="bg-green-600/15 text-green-700 dark:text-green-400">
                Público
              </Badge>
            ) : (
              <Badge variant="secondary">Privado</Badge>
            )}
            <span className="text-sm text-muted-foreground">
              Publicado el {dateFmt.format(new Date(p.publishedAt))}
            </span>
          </div>
        </Card>

        <Card className="flex flex-col gap-3 p-4 sm:p-6 md:col-span-1">
          <Eyebrow>Resumen</Eyebrow>
          <p className="text-sm">{p.excerpt}</p>
        </Card>

        <Card className="flex flex-col gap-3 p-4 sm:p-6 md:col-span-1">
          <Eyebrow>Etiquetas</Eyebrow>
          {p.tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin etiquetas.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        <Card className="flex flex-col gap-3 p-4 sm:p-6 md:col-span-2">
          <Eyebrow>Metadatos</Eyebrow>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Slug</dt>
              <dd className="font-mono">{p.slug}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Creado</dt>
              <dd>{dateFmt.format(new Date(p.createdAt))}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-4 sm:p-6 md:col-span-4">
          <Eyebrow>Contenido</Eyebrow>
          <div className="mt-4 text-sm leading-7 [&_a]:text-primary [&_a]:underline [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:font-semibold [&_table]:w-full [&_td]:border [&_td]:p-1.5 [&_th]:border [&_th]:bg-muted [&_th]:p-1.5 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {p.bodyMarkdown}
            </ReactMarkdown>
          </div>
        </Card>
      </div>
    </div>
  )
}
