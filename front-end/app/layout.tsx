import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/context/cart-context"
<<<<<<< HEAD
import { AuthProvider } from "@/context/auth-context"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SIST Chill Hotel",
  description: "SIST Chill Hotel - Your Perfect Stay",
=======

export const metadata: Metadata = {
  title: "럭스 호텔 - 럭셔리 숙박 시설",
  description: "럭스 호텔에서 최고급 서비스와 럭셔리한 경험을 느껴보세요.",
>>>>>>> graz1e
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
<<<<<<< HEAD
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main style={{ paddingTop: "80px" }}>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
=======
      <body>
        <CartProvider>
          <Header />
          <main style={{ paddingTop: "80px" }}>{children}</main>
          <Footer />
        </CartProvider>
>>>>>>> graz1e
      </body>
    </html>
  )
}

import "./globals.css"



import './globals.css'