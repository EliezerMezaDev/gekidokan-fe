// Deriva el slug de la URL de un representante a partir de su nombre.
// ponytail: naive (sin dedupe de colisiones); improbable en los mocks. Si el
// backend genera el slug, esto solo alimenta las rutas del alta local.

export function slugify(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
