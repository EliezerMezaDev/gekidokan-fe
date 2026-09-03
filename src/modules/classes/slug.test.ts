import { strict as assert } from "node:assert"
import { slugify } from "./slug"

// Check mínimo del slugify (ejecutar con `bun test src/modules/classes`).
assert.equal(slugify("Clase de Karate Básico"), "clase-de-karate-basico")
assert.equal(slugify("¡Kumité Avanzado!"), "kumite-avanzado")
assert.equal(slugify("  Defensa Personal  "), "defensa-personal")

console.log("slugify ok")
