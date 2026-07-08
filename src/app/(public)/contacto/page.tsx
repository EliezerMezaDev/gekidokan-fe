"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { contactSchema, type ContactInput } from "@/shared/schemas/public"
import { submitContact } from "@/modules/public/api"

// Metadata no se exporta desde un client component; el <title> lo cubre el
// layout raíz. El foco de esta página es el formulario (US-12).

const stripes =
  "repeating-linear-gradient(45deg,#efe7e7,#efe7e7 12px,#e7dede 12px,#e7dede 24px)"

const info = [
  { icon: "📍", title: "Sede", lines: "Av. del Dojo 58,\nCol. Centro, CDMX 06000" },
  { icon: "✆", title: "Llámanos", lines: "+52 55 1234 5678\n+52 55 8765 4321" },
  {
    icon: "✉",
    title: "Escríbenos",
    lines: "hola@bushidodojo.mx\ninscripciones@bushidodojo.mx",
  },
  { icon: "🕑", title: "Horario", lines: "Lun a Vie · 9:00 – 20:30\nSáb · 9:00 – 14:00" },
]

const interests = [
  { value: "INFANTIL", label: "Karate infantil" },
  { value: "JOVENES_ADULTOS", label: "Jóvenes y adultos" },
  { value: "KOBUDO", label: "Kobudo" },
  { value: "FAMILIAS", label: "Familias" },
]

