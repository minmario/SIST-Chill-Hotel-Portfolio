"use client"

import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { initTossPayment } from "@/lib/toss-payments"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from "./checkout.module.css"

export default function Checkout() {
  const router = useRouter()
  const { items: cartItems, totalPrice, clearCart } = useCart()
  const { isLoggedIn } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentError, setPaymentError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    memo: ""
  })

  // 클라이언트 사이드에서만 실행되도록 처리
  useEffect(() => {
    setMounted(true)
    
    // 로그인 상태 및 토큰 확인
    if (!isLoggedIn) {
      router.push("/login?redirect=/checkout");
    }
  }, [])

  // 사용자 정보 로드
  useEffect(() => {
    if (mounted && isLoggedIn) {
      const fetchUserInfo = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch('/api/user/checkout-info', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setFormData(prev => ({
              ...prev,
              name: data.name || "",
              phone: data.phone || "",
              email: data.email || ""
            }));
          }
        } catch (error) {
          console.error("사용자 정보 로드 오류:", error);
        }
      };
      
      fetchUserInfo();
    }
  }, [mounted, isLoggedIn]);

  useEffect(() => {
    if (mounted && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [mounted, cartItems, router]);

  // 서버 사이드 렌더링 중에는 기본 UI만 표시
  if (!mounted) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">결제 페이지 로딩 중...</h2>
        <p className="mb-6">잠시만 기다려주세요.</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setPaymentError("")

    // 결제 수단 선택 확인
    if (!paymentMethod) {
      setPaymentError('결제 수단을 선택해주세요.');
      setIsProcessing(false);
      return;
    }

    // 로그인 상태 재확인
    if (!isLoggedIn) {
      setPaymentError('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      setIsProcessing(false);
      setTimeout(() => {
        router.push("/login?redirect=/checkout");
      }, 2000);
      return;
    }

    try {
      // 1. 주문 생성 API 호출
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setPaymentError('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
        setIsProcessing(false);
        setTimeout(() => {
          router.push("/login?redirect=/checkout");
        }, 2000);
        return;
      }
      
      // 토큰이 유효한지 빠르게 검증 (JWT 형식 및 만료 확인)
      try {
        if (token.split('.').length !== 3) {
          throw new Error('유효하지 않은 토큰 형식');
        }
        
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = JSON.parse(atob(base64));
        
        // 토큰 만료 확인
        if (jsonPayload.exp * 1000 < Date.now()) {
          throw new Error('토큰이 만료됨');
        }
      } catch (e) {
        console.error('토큰 검증 실패:', e);
        setPaymentError('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
        setIsProcessing(false);
        setTimeout(() => {
          router.push("/login?redirect=/checkout");
        }, 2000);
        return;
      }
      
      // 만료되지 않은 토큰이라면 API 요청 시도
      const createOrderRes = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: totalPrice,
          paymentMethod,
          cartItemIdxList: cartItems.map(item => item.cartItemIdx)
        }),
        credentials: 'include'
      });
      
      if (!createOrderRes.ok) {
        const errorText = await createOrderRes.text();
        console.error('주문 생성 실패:', createOrderRes.status, errorText);
        
        if (createOrderRes.status === 401) {
          setPaymentError('로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.');
          setTimeout(() => {
            router.push("/login?redirect=/checkout");
          }, 2000);
        } else {
          setPaymentError(`주문 생성에 실패했습니다. (${createOrderRes.status})`);
        }
        
        setIsProcessing(false);
        return;
      }
      
      const orderResJson = await createOrderRes.json();
      const orderIdx = orderResJson.orderIdx || orderResJson.id || orderResJson.order_id;
      if (!orderIdx) {
        setPaymentError('주문 번호를 받아오지 못했습니다.');
        setIsProcessing(false);
        return;
      }

      // 2. 결제 데이터 준비 (id에 반드시 orderIdx 사용)
      const orderData = {
        amount: totalPrice,
        method: paymentMethod,
        name: `SIST-Chill-Hotel 주문 결제`,
        customerName: formData.name,
        paymentType: 'ORDER',
        id: orderIdx.toString()
      };

      // 3. 토스 페이먼츠 결제 시작
      const result = await initTossPayment(orderData)
      
      if (!result.success) {
        setPaymentError(result.message || "결제 처리 중 오류가 발생했습니다.")
        setIsProcessing(false)
        
        // 결제 실패 로깅
        const token = localStorage.getItem("accessToken")
        await fetch("/api/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            logType: "PAYMENT_FAILED",
            message: result.message
          })
        })
        return
      }

      // 결제가 성공하면 장바구니 비우기
      clearCart();
      // 로컬 스토리지에서도 직접 제거하여 동기화 문제 방지
      localStorage.removeItem('guestCart');
      // 결제 완료 플래그 설정
      localStorage.setItem('paymentCompleted', 'true');
      console.log('주문 완료 후 장바구니 비우기 완료');

      // 성공 처리는 successUrl로 리다이렉트되어 백엔드에서 처리됨
    } catch (error) {
      console.error("결제 오류:", error)
      setPaymentError("결제 처리 중 오류가 발생했습니다.")
      setIsProcessing(false)
    }
  }

  const subtotal = totalPrice
  const discount = Math.round(subtotal * 0.02) // 2% 할인
  const total = subtotal - discount

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>결제하기</h1>
          <p>주문 정보를 입력하고 결제를 완료하세요.</p>
        </div>
      </div>

      <section className={styles.checkoutSection}>
        <div className="container">
          <div className={styles.checkoutGrid}>
            <div className={styles.checkoutForm}>
              <h2 className={styles.formTitle}>주문 정보</h2>

              {paymentError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <strong>결제 실패: </strong> {paymentError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">배송 정보</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">이름</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">전화번호</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">이메일</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">요청 사항.</label>
                      <textarea
                        name="memo"
                        value={formData.memo}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">결제 수단</h2>
                  
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="카드"
                        checked={paymentMethod === "카드"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      신용카드
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="가상계좌"
                        checked={paymentMethod === "가상계좌"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      가상계좌
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="계좌이체"
                        checked={paymentMethod === "계좌이체"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      계좌이체
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing || !paymentMethod}
                  className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isProcessing ? "처리 중..." : "결제하기"}
                </button>
              </form>
            </div>

            <div className={styles.orderSummary}>
              <h2 className={styles.orderSummaryTitle}>주문 요약</h2>

              <div className={styles.orderItems}>
                {cartItems.map((item, idx) => (
                  <div key={item.id ?? idx} className={styles.orderItem}>
                    <div className={styles.orderItemDetails}>
                      <div className={styles.orderItemName}>{item.productName}</div>
                      <div className={styles.orderItemMeta}>수량: {item.quantity}</div>
                    </div>
                    <div className={styles.orderItemPrice}>{(item.price * item.quantity).toLocaleString()}원</div>
                  </div>
                ))}
              </div>

              <div className={styles.orderSummaryRow}>
                <span className={styles.orderSummaryLabel}>소계</span>
                <span className={styles.orderSummaryValue}>{subtotal.toLocaleString()}원</span>
              </div>

              <div className={styles.orderSummaryRow}>
                <span className={styles.orderSummaryLabel}>회원 등급 할인 (2%)</span>
                <span className={styles.orderSummaryDiscount}>-{discount.toLocaleString()}원</span>
              </div>

              <div className={styles.orderTotal}>
                <span className={styles.orderTotalLabel}>총 결제 금액</span>
                <span className={styles.orderTotalValue}>{total.toLocaleString()}원</span>
              </div>

              <Link href="/cart" className={styles.continueShoppingButton}>
                <ChevronLeft size={16} />
                장바구니로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

