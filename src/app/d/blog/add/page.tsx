import { BlogEditForm } from "@/modules/blog/blog-edit-form"

// La página solo monta el formulario de alta; la lógica vive en el módulo.
export default function AddBlogPostPage() {
  return <BlogEditForm />
}
