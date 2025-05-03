"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  
    const { userId, email, password, confirmPassword, name, phone } = formData
  
    // 필수 필드 확인
    if (!userId || !email || !password || !confirmPassword || !name || !phone) {
      alert("모든 필수 입력값을 채워주세요.")
      return
    }
    
  
    // 🔒 비밀번호 유효성 검사
    if (formData.password.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.")
      return
    }
  
    // 비밀번호 일치 검사
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
  
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("유효한 이메일 주소를 입력해주세요.")
      return
    }
  
    // 전화번호 숫자만 허용 (10~11자리)
    const cleanedPhone = phone.replace(/-/g, "")
    if (!/^\d{10,11}$/.test(cleanedPhone)) {
      alert("전화번호는 숫자만 10~11자리여야 합니다.")
      return
    }
  
    try {
      // API로 백엔드로 직접 보내는 부분
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          email,
          pwd: password,
          name,
          phone: cleanedPhone, // 하이픈 제거된 값 전달
        }),
      })
  
      if (!response.ok) {
        const text = await response.text();  // 여기만 수정
        throw new Error(text || "회원가입에 실패했습니다.");
      }
  
      alert("회원가입이 완료되었습니다.")
      router.push(`/admin/register/complete?userId=${encodeURIComponent(userId)}`)
    } catch (error: any) {
      alert(error.message || "회원가입 중 오류가 발생했습니다.")
      console.error("Registration error:", error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <p className="text-sm text-gray-500">새 계정을 만들기 위해 정보를 입력하세요</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="userId" className="text-sm font-medium">
                  아이디 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="아이디를 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  이름 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="전화번호를 입력하세요"
                  required
                />
              </div>
            </div>

            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
              가입하기
            </Button>

            <div className="text-center">
              <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
                로그인 페이지로 돌아가기
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

