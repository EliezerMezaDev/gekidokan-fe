import { SchemeEditForm } from "@/modules/billing/scheme-edit-form"

// La página solo monta el formulario de edición; la lógica vive en el módulo.
export default async function EditSchemePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <SchemeEditForm slug={slug} />
}
