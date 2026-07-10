import { StudentWizard } from "@/modules/students/student-wizard"

// La página solo monta el wizard de alta; la lógica vive en el módulo.
export default function AddStudentPage() {
  return <StudentWizard />
}
