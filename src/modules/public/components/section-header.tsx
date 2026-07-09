import type { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/shared/lib/utils"

function EyebrowOrnament({
  name,
  width,
  alt,
}: {
  name: "before" | "after"
  width: number
  alt: string
}) {
  return (
    <>
      <Image
        src={`/images/assets/eyebrow-${name}.png`}
        alt={alt}
        width={width}
        height={20}
        className="dark:hidden"
        aria-hidden
      />
      <Image
        src={`/images/assets/eyebrow-${name}-dark.png`}
        alt={alt}
        width={width}
        height={20}
        className="hidden dark:block"
        aria-hidden
      />
    </>
  )
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "disp mb-3 flex items-center gap-2 text-sm font-semibold text-primary",
        className
      )}
    >
      <EyebrowOrnament name="before" width={50} alt="" />
      {children}
      <EyebrowOrnament name="after" width={60} alt="" />
    </p>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string
  title: string
  lead?: string
}) {
  return (
    <>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="disp mb-3.5 text-[46px] leading-[1.05] font-bold">
        {title}
      </h1>
      {lead ? (
        <p className="max-w-[560px] text-base leading-relaxed text-ink-muted">
          {lead}
        </p>
      ) : null}
    </>
  )
}
