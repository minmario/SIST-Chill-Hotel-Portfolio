import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"
import { Inter } from "next/font/google"
import LayoutWatcher from "@/components/layout-watcher" // ✅ 추가

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SIST Chill Hotel",
  description: "SIST Chill Hotel - Your Perfect Stay",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <LayoutWatcher /> {/* ✅ 감시용 컴포넌트 배치 */}
            <Header />
            <main style={{ paddingTop: "80px" }}>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}