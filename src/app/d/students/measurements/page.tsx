import { MeasurementsBatchView } from "@/modules/attendance/measurements-batch-view"

// La página solo monta la vista; no usa useSearchParams, no necesita Suspense.
export default function MeasurementsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Toma de mediciones</h1>
      <MeasurementsBatchView />
    </div>
  )
}
