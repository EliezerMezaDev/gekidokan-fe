"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IconBook, IconReceipt2 } from "@tabler/icons-react"
import { useSession } from "@/shared/store/session"
import { useHydrateSession } from "@/shared/hooks/use-hydrate-session"
import { getStudentByAccessUsername } from "@/modules/students/api"
import { getSyllabusItems } from "@/modules/content/api"
import { getInvoices } from "@/modules/billing/api"
import { beltRankSchema, type Student } from "@/shared/schemas/students"
import type { SyllabusItem } from "@/shared/schemas/content"
import type { MonthlyInvoice } from "@/shared/schemas/billing"
import { beltLabel, beltDot } from "@/modules/students/belt"
import { Card, CardHeader, CardTitle, CardContent } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { LoadingState, EmptyState } from "@/shared/components/states"

// Home del alumno: sin helper server-side para leer la sesión en este
// proyecto (useSession es un store cliente), así que resuelve todo client-side
// con el mismo patrón de hidratación que StudentShell (useHydrateSession).
export default function StudentHome() {
  useHydrateSession()
  const email = useSession((s) => s.user?.email)
  const [student, setStudent] = useState<Student | null>(null)
  const [items, setItems] = useState<SyllabusItem[]>([])
  const [invoices, setInvoices] = useState<MonthlyInvoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!email) return
    setLoading(true)
    Promise.all([
      getStudentByAccessUsername(email),
      getSyllabusItems(),
      getInvoices(),
    ])
      .then(([s, syllabus, inv]) => {
        setStudent(s)
        setItems(syllabus)
        setInvoices(inv)
      })
      .finally(() => setLoading(false))
  }, [email])

  if (!email || loading) return <LoadingState rows={4} />

  if (!student) {
    return (
      <EmptyState
        title="Tu cuenta no está vinculada a un alumno"
        description="Contacta a tu sensei para vincular tu acceso."
      />
    )
  }

  const beltIdx = beltRankSchema.options.indexOf(student.belt)
  const nextContent = [...items]
    .filter((i) => beltRankSchema.options.indexOf(i.minBeltRank) <= beltIdx)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 3)
  const pendingInvoices = invoices.filter(
    (i) => i.studentId === student.id && i.status !== "PAID"
  )

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Hola, {student.firstName} 👋</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <span className={`size-3 rounded-full ${beltDot[student.belt]}`} />
          <span className="text-sm text-muted-foreground">
            Cinta {beltLabel[student.belt]}
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBook className="size-4" /> Próximo contenido
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {nextContent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Sin contenido disponible todavía.
            </p>
          ) : (
            nextContent.map((item) => (
              <Link
                key={item.id}
                href={`/s/content/${item.slug}`}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              >
                <span>{item.title}</span>
                <Badge variant="outline">{beltLabel[item.minBeltRank]}</Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconReceipt2 className="size-4" /> Facturas pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Estás al día.</p>
          ) : (
            <p className="text-sm">
              Tienes {pendingInvoices.length} factura
              {pendingInvoices.length > 1 ? "s" : ""} pendiente
              {pendingInvoices.length > 1 ? "s" : ""}:{" "}
              {pendingInvoices
                .slice(0, 2)
                .map((i) => i.period)
                .join(", ")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
