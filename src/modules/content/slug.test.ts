import { strict as assert } from "node:assert"
import { slugify } from "./slug"

// Check mínimo del slugify (ejecutar con `bun test src/modules/content`).
assert.equal(slugify("Introducción a la Técnica"), "introduccion-a-la-tecnica")
assert.equal(slugify("¡Domina los Movimientos!"), "domina-los-movimientos")
assert.equal(slugify("  Filosofía del Karate  "), "filosofia-del-karate")

console.log("slugify ok")
