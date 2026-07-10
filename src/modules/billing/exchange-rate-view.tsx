"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import type { ExchangeRate } from "@/shared/schemas/billing"
import { getExchangeRates } from "@/modules/billing/api"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  DataTable,
  SortableHeader,
  type ColumnDef,
} from "@/shared/components/data-table"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"
import { ExchangeRateForm } from "./exchange-rate-form"

// Tipo de cambio: alta inline arriba + histórico de tasas debajo. ponytail: una
// tasa se considera vigente si no tiene fecha de fin (validUntil).

const rateColumns: ColumnDef<ExchangeRate>[] = [
  {
    accessorKey: "rate",
    header: ({ column }) => (
      <SortableHeader column={column}>Tasa</SortableHeader>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.rate}</span>,
  },
  {
    accessorKey: "validFrom",
    header: ({ column }) => (
      <SortableHeader column={column}>Vigente desde</SortableHeader>
    ),
    cell: ({ row }) => row.original.validFrom,
  },
  {
    accessorKey: "validUntil",
    header: "Vigente hasta",
    cell: ({ row }) =>
      row.original.validUntil ? (
        row.original.validUntil
      ) : (
        <Badge className="bg-green-600/15 text-green-700 dark:text-green-400">
          Vigente
        </Badge>
      ),
  },
]

export function ExchangeRateView() {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function fetchRates() {
    getExchangeRates()
      .then(setRates)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRates()
  }, [])

  function retry() {
    setLoading(true)
    setError(null)
    fetchRates()
  }

  return (
    <div>
      <ModuleHeader
        title="Tipo de cambio"
        description="Tasa que el batch aplica al emitir facturas en moneda local."
      >
        <Button variant="outline" asChild>
          <Link href="/d/billing/invoices">
            <IconArrowLeft className="size-4" />
            Facturas
          </Link>
        </Button>
      </ModuleHeader>

      <div className="flex flex-col gap-4">
        <ExchangeRateForm onCreated={(r) => setRates((prev) => [r, ...prev])} />
        <DataTable
          columns={rateColumns}
          data={rates}
          getRowId={(r) => r.id}
          loading={loading}
          error={error}
          onRetry={retry}
          emptyTitle="Sin tasas"
          emptyDescription="Aún no se ha registrado ninguna tasa de cambio."
        />
      </div>
    </div>
  )
}
