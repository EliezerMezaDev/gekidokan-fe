import { ContentEditForm } from "@/modules/content/content-edit-form"

// La página solo monta el formulario de edición; la lógica vive en el módulo.
export default async function EditContentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ContentEditForm slug={slug} />
}
