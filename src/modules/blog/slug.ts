// Deriva el slug de la URL de un post a partir de su título.
// ponytail: naive (sin dedupe de colisiones); igual criterio que students/slug.ts.

export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
