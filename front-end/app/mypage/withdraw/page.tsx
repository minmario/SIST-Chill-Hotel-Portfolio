"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, CreditCard, LogOut, Award, Gift, AlertTriangle, Eye, EyeOff, Home } from "lucide-react"
import styles from "../mypage.module.css"
import { jwtDecode } from "jwt-decode"
import { useAuth } from "@/context/auth-context"
import Image from "next/image"

type JwtPayload = {
  sub: string
  role: string
  exp: number
}

export default function Withdraw() {
  const { logout } = useAuth();
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({
    userId: "",
    password: "",
  })
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  
    if (!loggedIn) {
      router.push("/login")
    } else {
      const token = localStorage.getItem("accessToken")
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token)
          setFormData((prev) => ({
            ...prev,
            userId: decoded.sub,  // ← 여기서 로그인한 유저 ID가 들어감
          }))
        } catch (error) {
          console.error("JWT 디코딩 실패:", error)
          router.push("/login")
        }
      }
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // 입력값 변경 시 해당 필드의 에러 메시지 초기화
    
  }

  const validateForm = () => {
    let isValid = true
    const errors = {
      userId: "",
      password: "",
    }

    if (!formData.userId) {
      errors.userId = "아이디를 입력해주세요."
      isValid = false
    }

    if (!formData.password) {
      errors.password = "비밀번호를 입력해주세요."
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!validateForm()) return
  
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch("/api/user/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 백엔드에서 JWT 인증 사용 시
        },
        body: JSON.stringify({ password: formData.password }),
      })
  
      if (!res.ok) {
        const message = await res.text()
        alert(message)
        return
      }
  
      setIsConfirmModalOpen(true)
    } catch (error) {
      console.error("비밀번호 확인 오류:", error)
      alert("비밀번호 확인 중 오류가 발생했습니다.")
    }
  }

   // ← 이거 위에 import 되어 있어야 함

   const handleConfirmWithdrawal = async () => {
    try {
      const token = localStorage.getItem("accessToken")
  
      const res = await fetch("/api/user/withdraw", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!res.ok) {
        const message = await res.text()
        alert(`탈퇴 실패: ${message}`)
        return
      }
  
      await logout();           // ✅ 반드시 await
      router.push("/")          // ✅ 리디렉션
      router.refresh();         // ✅ 상태 강제 재반영
  
    } catch (err) {
      console.error("탈퇴 요청 중 오류 발생:", err)
      alert("알 수 없는 오류가 발생했습니다.")
    }
  }

  if (!isLoggedIn) {
    return null // 로그인 페이지로 리디렉션 중
  }

  return (
    <>
      <div className={styles.header} style={{ position: 'relative', width: '100%', height: '300px', marginBottom: '2rem', overflow: 'hidden' }}>
  <Image
    src="/images/mypage/mypage-banner.PNG"   // ✅ 이 이미지 그대로 사용
    alt="마이페이지 배경"
    fill
    style={{ objectFit: 'cover' }}
    priority
  />
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.45)' }} />
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
    <div className="container">
      <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
        회원 탈퇴 
      </h1>
      <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 400, textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        회원 탈퇴를 진행하기 전에 아래의 내용을 확인해 주세요
      </p>
    </div>
  </div>
</div>

      <section className={styles.mypageSection}>
        <div className="container">
          {/* 브레드크럼 네비게이션 */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="flex items-center hover:text-primary-color transition-colors">
              <Home size={14} className="mr-1" />홈
            </Link>
            <span className="mx-2">›</span>
            <Link href="/mypage" className="hover:text-primary-color transition-colors">
              마이페이지
            </Link>
            <span className="mx-2">›</span>
            <span className="text-primary-color" style={{ color: "var(--primary-color)" }}>
              회원 탈퇴
            </span>
          </div>

          <div className={styles.mypageContainer}>
            {/* 사이드바 */}
            <div className={styles.sidebar}>
              <h2 className={styles.sidebarTitle}>
                <User size={20} className={styles.sidebarIcon} />
                마이페이지
              </h2>

              <ul className={styles.sidebarNav}>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage" className={styles.sidebarNavLink}>
                    <Award size={18} />
                    Chill Haven 등급 및 포인트
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/points" className={styles.sidebarNavLink}>
                    <Gift size={18} />
                    포인트 적립 내역 및 조회
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/info" className={styles.sidebarNavLink}>
                    <User size={18} />
                    마이페이지 정보 수정
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/withdraw" className={`${styles.sidebarNavLink} ${styles.sidebarNavLinkActive}`}>
                    <LogOut size={18} />
                    회원 탈퇴
                  </Link>
                </li>
                
              </ul>

              <div className={styles.customerService}>
                <h3 className={styles.customerServiceTitle}>고객 지원</h3>
                <p className={styles.customerServiceHours}>평일 09:00 - 18:00</p>
                <p className={styles.customerServicePhone}>1588-1234</p>
              </div>
            </div>

            {/* 콘텐츠 영역 */}
            <div className={styles.contentArea}>
              {/* 주의 메시지 */}
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start">
                <AlertTriangle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-700">
                  회원 탈퇴 시 모든 개인정보와 포인트가 삭제되며, 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold mb-4">회원 탈퇴 전 유의사항</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>탈퇴 시 모든 회원 정보는 즉시 삭제되며 복구할 수 없습니다.</li>
                  <li>보유하신 포인트는 모두 소멸되며, 환불되지 않습니다.</li>
                  <li>예약 내역이 있는 경우 탈퇴가 제한될 수 있습니다.</li>
                  <li>작성하신 리뷰, 문의 등의 게시물은 자동으로 삭제되지 않습니다.</li>
                  <li>탈퇴 후 동일한 이메일로 재가입이 가능하나, 이전 정보는 복구되지 않습니다.</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">회원 탈퇴 확인</h3>
                <p className="text-gray-600 mb-4">회원 탈퇴를 진행하시려면 비밀번호를 입력해주세요.</p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="userId" className="block mb-2 font-medium">
                      아이디
                    </label>
                    <input
                      type="text"
                      id="userId"
                      name="userId"
                      className={`w-full p-3 border ${formErrors.userId ? "border-red-500" : "border-gray-300"} rounded-md`}
                      value={formData.userId}
                      onChange={handleInputChange}
                      readOnly
                    />
                    {formErrors.userId && <p className="text-red-500 text-sm mt-1">{formErrors.userId}</p>}
                    <p className="text-xs text-gray-500 mt-1">아이디는 변경할 수 없습니다.</p>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 font-medium">
                      비밀번호
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={`w-full p-3 border ${formErrors.password ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="비밀번호를 입력해주세요"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      회원 탈퇴
                    </button>
                    <Link
                      href="/mypage"
                      className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 최종 확인 모달 */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">회원 탈퇴 확인</h3>
            <p className="text-gray-700 mb-6">
              정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 회원 정보와 포인트가 삭제됩니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={handleConfirmWithdrawal}
              >
                탈퇴 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

