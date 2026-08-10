"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { IconLock } from "@tabler/icons-react"
import { useSession } from "@/shared/store/session"
import { useHydrateSession } from "@/shared/hooks/use-hydrate-session"
import { getStudentByAccessUsername } from "@/modules/students/api"
import { getSyllabusItemBySlug } from "@/modules/content/api"
import { beltRankSchema, type Student } from "@/shared/schemas/students"
import type { SyllabusItem } from "@/shared/schemas/content"
import { beltLabel } from "@/modules/students/belt"
import { Card, CardHeader, CardTitle, CardContent } from "@/shadcn/card"
import { Badge } from "@/shadcn/badge"
import { LoadingState, EmptyState } from "@/shared/components/states"

// Detalle de un ítem de contenido. Si el alumno no alcanza el minBeltRank
// (acceso directo por URL a algo no desbloqueado) se muestra el estado de
// bloqueo en vez del cuerpo.
export default function StudentContentDetailPage() {
  useHydrateSession()
  const { slug } = useParams<{ slug: string }>()
  const email = useSession((s) => s.user?.email)
  const [student, setStudent] = useState<Student | null>(null)
  const [item, setItem] = useState<SyllabusItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!email) return
    setLoading(true)
    Promise.all([
      getStudentByAccessUsername(email),
      getSyllabusItemBySlug(slug),
    ])
      .then(([s, i]) => {
        setStudent(s)
        setItem(i)
      })
      .finally(() => setLoading(false))
  }, [email, slug])

  if (!email || loading) return <LoadingState rows={4} />
  if (!item) return <EmptyState title="Contenido no encontrado" />
  if (!student) {
    return (
      <EmptyState
        title="Tu cuenta no está vinculada a un alumno"
        description="Contacta a tu sensei para vincular tu acceso."
      />
    )
  }

  const unlocked =
    beltRankSchema.options.indexOf(item.minBeltRank) <=
    beltRankSchema.options.indexOf(student.belt)

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Badge variant="outline">{item.type}</Badge>
          <Badge variant="outline">Cinta {beltLabel[item.minBeltRank]}</Badge>
        </CardContent>
      </Card>

      {!unlocked ? (
        <EmptyState
          icon={<IconLock className="size-8" />}
          title="Contenido bloqueado"
          description={`Disponible desde cinta ${beltLabel[item.minBeltRank]}.`}
        />
      ) : (
        <>
          {item.videoUrl ? (
            <Card>
              <CardContent>
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary underline"
                >
                  Ver video
                </a>
              </CardContent>
            </Card>
          ) : null}
          {item.bodyMarkdown ? (
            <Card>
              <CardContent className="text-sm leading-relaxed [&_li]:ml-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.bodyMarkdown}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  )
}
