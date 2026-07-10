// Deriva el slug de la URL de una clase a partir de su nombre.
// ponytail: naive (sin dedupe de colisiones); improbable en los mocks. Si el
// backend genera el slug, esto solo alimenta las rutas del alta local.

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
