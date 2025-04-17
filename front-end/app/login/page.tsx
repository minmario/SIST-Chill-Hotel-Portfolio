"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "../../lib/axios"
import styles from "./login.module.css"
import { useAuth } from "@/context/auth-context"

export default function Login() {
  const router = useRouter()
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
      const response = await fetch("http://localhost:8080/api/user/auth/login", {
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
      console.log('[Login] 서버 응답 데이터:', data)
      
      // 필드명 확인 
      const token = data.token || data.message
      const role = data.role
      
      console.log('[Login] 추출한 토큰:', token)
      console.log('[Login] 추출한 역할:', role)

      // AuthContext의 login 함수 사용
      login(token, loginData.userId, role)

      router.push("/") // 로그인 성공 후 이동
    } catch (error) {
      console.error("로그인 중 오류:", error)
      setError("로그인에 실패했습니다. 다시 시도해주세요.")
    }
  };

  return (
    <>
      <div className={styles.header || "py-12 bg-gray-100"}>
        <div className="container">
          <h1 className="text-3xl font-bold">로그인</h1>
          <p>회원 정보로 로그인하여 서비스를 이용하세요.</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
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
                <Link href="/membership/join" style={{ color: "#2dd4bf" }}>
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