const sources = [
  { value: "RECOMENDACION", label: "Recomendación" },
  { value: "REDES", label: "Redes sociales" },
  { value: "BUSQUEDA", label: "Búsqueda web" },
  { value: "PASO_DOJO", label: "Paso por el dojo" },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      interest: undefined,
      source: undefined,
      message: "",
    },
  })

  async function onSubmit(values: ContactInput) {
    try {
      await submitContact(values)
      setSent(true)
      reset()
      toast.success("Mensaje enviado. Te responderemos pronto.")
    } catch {
      toast.error(
        "No pudimos enviar tu mensaje. Intenta de nuevo en un momento."
      )
    }
  }

  return (
    <div>
      {/* CABECERA */}
      <section className="mx-auto max-w-[1180px] px-8 pt-9 pb-1.5">
        <p className="disp mb-3 flex items-center gap-2 text-sm font-semibold text-[#eb1c24]">
          <span className="h-0.5 w-[22px] bg-[#eb1c24]" />
          Visítanos
        </p>
        <h1 className="disp mb-3.5 text-[46px] leading-[1.05] font-bold">
          Nuestra ubicación
        </h1>
        <p className="max-w-[560px] text-base leading-relaxed text-[#6b6363]">
          ¿Listo para empezar? Escríbenos o pásate por el dōjō. Estaremos
          encantados de resolver tus dudas y darte la bienvenida.
        </p>
      </section>

      {/* TARJETAS DE INFO */}
      <section className="mx-auto grid max-w-[1180px] gap-4 px-8 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {info.map((i) => (
          <div
            key={i.title}
            className="rounded-xl border border-[#ece3e3] bg-white px-[22px] py-6"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#eb1c24] text-[19px] text-white">
              {i.icon}
            </div>
            <h3 className="disp mb-2 text-[15px] font-bold">{i.title}</h3>
            <p className="text-[13.5px] leading-[1.55] whitespace-pre-line text-[#6b6363]">
              {i.lines}
            </p>
          </div>
        ))}
      </section>

      {/* FORMULARIO + IMAGEN */}
      <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-8 py-6 md:grid-cols-[0.85fr_1fr]">
        <div
          className="flex aspect-3/4 items-end justify-center rounded-[14px] p-[18px]"
          style={{ background: stripes }}
        >
          <span className="rounded bg-[#f7f1f1] px-2 py-1 font-mono text-[11px] text-[#8a8080]">
            foto · combate kumite
          </span>
        </div>

        <div>
          <p className="disp mb-2.5 flex items-center gap-2 text-sm font-semibold text-[#eb1c24]">
            <span className="h-0.5 w-[22px] bg-[#eb1c24]" />
            Estamos para ti
          </p>
          <h2 className="disp mb-2 text-[36px] font-bold">Escríbenos</h2>
          <p className="mb-7 text-[15px] text-[#6b6363]">
            Completa el formulario y te responderemos en menos de 24 horas.
          </p>

          {sent ? (
            <div className="rounded-xl bg-[#1c1717] px-7 py-6.5 text-white shadow-[6px_6px_0_#eb1c24]">
              <div className="disp mb-2 text-xl font-bold">
                ¡Mensaje enviado! 🥋
              </div>
              <p className="text-[14.5px] text-[#c9c0c0]">
                Gracias por escribirnos. Nuestro equipo te contactará muy
                pronto.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="disp mt-4 rounded-[7px] border border-[#4a4040] px-[18px] py-[9px] text-[12.5px] font-semibold text-white"
              >
                Enviar otro
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-[22px] grid grid-cols-1 gap-x-6 gap-y-[22px] sm:grid-cols-2">
                <Field error={errors.name?.message}>
                  <input
                    className="fld"
                    placeholder="Nombre*"
                    autoComplete="given-name"
                    {...register("name")}
                  />
                </Field>
                <Field error={errors.lastName?.message}>
                  <input
                    className="fld"
                    placeholder="Apellido*"
                    autoComplete="family-name"
                    {...register("lastName")}
                  />
                </Field>
                <Field error={errors.email?.message}>
                  <input
                    className="fld"
                    type="email"
                    placeholder="Email*"
                    autoComplete="email"
                    {...register("email")}
                  />
                </Field>
                <Field error={errors.phone?.message}>
                  <input
                    className="fld"
                    placeholder="Teléfono*"
                    autoComplete="tel"
                    {...register("phone")}
                  />
                </Field>
                <select
                  className="fld text-[#6b6363]"
                  defaultValue=""
                  {...register("interest", {
                    setValueAs: (v) => (v === "" ? undefined : v),
                  })}
                >
                  <option value="">Tipo de clase de interés</option>
                  {interests.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <select
                  className="fld text-[#6b6363]"
                  defaultValue=""
                  {...register("source", {
                    setValueAs: (v) => (v === "" ? undefined : v),
                  })}
                >
                  <option value="">¿Cómo nos conociste?</option>
                  {sources.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className="fld mb-[30px]"
                placeholder="Mensaje"
                {...register("message")}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="disp w-full rounded-[9px] bg-[#eb1c24] p-[17px] text-[15px] font-semibold text-white transition-colors hover:bg-[#c11119] disabled:opacity-50"
              >
                {isSubmitting ? "Enviando…" : "Enviar mensaje"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* MAPA */}
      <section className="mx-auto max-w-[1180px] px-8 pt-5 pb-12.5">
        <div className="relative flex h-[340px] items-center justify-center overflow-hidden rounded-[14px] bg-[#2a2626]">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(#3a3535 1px,transparent 1px),linear-gradient(90deg,#3a3535 1px,transparent 1px)",
              backgroundSize: "52px 52px",
            }}
          />
          <div className="relative text-center">
            <div className="mx-auto mb-3.5 h-10 w-10 rotate-[-45deg] rounded-tl-full rounded-tr-full rounded-bl-full bg-[#eb1c24] shadow-[0_6px_16px_rgba(0,0,0,0.4)]" />
            <div className="disp text-base font-bold text-white">
              Bushidō Dōjō
            </div>
            <div className="mt-1 text-[13px] text-[#b7aeae]">
              Av. del Dojo 58, Col. Centro · CDMX
            </div>
          </div>
          <div className="absolute top-3.5 left-3.5 flex gap-1.5">
            <span className="disp rounded-md bg-white px-3 py-1.5 text-[11px] font-semibold text-[#1c1717]">
              Mapa
            </span>
            <span className="disp rounded-md bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white">
              Satélite
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

function Field({
  error,
  children,
}: {
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
      {error ? <p className="mt-1 text-xs text-[#eb1c24]">{error}</p> : null}
    </div>
  )
}
