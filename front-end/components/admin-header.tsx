"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function AdminHeader() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoggedIn, logout } = useAuth()

  useEffect(() => {
    // 스크롤 상태 처리
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    window.addEventListener("scroll", handleScroll)
  
    // ✅ admin 영역 벗어날 경우 토큰 제거 및 로그아웃
    if (!pathname.startsWith("/admin")) {
      console.log("[AdminHeader] admin 영역 벗어남. 로그아웃 실행")
      logout()
    }
  
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled, pathname])
  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white text-black shadow-md" : "bg-black text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-10 w-10">
            <Image src="/logo2.PNG" alt="Chill Haven Logo" width={40} height={40} className="object-contain border border-white rounded" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Chill Haven</h1>
            <p className="text-xs">Administration System</p>
          </div>
        </Link>

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
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant={scrolled ? "default" : "secondary"} size="sm" asChild>
              <Link href="/">로그인</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
