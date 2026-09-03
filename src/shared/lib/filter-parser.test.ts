import { strict as assert } from "node:assert"
import {
  parseFilterInput,
  matchesNumber,
  type FilterSchema,
} from "./filter-parser"

// Check mínimo del mini-lenguaje de filtros (ejecutar con `bun test src/shared/lib`).

const schema: FilterSchema = {
  name: { type: "text" },
  age: { type: "number" },
  belt: { type: "text" },
}

// Operador numérico (campo=>valor).
assert.equal(parseFilterInput("age=>18", schema).age, ">18")
assert.equal(matchesNumber(20, ">18"), true)
assert.equal(matchesNumber(15, ">18"), false)

// Coma = OR.
assert.equal(parseFilterInput("belt=AZUL,NEGRO", schema).belt, "AZUL,NEGRO")

// Término suelto → primer campo del schema (name).
assert.equal(parseFilterInput("juan", schema).name, "juan")

// Input vacío / inválido no rompe.
assert.deepEqual(parseFilterInput("", schema), {})
assert.deepEqual(parseFilterInput("   ", schema), {})
assert.deepEqual(parseFilterInput("age=>no-es-numero", schema), {})
assert.deepEqual(parseFilterInput("campoInexistente=x", schema), {})

console.log("filter-parser ok")
