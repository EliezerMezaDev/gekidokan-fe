"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconAlertTriangle } from "@tabler/icons-react"
import { loginSchema, type LoginInput } from "@/shared/schemas/auth"
import { login, homeForRole } from "@/shared/lib/auth"
import { ApiError } from "@/shared/lib/api"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/shadcn/button"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import { Alert, AlertDescription } from "@/shadcn/alert"

function safeNext(next: string | null): string | null {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null
}

function LoginForm() {
  const router = useRouter()
  const next = safeNext(useSearchParams().get("next"))
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginInput) {
    setFormError(null)
    try {
      const user = await login(values)
      toast.success(`Bienvenido, ${user.name}`)
      router.replace(next ?? homeForRole(user.role))
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "No pudimos iniciar sesión. Intenta de nuevo."
      setFormError(message)
      toast.error(message)
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-card p-12 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-center">
        <img
          src="/images/brand/isologo.png"
          alt="Gekidokan - Logo"
          className="h-24 w-24 rounded-full object-contain"
        />
      </div>

      <h1 className="text-center text-2xl font-bold">Inicia sesión</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-4"
        noValidate
      >
        {formError ? (
          <Alert variant="destructive">
            <IconAlertTriangle className="size-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Tu contraseña"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-background">
      <div className="absolute inset-4 overflow-hidden rounded-lg">
        <Image
          src="/images/assets/patter-light.svg"
          alt=""
          fill
          priority
          className="object-cover dark:hidden"
        />
        <Image
          src="/images/assets/pattern-dark.svg"
          alt=""
          fill
          priority
          className="hidden object-cover dark:block"
        />
      </div>

      <div className="relative z-10 flex min-h-svh items-center justify-center">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
