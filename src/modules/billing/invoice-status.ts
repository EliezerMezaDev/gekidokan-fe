import type {
  InvoiceStatus,
  PaymentMethod,
  TuitionStatus,
} from "@/shared/schemas/billing"

// Presentación de estados/labels del módulo de facturación (compartida por
// columnas, tarjetas y detalle).

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  PENDING: "Pendiente",
  PARTIAL: "Parcial",
  PAID: "Pagada",
  OVERDUE: "Vencida",
  VOIDED: "Anulada",
}

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  CARD: "Tarjeta",
  CRYPTO: "Cripto",
}

export const tuitionStatusLabel: Record<TuitionStatus, string> = {
  DRAFT: "Borrador",
  APPROVED: "Aprobado",
  ARCHIVED: "Archivado",
}

// Clase de Badge por estado de factura (tokens, sin colores hardcodeados que
// rompan el dark).
export const invoiceStatusBadgeClass: Record<InvoiceStatus, string> = {
  OVERDUE: "bg-destructive/15 text-destructive",
  PAID: "bg-green-600/15 text-green-700 dark:text-green-400",
  PENDING: "",
  PARTIAL: "bg-primary/15 text-primary",
  VOIDED: "",
}

// PENDING/VOIDED usan variant="secondary" del Badge en vez de className.
export const invoiceStatusUsesSecondary: Record<InvoiceStatus, boolean> = {
  OVERDUE: false,
  PAID: false,
  PENDING: true,
  PARTIAL: false,
  VOIDED: true,
}
