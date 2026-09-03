import { strict as assert } from "node:assert"
import { csvCell } from "./csv"

// Check mínimo de csvCell (ejecutar con `bun test src/shared/lib`).
assert.equal(csvCell("hola"), "hola")
assert.equal(csvCell(42), "42")
assert.equal(csvCell(true), "true")
assert.equal(csvCell(null), "")
assert.equal(csvCell(undefined), "")
assert.equal(csvCell("a,b"), '"a,b"')
assert.equal(csvCell('a"b'), '"a""b"')
assert.equal(csvCell("a\nb"), '"a\nb"')
assert.equal(csvCell('x,"y'), '"x,""y"')
assert.equal(csvCell(""), "")

console.log("csv ok")
