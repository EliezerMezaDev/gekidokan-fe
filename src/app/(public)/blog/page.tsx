import type { Metadata } from "next"
import Link from "next/link"
import { getBlogPosts } from "@/modules/public/api"
import { formatDate } from "@/modules/public/format"
import { Badge } from "@/shadcn/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shadcn/card"
import { EmptyState } from "@/shared/components/states"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre Karate, Kobudo, técnica y vida en el dojo de la academia Gekidokan.",
}

export default async function BlogListPage() {
  const posts = await getBlogPosts()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Blog</h1>
        <p className="text-muted-foreground mt-2">
          Novedades, técnica y filosofía del dojo.
        </p>
      </header>

      {posts.length === 0 ? (
        <EmptyState
          title="Aún no hay publicaciones"
          description="Estamos preparando contenido. Vuelve pronto."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">{post.category}</Badge>
                  <CardTitle className="mt-1">{post.title}</CardTitle>
                  <CardDescription>{formatDate(post.publishedAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{post.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
