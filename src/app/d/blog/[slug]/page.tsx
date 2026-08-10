import { BlogDetail } from "@/modules/blog/blog-detail"

// La página solo monta el detalle; la carga y el render viven en el módulo.
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <BlogDetail slug={slug} />
}
