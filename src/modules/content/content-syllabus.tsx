"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { IconBook2, IconPlus, IconMinus, IconFocus2 } from "@tabler/icons-react"
import type { SyllabusItem } from "@/shared/schemas/content"
import { beltRankSchema } from "@/shared/schemas/students"
import { beltLabel, beltBar } from "@/modules/students/belt"
import { syllabusTypeLabel } from "./content-labels"

// Vista "syllabus": árbol de progresión estilo skill-tree de videojuego, dibujado
// a mano (sin librería de canvas). Cada cinta es una fila (eje Y = rango); sus
// ítems se alinean en horizontal. Las conexiones son curvas bézier que descienden
// de una card a otra siguiendo los prerequisites, admitiendo saltos multinivel.
// Las cards se arrastran; el lienzo panea arrastrando el fondo y hace zoom con
// rueda/botones. Al enfocar (hover) una card se resalta su cadena de antecesores
// y sucesores y se atenúa el resto. Presentacional: recibe los ítems ya filtrados.

const CARD_W = 240
const CARD_H = 76
const COL_W = 280
const ROW_H = 150
const LABEL_W = 150 // ancho reservado a la izquierda para la etiqueta de cinta.
const PAD_TOP = 24
const PAD = 48 // margen del lienzo para que la última fila/columna respire.
const MIN_SCALE = 0.4
const MAX_SCALE = 2

type Pt = { x: number; y: number }
type View = { s: number; tx: number; ty: number }

const clamp = (n: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, n))

