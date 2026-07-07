"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconCircleCheck } from "@tabler/icons-react"
import { contactSchema, type ContactInput } from "@/shared/schemas/public"
import { submitContact } from "@/modules/public/api"
import { Button } from "@/shadcn/button"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import { Textarea } from "@/shadcn/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shadcn/card"

// Metadata no se exporta desde un client component; el <title> lo cubre el
// layout raíz. El foco de esta página es el formulario (US-12).

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  })

  async function onSubmit(values: ContactInput) {
    try {
      await submitContact(values)
      setSent(true)
      toast.success("Mensaje enviado. Te responderemos pronto.")
    } catch {
      toast.error("No pudimos enviar tu mensaje. Intenta de nuevo en un momento.")
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold">Contacto</h1>
        <p className="text-muted-foreground mt-2">
          ¿Quieres empezar o tienes dudas? Escríbenos y te contactamos.
        </p>
      </header>

      {sent ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <IconCircleCheck className="size-5" /> ¡Mensaje enviado!
            </CardTitle>
            <CardDescription>
              Gracias por escribirnos. Te responderemos a la brevedad.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setSent(false)}>
              Enviar otro mensaje
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" autoComplete="name" {...register("name")} />
            {errors.name ? <p className="text-destructive text-sm">{errors.name.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email ? <p className="text-destructive text-sm">{errors.email.message}</p> : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea id="message" rows={5} {...register("message")} />
            {errors.message ? <p className="text-destructive text-sm">{errors.message.message}</p> : null}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando…" : "Enviar mensaje"}
          </Button>
        </form>
      )}
    </div>
  )
}
