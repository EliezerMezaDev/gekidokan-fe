import { GuardianDetail } from "@/modules/guardians/guardian-detail"

// La página solo monta el detalle; la carga y el render viven en el módulo.
export default async function GuardianDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <GuardianDetail slug={slug} />
}
