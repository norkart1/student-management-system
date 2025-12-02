import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#329D9C",
}

export const metadata: Metadata = {
  title: "Student Management System",
  description: "Comprehensive student, teacher, and academic management platform",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Student Management System",
    description: "Comprehensive student, teacher, and academic management platform",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
