import type { RelationshipType } from "@/shared/schemas/guardians"

// Etiquetas de la relación representante-alumno. La relación vive en el
// vínculo del alumno (Student.guardianRelationship), no en el guardian.

export const relationshipLabel: Record<RelationshipType, string> = {
  PADRE: "Padre",
  MADRE: "Madre",
  TUTOR: "Tutor",
  OTRO: "Otro",
}
