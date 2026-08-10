// Escapa un valor para una celda CSV (comillas si contiene comas, comillas o
// saltos de línea). Compartido por data-table.tsx y export-dialog.tsx.
export function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
