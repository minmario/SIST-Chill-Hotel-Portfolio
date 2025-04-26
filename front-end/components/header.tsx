"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingCart, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from '@/context/cart-context'
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { totalItems } = useCart()
  const pathname = usePathname()
  const { logout, isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  const handleLogout = async () => {
    await logout();  // logout() 안에 이미 fetch 요청 들어있음
    router.push('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
      style={{ height: "80px" }}
    >
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center" style={{ height: 56 }}>
          <Image 
            src="/logo1.png"
            alt="ChillHaven 로고"
            width={120} // 원하는 크기로 조정
            height={50}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/service" className="transition-colors" style={{ color: isScrolled ? "#333333" : "#111827" }}>
            고객센터
          </Link>
          <Link href="/rooms" className="transition-colors" style={{ color: isScrolled ? "#333333" : "#111827" }}>
            객실
          </Link>
          <Link href="/offers" className="transition-colors" style={{ color: isScrolled ? "#333333" : "#111827" }}>
            스페셜 오퍼
          </Link>
          <Link href="/dining" className="transition-colors" style={{ color: isScrolled ? "#333333" : "#111827" }}>
            다이닝
          </Link>
          <Link href="/facilities" className="transition-colors" style={{ color: isScrolled ? "#333333" : "#111827" }}>
            편의시설
          </Link>
          <Link href="/membership" className="transition-colors" style={{ color: isScrolled ? "#333333" : "#111827" }}>
            멤버십
          </Link>
          <Link
            href="/booking/check"
            className="transition-colors"
            style={{ color: isScrolled ? "#333333" : "#111827" }}
          >
            예약확인
          </Link>
          <Link href="/store" className="transition-colors" style={{ color: isScrolled ? "#333333" : "#111827" }}>
            기프트샵
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="relative transition-colors"
            style={{ color: isScrolled ? "#333333" : "#111827" }}
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                style={{ backgroundColor: "#2dd4bf" }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/mypage"
                className="relative transition-colors"
                style={{ color: isScrolled ? "#333333" : "#111827" }}
              >
                <User size={24} />
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-md font-medium py-2 px-4 text-white transition-colors"
                style={{ backgroundColor: "#2dd4bf" }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md font-medium py-2 px-4 text-white transition-colors"
              style={{ backgroundColor: "#2dd4bf" }}
            >
              로그인
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <Link
            href="/cart"
            className="relative transition-colors"
            style={{ color: isScrolled ? "#333333" : "#111827" }}
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                style={{ backgroundColor: "#2dd4bf" }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {isLoggedIn && (
            <Link
              href="/mypage"
              className="relative transition-colors"
              style={{ color: isScrolled ? "#333333" : "#111827" }}
            >
              <User size={24} />
            </Link>
          )}

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="메뉴 토글">
            {isMenuOpen ? (
              <X size={24} color={isScrolled ? "#333333" : "#111827"} />
            ) : (
              <Menu size={24} color={isScrolled ? "#333333" : "#111827"} />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 pt-20">
            <nav className="container flex flex-col gap-4 p-4">
              <Link
                href="/service"
                className="text-lg py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                고객센터
              </Link>
              <Link
                href="/rooms"
                className="text-lg py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                객실
              </Link>
              <Link
                href="/offers"
                className="text-lg py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                스페셜 오퍼
              </Link>
              <Link
                href="/dining"
                className="text-lg py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                다이닝
              </Link>
              <Link
                href="/facilities"
                className="text-lg py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                편의시설
              </Link>
              <Link
                href="/membership"
                className="text-lg py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                멤버십
              </Link>
              <Link
                href="/booking/check"
                className="text-lg py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                예약확인
              </Link>
              <Link
                href="/store"
                className="text-lg py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                기프트샵
              </Link>

              <div className="mt-8">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/mypage"
                      className="block py-2 mb-2 w-full text-center border border-gray-300 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="block py-2 w-full text-center bg-red-500 text-white rounded"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block py-2 w-full text-center"
                    style={{ backgroundColor: "#2dd4bf", color: "#fff", borderRadius: "0.375rem" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    로그인
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

