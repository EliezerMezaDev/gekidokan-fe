// Catálogo de contenido programático mock (para poblar los checkboxes del paso
// académico y listar el contenido habilitado en el detalle).
// ponytail: mock; el catálogo y el acceso reales llegan con el módulo de
// contenido, bloqueado por DT-05.

export const mockContent: { id: string; label: string }[] = [
  { id: "kata-heian-shodan", label: "Kata: Heian Shodan" },
  { id: "kata-heian-nidan", label: "Kata: Heian Nidan" },
  { id: "kihon-basico", label: "Kihon básico" },
  { id: "kumite-gohon", label: "Kumite: Gohon" },
  { id: "kumite-kihon-ippon", label: "Kumite: Kihon Ippon" },
  { id: "terminologia", label: "Terminología y etiqueta" },
]

const contentLabelById = new Map(mockContent.map((c) => [c.id, c.label]))

export function contentLabel(id: string): string {
  return contentLabelById.get(id) ?? id
}
