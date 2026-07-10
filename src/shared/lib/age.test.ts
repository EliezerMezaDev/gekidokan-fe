import { strict as assert } from "node:assert"
import { calcAge, isMinor } from "./age"

// Check mínimo de cálculo de edad (ejecutar con `bun test src/shared/lib`).
// Fechas relativas a hoy para no depender de una fecha fija.

function isoYearsAgo(years: number): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() - years)
  return d.toISOString().slice(0, 10)
}

assert.equal(isMinor(isoYearsAgo(10)), true)
assert.equal(isMinor(isoYearsAgo(30)), false)

// Borde exacto de 18: cumplió hoy → ya no es menor.
assert.equal(calcAge(isoYearsAgo(18)), 18)
assert.equal(isMinor(isoYearsAgo(18)), false)
assert.equal(isMinor(isoYearsAgo(17)), true)

// Fecha vacía / inválida no bloquea el form.
assert.equal(isMinor(""), false)
assert.equal(Number.isNaN(calcAge("no-es-fecha")), true)

console.log("age ok")
