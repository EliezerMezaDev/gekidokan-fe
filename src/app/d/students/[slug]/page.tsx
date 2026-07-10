import { StudentDetail } from "@/modules/students/student-detail"

// La página solo monta el detalle; la carga y el render viven en el módulo.
export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <StudentDetail slug={slug} />
}
