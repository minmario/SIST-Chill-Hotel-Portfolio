"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import AdminHeader from "@/components/admin-header"
import { jwtDecode } from "jwt-decode"

type JwtPayload = {
  sub: string
  role: string
  exp: number
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const isPublicPath =
      pathname === "/admin" ||
      pathname === "/admin/register" ||
      pathname === "/admin/register/complete"

    if (isPublicPath) {
      setChecking(false)
      return
    }

    const token = localStorage.getItem("accessToken")

    if (!token) {
      router.push("/admin")
      return
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const now = Math.floor(Date.now() / 1000)

      if (decoded.exp < now || (decoded.role !== "ADMIN" && decoded.role !== "STAFF")) {
        router.push("/admin")
        return
      }

      setChecking(false)
    } catch (e) {
      console.error("JWT 파싱 오류:", e)
      router.push("/admin")
    }
  }, [pathname, router])

  if (checking) return null

  const isLoginPage =
    pathname === "/admin" ||
    pathname === "/admin/register" ||
    pathname === "/admin/register/complete"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
    <aside className="w-64 sticky top-0 self-start min-h-screen bg-gray-900 text-white">
      <AdminSidebar />
    </aside>
 
    <section className="flex-1 bg-gray-100 min-h-screen overflow-hidden">
      {/* ✅ 여기 추가 */}
      <AdminHeader/>

      <main className="flex-1 p-8 overflow-auto w-full">{children}</main>
    </section>
  </div>
  )
}
