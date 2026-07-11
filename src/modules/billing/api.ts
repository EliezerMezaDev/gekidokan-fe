import { api } from "@/shared/lib/api"
import {
  monthlyInvoiceSchema,
  paymentSchema,
  tuitionSchemeSchema,
  exchangeRateSchema,
  type MonthlyInvoice,
  type Payment,
  type TuitionScheme,
  type TuitionSchemeInput,
  type ExchangeRate,
  type ExchangeRateInput,
} from "@/shared/schemas/billing"
import {
  mockInvoices,
  mockPayments,
  mockSchemes,
  mockExchangeRates,
} from "./mock-data"
import { slugifyScheme } from "./slug"

// Capa de acceso al módulo de facturación. Único punto de swap: con
// USE_MOCKS devuelve los mocks; con el backend real enruta a /billing. Las
// páginas no cambian al hacer el swap. Las facturas mensuales las emite el
// batch del backend (@nestjs/schedule); este módulo no crea invoices.

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false"

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export async function getInvoices(): Promise<MonthlyInvoice[]> {
  if (USE_MOCKS) {
    await delay()
    return mockInvoices
  }
  return monthlyInvoiceSchema.array().parse(await api.get("/billing/invoices"))
}

export async function getInvoiceBySlug(
  slug: string
): Promise<MonthlyInvoice | null> {
  if (USE_MOCKS) {
    await delay()
    return mockInvoices.find((i) => i.slug === slug) ?? null
  }
  return monthlyInvoiceSchema.parse(await api.get(`/billing/invoices/${slug}`))
}

export async function getPaymentsByInvoice(
  invoiceId: string
): Promise<Payment[]> {
  if (USE_MOCKS) {
    await delay()
    return mockPayments.filter((p) => p.invoiceId === invoiceId)
  }
  return paymentSchema
    .array()
    .parse(await api.get(`/billing/invoices/${invoiceId}/payments`))
}

// Concilia (valida) un pago reportado y recalcula el estado de la factura.
// ponytail: mock muta el arreglo en memoria (no persiste entre recargas); el
// backend real hará esto en una transacción.
export async function validatePayment(
  paymentId: string
): Promise<MonthlyInvoice> {
  if (USE_MOCKS) {
    await delay()
    const payment = mockPayments.find((p) => p.id === paymentId)
    if (!payment) throw new Error("Pago no encontrado")
    payment.validated = true

    const invoice = mockInvoices.find((i) => i.id === payment.invoiceId)
    if (!invoice) throw new Error("Factura no encontrada")
    invoice.paidAmount = mockPayments
      .filter((p) => p.invoiceId === invoice.id && p.validated)
      .reduce((sum, p) => sum + p.amount, 0)
    invoice.status =
      invoice.paidAmount >= invoice.localAmount
        ? "PAID"
        : invoice.paidAmount > 0
          ? "PARTIAL"
          : invoice.status
    return invoice
  }
  return monthlyInvoiceSchema.parse(
    await api.post(`/billing/payments/${paymentId}/validate`)
  )
}

export async function getSchemes(): Promise<TuitionScheme[]> {
  if (USE_MOCKS) {
    await delay()
    return mockSchemes
  }
  return tuitionSchemeSchema.array().parse(await api.get("/billing/schemes"))
}

export async function getSchemeBySlug(
  slug: string
): Promise<TuitionScheme | null> {
  if (USE_MOCKS) {
    await delay()
    return mockSchemes.find((s) => s.slug === slug) ?? null
  }
  return tuitionSchemeSchema.parse(await api.get(`/billing/schemes/${slug}`))
}

export async function createScheme(
  input: TuitionSchemeInput
): Promise<TuitionScheme> {
  if (USE_MOCKS) {
    await delay()
    // ponytail: alta local simulada; no persiste entre recargas.
    return {
      id: `ts-${Date.now()}`,
      slug: slugifyScheme(input.name),
      createdAt: new Date().toISOString(),
      ...input,
    }
  }
  return tuitionSchemeSchema.parse(await api.post("/billing/schemes", input))
}

export async function updateScheme(
  slug: string,
  input: TuitionSchemeInput
): Promise<TuitionScheme> {
  if (USE_MOCKS) {
    await delay()
    const current = mockSchemes.find((s) => s.slug === slug)
    return {
      id: current?.id ?? `ts-${Date.now()}`,
      slug: slugifyScheme(input.name),
      createdAt: current?.createdAt ?? new Date().toISOString(),
      ...input,
    }
  }
  return tuitionSchemeSchema.parse(
    await api.patch(`/billing/schemes/${slug}`, input)
  )
}

export async function getExchangeRates(): Promise<ExchangeRate[]> {
  if (USE_MOCKS) {
    await delay()
    return mockExchangeRates
  }
  return exchangeRateSchema
    .array()
    .parse(await api.get("/billing/exchange-rate"))
}

export async function createExchangeRate(
  input: ExchangeRateInput
): Promise<ExchangeRate> {
  if (USE_MOCKS) {
    await delay()
    // ponytail: alta local simulada; no persiste entre recargas.
    const created: ExchangeRate = {
      id: `xr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...input,
    }
    mockExchangeRates.push(created)
    return created
  }
  return exchangeRateSchema.parse(
    await api.post("/billing/exchange-rate", input)
  )
}
