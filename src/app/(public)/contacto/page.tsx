"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { contactSchema, type ContactInput } from "@/shared/schemas/public"
import { submitContact } from "@/modules/public/api"
import {
  SectionHeader,
  Eyebrow,
} from "@/modules/public/components/section-header"
import { PhotoPlaceholder } from "@/modules/public/components/photo-placeholder"

const info = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
      </svg>
    ),
    title: "Sede",
    lines: "Av. del Dojo 58,\nCol. Centro, CDMX 06000",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18.497 4.409a10 10 0 0 1 -10.36 16.828l-.223 -.098l-4.759 .849l-.11 .011a1 1 0 0 1 -.11 0l-.102 -.013l-.108 -.024l-.105 -.037l-.099 -.047l-.093 -.058l-.014 -.011l-.012 -.007l-.086 -.073l-.077 -.08l-.067 -.088l-.056 -.094l-.034 -.07l-.04 -.108l-.028 -.128l-.012 -.102a1 1 0 0 1 0 -.125l.012 -.1l.024 -.11l.045 -.122l1.433 -3.304l-.009 -.014a10 10 0 0 1 1.549 -12.454l.215 -.203a10 10 0 0 1 13.226 -.217m-8.997 3.09a1.5 1.5 0 0 0 -1.5 1.5v1a6 6 0 0 0 6 6h1a1.5 1.5 0 0 0 0 -3h-1l-.144 .007a1.5 1.5 0 0 0 -1.128 .697l-.042 .074l-.022 -.007a4.01 4.01 0 0 1 -2.435 -2.435l-.008 -.023l.075 -.041a1.5 1.5 0 0 0 .704 -1.272v-1a1.5 1.5 0 0 0 -1.5 -1.5" />
      </svg>
    ),
    title: "Llámanos",
    lines: "(+58) 414-3210449",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z" />
        <path d="M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z" />
      </svg>
    ),
    title: "Escríbenos",
    lines: "contacto@gekidokan.com.ve",
  },
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
    <div className="my-20">
      <section className="mx-auto max-w-[1180px] px-8 pt-9 pb-1.5">
        <SectionHeader
          eyebrow="Visítanos"
          title="Nuestra ubicación"
          lead="¿Listo para empezar? Escríbenos o pásate por el dōjō. Estaremos encantados de resolver tus dudas y darte la bienvenida."
        />
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-4 px-8 py-7 sm:grid-cols-2 lg:grid-cols-3">
        {info.map((i) => (
          <div
            key={i.title}
            className="rounded-xl border border-line bg-white px-[22px] py-6"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-[19px] text-white">
              {i.icon}
            </div>
            <h3 className="disp mb-2 text-[15px] font-bold">{i.title}</h3>
            <p className="text-[13.5px] leading-[1.55] whitespace-pre-line text-ink-muted">
              {i.lines}
            </p>
          </div>
        ))}
      </section>

      {/* FORMULARIO + IMAGEN */}
      <section className="mx-auto grid max-w-[1180px] items-center gap-12 px-8 py-6 md:grid-cols-[0.85fr_1fr]">
        <PhotoPlaceholder
          label="foto · combate kumite"
          step={12}
          className="aspect-3/4 justify-center rounded-[14px] p-[18px]"
        />

        <div>
          <Eyebrow className="mb-2.5">Estamos para ti</Eyebrow>
          <h2 className="disp mb-2 text-[36px] font-bold">Escríbenos</h2>
          <p className="mb-7 text-[15px] text-ink-muted">
            Completa el formulario y te responderemos en menos de 24 horas.
          </p>

          {sent ? (
            <div className="rounded-xl bg-foreground px-7 py-6.5 text-white shadow-[6px_6px_0_var(--primary)]">
              <div className="disp mb-2 text-xl font-bold">
                ¡Mensaje enviado! 🥋
              </div>
              <p className="text-[14.5px] text-ink-inverse">
                Gracias por escribirnos. Nuestro equipo te contactará muy
                pronto.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="disp mt-4 rounded-[7px] border border-line-inverse px-[18px] py-[9px] text-[12.5px] font-semibold text-white"
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
                  className="fld text-ink-muted"
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
                  className="fld text-ink-muted"
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
                className="disp w-full rounded-[9px] bg-primary p-[17px] text-[15px] font-semibold text-white transition-colors hover:bg-primary-strong disabled:opacity-50"
              >
                {isSubmitting ? "Enviando…" : "Enviar mensaje"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* MAPA */}
      <section className="mx-auto aspect-video max-w-[1180px] px-8 pt-5 pb-12.5">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.19142939669!2d-63.86135108926896!3d11.024259654527935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c318f0077508737%3A0xdf23dc6f2f529231!2sGekidokan!5e0!3m2!1ses!2sus!4v1783620404687!5m2!1ses!2sus"

          loading="lazy"
          className="h-full w-full"
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
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
      {error ? <p className="mt-1 text-xs text-primary">{error}</p> : null}
    </div>
  )
}
