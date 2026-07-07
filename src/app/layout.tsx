import type { Metadata } from "next"
import { Geist_Mono, Inter, Noto_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/shared/components/theme-provider"
import { Toaster } from "@/shadcn/sonner"
import { cn } from "@/shared/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Gekidokan — Academia de Karate y Kobudo",
    template: "%s · Gekidokan",
  },
  description:
    "Academia de Karate Shotokan y Kobudo de Okinawa. Clases para niños y adultos.",
}

const notoSansHeading = Noto_Sans({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable, notoSansHeading.variable)}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
