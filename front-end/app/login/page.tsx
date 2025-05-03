"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "../../lib/axios"
import styles from "./login.module.css"
import { useAuth } from "@/context/auth-context"

export default function Login() {
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const redirect = searchParams ? searchParams.get("redirect") : null;
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
      console.log('[Login] 서버 응답 데이터:', data)
      
      // 필드명 확인 
    
      const role = data.role
      
      
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userName", loginData.userId)
      localStorage.setItem("userRole", role)
      localStorage.setItem("userToken", data.token)
      const token = data.token;

      if (!token || token.split(".").length !== 3) {
        console.error("[Login] 잘못된 토큰 형식:", token);
        throw new Error("서버에서 유효한 JWT 토큰을 반환하지 않았습니다.");
      }

      localStorage.setItem("accessToken", token);

      login({
        userId: loginData.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      }, data.token);

      // 안내: 토큰 저장 직후 info 페이지에서 바로 membershipIdx가 반영됨
      router.push(redirect || "/") // 로그인 성공 후 이동
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
