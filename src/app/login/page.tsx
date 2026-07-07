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
import { Button } from "@/shadcn/button"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shadcn/card"
import { Alert, AlertDescription } from "@/shadcn/alert"

function safeNext(next: string | null): string | null {
  // Evita open-redirect: solo rutas internas.
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Gekidokan</CardTitle>
        <CardDescription>Inicia sesión para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
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
              autoComplete="email"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
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
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
