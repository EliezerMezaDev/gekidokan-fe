// Cálculo de edad a partir de una fecha ISO (YYYY-MM-DD). Se usa para decidir
// si un alumno requiere representante (menor de edad).

export function calcAge(birthDate: string): number {
  const d = new Date(birthDate)
  if (Number.isNaN(d.getTime())) return NaN

  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const monthDiff = today.getMonth() - d.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d.getDate())) {
    age -= 1
  }
  return age
}

export function isMinor(birthDate: string): boolean {
  // ponytail: string vacío → false para no bloquear el form antes de que el
  // usuario capture la fecha; el schema obliga birthDate por separado.
  if (!birthDate) return false
  return calcAge(birthDate) < 18
}
