"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check } from "lucide-react"
import styles from "../../rooms/rooms.module.css"

export default function BookingLogin() {
  const router = useRouter()
  const [loginData, setLoginData] = useState({
    id: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // 로그인 처리 (실제로는 API 호출 등이 필요)
    console.log("로그인 정보:", loginData)

    // 세션 정보 저장 (실제로는 토큰 등을 저장)
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userId", loginData.id)
    localStorage.setItem("accessToken", "mock-access-token") // 실제 로그인 API 응답값 활용

    // 고객 정보 입력 페이지로 이동
    router.push("/booking/customer-info")
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>로그인</h1>
          <p>회원 정보로 로그인하여 예약을 진행하세요.</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
          <div className={styles.bookingSteps}>
            <div className={`${styles.bookingStep} ${styles.bookingStepCompleted}`}>
              <div className={styles.bookingStepNumber}>
                <Check size={16} />
              </div>
              <div className={styles.bookingStepLabel}>객실 선택</div>
            </div>
            <div className={`${styles.bookingStep} ${styles.bookingStepCompleted}`}>
              <div className={styles.bookingStepNumber}>
                <Check size={16} />
              </div>
              <div className={styles.bookingStepLabel}>옵션 선택</div>
            </div>
            <div className={`${styles.bookingStep} ${styles.bookingStepActive}`}>
              <div className={styles.bookingStepNumber}>3</div>
              <div className={styles.bookingStepLabel}>정보 입력</div>
            </div>
            <div className={styles.bookingStep}>
              <div className={styles.bookingStepNumber}>4</div>
              <div className={styles.bookingStepLabel}>예약 완료</div>
            </div>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-6">회원 로그인</h2>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="id" className="block mb-2 font-medium">
                  아이디
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={loginData.id}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 font-medium">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={loginData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="w-full button button-primary py-3">
                로그인
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                아직 회원이 아니신가요?{" "}
                <Link href="/membership/join" className="text-primary-color">
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

