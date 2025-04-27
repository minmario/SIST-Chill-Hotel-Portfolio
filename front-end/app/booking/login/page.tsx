"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check } from "lucide-react"
import Image from "next/image"
import styles from "../../rooms/rooms.module.css"
import { useAuth } from "@/context/auth-context"

export default function BookingLogin() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [skipLogin, setSkipLogin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userName = localStorage.getItem("userName") || "";
      const token = localStorage.getItem("token") || "";
      // 필요한 회원 정보 추가로 추출 가능
      if (isLoggedIn && userName) {
        setSkipLogin(true);
        router.replace(`/booking/customer-info?userName=${encodeURIComponent(userName)}&token=${encodeURIComponent(token)}`);
      }
    }
    setIsChecking(false);
  }, [router]);

  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
  })
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
    setError("") // 에러 메시지 초기화
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isClient) return

    try {
      const response = await fetch("/api/user/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: loginData.userId,
          pwd: loginData.password,
        }),
      })

      if (!response.ok) {
        throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.")
      }

      const data = await response.json()
      console.log('[BookingLogin] 서버 응답 데이터:', data)
      const token = data.token || data.message
      

      localStorage.setItem("token", token)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userName", loginData.userId)

      login(token, loginData.userId)

      // 예약 진행 단계이므로 고객 정보 입력 페이지로 이동
      router.push("/booking/customer-info")
    } catch (error) {
      console.error("로그인 중 오류:", error)
      setError("로그인에 실패했습니다. 다시 시도해주세요.")
    }
  }

  if (isChecking || skipLogin) {
    // 체크 중이거나 바로 이동 중이면 아무것도 렌더링하지 않음
    return null;
  }

  return (
    <>
      {/* 이하 기존 로그인 폼 및 UI 그대로 */}
      <div style={{ position: "relative", width: "100%", maxHeight: 240, overflow: "hidden" }}>
        <Image
          src="/images/login_image.png"
          alt="호텔 로그인 배너"
          width={1200}
          height={240}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
          priority
        />
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: "rgba(0,0,0,0.25)",
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, margin: 0 }}>로그인</h1>
          <p style={{ fontSize: 20, margin: "14px 0 0 0" }}>회원정보로 로그인하여 예약을 진행하세요.</p>
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
                <label htmlFor="userId" className="block mb-2 font-medium">
                  아이디
                </label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  autoComplete="username"
                  className="w-full p-3 border border-gray-300 rounded"
                  value={loginData.userId}
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
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-md font-medium text-white"
                style={{ backgroundColor: "#2dd4bf" }}
              >
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

