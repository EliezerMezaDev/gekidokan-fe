import type { BlogPostAdmin } from "@/shared/schemas/public"

// Datos mock de posts del blog. Satisfacen blogPostAdminSchema y se sustituyen
// por las respuestas reales del backend (GET /blog) cuando exista el módulo.

export const mockBlogPosts: BlogPostAdmin[] = [
  {
    id: "bl-001",
    slug: "nuevo-dojo-en-el-centro",
    title: "Abrimos nuevo dojo en el centro de la ciudad",
    category: "Noticias",
    excerpt:
      "Desde el próximo mes sumamos una nueva sede para acercar el karate a más familias.",
    bodyMarkdown: `## Una nueva sede para el dojo

Con mucha alegría anunciamos la apertura de nuestra **nueva sede** en el centro de la ciudad, pensada para recibir a más alumnos de todas las edades.

- Clases infantiles: lunes, miércoles y viernes
- Clases juveniles/adultos: martes y jueves
- Kobudo: sábados por la mañana

> "El karate no empieza ni termina con una técnica, empieza y termina con el respeto." — Gichin Funakoshi

¡Los esperamos!`,
    tags: ["dojo", "noticias", "apertura"],
    isPublic: true,
    coverImage: "/img/blog/nuevo-dojo.jpg",
    publishedAt: "2026-06-02T09:00:00.000Z",
    createdAt: "2026-05-28T14:30:00.000Z",
  },
  {
    id: "bl-002",
    slug: "guia-basica-heian-shodan",
    title: "Guía básica del kata Heian Shodan",
    category: "Técnica",
    excerpt:
      "Repasamos los movimientos fundamentales del primer kata del sistema Heian.",
    bodyMarkdown: `## Heian Shodan paso a paso

Heian Shodan es el primer kata que aprenden los alumnos de cinta blanca/amarilla. Consta de 21 movimientos.

1. Posición inicial (yoi)
2. Giro a la izquierda con gedan barai
3. Paso adelante con oi zuki
4. Giro 180° con gedan barai
5. ...continúa la secuencia

\`\`\`
Secuencia: gedan barai → oi zuki → age uke → ...
\`\`\`

Practica cada movimiento por separado antes de encadenarlos.`,
    tags: ["kata", "tecnica", "heian"],
    isPublic: true,
    coverImage: "/img/blog/heian-shodan.jpg",
    publishedAt: "2026-05-15T12:00:00.000Z",
    createdAt: "2026-05-10T10:00:00.000Z",
  },
  {
    id: "bl-003",
    slug: "torneo-interno-2026",
    title: "Resultados del torneo interno 2026",
    category: "Eventos",
    excerpt:
      "Un resumen del torneo interno de kata y kumite disputado este fin de semana.",
    bodyMarkdown: `## ¡Gran torneo interno!

Este fin de semana se disputó el torneo interno anual, con más de 40 participantes en las categorías de kata y kumite.

### Podio de kata

| Puesto | Alumno |
| --- | --- |
| 1 | Diego Fernández |
| 2 | Camila Torres |
| 3 | Lucas Díaz |

Felicitaciones a todos los participantes por el esfuerzo y la actitud durante la competencia.`,
    tags: ["torneo", "eventos", "kata", "kumite"],
    isPublic: true,
    coverImage: "/img/blog/torneo-2026.jpg",
    publishedAt: "2026-04-20T18:00:00.000Z",
    createdAt: "2026-04-18T09:15:00.000Z",
  },
  {
    id: "bl-004",
    slug: "importancia-del-kihon",
    title: "La importancia del kihon en la formación del karateka",
    category: "Técnica",
    excerpt:
      "Por qué la práctica constante de las técnicas básicas es la base de todo progreso.",
    bodyMarkdown: `## Kihon: la base de todo

El *kihon* (técnica básica) es el pilar sobre el que se construyen kata y kumite. Sin una base sólida, el resto del entrenamiento se resiente.

- Postura correcta (dachi)
- Golpes (zuki)
- Patadas (geri)
- Bloqueos (uke)

La repetición constante, con atención al detalle, es lo que transforma el movimiento en técnica.`,
    tags: ["kihon", "tecnica", "entrenamiento"],
    isPublic: true,
    publishedAt: "2026-03-10T08:00:00.000Z",
    createdAt: "2026-03-05T11:00:00.000Z",
  },
  {
    id: "bl-005",
    slug: "borrador-articulo-nutricion",
    title: "Nutrición para jóvenes karatekas (borrador)",
    category: "Salud",
    excerpt:
      "Recomendaciones generales de nutrición para alumnos en crecimiento.",
    bodyMarkdown: `## Nutrición y rendimiento

Artículo en preparación sobre hábitos alimenticios recomendados para alumnos jóvenes que entrenan con regularidad.

Pendiente de revisión antes de publicar.`,
    tags: ["salud", "nutricion"],
    isPublic: false,
    publishedAt: "2026-07-01T00:00:00.000Z",
    createdAt: "2026-06-25T16:45:00.000Z",
  },
  {
    id: "bl-006",
    slug: "cierre-de-ano-2025",
    title: "Cierre de año 2025: un repaso del camino recorrido",
    category: "Noticias",
    excerpt:
      "Un vistazo a los logros del dojo durante el año que termina y lo que viene.",
    bodyMarkdown: `## Gracias por un gran año

2025 fue un año de crecimiento para el dojo: nuevos alumnos, nuevos cinturones negros y más presencia en torneos regionales.

Gracias a toda la familia del dojo por el compromiso y la disciplina. ¡Nos vemos en 2026 con más entrenamiento!`,
    tags: ["noticias", "cierre-de-ano"],
    isPublic: true,
    coverImage: "/img/blog/cierre-2025.jpg",
    publishedAt: "2025-12-20T10:00:00.000Z",
    createdAt: "2025-12-18T09:00:00.000Z",
  },
]
