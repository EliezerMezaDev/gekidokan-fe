import { strict as assert } from "node:assert"
import { slugify } from "./slug"

// Check mínimo del slugify (ejecutar con `bun test src/modules/blog`).
assert.equal(slugify("Nuevo dojo en el centro"), "nuevo-dojo-en-el-centro")
assert.equal(slugify("¡Técnica de Kumité!"), "tecnica-de-kumite")
assert.equal(slugify("  Eventos  "), "eventos")

console.log("slugify ok")
