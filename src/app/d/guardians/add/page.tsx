import { GuardianRegisterForm } from "@/modules/guardians/guardian-register-form"

// La página solo monta el formulario de alta; la lógica vive en el módulo.
export default function AddGuardianPage() {
  return <GuardianRegisterForm />
}
