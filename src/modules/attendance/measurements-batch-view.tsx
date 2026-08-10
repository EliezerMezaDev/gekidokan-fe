"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/table"
import { Input } from "@/shadcn/input"
import { Button } from "@/shadcn/button"
import { Card } from "@/shadcn/card"
import { getStudents } from "@/modules/students/api"
import type { Student } from "@/shared/schemas/students"
import type { Measurement } from "@/shared/schemas/attendance"
import { getMeasurements, saveMeasurements } from "./api"

// Toma de mediciones en lote: una fila por alumno, altura/peso opcionales por
// fila. Solo se envían las filas donde el usuario escribió algo. No usa
// DataTable genérico porque no es un listado con export/filtros, es un form.

type Draft = { height: string; weight: string }

export function MeasurementsBatchView() {
  const [students, setStudents] = useState<Student[]>([])
  const [lastMeasurements, setLastMeasurements] = useState<Record<string, Measurement>>({})
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const [studentList, measurements] = await Promise.all([
        getStudents(),
        getMeasurements(),
      ])
      setStudents(studentList)
      // ponytail: última medición por alumno = último elemento del array mock
      // por studentId (no viene ordenado por fecha, alcanza para el placeholder).
      const last: Record<string, Measurement> = {}
      for (const m of measurements) last[m.studentId] = m
      setLastMeasurements(last)
      setLoading(false)
    }
    load()
  }, [])

  function setField(studentId: string, field: keyof Draft, value: string) {
    setDrafts((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value } as Draft,
    }))
  }

  async function handleSave() {
    const batch = Object.entries(drafts)
      .filter(([, d]) => d.height || d.weight)
      .map(([studentId, d]) => ({
        studentId,
        height: d.height ? Number(d.height) : undefined,
        weight: d.weight ? Number(d.weight) : undefined,
      }))
    if (batch.length === 0) {
      toast.error("Ingresa al menos una medición")
      return
    }
    setSaving(true)
    try {
      await saveMeasurements(batch)
      toast.success(`Mediciones guardadas (${batch.length})`)
      setDrafts({})
    } catch {
      toast.error("No se pudieron guardar las mediciones. Intenta de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Cargando alumnos…</p>
  }

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alumno</TableHead>
            <TableHead>Altura (cm)</TableHead>
            <TableHead>Peso (kg)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.firstName} {s.lastName}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder={lastMeasurements[s.id]?.height?.toString() ?? "—"}
                  value={drafts[s.id]?.height ?? ""}
                  onChange={(e) => setField(s.id, "height", e.target.value)}
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder={lastMeasurements[s.id]?.weight?.toString() ?? "—"}
                  value={drafts[s.id]?.weight ?? ""}
                  onChange={(e) => setField(s.id, "weight", e.target.value)}
                  className="w-24"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Guardando…" : "Guardar mediciones"}
        </Button>
      </div>
    </Card>
  )
}
