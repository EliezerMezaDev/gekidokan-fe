import { strict as assert } from "node:assert"
import { slugify } from "./slug"

// Check mínimo del slugify (ejecutar con `bun test src/modules/students`).
assert.equal(slugify("Mateo", "Rodríguez"), "mateo-rodriguez")
assert.equal(slugify("José María", "Ñáñez"), "jose-maria-nanez")
assert.equal(slugify("  Ana  ", "Gómez!"), "ana-gomez")

console.log("slugify ok")
