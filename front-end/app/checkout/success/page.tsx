"use client"

import { useCart } from '@/context/cart-context'
import { checkPaymentStatus } from '@/lib/toss-payments'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { clearCart } = useCart()

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!paymentKey || !orderId || !amount) {
          throw new Error('결제 정보가 부족합니다.')
        }

        // 결제 상태 확인
        await checkPaymentStatus(paymentKey, orderId, parseInt(amount))
        
        // 장바구니 비우기
        clearCart()
        
        setIsLoading(false)
      } catch (error) {
        console.error('결제 확인 중 오류:', error)
        setError('결제 확인 중 오류가 발생했습니다.')
        setIsLoading(false)
      }
    }

    verifyPayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGoHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">결제 확인 중...</h2>
        <p className="mb-6">결제 정보를 확인하고 있습니다. 잠시만 기다려주세요.</p>
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-20 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 inline-block">
          <h2 className="text-2xl font-bold mb-4">결제 확인 실패</h2>
          <p className="mb-6">{error}</p>
        </div>
        <div>
          <Link href="/cart" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            장바구니로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-20 text-center">
      <div className="mb-8">
        <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4">결제가 완료되었습니다!</h1>
      <p className="text-gray-600 mb-8">
        주문이 성공적으로 처리되었습니다. 체크인 시 제품을 수령하여 주십시오.
      </p>
      <button
        onClick={handleGoHome}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        홈으로 이동
      </button>
    </div>
  )
} 