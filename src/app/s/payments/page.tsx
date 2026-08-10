"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/shared/store/session"
import { getStudentByAccessUsername } from "@/modules/students/api"
import { getInvoices, getPaymentsByInvoice } from "@/modules/billing/api"
import type { MonthlyInvoice, Payment } from "@/shared/schemas/billing"
import type { Student } from "@/shared/schemas/students"
import { Card } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { Button } from "@/shadcn/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/dialog"
import { EmptyState, LoadingState } from "@/shared/components/states"
import { invoiceStatusLabel, invoiceStatusBadgeClass } from "@/modules/billing/invoice-status"
import { usdFmt, localFmt } from "@/modules/billing/money"
import { ReportPaymentForm } from "./report-payment-form"

// Vista de pagos del alumno: lista sus facturas y permite reportar un pago
// contra las que no estén pagadas. Resuelve la sesión en cliente (no hay
// helper server-side para leer el JWT en /s).

export default function PaymentsPage() {
  const user = useSession((s) => s.user)
  const [student, setStudent] = useState<Student | null>(null)
  const [invoices, setInvoices] = useState<MonthlyInvoice[]>([])
  const [payments, setPayments] = useState<Record<string, Payment[]>>({})
  const [loading, setLoading] = useState(true)
  const [openInvoiceId, setOpenInvoiceId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.email) return
    let cancelled = false
    setLoading(true)
    getStudentByAccessUsername(user.email).then(async (st) => {
      if (cancelled) return
      setStudent(st)
      if (!st) {
        setLoading(false)
        return
      }
      const all = await getInvoices()
      const mine = all.filter((i) => i.studentId === st.id)
      setInvoices(mine)
      const entries = await Promise.all(
        mine.map(async (i) => [i.id, await getPaymentsByInvoice(i.id)] as const)
      )
      if (!cancelled) setPayments(Object.fromEntries(entries))
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [user?.email])

  async function refreshPayments(invoiceId: string) {
    const list = await getPaymentsByInvoice(invoiceId)
    setPayments((prev) => ({ ...prev, [invoiceId]: list }))
  }

  if (loading) return <LoadingState rows={4} />

  if (!student) {
    return (
      <EmptyState
        title="No encontramos tu perfil de alumno"
        description="Contacta a la academia si crees que esto es un error."
      />
    )
  }

  if (invoices.length === 0) {
    return (
      <EmptyState
        title="Sin facturas"
        description="Aún no tienes mensualidades generadas."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Mis pagos</h1>
      {invoices.map((invoice) => (
        <Card key={invoice.id} size="sm" className="gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{invoice.period}</span>
            <Badge
              variant={
                invoice.status === "PENDING" || invoice.status === "VOIDED"
                  ? "secondary"
                  : undefined
              }
              className={invoiceStatusBadgeClass[invoice.status] || undefined}
            >
              {invoiceStatusLabel[invoice.status]}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{usdFmt.format(invoice.amountUsd)}</span>
            <span>{localFmt.format(invoice.localAmount)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Vence {invoice.dueDate}
          </p>

          {(payments[invoice.id] ?? []).length > 0 ? (
            <ul className="flex flex-col gap-1 border-t pt-2 text-xs">
              {payments[invoice.id].map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {p.reference} · {usdFmt.format(p.amount)}
                  </span>
                  <Badge variant={p.validated ? undefined : "secondary"}>
                    {p.validated ? "Validado" : "Pendiente de validar"}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : null}

          {invoice.status !== "PAID" && invoice.status !== "VOIDED" ? (
            <Dialog
              open={openInvoiceId === invoice.id}
              onOpenChange={(open) => setOpenInvoiceId(open ? invoice.id : null)}
            >
              <Button
                size="sm"
                variant="outline"
                className="mt-1"
                onClick={() => setOpenInvoiceId(invoice.id)}
              >
                Reportar pago
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reportar pago — {invoice.period}</DialogTitle>
                </DialogHeader>
                <ReportPaymentForm
                  invoiceId={invoice.id}
                  onReported={() => {
                    setOpenInvoiceId(null)
                    refreshPayments(invoice.id)
                  }}
                />
              </DialogContent>
            </Dialog>
          ) : null}
        </Card>
      ))}
    </div>
  )
}
