import { ContentDetail } from "@/modules/content/content-detail"

// La página solo monta el detalle; la carga y el render viven en el módulo.
export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ContentDetail slug={slug} />
}
