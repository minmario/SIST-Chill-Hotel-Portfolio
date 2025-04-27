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
    registerCard: false, // <-- 추가
  })
  const bodyData: any = {
    id: formData.userId,
    pwd: formData.password,
    email: formData.email,
    name: formData.firstName + " " + formData.lastName,
    phone: formData.phone,
    firstName: formData.firstName,
    lastName: formData.lastName,
  }
  type User = {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  
  if (formData.registerCard) {
    bodyData.paymentMethod = {
      cardCompany: formData.cardCompany,
      cardExpiry: formData.cardExpiry,
      cardNumber: formData.cardNumber,
      cardHolder: formData.cardHolder,
    }
  }
  

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
  
    // 🔒 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert("유효한 이메일 주소를 입력해주세요.")
      return
    }
  
    // 🔒 비밀번호 유효성 검사
    if (formData.password.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.")
      return
    }
  
    // 🔒 비밀번호 일치 확인
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
  
    // 🔒 전화번호 검사 (숫자만, 10~11자리)
    const phoneRegex = /^[0-9]{10,11}$/
    if (!phoneRegex.test(formData.phone.replace(/-/g, ""))) {
      alert("유효한 전화번호를 입력해주세요.")
      return
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/user/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message)  // "이미 사용 중인 아이디입니다" or "이메일입니다"
      }
  
      const data = await response.json()
      console.log("[Register] 서버 응답 데이터:", data)
  
      alert("회원가입이 완료되었습니다.")
  
      // ✅ 완료 페이지로 이동
      router.push(`/membership/join/complete?userId=${encodeURIComponent(formData.userId)}`)
  
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
                <label htmlFor="firstName" className="block mb-2 font-medium">
                성 <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="성을 입력하세요"
                value={formData.firstName} 
                onChange={handleInputChange}
                required
                />
                </div>

                <div>
                <label htmlFor="lastName" className="block mb-2 font-medium">
                이름 <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="이름을 입력하세요"
                value={formData.lastName} 
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
              {/* <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="registerCard"
                  name="registerCard"
                  checked={formData.registerCard}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <label htmlFor="registerCard" className="text-sm text-gray-700">
                  결제 수단을 지금 등록하겠습니다
                </label>
              </div> */}
              
              
            {/* {formData.registerCard && (
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
              )} */}

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
                    
                    이용약관
                    
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