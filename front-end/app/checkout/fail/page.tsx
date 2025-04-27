"use client"
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentFailPage() {
  return (
    <Suspense>
      <PaymentFailContent />
    </Suspense>
  );
}

function PaymentFailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('알 수 없는 오류가 발생했습니다.')
  
  useEffect(() => {
    // URL에서 에러 메시지 추출
    const code = searchParams.get('code')
    const message = searchParams.get('message')
    
    if (message) {
      setErrorMessage(message)
    } else if (code) {
      // 에러 코드에 따른 메시지 설정
      switch(code) {
        case 'INVALID_REQUEST':
          setErrorMessage('잘못된 요청입니다.')
          break
        case 'UNAUTHORIZED':
          setErrorMessage('인증에 실패했습니다.')
          break
        case 'FORBIDDEN':
          setErrorMessage('해당 기능에 대한 권한이 없습니다.')
          break
        case 'NOT_FOUND':
          setErrorMessage('존재하지 않는 리소스입니다.')
          break
        case 'METHOD_NOT_ALLOWED':
          setErrorMessage('허용되지 않은 메소드입니다.')
          break
        case 'TIMEOUT':
          setErrorMessage('요청 시간이 초과되었습니다.')
          break
        case 'INTERNAL_SERVER_ERROR':
          setErrorMessage('서버 에러가 발생했습니다.')
          break
        default:
          setErrorMessage('결제 처리 중 오류가 발생했습니다.')
      }
    }
    
    // 실패 로그 기록
    const logFailure = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        await fetch('/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            logType: 'PAYMENT_FAILED',
            message: `결제 실패: ${errorMessage}`
          })
        })
      } catch (error) {
        console.error('로그 기록 중 오류:', error)
      }
    }
    
    logFailure()
  }, [searchParams, errorMessage])

  return (
    <div className="container py-20 text-center">
      <div className="mb-8">
        <svg className="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4">결제 실패</h1>
      <p className="text-gray-600 mb-8">
        {errorMessage}
      </p>
      <div className="space-x-4">
        <Link href="/checkout" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          결제 다시 시도
        </Link>
        <Link href="/cart" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300">
          장바구니로 돌아가기
        </Link>
      </div>
    </div>
  )
} 