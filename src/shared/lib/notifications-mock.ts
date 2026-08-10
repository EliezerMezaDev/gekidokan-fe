import type { Notification } from "@/shared/schemas/notifications"

// ponytail: mock en memoria sin persistencia (se pierde al refrescar). Se
// sustituye por GET/PATCH /me/notifications cuando exista el backend.

const notifications: Notification[] = [
  {
    id: "nt-001",
    title: "Nuevo alumno inscrito",
    body: "Mateo Rodríguez se inscribió en Shotokan Infantil.",
    read: false,
    createdAt: "2026-08-09T12:30:00.000Z",
    href: "/d/students/mateo-rodriguez",
  },
  {
    id: "nt-002",
    title: "Pago pendiente",
    body: "La mensualidad de Valentina Gómez vence en 2 días.",
    read: false,
    createdAt: "2026-08-09T09:15:00.000Z",
    href: "/d/billing",
  },
  {
    id: "nt-003",
    title: "Cambio de cinta",
    body: "Jorge Pérez fue promovido a cinta amarilla.",
    read: false,
    createdAt: "2026-08-08T18:00:00.000Z",
    href: "/d/students/jorge-perez",
  },
  {
    id: "nt-004",
    title: "Clase reprogramada",
    body: "Shotokan Adultos del jueves se movió a las 7:00pm.",
    read: true,
    createdAt: "2026-08-07T14:45:00.000Z",
    href: "/d/classes",
  },
  {
    id: "nt-005",
    title: "Factura generada",
    body: "Se generó la facturación batch de agosto (42 alumnos).",
    read: true,
    createdAt: "2026-08-06T08:00:00.000Z",
    href: "/d/billing",
  },
  {
    id: "nt-006",
    title: "Nuevo representante",
    body: "Carla Gómez se registró como representante.",
    read: false,
    createdAt: "2026-08-05T16:20:00.000Z",
    href: "/d/guardians",
  },
  {
    id: "nt-007",
    title: "Asistencia baja",
    body: "Kobudo Avanzado tiene 3 ausencias consecutivas de un alumno.",
    read: true,
    createdAt: "2026-08-04T11:00:00.000Z",
    href: "/d/classes",
  },
]

export function getNotifications(): Notification[] {
  return notifications
}

export function markAsRead(id: string): void {
  const n = notifications.find((n) => n.id === id)
  if (n) n.read = true
}

export function markAllAsRead(): void {
  for (const n of notifications) n.read = true
}
