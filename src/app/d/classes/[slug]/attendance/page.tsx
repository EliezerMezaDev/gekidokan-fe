import { ClassAttendanceView } from "@/modules/attendance/class-attendance-view"

// La página solo monta la vista de asistencia; la lógica vive en el módulo.
export default async function ClassAttendancePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <ClassAttendanceView slug={slug} />
}
