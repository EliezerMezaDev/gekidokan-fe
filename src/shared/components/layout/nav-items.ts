import {
  type Icon,
  IconLayoutDashboard,
  IconUsers,
  IconUsersGroup,
  IconCalendarEvent,
  IconReceipt2,
  IconBook,
  IconHome,
  IconArticle,
} from "@tabler/icons-react"

export type NavItem = { href: string; label: string; icon: Icon }

// Navegación del dashboard admin (/d). Los destinos se llenan en etapas 2-5.
export const dashboardNav: NavItem[] = [
  { href: "/d", label: "Inicio", icon: IconLayoutDashboard },
  { href: "/d/students", label: "Alumnos", icon: IconUsers },
  { href: "/d/guardians", label: "Representantes", icon: IconUsersGroup },
  { href: "/d/classes", label: "Clases", icon: IconCalendarEvent },
  { href: "/d/billing/invoices", label: "Facturación", icon: IconReceipt2 },
  { href: "/d/content", label: "Contenido", icon: IconBook },
]

// Navegación inferior del área de alumno (/s), mobile-first.
export const studentNav: NavItem[] = [
  { href: "/s", label: "Inicio", icon: IconHome },
  { href: "/s/content", label: "Contenido", icon: IconBook },
  { href: "/s/payments", label: "Pagos", icon: IconReceipt2 },
  { href: "/s/blog", label: "Blog", icon: IconArticle },
]
