"use client"

import { Suspense } from 'react'
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function MembershipCompletePage() {
  return (
    <Suspense>
      <MembershipCompleteContent />
    </Suspense>
  );
}

function MembershipCompleteContent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center bg-white rounded-lg shadow p-8">
        <div className="space-y-1 mb-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">가입 완료!</h1>
          <p className="text-gray-500">회원가입이 성공적으로 완료되었습니다.</p>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">회원 아이디</p>
            <p className="text-xl font-bold">{userId}</p>
          </div>
          <p className="text-sm text-gray-500">이 아이디로 로그인하여 서비스를 이용하실 수 있습니다.</p>
        </div>
        <div className="mt-8">
          <Link 
            href="/login"
            className="inline-block w-full py-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-lg font-medium"
          >
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
} 