import type { MetadataRoute } from "next"

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Áreas privadas: no indexar la app interna ni el login.
      disallow: ["/d", "/s", "/login"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
