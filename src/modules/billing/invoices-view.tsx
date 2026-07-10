"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconCoin, IconCurrencyDollar } from "@tabler/icons-react"
import type { MonthlyInvoice } from "@/shared/schemas/billing"
import type { ParsedFilter } from "@/shared/lib/filter-parser"
import { getInvoices } from "@/modules/billing/api"
import { ModuleHeader } from "@/shared/components/module-header"
import { DataTable } from "@/shared/components/data-table"
import { TablePagination } from "@/shared/components/table-pagination"
import { ViewToggle, type ViewMode } from "@/shared/components/view-toggle"
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
} from "@/shared/components/states"
import { Button } from "@/shadcn/button"
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/tabs"
import { useQueryFilters } from "@/shared/hooks/use-query-filters"
import { invoiceColumns, invoiceRowActions } from "./columns"
import { InvoicesFilter } from "./invoices-filter"
import { InvoiceCard } from "./invoice-card"
import {
  applyInvoiceFilters,
  invoicesFilterSchema,
  invoicesQuerySchema,
} from "./filters"

// Orquestador del módulo de facturas. Responsabilidad única: cargar datos,
// exponer los filtros (sincronizados con la URL vía query params), tabs por
// estado y el modo de vista (tabla/grilla), y delegar el render a las piezas
// dedicadas. Sin botón "Nueva factura": las emite el batch de facturación del
// backend, no se crean a mano. ponytail: los cross-links a Esquemas/Tipo de
// cambio viven en el header hasta que el módulo tenga un layout propio con tabs.

function textOnly(filters: ParsedFilter): ParsedFilter {
  const out: ParsedFilter = {}
  for (const key of Object.keys(invoicesFilterSchema)) {
    if (filters[key]) out[key] = filters[key]
  }
  return out
}

export function InvoicesView() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<MonthlyInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<ViewMode>("table")
  const [gridPageIndex, setGridPageIndex] = useState(0)
  const [gridPageSize, setGridPageSize] = useState(12)

  const { filters, apply } = useQueryFilters(invoicesQuerySchema)

  function fetchInvoices() {
    getInvoices()
      .then(setInvoices)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  function retry() {
    setLoading(true)
    setError(null)
    fetchInvoices()
  }

  const visible = useMemo(
    () => applyInvoiceFilters(invoices, filters),
    [invoices, filters]
  )

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

  const actions = invoiceRowActions(router)
  const tab = filters.status ?? "all"

  const applyText = (parsed: ParsedFilter) =>
    apply({ ...parsed, ...(filters.status ? { status: filters.status } : {}) })
  const setStatus = (value: string) =>
    apply(
      value === "all"
        ? textOnly(filters)
        : { ...textOnly(filters), status: value }
    )

  return (
    <div>
      <ModuleHeader
        title="Facturación"
        description="Facturas mensuales emitidas por el batch de facturación."
      >
        <Button variant="outline" asChild>
          <Link href="/d/billing/schemes">
            <IconCoin className="size-4" />
            Esquemas
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/d/billing/exchange-rate">
            <IconCurrencyDollar className="size-4" />
            Tipo de cambio
          </Link>
        </Button>
      </ModuleHeader>

      <div className="flex flex-col gap-3">
        <InvoicesFilter filters={filters} onApply={applyText} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Tabs value={tab} onValueChange={setStatus}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="PENDING">Pendientes</TabsTrigger>
              <TabsTrigger value="OVERDUE">Vencidas</TabsTrigger>
              <TabsTrigger value="PAID">Pagadas</TabsTrigger>
            </TabsList>
          </Tabs>
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      <div className="mt-4">
        {view === "table" ? (
          <DataTable
            columns={invoiceColumns}
            data={visible}
            getRowId={(i) => i.id}
            loading={loading}
            error={error}
            onRetry={retry}
            rowActions={() => actions}
            onRowClick={(i) => router.push(`/d/billing/invoices/${i.slug}`)}
            exportable
            exportFileName="facturas"
            emptyTitle="Sin facturas"
            emptyDescription="Ninguna factura coincide con el filtro."
          />
        ) : loading ? (
          <CardGridSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : visible.length === 0 ? (
          <EmptyState
            title="Sin facturas"
            description="Ninguna factura coincide con el filtro."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gridPage.map((i) => (
                <InvoiceCard key={i.id} invoice={i} actions={actions} />
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
