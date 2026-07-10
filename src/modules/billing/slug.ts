// Slugs del módulo de facturación.
// ponytail: naive (sin dedupe de colisiones); improbable en los mocks.

function slugPart(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function slugifyScheme(name: string): string {
  return slugPart(name)
}

export function slugifyInvoice(period: string, studentName: string): string {
  return `${period}-${slugPart(studentName)}`
}
