"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, CreditCard, LogOut, Award, Gift, Eye, EyeOff, Key, Save } from "lucide-react"
import styles from "../mypage.module.css"

export default function UserInfo() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [verificationPassword, setVerificationPassword] = useState("")
  const [showVerificationPassword, setShowVerificationPassword] = useState(false)
  const [verificationError, setVerificationError] = useState("")

  const [formData, setFormData] = useState({
    userId: "test",
    email: "vldhtmxk@naver.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    lastName: "이",
    firstName: "",
    englishLastName: "",
    englishFirstName: "승범",
    phone: "01023234444",
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    phone: "",
  })

  useEffect(() => {
    // 로그인 상태 확인
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)

    if (!loggedIn) {
      router.push("/login")
    }

    // 실제로는 API에서 사용자 정보를 가져와야 함
    const userEmail = localStorage.getItem("userEmail")
    if (userEmail) {
      setFormData((prev) => ({
        ...prev,
        email: userEmail,
      }))
    }
  }, [router])

  const handleVerificationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationPassword(e.target.value)
    setVerificationError("")
  }

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault()

    // 실제로는 API를 통해 비밀번호 검증이 필요함
    // 여기서는 간단히 "password"라는 값으로 검증
    if (verificationPassword === "password") {
      setIsVerified(true)
      setVerificationError("")
    } else {
      setVerificationError("비밀번호가 일치하지 않습니다.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // 입력값 변경 시 해당 필드의 에러 메시지 초기화
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const errors = {
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      phone: "",
    }

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = "유효한 이메일 주소를 입력해주세요."
      isValid = false
    }

    // 비밀번호 변경 시 검증
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = "현재 비밀번호를 입력해주세요."
        isValid = false
      }

      if (formData.newPassword.length < 8) {
        errors.newPassword = "비밀번호는 8자 이상이어야 합니다."
        isValid = false
      }

      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = "새 비밀번호가 일치하지 않습니다."
        isValid = false
      }
    }

    // 전화번호 검증
    const phoneRegex = /^[0-9]{10,11}$/
    if (!phoneRegex.test(formData.phone.replace(/-/g, ""))) {
      errors.phone = "유효한 전화번호를 입력해주세요."
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // 정보 업데이트 처리 (실제로는 API 호출)
    alert("회원 정보가 성공적으로 업데이트되었습니다.")

    // 비밀번호 필드 초기화
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  if (!isLoggedIn) {
    return null // 로그인 페이지로 리디렉션 중
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>마이페이지 정보 수정</h1>
          <p>회원님의 정보를 안전하게 확인, 변경하실 수 있습니다.</p>
        </div>
      </div>

      <section className={styles.mypageSection}>
        <div className="container">
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
                  <Link href="/mypage/info" className={`${styles.sidebarNavLink} ${styles.sidebarNavLinkActive}`}>
                    <User size={18} />
                    마이페이지 정보 수정
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/withdraw" className={styles.sidebarNavLink}>
                    <LogOut size={18} />
                    회원 탈퇴
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/payment" className={styles.sidebarNavLink}>
                    <CreditCard size={18} />
                    결제관리
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
              {!isVerified ? (
                // 비밀번호 확인 단계
                <div className="max-w-md mx-auto">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Key size={20} className="mr-2 text-primary-color" style={{ color: "var(--primary-color)" }} />
                      비밀번호 확인
                    </h3>
                    <p className="text-gray-600 mb-4">회원정보 보호를 위해 비밀번호를 다시 한번 확인합니다.</p>

                    <form onSubmit={handleVerification}>
                      <div className="mb-4">
                        <label htmlFor="verificationPassword" className="block mb-2 font-medium">
                          비밀번호
                        </label>
                        <div className="relative">
                          <input
                            type={showVerificationPassword ? "text" : "password"}
                            id="verificationPassword"
                            className={`w-full p-3 border ${verificationError ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
                            value={verificationPassword}
                            onChange={handleVerificationInputChange}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowVerificationPassword(!showVerificationPassword)}
                          >
                            {showVerificationPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {verificationError && <p className="text-red-500 text-sm mt-1">{verificationError}</p>}
                        <p className="text-xs text-gray-500 mt-2">* 테스트용: "password"를 입력하세요</p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-primary-color text-white rounded-md hover:bg-primary-hover transition-colors"
                        style={{ backgroundColor: "var(--primary-color)" }}
                      >
                        확인
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                // 회원 정보 수정 폼
                <div>
                  <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">회원 정보 수정</h3>
                  <p className="text-gray-600 mb-6">회원님의 정보를 안전하게 확인, 변경하실 수 있습니다.</p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="userId" className="block mb-2 font-medium">
                            아이디
                          </label>
                          <input
                            type="text"
                            id="userId"
                            name="userId"
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                            value={formData.userId}
                            disabled
                          />
                          <p className="text-xs text-gray-500 mt-1">아이디는 변경할 수 없습니다.</p>
                        </div>

                        <div>
                          <label htmlFor="email" className="block mb-2 font-medium">
                            이메일
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className={`w-full p-3 border ${formErrors.email ? "border-red-500" : "border-gray-300"} rounded-md`}
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h4 className="text-lg font-medium mb-4 flex items-center">
                        <Key size={18} className="mr-2 text-primary-color" style={{ color: "var(--primary-color)" }} />
                        비밀번호 변경
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block mb-2 font-medium">
                            현재 비밀번호
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              id="currentPassword"
                              name="currentPassword"
                              className={`w-full p-3 border ${formErrors.currentPassword ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              placeholder="현재 비밀번호를 입력하세요"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {formErrors.currentPassword && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.currentPassword}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="newPassword" className="block mb-2 font-medium">
                            새 비밀번호
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              id="newPassword"
                              name="newPassword"
                              className={`w-full p-3 border ${formErrors.newPassword ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              placeholder="새 비밀번호를 입력하세요"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {formErrors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block mb-2 font-medium">
                            새 비밀번호 확인
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              className={`w-full p-3 border ${formErrors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md pr-10`}
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="새 비밀번호를 다시 입력하세요"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {formErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="lastName" className="block mb-2 font-medium">
                            이름
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="englishFirstName" className="block mb-2 font-medium">
                            영문 이름
                          </label>
                          <input
                            type="text"
                            id="englishFirstName"
                            name="englishFirstName"
                            className="w-full p-3 border border-gray-300 rounded-md"
                            value={formData.englishFirstName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-8">
                      <label htmlFor="phone" className="block mb-2 font-medium">
                        전화번호
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={`w-full p-3 border ${formErrors.phone ? "border-red-500" : "border-gray-300"} rounded-md`}
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                    </div>

                    <div className="flex justify-center gap-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-primary-color text-white rounded-md hover:bg-primary-hover transition-colors flex items-center"
                        style={{ backgroundColor: "var(--primary-color)" }}
                      >
                        <Save size={18} className="mr-2" />
                        정보 저장
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
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

