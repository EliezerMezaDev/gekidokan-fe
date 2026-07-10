"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { FilterSchema, ParsedFilter } from "@/shared/lib/filter-parser"

// Sincroniza los filtros del módulo con los query params de la URL: cada campo
// del schema es un param propio (?name=juan&belt=AZUL), de modo que los filtros
// son compartibles y sobreviven al refresco. Solo toca las claves del schema;
// deja intactos otros params (paginación futura, etc.). Genérico: no conoce
// ningún módulo. El backend recibirá estos mismos params tal cual.
export function useQueryFilters(schema: FilterSchema) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const filters: ParsedFilter = {}
  for (const key of Object.keys(schema)) {
    const v = params.get(key)
    if (v) filters[key] = v
  }

  const apply = useCallback(
    (next: ParsedFilter) => {
      const sp = new URLSearchParams(params.toString())
      for (const key of Object.keys(schema)) sp.delete(key)
      for (const [k, v] of Object.entries(next)) {
        if (v) sp.set(k, v)
      }
      const qs = sp.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [params, pathname, router, schema]
  )

  return { filters, apply }
}
