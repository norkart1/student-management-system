import type { Metadata } from "next"
import type { ReactNode } from "react"
import "./globals.css"

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
    <html lang="en">
      <body className="font-['Anek_Latin','Anek_Malayalam',sans-serif] antialiased">
        {children}
      </body>
    </html>
  )
}
