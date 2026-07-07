import type { BlogPost, PublicClass } from "@/shared/schemas/public"

// Datos mock del portal. Satisfacen los esquemas Zod y se sustituyen por las
// respuestas reales del backend cuando existan los endpoints públicos.

export const mockClasses: PublicClass[] = [
  {
    id: "shotokan-infantil",
    name: "Karate Shotokan — Infantil",
    style: "SHOTOKAN",
    instructor: "Sensei Akira Tanaka",
    description:
      "Iniciación al Karate Shotokan para niños de 6 a 12 años: kihon, disciplina y valores del dojo.",
    schedules: [
      { weekday: "LUNES", startTime: "17:00", endTime: "18:00" },
      { weekday: "MIERCOLES", startTime: "17:00", endTime: "18:00" },
    ],
  },
  {
    id: "shotokan-adultos",
    name: "Karate Shotokan — Adultos",
    style: "SHOTOKAN",
    instructor: "Sensei Akira Tanaka",
    description:
      "Entrenamiento integral de kihon, kata y kumite para jóvenes y adultos de todos los niveles.",
    schedules: [
      { weekday: "MARTES", startTime: "19:00", endTime: "20:30" },
      { weekday: "JUEVES", startTime: "19:00", endTime: "20:30" },
    ],
  },
  {
    id: "kobudo",
    name: "Kobudo de Okinawa",
    style: "KOBUDO",
    instructor: "Sensei María Fernández",
    description:
      "Manejo tradicional de armas de Okinawa (bo, sai, tonfa) con énfasis en técnica y control.",
    schedules: [{ weekday: "SABADO", startTime: "10:00", endTime: "11:30" }],
  },
]

export const mockBlogPosts: BlogPost[] = [
  {
    slug: "bienvenida-a-gekidokan",
    title: "Bienvenido al dojo Gekidokan",
    category: "Academia",
    excerpt:
      "Conoce nuestra filosofía, nuestros senseis y el camino que ofrecemos a cada alumno.",
    publishedAt: "2026-06-01T09:00:00.000Z",
    coverImage: "/images/brand/spectacular.png",
    bodyMarkdown:
      "## Un camino, no un destino\n\nEn **Gekidokan** entendemos el Karate y el Kobudo como una disciplina de vida.\n\n- Respeto\n- Constancia\n- Superación\n\nTe esperamos en el dojo.",
  },
  {
    slug: "que-es-el-kata",
    title: "¿Qué es un kata y por qué importa?",
    category: "Técnica",
    excerpt:
      "El kata es la columna vertebral del Karate tradicional. Te explicamos su papel en tu progreso.",
    publishedAt: "2026-06-15T09:00:00.000Z",
    coverImage: "/images/brand/isologo.png",
    bodyMarkdown:
      "## La forma como memoria del combate\n\nEl kata codifica técnicas de defensa y ataque en una secuencia.\n\nPracticarlo desarrolla equilibrio, respiración y precisión.",
  },
  {
    slug: "preparando-tu-primer-examen-de-cinta",
    title: "Preparando tu primer examen de cinta",
    category: "Alumnos",
    excerpt:
      "Consejos prácticos para afrontar con confianza tu primer cambio de grado.",
    publishedAt: "2026-06-28T09:00:00.000Z",
    bodyMarkdown:
      "## Antes del examen\n\n1. Repasa el kihon.\n2. Descansa bien.\n3. Confía en tu preparación.\n\nEl examen es una celebración de tu progreso, no una prueba a superar con miedo.",
  },
]
