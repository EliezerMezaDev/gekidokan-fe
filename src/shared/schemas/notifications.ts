import { z } from "zod"

// Espejo de backend/src/shared/schemas (ver CLAUDE.md — tipado derivado con
// z.infer). Notificaciones in-app de la campana (fe/src/shared/components/layout/notification-bell.tsx).

export const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  read: z.boolean(),
  createdAt: z.iso.datetime(),
  href: z.string().optional(),
})
export type Notification = z.infer<typeof notificationSchema>
