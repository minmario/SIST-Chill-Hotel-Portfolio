"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter() 
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const role = localStorage.getItem("userRole")
  
    if (token && role !== "ADMIN") {
      console.log("[LoginPage] 일반 사용자 접근 차단 → 메인페이지로 리다이렉트")
      router.replace("/") // 또는 "/login" 등
    }
  }, [])
  const { login } = useAuth()
 
  
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          pwd: password,
        }),
      })

      if (!response.ok) {
        throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.")
      }

      const data = await response.json()
      const { message: token, role } = data
     
      // ✅ JWT 토큰과 역할 저장
      localStorage.setItem("accessToken", token)
      localStorage.setItem("userRole", role)

      // ✅ 로그인 상태 전역 업데이트
      login(
        {
          userId,
          name: "관리자",
          email: "admin@example.com",
          role,
        },
        token
      )

      // ✅ 이동
      router.push("/admin/dashboard")
    } catch (err: any) {
      console.error("로그인 실패:", err)
      setError(err.message || "로그인 중 오류가 발생했습니다.")
    }
  }

  return (
    
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
          <CardDescription className="text-center">
            아이디와 비밀번호를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="userId" className="text-sm font-medium">
                아이디
              </label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
              로그인
            </Button>
          </form>
        </CardContent>
        
      </Card>
    </div>
  )
}
