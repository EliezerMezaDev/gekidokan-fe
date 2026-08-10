"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconPlus } from "@tabler/icons-react"
import type { BlogPostAdmin } from "@/shared/schemas/public"
import type { ParsedFilter } from "@/shared/lib/filter-parser"
import { getBlogPosts } from "@/modules/blog/api"
import { ModuleHeader } from "@/shared/components/module-header"
import { DataTable } from "@/shared/components/data-table"
import { TablePagination } from "@/shared/components/table-pagination"
import { ViewToggle, type ViewMode } from "@/shared/components/view-toggle"
import { useLocalStorageState } from "@/shared/hooks/use-local-storage-state"
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from "@/shared/components/states"
import { Button } from "@/shadcn/button"
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/tabs"
import { useQueryFilters } from "@/shared/hooks/use-query-filters"
import { blogColumns, blogRowActions } from "./columns"
import { BlogFilter } from "./blog-filter"
import { BlogCard } from "./blog-card"
import {
  applyBlogFilters,
  blogFilterSchema,
  blogQuerySchema,
} from "./filters"

// Orquestador del módulo de blog. Responsabilidad única: cargar datos, exponer
// los filtros (sincronizados con la URL vía query params) y el modo de vista
// (tabla/grilla), y delegar el render a las piezas dedicadas
// (columns/BlogCard) sobre el genérico (DataTable). El filtrado hoy corre en
// cliente sobre los mocks (ver filters.ts).

// Deja solo los campos de texto (excluye isPublic, que controla el tab).
function textOnly(filters: ParsedFilter): ParsedFilter {
  const out: ParsedFilter = {}
  for (const key of Object.keys(blogFilterSchema)) {
    if (filters[key]) out[key] = filters[key]
  }
  return out
}

export function BlogView() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPostAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useLocalStorageState<ViewMode>("view:blog", "table")
  const [gridPageIndex, setGridPageIndex] = useState(0)
  const [gridPageSize, setGridPageSize] = useState(12)

  const { filters, apply } = useQueryFilters(blogQuerySchema)

  function fetchPosts() {
    getBlogPosts()
      .then(setPosts)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  function retry() {
    setLoading(true)
    setError(null)
    fetchPosts()
  }

  const visible = useMemo(
    () => applyBlogFilters(posts, filters),
    [posts, filters]
  )

  // ponytail: paginación de la grilla corre en cliente sobre los mocks, igual
  // que el resto del filtrado (ver filters.ts); mover al backend cuando pagine.
  useEffect(() => {
    setGridPageIndex(0)
  }, [filters, gridPageSize])

  const gridPage = useMemo(
    () =>
      visible.slice(
        gridPageIndex * gridPageSize,
        gridPageIndex * gridPageSize + gridPageSize
      ),
    [visible, gridPageIndex, gridPageSize]
  )

  const actions = blogRowActions(router)
  const tab = filters.isPublic ?? "all"

  // El filtro de texto conserva el estado del tab, y el tab conserva el texto.
  const applyText = (parsed: ParsedFilter) =>
    apply({
      ...parsed,
      ...(filters.isPublic ? { isPublic: filters.isPublic } : {}),
    })
  const setTab = (value: string) =>
    apply(
      value === "all"
        ? textOnly(filters)
        : { ...textOnly(filters), isPublic: value }
    )

  return (
    <div>
      <ModuleHeader title="Blog" description="Gestiona las publicaciones del blog.">
        <Button asChild>
          <Link href="/d/blog/add">
            <IconPlus className="size-4" />
            Nueva publicación
          </Link>
        </Button>
      </ModuleHeader>

      <div className="flex flex-col gap-3">
        <BlogFilter filters={filters} onApply={applyText} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="true">Públicos</TabsTrigger>
              <TabsTrigger value="false">Privados</TabsTrigger>
            </TabsList>
          </Tabs>
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <div className="mt-4">
        {view === "table" ? (
          <DataTable
            columns={blogColumns}
            data={visible}
            getRowId={(p) => p.id}
            loading={loading}
            error={error}
            onRetry={retry}
            rowActions={() => actions}
            onRowClick={(p) => router.push(`/d/blog/${p.slug}`)}
            exportable
            exportFileName="blog"
            exportAll={() => getBlogPosts()}
            persistKey="blog"
            emptyTitle="Sin publicaciones"
            emptyDescription="Ninguna publicación coincide con el filtro."
          />
        ) : loading ? (
          <CardGridSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : visible.length === 0 ? (
          <EmptyState
            title="Sin publicaciones"
            description="Ninguna publicación coincide con el filtro."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gridPage.map((p) => (
                <BlogCard key={p.id} post={p} actions={actions} />
              ))}
            </div>
            <TablePagination
              pageIndex={gridPageIndex}
              pageSize={gridPageSize}
              total={visible.length}
              onPageChange={setGridPageIndex}
              onPageSizeChange={setGridPageSize}
            />
          </div>
        )}
      </div>
    </div>
  )
}
