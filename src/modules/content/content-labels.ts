import type { SyllabusType, ContentStyle } from "@/shared/schemas/content"

export const syllabusTypeLabel: Record<SyllabusType, string> = {
  KATA: "Kata",
  BUNKAI: "Bunkai",
  PROGRAM: "Programa",
}

export const contentStyleLabel: Record<ContentStyle, string> = {
  SHOTOKAN: "Shotokan",
  KOBUDO: "Kobudo",
  OTRO: "Otro",
}
