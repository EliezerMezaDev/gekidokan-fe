import { Suspense } from "react"
import { StudentAttendanceView } from "@/modules/attendance/student-attendance-view"

// La página solo monta; la carga y el render viven en el módulo. Suspense
// obligatorio: la vista usa useSearchParams para los filtros de la URL.
export default async function StudentAttendancePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <Suspense>
      <StudentAttendanceView slug={slug} />
    </Suspense>
  )
}
