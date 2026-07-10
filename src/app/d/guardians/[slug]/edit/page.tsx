import { GuardianEditForm } from "@/modules/guardians/guardian-edit-form"

// La página solo monta el formulario de edición; la lógica vive en el módulo.
export default async function EditGuardianPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <GuardianEditForm slug={slug} />
}
