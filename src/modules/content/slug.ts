// Deriva el slug de la URL del contenido a partir de su título.
// ponytail: naive (sin dedupe de colisiones); improbable en los mocks.

export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
