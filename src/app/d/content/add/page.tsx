import { ContentRegisterForm } from "@/modules/content/content-register-form"

// La página solo monta el formulario de alta; la lógica vive en el módulo.
export default function AddContentPage() {
  return <ContentRegisterForm />
}