export function ContentSyllabus({ items }: { items: SyllabusItem[] }) {
  const router = useRouter()
  const viewportRef = useRef<HTMLDivElement>(null)

  // Posiciones base deterministas + tamaño del lienzo.
  const { basePos, width, height, beltsWithItems, rowOfBelt } = useMemo(() => {
    const beltsWithItems = beltRankSchema.options.filter((b) =>
      items.some((i) => i.minBeltRank === b)
    )
    const rowOfBelt = new Map(beltsWithItems.map((b, r) => [b, r]))
    const colOf: Record<string, number> = {}
    const basePos: Record<string, Pt> = {}
    let maxCol = 0
    for (const item of items) {
      const row = rowOfBelt.get(item.minBeltRank) ?? 0
      const col = colOf[item.minBeltRank] ?? 0
      colOf[item.minBeltRank] = col + 1
      maxCol = Math.max(maxCol, col)
      basePos[item.id] = { x: LABEL_W + col * COL_W, y: PAD_TOP + row * ROW_H }
    }
    const width = LABEL_W + maxCol * COL_W + CARD_W + PAD
    const height = PAD_TOP + Math.max(beltsWithItems.length, 1) * ROW_H + PAD
    return { basePos, width, height, beltsWithItems, rowOfBelt }
  }, [items])

  // Cámara (pan/zoom), overrides de arrastre de cards y card enfocada.
  // ponytail: nada persiste al recargar; persistir solo si se pide.
  const [view, setView] = useState<View>({ s: 1, tx: 0, ty: 0 })
  const [drag, setDrag] = useState<Record<string, Pt>>({})
  const [focusId, setFocusId] = useState<string | null>(null)
  const cardRef = useRef<{
    id: string
    startX: number
    startY: number
    orig: Pt
    moved: boolean
  } | null>(null)
  const panRef = useRef<{
    startX: number
    startY: number
    tx: number
    ty: number
  } | null>(null)

  const posOf = (id: string): Pt => drag[id] ?? basePos[id] ?? { x: 0, y: 0 }

  // Cadena relacionada con la card enfocada: ella + todos sus antecesores
  // (prereqs transitivos) + todos sus sucesores (dependientes transitivos).
  const related = useMemo(() => {
    if (!focusId) return null
    const vis = new Set(items.map((i) => i.id))
    const parents = new Map<string, string[]>()
    const children = new Map<string, string[]>()
    for (const it of items) {
      const ps = it.prerequisites.filter((p) => vis.has(p))
      parents.set(it.id, ps)
      for (const p of ps) children.set(p, [...(children.get(p) ?? []), it.id])
    }
    const walk = (adj: Map<string, string[]>) => {
      const seen = new Set<string>()
      const stack = [focusId]
      while (stack.length) {
        const n = stack.pop()!
        for (const m of adj.get(n) ?? [])
          if (!seen.has(m)) {
            seen.add(m)
            stack.push(m)
          }
      }
      return seen
    }
    return new Set<string>([focusId, ...walk(parents), ...walk(children)])
  }, [focusId, items])

  // Zoom alrededor de un punto (coords relativas al viewport) preservándolo fijo.
  function zoomAt(factor: number, cx: number, cy: number) {
    setView((v) => {
      const s = clamp(v.s * factor)
      const k = s / v.s
      return { s, tx: cx - (cx - v.tx) * k, ty: cy - (cy - v.ty) * k }
    })
  }

  // Rueda → zoom. Listener no pasivo para poder evitar el scroll de la página.
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomAt(
        e.deltaY < 0 ? 1.1 : 1 / 1.1,
        e.clientX - r.left,
        e.clientY - r.top
      )
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  function zoomButton(factor: number) {
    const el = viewportRef.current
    if (!el) return
    zoomAt(factor, el.clientWidth / 2, el.clientHeight / 2)
  }

  function resetView() {
    setView({ s: 1, tx: 0, ty: 0 })
    setDrag({}) // devuelve las cards arrastradas a su posición base.
  }

  // Pan del lienzo: arrastrar el fondo (las cards paran la propagación).
  function onViewportPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    panRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      tx: view.tx,
      ty: view.ty,
    }
  }
  function onViewportPointerMove(e: React.PointerEvent) {
    const p = panRef.current
    if (p) {
      setView((v) => ({
        ...v,
        tx: p.tx + (e.clientX - p.startX),
        ty: p.ty + (e.clientY - p.startY),
      }))
      return
    }
    const c = cardRef.current
    if (!c) return
    const dx = e.clientX - c.startX
    const dy = e.clientY - c.startY
    if (!c.moved && Math.hypot(dx, dy) < 4) return // umbral: distingue drag de click.
    c.moved = true
    // El puntero se mueve en px de pantalla; el lienzo está escalado por s.
    setDrag((prev) => ({
      ...prev,
      [c.id]: { x: c.orig.x + dx / view.s, y: c.orig.y + dy / view.s },
    }))
  }
  function onViewportPointerUp() {
    panRef.current = null
  }

  // Arrastre / click de una card (para la propagación para no panear el lienzo).
  function onCardPointerDown(e: React.PointerEvent, id: string) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    cardRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      orig: posOf(id),
      moved: false,
    }
  }
  function onCardPointerUp(item: SyllabusItem) {
    const c = cardRef.current
    cardRef.current = null
    if (c && !c.moved) router.push(`/d/content/${item.slug}`) // click sin arrastre.
  }

  const visibleIds = new Set(items.map((i) => i.id))

  // Aristas: una curva bézier por prerrequisito visible (padre abajo → hijo arriba).
  const edges = items.flatMap((item) =>
    item.prerequisites
      .filter((id) => visibleIds.has(id))
      .map((prereqId) => {
        const from = posOf(prereqId)
        const to = posOf(item.id)
        const x1 = from.x + CARD_W / 2
        const y1 = from.y + CARD_H
        const x2 = to.x + CARD_W / 2
        const y2 = to.y
        const dy = (y2 - y1) / 2
        // Resaltada si ambos extremos están en la cadena enfocada.
        const hi =
          related != null && related.has(prereqId) && related.has(item.id)
        return {
          id: `${prereqId}->${item.id}`,
          d: `M ${x1} ${y1} C ${x1} ${y1 + dy} ${x2} ${y2 - dy} ${x2} ${y2}`,
          hi,
        }
      })
  )

  return (
    <div
      ref={viewportRef}
      onPointerDown={onViewportPointerDown}
      onPointerMove={onViewportPointerMove}
      onPointerUp={onViewportPointerUp}
      className="relative h-[calc(100vh-20rem)] min-h-[420px] cursor-grab touch-none overflow-hidden rounded-xl border bg-muted/20 active:cursor-grabbing"
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width,
          height,
          transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.s})`,
        }}
      >
        <style>{`@keyframes syl-flow{to{stroke-dashoffset:-20}}`}</style>

        {/* Capa de conexiones detrás de las cards; no intercepta el puntero.
            overflow visible: las curvas no se recortan al arrastrar cards fuera. */}
        <svg
          className="pointer-events-none absolute inset-0"
          width={width}
          height={height}
          style={{ overflow: "visible" }}
        >
          {edges.map((e) => {
            // Por defecto grises; resaltadas → color de texto (blanco en oscuro);
            // el resto se atenúa cuando hay una card enfocada.
            const stroke = e.hi
              ? "var(--foreground)"
              : "var(--muted-foreground)"
            const opacity = related == null ? 0.7 : e.hi ? 1 : 0.12
            return (
              <path
                key={e.id}
                d={e.d}
                fill="none"
                stroke={stroke}
                strokeWidth={e.hi ? 2.5 : 2}
                strokeLinecap="round"
                strokeDasharray="6 5"
                opacity={opacity}
                style={{ animation: "syl-flow 1s linear infinite" }}
              />
            )
          })}
        </svg>

        {/* Etiquetas de "nivel" (cinta) por fila. Estáticas. */}
        {beltsWithItems.map((belt) => (
          <div
            key={`belt-${belt}`}
            className="absolute flex items-center gap-2"
            style={{
              left: 8,
              top:
                PAD_TOP + (rowOfBelt.get(belt) ?? 0) * ROW_H + CARD_H / 2 - 16,
              width: LABEL_W - 16,
            }}
          >
            <span className={`h-8 w-2 rounded-full ${beltBar[belt]}`} />
            <span className="disp text-xs text-muted-foreground">
              {beltLabel[belt]}
            </span>
          </div>
        ))}

        {/* Cards de ítem, arrastrables. */}
        {items.map((item) => {
          const p = posOf(item.id)
          const dimmed = related != null && !related.has(item.id)
          return (
            <div
              key={item.id}
              onPointerDown={(e) => onCardPointerDown(e, item.id)}
              onPointerUp={() => onCardPointerUp(item)}
              onPointerEnter={() => setFocusId(item.id)}
              onPointerLeave={() =>
                setFocusId((cur) => (cur === item.id ? null : cur))
              }
              className={`absolute z-10 flex cursor-grab touch-none flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all select-none hover:border-[color:var(--ring)] active:cursor-grabbing ${
                dimmed ? "opacity-40" : "opacity-100"
              }`}
              style={{ left: p.x, top: p.y, width: CARD_W, height: CARD_H }}
            >
              <div
                className={`h-1.5 w-full shrink-0 ${beltBar[item.minBeltRank]}`}
              />
              <div className="flex flex-1 items-center gap-3 p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <IconBook2 className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {syllabusTypeLabel[item.type]}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Controles de zoom / reset (fijos al viewport, no escalan). */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1 rounded-lg border bg-card/90 p-1 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={() => zoomButton(1.2)}
          className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Acercar"
        >
          <IconPlus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => zoomButton(1 / 1.2)}
          className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Alejar"
        >
          <IconMinus className="size-4" />
        </button>
        <button
          type="button"
          onClick={resetView}
          className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Reiniciar vista"
          title="Reiniciar vista"
        >
          <IconFocus2 className="size-4" />
        </button>
      </div>
    </div>
  )
}
