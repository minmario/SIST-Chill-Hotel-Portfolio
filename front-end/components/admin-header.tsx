"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function AdminHeader() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoggedIn, logout } = useAuth()

  const wasInAdmin = useRef(false) // ✅ 이전에 admin 안에 있었는지 기록하는 ref

  // ✅ 스크롤 감시
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  // ✅ admin -> 다른 곳으로 나갈 때만 로그아웃
  useEffect(() => {
    const handleLogoutIfNeeded = async () => {
      const isNowAdminPath = pathname.startsWith("/admin")
  
      if (wasInAdmin.current && !isNowAdminPath && isLoggedIn) {
        console.log("[AdminHeader] admin 영역을 벗어남 → 로그아웃 실행")
        await logout()         // ✅ logout 완료까지 기다리고
        router.push("/")       // ✅ 그 다음에 이동
      }
  
      wasInAdmin.current = isNowAdminPath // 현재 상태 기록
    }
  
    handleLogoutIfNeeded()
  }, [pathname, isLoggedIn])

  const handleLogoClick = async () => {
    if (isLoggedIn) {
      console.log("[AdminHeader] 로고 클릭 → 로그아웃 후 메인 이동")
      await logout()
    }
    router.push("/")
  }

  const handleLogout = async () => {
    console.log("[AdminHeader] 로그아웃 버튼 클릭")
    await logout()
    router.push("/")
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white text-black shadow-md" : "bg-black text-white"}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* 로고 클릭 */}
        <button onClick={handleLogoClick} className="flex items-center space-x-2 focus:outline-none">
          <div className="relative h-10 w-10">
            <Image src="/logo2.PNG" alt="Chill Haven Logo" width={40} height={40} className="object-contain border border-white rounded" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Chill Haven</h1>
            <p className="text-xs">Administration System</p>
          </div>
        </button>

        <div className="flex items-center">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={scrolled ? "outline" : "secondary"} size="sm" className={`flex items-center gap-2 border ${scrolled ? "border-black" : "border-white"}`}>
                  <User size={16} />
                  <span className="hidden sm:inline">{user?.name || user?.userId}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="bg-white text-black">
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-100">
                  <LogOut size={16} className="mr-2" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant={scrolled ? "default" : "secondary"} size="sm" asChild>
              <button onClick={handleLogoClick}>로그인</button>
            </Button>
          )}
        </div>

      </div>
    </header>
  )
}