"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  // 디버깅을 위한 로컬 스토리지 정보 확인
  useEffect(() => {
    const storedUserData = localStorage.getItem("registeredUser")
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData)
        setDebugInfo(`저장된 사용자 ID: ${userData.userId}`)
      } catch (e) {
        setDebugInfo("저장된 사용자 정보를 파싱할 수 없습니다.")
      }
    } else {
      setDebugInfo("저장된 사용자 정보가 없습니다.")
    }
  }, [])

  // Update the handleLogin function to allow all registered accounts to log in

  // Replace the existing handleLogin function with this updated version
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("로그인 시도:", { userId, password })

    // 로컬 스토리지에서 사용자 데이터 가져오기
    const storedUserData = localStorage.getItem("registeredUser")
    console.log("저장된 사용자 데이터:", storedUserData)

    // 하드코딩된 계정 확인 (admin/admin1234)
    if (userId === "admin" && password === "admin1234") {
      console.log("관리자 로그인 성공")
      // 성공적인 관리자 로그인
      login({
        userId: "admin",
        name: "관리자",
        email: "admin@example.com",
      })
      console.log("관리자 로그인 후 상태:", { isLoggedIn: true, userId: "admin" })
      router.push("/admin/dashboard")
      return
    }

    // 하드코딩된 계정 확인 (hello/1111)
    if (userId === "hello" && password === "1111") {
      console.log("테스트 사용자 로그인 성공")
      // 성공적인 로그인
      login({
        userId: "hello",
        name: "테스트 사용자",
        email: "test@example.com",
      })
      router.push("/admin/dashboard")
      return
    }

    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData)
        console.log("파싱된 사용자 데이터:", { storedId: userData.userId, storedPw: userData.password })

        if (userData.userId === userId && userData.password === password) {
          console.log("로컬 스토리지 사용자 로그인 성공")
          // 성공적인 로그인
          login({
            userId: userData.userId,
            name: userData.name,
            email: userData.email,
          })
          router.push("/admin/dashboard")
          return
        } else {
          console.log("사용자 정보 불일치")
          setError("아이디 또는 비밀번호가 올바르지 않습니다.")
        }
      } catch (e) {
        console.error("사용자 데이터 파싱 오류:", e)
        setError("사용자 정보를 불러오는 중 오류가 발생했습니다.")
      }
    } else {
      console.log("저장된 사용자 정보 없음")
      setError("등록된 사용자 정보가 없습니다. 회원가입을 진행해주세요.")
    }
  }
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
          <CardDescription className="text-center">아이디와 비밀번호를 입력하세요</CardDescription>
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
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}
            {debugInfo && (
              <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-500">
                <p>디버그 정보: {debugInfo}</p>
                <p className="text-xs mt-1">
                  * 테스트 계정: ID - hello, PW - 1111
                  <br />* 관리자 계정: ID - admin, PW - admin1234
                </p>
              </div>
            )}
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/admin/register">회원가입</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

