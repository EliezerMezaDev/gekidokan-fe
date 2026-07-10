import { StudentEditForm } from "@/modules/students/student-edit-form"

// La página solo monta el formulario de edición; la lógica vive en el módulo.
export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <StudentEditForm slug={slug} />
}
