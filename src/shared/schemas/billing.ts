import { z } from "zod"

// Espejo de backend/src/shared/schemas (ver CLAUDE.md — tipado derivado con
// z.infer). Modelo de facturación: esquemas de mensualidad, tasas de cambio,
// facturas mensuales y pagos reportados por el alumno/representante.

export const invoiceStatusSchema = z.enum([
  "PENDING",
  "PARTIAL",
  "PAID",
  "OVERDUE",
  "VOIDED",
])
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>

export const paymentMethodSchema = z.enum([
  "CASH",
  "TRANSFER",
  "CARD",
  "CRYPTO",
])
export type PaymentMethod = z.infer<typeof paymentMethodSchema>

export const tuitionStatusSchema = z.enum(["DRAFT", "APPROVED", "ARCHIVED"])
export type TuitionStatus = z.infer<typeof tuitionStatusSchema>

export const tuitionSchemeSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  amountUsd: z.number().positive(),
  cutoffDay: z.number().int().min(1).max(28),
  dueDay: z.number().int().min(1).max(28),
  status: tuitionStatusSchema,
  createdAt: z.iso.datetime(),
})
export type TuitionScheme = z.infer<typeof tuitionSchemeSchema>

export const tuitionSchemeInputSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  amountUsd: z.number().positive("El monto debe ser mayor a 0"),
  cutoffDay: z.number().int().min(1).max(28),
  dueDay: z.number().int().min(1).max(28),
  status: tuitionStatusSchema,
})
export type TuitionSchemeInput = z.infer<typeof tuitionSchemeInputSchema>

export const exchangeRateSchema = z.object({
  id: z.string(),
  rate: z.number().positive(),
  validFrom: z.iso.date(),
  validUntil: z.iso.date().optional(),
  createdAt: z.iso.datetime(),
})
export type ExchangeRate = z.infer<typeof exchangeRateSchema>

export const exchangeRateInputSchema = z.object({
  rate: z.number().positive("La tasa debe ser mayor a 0"),
  validFrom: z.iso.date("Fecha inválida"),
  validUntil: z.iso.date("Fecha inválida").optional(),
})
export type ExchangeRateInput = z.infer<typeof exchangeRateInputSchema>

export const monthlyInvoiceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  studentId: z.string(),
  // Snapshot de display; evita depender de un join con students en el mock.
  studentName: z.string(),
  period: z.string(), // "YYYY-MM"
  amountUsd: z.number(),
  exchangeRate: z.number(),
  localAmount: z.number(),
  paidAmount: z.number().default(0),
  status: invoiceStatusSchema,
  dueDate: z.iso.date(),
  createdAt: z.iso.datetime(),
})
export type MonthlyInvoice = z.infer<typeof monthlyInvoiceSchema>

export const paymentSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  method: paymentMethodSchema,
  reference: z.string(),
  amount: z.number().positive(),
  reportedAt: z.iso.datetime(),
  receiptUrl: z.literal("").or(z.url()).optional(),
  validated: z.boolean().default(false),
})
export type Payment = z.infer<typeof paymentSchema>
