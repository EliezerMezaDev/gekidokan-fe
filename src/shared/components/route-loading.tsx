import { LoadingState } from "@/shared/components/states"

// Fallback instantáneo entre transiciones de ruta (`loading.tsx` de Next). La
// carga real de datos sigue siendo client-side (useEffect por vista); esto
// solo cubre el hueco mientras monta el chunk de la ruta.
export default function RouteLoading() {
  return (
    <div className="p-4 sm:p-6">
      <LoadingState rows={4} />
    </div>
  )
}
