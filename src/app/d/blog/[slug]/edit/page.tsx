import { BlogEditForm } from "@/modules/blog/blog-edit-form"

// La página solo monta el formulario de edición; la lógica vive en el módulo.
export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <BlogEditForm slug={slug} />
}
