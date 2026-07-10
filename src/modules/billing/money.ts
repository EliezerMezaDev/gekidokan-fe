// Formatters de moneda del módulo de facturación.
// ponytail: moneda local fija (VES); parametrizar si se agregan más países.

export const usdFmt = new Intl.NumberFormat("es-VE", {
  style: "currency",
  currency: "USD",
})

export const localFmt = new Intl.NumberFormat("es-VE", {
  style: "currency",
  currency: "VES",
})
