import { ClassDetail } from "@/modules/classes/class-detail"

// La página solo monta el detalle; la carga y el render viven en el módulo.
export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ClassDetail slug={slug} />
}
