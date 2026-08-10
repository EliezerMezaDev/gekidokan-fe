import type {
  ClassStyle,
  DayOfWeek,
  ClassSchedule,
} from "@/shared/schemas/classes"

// Etiquetas en español de los enums locales del módulo de clases.

export const styleLabel: Record<ClassStyle, string> = {
  SHOTOKAN: "Shotokan",
  KOBUDO: "Kobudo",
  OTRO: "Otro",
}

export const dayLabel: Record<DayOfWeek, string> = {
  MON: "Lun",
  TUE: "Mar",
  WED: "Mié",
  THU: "Jue",
  FRI: "Vie",
  SAT: "Sáb",
  SUN: "Dom",
}

// Agrupa los horarios por rango de hora y junta los días con "/", p. ej.
// "Lun/Mié 18:00–19:30, Sáb 10:00–11:00".
export function formatSchedule(schedules: ClassSchedule[]): string {
  if (schedules.length === 0) return "—"

  const groups = new Map<string, DayOfWeek[]>()
  for (const s of schedules) {
    const key = `${s.startTime}-${s.endTime}`
    const days = groups.get(key) ?? []
    days.push(s.dayOfWeek)
    groups.set(key, days)
  }

  return Array.from(groups.entries())
    .map(([range, days]) => {
      const [start, end] = range.split("-")
      const dayText = days.map((d) => dayLabel[d]).join("/")
      return `${dayText} ${start}–${end}`
    })
    .join(", ")
}

const dayIndex: Record<DayOfWeek, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
}

// Calcula la próxima fecha/hora de ocurrencia de la clase a partir de ahora,
// eligiendo la más próxima entre todos los horarios de la semana.
export function nextSessionDate(schedules: ClassSchedule[]): Date | null {
  if (schedules.length === 0) return null

  const now = new Date()
  let closest: Date | null = null

  for (const s of schedules) {
    const [hours, minutes] = s.startTime.split(":").map(Number)
    const candidate = new Date(now)
    let dayDiff = (dayIndex[s.dayOfWeek] - now.getDay() + 7) % 7
    candidate.setDate(now.getDate() + dayDiff)
    candidate.setHours(hours, minutes, 0, 0)
    if (candidate < now) candidate.setDate(candidate.getDate() + 7)

    if (!closest || candidate < closest) closest = candidate
  }

  return closest
}
