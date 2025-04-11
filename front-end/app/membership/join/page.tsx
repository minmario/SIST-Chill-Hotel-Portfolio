"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import styles from "../membership.module.css"
import { useAuth } from "@/context/auth-context"

export default function MembershipJoin() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    password: "",
    passwordConfirm: "",
    lastName: "",
    firstName: "",
    englishLastName: "",
    englishFirstName: "",
    phone: "",
    cardCompany: "삼성카드",
    cardExpiry: "",
    cardNumber: "",
    cardHolder: "",
    agreeTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    try {
      // 회원가입 API 호출
      const response = await fetch("http://localhost:8080/api/user/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.userId,
          pwd: formData.password,
          email: formData.email,
          name: formData.lastName + " " + formData.firstName,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      })

      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.")
      }

      const data = await response.json()
      console.log('[Register] 서버 응답 데이터:', data)
      
      // 필드명 확인
      const token = data.token || data.message
      const role = data.role
      
      console.log('[Register] 추출한 토큰:', token)
      console.log('[Register] 추출한 역할:', role)
      
      // AuthContext의 login 함수 사용
      login(token, formData.userId, role)

      // 성공 메시지 표시
      alert("회원가입이 완료되었습니다.")

      // 로그인 페이지로 이동
      router.push("/login")
    } catch (error) {
      console.error("회원가입 중 오류:", error)
      alert("회원가입에 실패했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>회원가입</h1>
          <p>새 계정을 만들기 위해 정보를 입력하세요</p>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="userId" className="block mb-2 font-medium">
                    아이디 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="아이디를 입력하세요"
                    value={formData.userId}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block mb-2 font-medium">
                    비밀번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="passwordConfirm" className="block mb-2 font-medium">
                    비밀번호 확인 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block mb-2 font-medium">
                    성 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="성을 입력하세요"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="firstName" className="block mb-2 font-medium">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="이름을 입력하세요"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block mb-2 font-medium">
                    전화번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="전화번호를 입력하세요"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">결제수단</h3>

                <div className="bg-gray-50 p-6 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="cardCompany" className="block mb-2 font-medium">
                        카드사
                      </label>
                      <select
                        id="cardCompany"
                        name="cardCompany"
                        className="w-full p-3 border border-gray-300 rounded"
                        value={formData.cardCompany}
                        onChange={handleInputChange}
                      >
                        <option value="삼성카드">삼성카드</option>
                        <option value="신한카드">신한카드</option>
                        <option value="현대카드">현대카드</option>
                        <option value="KB국민카드">KB국민카드</option>
                        <option value="롯데카드">롯데카드</option>
                        <option value="BC카드">BC카드</option>
                        <option value="하나카드">하나카드</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="cardExpiry" className="block mb-2 font-medium">
                        만료일
                      </label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        className="w-full p-3 border border-gray-300 rounded"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="cardNumber" className="block mb-2 font-medium">
                      카드 번호
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      className="w-full p-3 border border-gray-300 rounded"
                      placeholder="0000 0000 0000 0000"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="cardHolder" className="block mb-2 font-medium">
                      카드 소유자
                    </label>
                    <input
                      type="text"
                      id="cardHolder"
                      name="cardHolder"
                      className="w-full p-3 border border-gray-300 rounded"
                      placeholder="카드에 표시된 이름"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-8">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  required
                  className="w-5 h-5"
                />
                <label htmlFor="agreeTerms">
                  <span className="ml-2">
                    <Link href="/terms" className="text-primary-color underline">
                      이용약관
                    </Link>{" "}
                    및{" "}
                    <Link href="/privacy" className="text-primary-color underline">
                      개인정보 처리방침
                    </Link>
                    에 동의합니다.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                가입하기
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  이미 계정이 있으신가요?{" "}
                  <Link href="/login" className="text-primary-color">
                    로그인
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

