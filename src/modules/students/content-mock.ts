import type { BeltRank } from "@/shared/schemas/students"

// Catálogo de contenido programático mock (para poblar los checkboxes del paso
// académico y listar el contenido habilitado en el detalle).
// ponytail: mock; el catálogo y el acceso reales llegan con el módulo de
// contenido, bloqueado por DT-05.

export const mockContent: { id: string; label: string; belt: BeltRank }[] = [
  { id: "kata-heian-shodan", label: "Kata: Heian Shodan", belt: "BLANCO" },
  { id: "kihon-basico", label: "Kihon básico", belt: "BLANCO" },
  { id: "kata-heian-nidan", label: "Kata: Heian Nidan", belt: "AMARILLO" },
  { id: "kumite-gohon", label: "Kumite: Gohon", belt: "NARANJA" },
  { id: "terminologia", label: "Terminología y etiqueta", belt: "NARANJA" },
  { id: "kumite-kihon-ippon", label: "Kumite: Kihon Ippon", belt: "VERDE" },
]

const contentLabelById = new Map(mockContent.map((c) => [c.id, c.label]))

export function contentLabel(id: string): string {
  return contentLabelById.get(id) ?? id
}
