import type { KarateClass } from "@/shared/schemas/classes"

// Datos mock de clases. Satisfacen classSchema; enrolledStudentIds apunta a
// ids reales de fe/src/modules/students/mock-data.ts (st-001..st-008).

export const mockClasses: KarateClass[] = [
  {
    id: "cl-001",
    slug: "shotokan-infantil",
    name: "Shotokan Infantil",
    style: "SHOTOKAN",
    instructorName: "Sensei Carlos Ríos",
    capacity: 20,
    schedules: [
      { dayOfWeek: "MON", startTime: "16:00", endTime: "17:00" },
      { dayOfWeek: "WED", startTime: "16:00", endTime: "17:00" },
    ],
    enrolledStudentIds: ["st-001", "st-002", "st-008"],
    createdAt: "2025-01-10T00:00:00.000Z",
  },
  {
    id: "cl-002",
    slug: "shotokan-juvenil",
    name: "Shotokan Juvenil",
    style: "SHOTOKAN",
    instructorName: "Sensei Carlos Ríos",
    capacity: 18,
    schedules: [
      { dayOfWeek: "MON", startTime: "18:00", endTime: "19:30" },
      { dayOfWeek: "WED", startTime: "18:00", endTime: "19:30" },
    ],
    enrolledStudentIds: ["st-003", "st-004"],
    createdAt: "2025-02-01T00:00:00.000Z",
  },
  {
    id: "cl-003",
    slug: "shotokan-adultos",
    name: "Shotokan Adultos",
    style: "SHOTOKAN",
    instructorName: "Sensei Marina Vidal",
    capacity: 25,
    schedules: [
      { dayOfWeek: "TUE", startTime: "19:00", endTime: "20:30" },
      { dayOfWeek: "THU", startTime: "19:00", endTime: "20:30" },
      { dayOfWeek: "SAT", startTime: "10:00", endTime: "11:30" },
    ],
    enrolledStudentIds: ["st-005", "st-006", "st-007"],
    createdAt: "2024-11-20T00:00:00.000Z",
  },
  {
    id: "cl-004",
    slug: "kobudo-avanzado",
    name: "Kobudo Avanzado",
    style: "KOBUDO",
    instructorName: "Sensei Marina Vidal",
    capacity: 12,
    schedules: [{ dayOfWeek: "FRI", startTime: "19:00", endTime: "20:30" }],
    enrolledStudentIds: ["st-006", "st-007"],
    createdAt: "2025-03-05T00:00:00.000Z",
  },
  {
    id: "cl-005",
    slug: "acondicionamiento-fisico",
    name: "Acondicionamiento Físico",
    style: "OTRO",
    instructorName: "Prof. Ana Salas",
    schedules: [{ dayOfWeek: "SAT", startTime: "08:00", endTime: "09:00" }],
    enrolledStudentIds: [],
    createdAt: "2025-05-15T00:00:00.000Z",
  },
]
