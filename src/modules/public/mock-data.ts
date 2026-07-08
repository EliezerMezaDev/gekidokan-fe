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
    slug: "la-historia-del-karate-de-okinawa",
    title: "La historia del Karate de Okinawa",
    category: "Historia",
    excerpt:
      "Un recorrido desde el Ryukyu Te hasta los estilos modernos que practicamos hoy en el dōjō.",
    publishedAt: "2026-02-28T09:00:00.000Z",
    bodyMarkdown:
      "El Karate nació en las islas Ryukyu, actual Okinawa, como una síntesis entre las artes de combate locales (Te) y las influencias marciales llegadas de China. Durante siglos se transmitió en secreto, de maestro a discípulo.\n\n## Del secreto a las escuelas\n\nA comienzos del siglo XX, maestros como Anko Itosu llevaron el Karate a las escuelas de Okinawa, sistematizando las katas y adaptando la práctica a la educación física.\n\nCuando el arte llegó al Japón continental en los años 1920, se popularizó rápidamente y dio origen a los grandes estilos que conocemos: Shotokan, Goju-ryu, Shito-ryu y Wado-ryu.",
  },
  {
    slug: "10-beneficios-de-practicar-karate",
    title: "10 beneficios de practicar Karate",
    category: "Salud",
    excerpt:
      "Más allá de la defensa personal: fuerza, concentración, disciplina y una comunidad que te impulsa.",
    publishedAt: "2026-06-12T09:00:00.000Z",
    bodyMarkdown:
      "Practicar Karate transforma cuerpo y mente. Estos son diez beneficios que nuestros alumnos experimentan de forma constante.\n\n## Cuerpo y mente\n\nMejora la fuerza, la flexibilidad y la coordinación, a la vez que reduce el estrés y agudiza la concentración. La repetición de katas entrena la memoria motora y la calma bajo presión.\n\nY quizá lo más valioso: la disciplina y el respeto que se cultivan en el tatami acompañan al practicante en cada área de su vida.",
  },
  {
    slug: "reglas-del-kumite-guia-esencial",
    title: "Reglas del kumite: guía esencial",
    category: "Guía",
    excerpt:
      "Puntuaciones, categorías y protocolo. Todo lo que necesitas saber antes de tu primer combate.",
    publishedAt: "2026-08-11T09:00:00.000Z",
    bodyMarkdown:
      "El kumite es el combate deportivo del Karate. Conocer sus reglas te permite competir con seguridad y aprovechar cada intercambio.\n\n## Sistema de puntuación\n\nYuko (1 punto) para golpes de puño, Waza-ari (2 puntos) para patadas al cuerpo y Ippon (3 puntos) para patadas a la cabeza o técnicas de barrido seguidas de golpe.\n\nEl respeto al oponente y al árbitro es innegociable: el saludo abre y cierra cada encuentro.",
  },
  {
    slug: "introduccion-al-kobudo",
    title: "Introducción al Kobudo: el arte de las armas",
    category: "Kobudo",
    excerpt:
      "Bo, sai, tonfa y nunchaku. Descubre las armas tradicionales de Okinawa y su origen agrícola.",
    publishedAt: "2026-09-02T09:00:00.000Z",
    bodyMarkdown:
      "El Kobudo es el arte marcial de las armas tradicionales de Okinawa, muchas de ellas derivadas de herramientas agrícolas y de pesca.\n\n## Las armas principales\n\nEl bo (bastón largo), el sai (trinche metálico), la tonfa (mango de molino) y el nunchaku son las armas más practicadas, cada una con sus katas propias.\n\nEn el dōjō integramos el Kobudo con el Karate: el trabajo de armas refina el control corporal y la percepción de la distancia.",
  },
  {
    slug: "el-significado-de-los-cinturones",
    title: "El significado de los cinturones",
    category: "Historia",
    excerpt:
      "Del blanco al negro: qué representa cada grado y por qué el color no lo es todo.",
    publishedAt: "2026-09-20T09:00:00.000Z",
    bodyMarkdown:
      "El sistema de cinturones (kyu y dan) ordena el progreso del practicante, pero su verdadero valor está en el trabajo que representa, no en el color.\n\n## Kyu y dan\n\nLos grados kyu descienden del blanco hacia el marrón; los grados dan comienzan en el cinturón negro y marcan el inicio del verdadero aprendizaje.\n\nComo dice el proverbio del dōjō: el cinturón negro no es el final, es el primer paso.",
  },
  {
    slug: "karate-para-ninos-disciplina-y-confianza",
    title: "Karate para niños: disciplina y confianza",
    category: "Salud",
    excerpt:
      "Por qué las artes marciales son una de las mejores actividades para el desarrollo infantil.",
    publishedAt: "2026-10-05T09:00:00.000Z",
    bodyMarkdown:
      "Para los más pequeños, el Karate es mucho más que ejercicio: es una escuela de valores en movimiento.\n\n## Beneficios en la infancia\n\nMejora la concentración, canaliza la energía, refuerza la autoestima y enseña a gestionar la frustración a través del esfuerzo constante.\n\nEn un entorno seguro y estructurado, los niños aprenden respeto, paciencia y trabajo en equipo.",
  },
]
