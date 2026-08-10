"use client"

import { useEffect, useState } from "react"

// Como useState, pero persiste el valor en localStorage bajo `key`. Lazy init:
// intenta leer/parsear en el primer render; si no hay window (SSR), no existe
// la key, o el contenido está corrupto/bloqueado (modo privado, cuotas), cae a
// defaultValue. Cada set se persiste en un efecto, también protegido.
// ponytail: sin sync entre pestañas, no hay caso de uso multi-tab hoy
export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignorar: storage bloqueado o cuota excedida
    }
  }, [key, value])

  return [value, setValue] as const
}
