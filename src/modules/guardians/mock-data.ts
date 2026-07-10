import type { Guardian } from "@/shared/schemas/guardians"

// Datos mock de representantes. Ids ESTABLES (gd-001..gd-006): el módulo de
// alumnos referencia representantes por id (Student.guardianId). Se sustituyen
// por las respuestas reales del backend (GET /guardians) cuando exista el
// módulo.

export const mockGuardians: Guardian[] = [
  {
    id: "gd-001",
    slug: "carla-gomez",
    firstName: "Carla",
    lastName: "Gómez",
    email: "carla.gomez@example.com",
    phone: "+58 414 5559988",
    nationalId: "V-15.234.567",
    createdAt: "2025-09-01T00:00:00.000Z",
  },
  {
    id: "gd-002",
    slug: "luis-martinez",
    firstName: "Luis",
    lastName: "Martínez",
    email: "luis.martinez@example.com",
    phone: "+58 416 5552233",
    nationalId: "V-12.876.543",
    createdAt: "2024-11-01T00:00:00.000Z",
  },
  {
    id: "gd-003",
    slug: "ana-ramirez",
    firstName: "Ana",
    lastName: "Ramírez",
    phone: "+58 412 5551234",
    nationalId: "V-18.345.678",
    createdAt: "2025-10-20T00:00:00.000Z",
  },
  {
    id: "gd-004",
    slug: "jose-hernandez",
    firstName: "José",
    lastName: "Hernández",
    email: "jose.hernandez@example.com",
    phone: "+58 424 5556677",
    nationalId: "V-20.123.456",
    createdAt: "2025-05-14T00:00:00.000Z",
  },
  {
    id: "gd-005",
    slug: "maria-castillo",
    firstName: "María",
    lastName: "Castillo",
    email: "maria.castillo@example.com",
    nationalId: "V-9.876.234",
    createdAt: "2024-08-03T00:00:00.000Z",
  },
  {
    id: "gd-006",
    slug: "pedro-suarez",
    firstName: "Pedro",
    lastName: "Suárez",
    phone: "+58 426 5554455",
    createdAt: "2026-01-10T00:00:00.000Z",
  },
]
