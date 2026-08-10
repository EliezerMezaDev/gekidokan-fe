"use client"

import { Fragment } from "react"
import Image from "next/image"
import { IconArticle, IconDotsVertical } from "@tabler/icons-react"
import type { BlogPostAdmin } from "@/shared/schemas/public"
import type { RowAction } from "@/shared/components/data-table"
import { Card } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu"
import { dateFmt } from "./labels"

// Tarjeta de publicación para la vista de grilla (dedicada). Muestra la
// portada si existe, con el mismo menú de acciones (⋯) que la fila de tabla.

export function BlogCard({
  post: p,
  actions,
}: {
  post: BlogPostAdmin
  actions: RowAction<BlogPostAdmin>[]
}) {
  return (
    <Card size="sm" className="gap-3 overflow-hidden rounded-xl pt-0">
      <div className="relative aspect-16/9 w-full shrink-0 bg-muted">
        {p.coverImage ? (
          <Image
            src={p.coverImage}
            alt={p.title}
            fill
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <IconArticle className="size-6" />
          </span>
        )}
      </div>

      <div className="flex items-start gap-3 px-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{p.title}</p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {p.excerpt}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="-mr-1 size-8 shrink-0 text-muted-foreground"
              aria-label="Acciones"
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {actions.map((a, i) => (
              <Fragment key={a.label}>
                {a.separatorBefore && i > 0 ? <DropdownMenuSeparator /> : null}
                <DropdownMenuItem
                  variant={a.destructive ? "destructive" : "default"}
                  onClick={() => a.onSelect(p)}
                >
                  {a.label}
                </DropdownMenuItem>
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between px-4">
        <Badge variant="secondary">{p.category}</Badge>
        {p.isPublic ? (
          <Badge className="bg-green-600/15 text-green-700 dark:text-green-400">
            Público
          </Badge>
        ) : (
          <Badge variant="secondary">Privado</Badge>
        )}
      </div>

      {p.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1 px-4">
          {p.tags.map((t) => (
            <Badge key={t} variant="outline" className="font-normal">
              {t}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between border-t px-4 pt-3 text-xs text-muted-foreground">
        <span className="truncate">{dateFmt.format(new Date(p.publishedAt))}</span>
      </div>
    </Card>
  )
}
