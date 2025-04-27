"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LayoutWatcher() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
    const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null

    const isAdminLoggedIn = accessToken && (userRole === "ADMIN" || userRole === "STAFF")
    const isAdminPath = pathname.startsWith("/admin")

    // console.log({pathname, isAdminLoggedIn, isAdminPath})

    if (isAdminLoggedIn && !isAdminPath) {
      console.log("[LayoutWatcher] 관리자가 admin 영역 벗어남. 로그아웃 실행")

      // localStorage에서 관련 정보 제거
      localStorage.removeItem("accessToken")
      localStorage.removeItem("userId")
      localStorage.removeItem("userRole")
      localStorage.removeItem("auth-storage")

      // 강제로 새로고침해서 클린한 상태로
      router.replace("/")
      router.refresh()
    }
  }, [pathname])

  return null
}