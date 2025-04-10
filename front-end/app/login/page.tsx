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
<<<<<<< HEAD
      // 하드코딩된 사용자 검증 (테스트용)
      if (loginData.email === 'user@example.com' && loginData.password === 'password123') {
        // 더미 JWT 토큰 생성 (실제 서비스에서는 서버에서 제공되어야 함)
        const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        
        // 로그인 상태 설정
        login(dummyToken);
        
        // 메인 페이지로 이동
        router.push("/");
        return;
      }
      
      // 하드코딩된 사용자로 로그인하지 않을 경우, 백엔드 API 호출 시도
      const response = await axios.post("/api/auth/login", {
        email: loginData.email,
        password: loginData.password,
      });

      // 토큰 저장
      const { token } = response.data;
      login(token);

      // 메인 페이지로 이동
      router.push("/");
    } catch (error: any) {
      console.error("로그인 중 오류가 발생했습니다:", error);
      if (error.response?.status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
=======
      const response = await fetch("http://localhost:8080/api/auth/login", {
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
      const { message: token, role } = data

      localStorage.setItem("accessToken", token)
      localStorage.setItem("userId", loginData.userId)
      localStorage.setItem("userRole", role)

      router.push("/") // ✅ 로그인 성공 후 이동 경로 필요 시 변경
    } catch (error) {
      console.error("로그인 중 오류:", error)
      alert("로그인에 실패했습니다. 다시 시도해주세요.")
>>>>>>> minmario
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
