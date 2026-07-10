"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import { useSession } from "@/shared/store/session"
import type { Role } from "@/shared/schemas/auth"
import { ModuleHeader } from "@/shared/components/module-header"
import { EmptyState } from "@/shared/components/states"
import { Card } from "@/shadcn/card"
import { Button } from "@/shadcn/button"
import { Input } from "@/shadcn/input"
import { Label } from "@/shadcn/label"
import { Separator } from "@/shadcn/separator"

// Perfil del usuario autenticado: datos de solo lectura (nombre, correo, rol)
// más un formulario para editar el nombre y cambiar la contraseña.
// ponytail: persiste contra el store local (mock); cablear a PATCH /me cuando exista.

const roleLabel: Record<Role, string> = {
  ADMIN: "Administrador",
  PROFESSOR: "Profesor",
  STUDENT: "Alumno",
  GUARDIAN: "Representante",
}

const profileFormSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .or(z.literal("")),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((v) => v.newPassword === "" || v.currentPassword.length > 0, {
    message: "Ingresa tu contraseña actual para cambiarla",
    path: ["currentPassword"],
  })

type ProfileFormInput = z.infer<typeof profileFormSchema>

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null
}

export function ProfileView() {
  const user = useSession((s) => s.user)
  const setUser = useSession((s) => s.setUser)

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name ?? "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  if (!user) {
    return (
      <EmptyState
        title="No has iniciado sesión"
        description="Inicia sesión para ver y editar tu perfil."
      />
    )
  }

  async function onSubmit(values: ProfileFormInput) {
    setUser({ ...user!, name: values.name })
    toast.success("Perfil actualizado")
    form.reset({
      name: values.name,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  return (
    <div>
      <ModuleHeader
        title="Mi perfil"
        description="Consulta tus datos de cuenta y actualiza tu información."
      />

      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Card className="p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Nombre</dt>
              <dd className="text-sm font-medium">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Correo</dt>
              <dd className="text-sm font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Rol</dt>
              <dd className="text-sm font-medium">{roleLabel[user.role]}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6"
          >
            <section className="flex flex-col gap-4">
              <h2 className="disp text-[11px] text-muted-foreground">
                Editar nombre
              </h2>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" {...form.register("name")} />
                <FieldError message={form.formState.errors.name?.message} />
              </div>
            </section>

            <Separator />

            <section className="flex flex-col gap-4">
              <h2 className="disp text-[11px] text-muted-foreground">
                Cambiar contraseña
              </h2>
              <div className="flex flex-col gap-2">
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...form.register("currentPassword")}
                />
                <FieldError
                  message={form.formState.errors.currentPassword?.message}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="opcional"
                    {...form.register("newPassword")}
                  />
                  <FieldError
                    message={form.formState.errors.newPassword?.message}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                  />
                  <FieldError
                    message={form.formState.errors.confirmPassword?.message}
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Guardando…" : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
