"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "@/shared/store/session"
import { useHydrateSession } from "@/shared/hooks/use-hydrate-session"
import { getStudentByAccessUsername } from "@/modules/students/api"
import { getSyllabusItems } from "@/modules/content/api"
import { beltRankSchema, type Student } from "@/shared/schemas/students"
import type { SyllabusItem, SyllabusType } from "@/shared/schemas/content"
import { beltLabel } from "@/modules/students/belt"
import { Card, CardContent } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shadcn/tabs"
import { LoadingState, EmptyState } from "@/shared/components/states"

const typeLabel: Record<SyllabusType, string> = {
  KATA: "Katas",
  BUNKAI: "Bunkai",
  PROGRAM: "Programas",
}
const types = Object.keys(typeLabel) as SyllabusType[]

// Listado de contenido del alumno, filtrado por cinta alcanzable (modelo
// acumulativo con minBeltRank, ver DT-05 en CLAUDE.md).
export default function StudentContentPage() {
  useHydrateSession()
  const email = useSession((s) => s.user?.email)
  const [student, setStudent] = useState<Student | null>(null)
  const [items, setItems] = useState<SyllabusItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!email) return
    setLoading(true)
    Promise.all([getStudentByAccessUsername(email), getSyllabusItems()])
      .then(([s, syllabus]) => {
        setStudent(s)
        setItems(syllabus)
      })
      .finally(() => setLoading(false))
  }, [email])

  if (!email || loading) return <LoadingState rows={5} />

  if (!student) {
    return (
      <EmptyState
        title="Tu cuenta no está vinculada a un alumno"
        description="Contacta a tu sensei para vincular tu acceso."
      />
    )
  }

  const beltIdx = beltRankSchema.options.indexOf(student.belt)
  const reachable = items.filter(
    (i) => beltRankSchema.options.indexOf(i.minBeltRank) <= beltIdx
  )

  return (
    <Tabs defaultValue="KATA" className="flex flex-col gap-4">
      <TabsList className="w-full">
        {types.map((type) => (
          <TabsTrigger key={type} value={type} className="flex-1">
            {typeLabel[type]}
          </TabsTrigger>
        ))}
      </TabsList>
      {types.map((type) => {
        const list = reachable.filter((i) => i.type === type)
        return (
          <TabsContent
            key={type}
            value={type}
            className="flex flex-col gap-3"
          >
            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sin contenido disponible en esta categoría todavía.
              </p>
            ) : (
              list.map((item) => (
                <Link key={item.id} href={`/s/content/${item.slug}`}>
                  <Card>
                    <CardContent className="flex items-center justify-between">
                      <span className="font-medium">{item.title}</span>
                      <Badge variant="outline">
                        {beltLabel[item.minBeltRank]}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
