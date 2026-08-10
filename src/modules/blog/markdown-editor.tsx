"use client"

import { useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  IconBold,
  IconItalic,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconQuote,
  IconCode,
  IconLink,
  IconPhoto,
  IconTable,
  IconMinus,
} from "@tabler/icons-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shadcn/button"
import { Textarea } from "@/shadcn/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/tabs"

// Editor de markdown mínimo: textarea controlado + toolbar que envuelve la
// selección con sintaxis markdown, y un panel de vista previa con
// ReactMarkdown+remarkGfm (mismo renderer que usa el portal público).
// ponytail: sin dependencia de editor externo; alcanza para el CMS del blog.

type WrapAction = { before: string; after?: string; block?: boolean }

const TOOLBAR: {
  icon: typeof IconBold
  label: string
  action: WrapAction
}[] = [
  { icon: IconBold, label: "Negrita", action: { before: "**", after: "**" } },
  { icon: IconItalic, label: "Itálica", action: { before: "_", after: "_" } },
  { icon: IconH1, label: "Título 1", action: { before: "# ", block: true } },
  { icon: IconH2, label: "Título 2", action: { before: "## ", block: true } },
  { icon: IconH3, label: "Título 3", action: { before: "### ", block: true } },
  { icon: IconList, label: "Lista", action: { before: "- ", block: true } },
  {
    icon: IconListNumbers,
    label: "Lista numerada",
    action: { before: "1. ", block: true },
  },
  { icon: IconQuote, label: "Cita", action: { before: "> ", block: true } },
  { icon: IconCode, label: "Código", action: { before: "`", after: "`" } },
  { icon: IconLink, label: "Enlace", action: { before: "[texto](url)" } },
  { icon: IconPhoto, label: "Imagen", action: { before: "![alt](url)" } },
  {
    icon: IconTable,
    label: "Tabla",
    action: {
      before:
        "| Columna 1 | Columna 2 |\n| --- | --- |\n| Valor 1 | Valor 2 |",
    },
  },
  { icon: IconMinus, label: "Línea horizontal", action: { before: "---" } },
]

export function MarkdownEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  // Un solo textarea/preview reales; en mobile se alterna cuál se ve con CSS
  // (no con Tabs de Radix, que desmonta el panel inactivo y rompería el ref
  // compartido del textarea).
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit")

  function applyAction({ before, after = "", block }: WrapAction) {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)

    let insertStart = start
    // Bloque (título/lista/cita): se inserta al comienzo de la línea actual.
    if (block) {
      insertStart = value.lastIndexOf("\n", start - 1) + 1
    }

    const next =
      value.slice(0, insertStart) +
      before +
      value.slice(insertStart, end) +
      (block ? "" : after) +
      value.slice(end)

    onChange(next)

    const cursor = block
      ? insertStart + before.length + (end - insertStart)
      : insertStart + before.length + selected.length + after.length
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(cursor, cursor)
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1 rounded-md border p-1">
        {TOOLBAR.map(({ icon: Icon, label, action }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={label}
            title={label}
            onClick={() => applyAction(action)}
          >
            <Icon className="size-4" />
          </Button>
        ))}
      </div>

      {/* Desktop: editor y vista previa lado a lado. Mobile: tabs (mismas
          instancias, solo se alterna qué panel se ve). */}
      <Tabs
        value={mobileTab}
        onValueChange={(v) => setMobileTab(v as "edit" | "preview")}
        className="md:hidden"
      >
        <TabsList className="w-full">
          <TabsTrigger value="edit" className="flex-1">
            Editar
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            Vista previa
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3 md:grid-cols-2">
        <div className={cn(mobileTab !== "edit" && "hidden", "md:block")}>
          <MarkdownTextarea textareaRef={ref} value={value} onChange={onChange} />
        </div>
        <div className={cn(mobileTab !== "preview" && "hidden", "md:block")}>
          <MarkdownPreview value={value} />
        </div>
      </div>
    </div>
  )
}

function MarkdownTextarea({
  textareaRef,
  value,
  onChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Escribe el contenido en markdown…"
      className="min-h-80 font-mono text-sm"
    />
  )
}

function MarkdownPreview({ value }: { value: string }) {
  return (
    <div className="min-h-80 overflow-auto rounded-md border p-4 text-sm [&_a]:text-primary [&_a]:underline [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_strong]:font-semibold [&_table]:w-full [&_td]:border [&_td]:p-1.5 [&_th]:border [&_th]:bg-muted [&_th]:p-1.5 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6">
      {value.trim() ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
      ) : (
        <p className="text-muted-foreground">La vista previa aparecerá aquí.</p>
      )}
    </div>
  )
}
