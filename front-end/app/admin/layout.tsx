"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import AdminSidebar from "@/components/admin-sidebar"
import AdminHeader from "@/components/admin-header"



// 관리자 권한 체크 함수를 수정합니다.
const isAdmin = (userId: string) => {
  // 모든 사용자에게 관리자 권한 부여
  return true
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoggedIn } = useAuth()
  const isLoginPage = pathname === "/login"

  // Update the useEffect hook to redirect from /admin to /admin/dashboard
  useEffect(() => {
    // Skip auth check for the admin login page
    if (pathname === "/admin") {
      return
    }

    // 로그인 상태 및 관리자 권한 체크
    console.log("관리자 레이아웃 권한 체크:", { isLoggedIn, user })

    if (!isLoggedIn) {
      console.log("로그인 상태가 아님, 관리자 로그인 페이지로 리다이렉트")
      router.push("/admin")
      return
    }

    if (user && !isAdmin(user.userId)) {
      console.log("관리자 권한이 없음, 관리자 로그인 페이지로 리다이렉트")
      router.push("/admin")
      return
    }

    console.log("관리자 권한 확인 완료")
  }, [isLoggedIn, user, router, pathname])

  // Don't show sidebar on the admin login page
  if (pathname === "/admin") {
    return <>{children}</>
  }

  // 권한 체크 중에는 아무것도 렌더링하지 않음
  if (!isLoggedIn || !user || !isAdmin(user.userId)) {
    return null
  }

  return (
    <div className="flex min-h-screen">
    <div className="w-64 flex-shrink-0 sticky top-0 h-screen">
      <AdminSidebar />
    </div>
    <div className="flex-1 bg-gray-100 min-h-screen">
      {/* ✅ 여기 추가 */}
      <AdminHeader />

      <main className="p-8">{children}</main>
    </div>
  </div>
  )
}

