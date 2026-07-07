import type { ReactNode } from "react"
import { StudentShell } from "@/shared/components/layout/student-shell"

export default function StudentLayout({ children }: { children: ReactNode }) {
  return <StudentShell>{children}</StudentShell>
}
