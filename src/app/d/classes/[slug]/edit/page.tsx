import { ClassEditForm } from "@/modules/classes/class-edit-form"

// La página solo monta el formulario de edición; la lógica vive en el módulo.
export default async function EditClassPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ClassEditForm slug={slug} />
}
