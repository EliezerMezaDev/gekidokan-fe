import { CardGridSkeleton } from "@/shared/components/states"

// Skeleton del listado de blog. Reusa el patrón ya usado en el resto del
// proyecto (CardGridSkeleton) en vez de reinventar uno propio.
export default function StudentBlogLoading() {
  return <CardGridSkeleton count={4} />
}
