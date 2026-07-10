import { ExchangeRateView } from "@/modules/billing/exchange-rate-view"

// La página solo monta la vista de tipo de cambio; la lógica vive en el módulo.
export default function ExchangeRatePage() {
  return <ExchangeRateView />
}
