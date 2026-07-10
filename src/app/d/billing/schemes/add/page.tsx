import { SchemeRegisterForm } from "@/modules/billing/scheme-register-form"

// La página solo monta el formulario de alta; la lógica vive en el módulo.
export default function AddSchemePage() {
  return <SchemeRegisterForm />
}
