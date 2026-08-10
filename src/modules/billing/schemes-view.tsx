"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconArrowLeft, IconPlus } from "@tabler/icons-react"
import type { TuitionScheme } from "@/shared/schemas/billing"
import { getSchemes } from "@/modules/billing/api"
import { ModuleHeader } from "@/shared/components/module-header"
import { DataTable } from "@/shared/components/data-table"
import { Button } from "@/shadcn/button"
import { schemeColumns, schemeRowActions } from "./scheme-columns"

// Orquestador de esquemas de mensualidad. Lista simple sobre DataTable: los
// esquemas son configuración (pocos registros), así que no lleva tabs, filtro
// ni grilla. ponytail: sin filtro/grilla porque la lista es corta; añadir si
// crece.

export function SchemesView() {
  const router = useRouter()
  const [schemes, setSchemes] = useState<TuitionScheme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function fetchSchemes() {
    getSchemes()
      .then(setSchemes)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSchemes()
  }, [])

  function retry() {
    setLoading(true)
    setError(null)
    fetchSchemes()
  }

  return (
    <div>
      <ModuleHeader
        title="Esquemas de mensualidad"
        description="Planes de cobro que el batch usa para emitir las facturas."
      >
        <Button variant="outline" asChild>
          <Link href="/d/billing/invoices">
            <IconArrowLeft className="size-4" />
            Facturas
          </Link>
        </Button>
        <Button asChild>
          <Link href="/d/billing/schemes/add">
            <IconPlus className="size-4" />
            Nuevo esquema
          </Link>
        </Button>
      </ModuleHeader>

      <DataTable
        columns={schemeColumns}
        data={schemes}
        getRowId={(s) => s.id}
        loading={loading}
        error={error}
        onRetry={retry}
        rowActions={() => schemeRowActions(router)}
        onRowClick={(s) => router.push(`/d/billing/schemes/${s.slug}/edit`)}
        exportable
        exportAll={getSchemes}
        persistKey="billing-schemes"
        exportFileName="esquemas"
        emptyTitle="Sin esquemas"
        emptyDescription="Aún no hay esquemas de mensualidad."
      />
    </div>
  )
}
