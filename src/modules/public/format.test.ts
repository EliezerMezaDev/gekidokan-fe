import { strict as assert } from "node:assert"
import { formatDate, formatShortDate } from "./format"

// Check mínimo de formato de fechas (ejecutar con `bun test src/modules/public`).
assert.equal(formatDate("2026-02-28"), "28 de febrero de 2026")
assert.equal(formatDate("2026-01-01"), "1 de enero de 2026")
assert.equal(formatDate("2026-12-31"), "31 de diciembre de 2026")

assert.equal(formatShortDate("2026-02-28"), "28 Feb, 2026")
assert.equal(formatShortDate("2026-08-05"), "05 Ago, 2026")
assert.equal(formatShortDate("2026-01-01"), "01 Ene, 2026")
assert.equal(formatShortDate("2026-12-31"), "31 Dic, 2026")
assert.equal(formatShortDate("2025-12-31"), "31 Dic, 2025")

console.log("format ok")
