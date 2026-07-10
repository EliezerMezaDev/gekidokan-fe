import { InvoiceDetail } from "@/modules/billing/invoice-detail"

// La página solo monta el detalle; la carga y el render viven en el módulo.
export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <InvoiceDetail slug={slug} />
}
