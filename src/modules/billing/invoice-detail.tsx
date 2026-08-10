"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { IconArrowLeft, IconCheck } from "@tabler/icons-react"
import type { MonthlyInvoice, Payment } from "@/shared/schemas/billing"
import { ModuleHeader } from "@/shared/components/module-header"
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { getInvoiceBySlug, getPaymentsByInvoice, validatePayment } from "./api"
import { usdFmt, localFmt } from "./money"
import { InvoiceStatusBadge } from "./columns"
import { paymentMethodLabel } from "./invoice-status"

// Ficha de detalle de una factura: datos de la factura + alumno, montos en
// StatCards, lista de pagos reportados y la acción de conciliación (mock:
// valida el pago y recalcula el estado de la factura localmente).

function Eyebrow({ children }: { children: string }) {
  return <p className="disp text-[11px] text-muted-foreground">{children}</p>
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="disp text-[10px] text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="flex flex-col justify-between gap-1 p-6">
      <Eyebrow>{label}</Eyebrow>
      <p className="font-heading text-3xl tracking-tight">{value}</p>
    </Card>
  )
}

export function InvoiceDetail({ slug }: { slug: string }) {
  const [invoice, setInvoice] = useState<MonthlyInvoice | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [validatingId, setValidatingId] = useState<string | null>(null)

  function fetchInvoice() {
    getInvoiceBySlug(slug)
      .then(async (i) => {
        setInvoice(i)
        if (i) setPayments(await getPaymentsByInvoice(i.id))
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "No se pudo cargar")
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchInvoice()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  function retry() {
    setLoading(true)
    setError(null)
    fetchInvoice()
  }

  async function onValidate(paymentId: string) {
    setValidatingId(paymentId)
    try {
      const updated = await validatePayment(paymentId)
      setInvoice(updated)
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, validated: true } : p))
      )
      toast.success("Pago conciliado")
    } catch {
      toast.error("No se pudo conciliar el pago. Intenta de nuevo.")
    } finally {
      setValidatingId(null)
    }
  }

  if (loading) return <LoadingState rows={5} />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!invoice)
    return (
      <EmptyState
        title="Factura no encontrada"
        description="Puede que haya sido eliminada o el enlace sea incorrecto."
        action={
          <Button asChild variant="outline">
            <Link href="/d/billing/invoices">Volver a facturas</Link>
          </Button>
        }
      />
    )

  const i = invoice
  return (
    <div>
      <ModuleHeader
        title={`${i.studentName} · ${i.period}`}
        description="Detalle de la factura."
      >
        <Button variant="outline" asChild>
          <Link href="/d/billing/invoices">
            <IconArrowLeft className="size-4" />
            Volver
          </Link>
        </Button>
      </ModuleHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-6 sm:p-8 md:col-span-2 md:row-span-2">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-2xl leading-tight tracking-tight">
                {i.studentName}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Período {i.period}
              </p>
            </div>
            <InvoiceStatusBadge status={i.status} />
          </div>

          <dl className="mt-7 grid gap-6 sm:grid-cols-2">
            <Field label="Monto USD" value={usdFmt.format(i.amountUsd)} />
            <Field label="Tasa de cambio" value={i.exchangeRate.toString()} />
            <Field label="Monto local" value={localFmt.format(i.localAmount)} />
            <Field label="Fecha de vencimiento" value={i.dueDate} />
          </dl>
        </Card>

        <StatCard label="Pagado" value={localFmt.format(i.paidAmount)} />
        <StatCard
          label="Saldo"
          value={localFmt.format(Math.max(i.localAmount - i.paidAmount, 0))}
        />

        <Card className="p-6 sm:p-8 md:col-span-2">
          <Eyebrow>Facturado</Eyebrow>
          <p className="mt-3 font-heading text-2xl tracking-tight">
            {localFmt.format(i.localAmount)}
          </p>
        </Card>

        <Card className="p-6 sm:p-8 md:col-span-4">
          <Eyebrow>Pagos reportados</Eyebrow>
          {payments.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Sin pagos reportados para esta factura.
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {paymentMethodLabel[p.method]} · {usdFmt.format(p.amount)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      Ref. {p.reference} ·{" "}
                      {new Date(p.reportedAt).toLocaleString("es")}
                    </p>
                  </div>
                  {p.validated ? (
                    <span className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                      <IconCheck className="size-4" />
                      Conciliado
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onValidate(p.id)}
                      disabled={validatingId === p.id}
                    >
                      {validatingId === p.id ? "Conciliando…" : "Conciliar"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
