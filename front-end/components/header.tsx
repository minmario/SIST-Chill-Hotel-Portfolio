"use client"

import { useState, useEffect, useCallback, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingCart, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from '@/context/cart-context'
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

// 메모화된 NavLink 컴포넌트
const NavLink = memo(({ href, children, isScrolled }: { href: string; children: React.ReactNode; isScrolled: boolean }) => (
  <Link href={href} className="transition-colors" style={{ color: isScrolled ? "#333333" : "#111827" }}>
    {children}
  </Link>
));
NavLink.displayName = 'NavLink';

// 모바일 메뉴 링크
const MobileLink = memo(({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) => (
  <Link
    href={href}
    className="text-lg py-2 border-b border-gray-100"
    onClick={onClick}
  >
    {children}
  </Link>
));
MobileLink.displayName = 'MobileLink';

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

  const handleLogout = useCallback(() => {
    logout()
    router.push('/')
  }, [logout, router])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

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
            width={120}
            height={50}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/service" isScrolled={isScrolled}>고객센터</NavLink>
          <NavLink href="/rooms" isScrolled={isScrolled}>객실</NavLink>
          <NavLink href="/offers" isScrolled={isScrolled}>스페셜 오퍼</NavLink>
          <NavLink href="/dining" isScrolled={isScrolled}>다이닝</NavLink>
          <NavLink href="/facilities" isScrolled={isScrolled}>편의시설</NavLink>
          <NavLink href="/membership" isScrolled={isScrolled}>멤버십</NavLink>
          <NavLink href="/booking/check" isScrolled={isScrolled}>예약확인</NavLink>
          <NavLink href="/store" isScrolled={isScrolled}>기프트샵</NavLink>
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

          <button className="md:hidden" onClick={toggleMenu} aria-label="메뉴 토글">
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
              <MobileLink href="/service" onClick={closeMenu}>고객센터</MobileLink>
              <MobileLink href="/rooms" onClick={closeMenu}>객실</MobileLink>
              <MobileLink href="/offers" onClick={closeMenu}>스페셜 오퍼</MobileLink>
              <MobileLink href="/dining" onClick={closeMenu}>다이닝</MobileLink>
              <MobileLink href="/facilities" onClick={closeMenu}>편의시설</MobileLink>
              <MobileLink href="/membership" onClick={closeMenu}>멤버십</MobileLink>
              <MobileLink href="/booking/check" onClick={closeMenu}>예약확인</MobileLink>
              <MobileLink href="/store" onClick={closeMenu}>기프트샵</MobileLink>

              {isLoggedIn ? (
                <>
                  <MobileLink href="/mypage" onClick={closeMenu}>마이페이지</MobileLink>
                  <button
                    onClick={() => {
                      handleLogout()
                      closeMenu()
                    }}
                    className="text-lg py-4 mt-4 text-center rounded-md font-medium text-white"
                    style={{ backgroundColor: "#2dd4bf" }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-lg py-4 mt-4 text-center rounded-md font-medium text-white"
                  style={{ backgroundColor: "#2dd4bf" }}
                  onClick={closeMenu}
                >
                  로그인
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default memo(Header)

