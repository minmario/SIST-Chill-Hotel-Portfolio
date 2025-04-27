"use client"

import React, { useState, Suspense,useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./page.module.css"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth" 

// 동적 import를 사용하여 컴포넌트 지연 로딩 - Suspense 추가
const MainSlider = dynamic(() => import("@/components/Home/MainSlider"), {
  loading: () => <div className="h-[80vh] bg-gray-100 animate-pulse flex items-center justify-center"><span className="text-gray-500">슬라이더 로딩 중...</span></div>,
  ssr: true
})

const BookingSearch = dynamic(() => import("@/components/Home/BookingSearch"), {
  ssr: true
})

const RoomSection = dynamic(() => import("@/components/Home/RoomSection"), {
  ssr: true
})

const slides = [
  {
    id: 1,
    image: "/main_room.png?height=1080&width=1920",
    title: "Your Ultimate Healing Retreat",
    description: "Experience tranquility and rejuvenation at Chill Haven Resort & Spa",
    buttonText: "Begin Your Journey",
    buttonLink: "/rooms",
  },
  {
    id: 2,
    image: "/main_pool.png?height=1080&width=1920",
    title: "Luxury Meets Nature",
    description: "Immerse yourself in the perfect blend of luxury and natural beauty",
    buttonText: "Explore Our Resort",
    buttonLink: "/facilities",
  },
  {
    id: 3,
    image: "/main_dining.png?height=1080&width=1920",
    title: "Culinary Excellence",
    description: "Indulge in exceptional dining experiences with breathtaking views",
    buttonText: "Discover Dining",
    buttonLink: "/dining",
  },
]

// 객실 정보
const rooms = [
  {
    id: 1,
    name: "Chill Harmony Room",
    image: "/images/rooms/harmony/harmony1.png?height=300&width=400",
    description: "A peaceful retreat with panoramic mountain views with harmonious design elements.",
    size: "30m²",
    capacity: "성인 2인 기준",
    link: "/rooms/2",
  },
  {
    id: 2,
    name: "Chill Serenity Room",
    image: "/images/rooms/serenity/serenity1.png?height=300&width=400",
    description: "A tranquil space with modern amenities and soothing natural views.",
    size: "35m²",
    capacity: "성인 2인 기준",
    link: "/rooms/3",
  },
  {
    id: 3,
    name: "Chill Family Suite",
    image: "/images/rooms/family/family1.png?height=300&width=400",
    description: "A spacious suite with separate living areas and a luxurious suite designed for family well-being.",
    size: "50m²",
    capacity: "성인 2인 기준",
    link: "/rooms/4",
  },
]

// 다이닝 정보
const diningOptions = [
  {
    id: 1,
    name: "라 테라스",
    image: "https://images.unsplash.com/photo-1583338917496-7ea264c374ce?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8JUVCJUI3JTk0JUVEJThFJTk4fGVufDB8fDB8fHww",
    description: "신선한 제철 식재료로 준비한 인터내셔널 뷔페 레스토랑. 아침, 점심, 저녁 다양한 요리를 즐기실 수 있습니다.",
    hours: "매일 06:30 - 22:00",
    link: "/dining/sunset-lounge",
  },
  {
    id: 2,
    name: "아리아",
    image: "https://images.unsplash.com/photo-1611765083444-a3ce30f1c885?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGl0YWxpYW4lMjByZXN0YXVyYW50fGVufDB8fDB8fHww",
    description: "정통 이탈리안 요리를 현대적으로 재해석한 파인 다이닝 레스토랑. 엄선된 와인 리스트와 함께 특별한 식사를 즐겨보세요.",
    hours: "매일 12:00 - 22:00",
    link: "/dining/ocean-view",
  },
  {
    id: 3,
    name: "사쿠라",
    image: "https://images.unsplash.com/photo-1512132411229-c30391241dd8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amFwYW5lc2UlMjByZXN0YXVyYW50fGVufDB8fDB8fHww",
    description: "최고급 식재료로 준비한 정통 일식 오마카세. 숙련된 일본 요리사가 선보이는 계절 요리를 카운터에서 직접 즐겨보세요.",
    hours: "매일 12:00 - 22:00",
    link: "/dining/harmony-bar",
  },
]

// 기프트샵 상품 정보
const storeItems = [
  {
    id: 1,
    name: "Chill Haven 시그니처 배스로브",
    image: "/placeholder.svg?height=400&width=800",
    description: "최고급 면소재로 제작된 호텔 시그니처 배스로브",
    price: "120,000원",
    link: "/store/1",
  },
  {
    id: 2,
    name: "Chill Haven 베개",
    image: "/placeholder.svg?height=400&width=800",
    description: "최상의 수면을 위한 프리미엄 구스다운 베개",
    price: "89,000원",
    link: "/store/2",
  },
  {
    id: 3,
    name: "Chill Haven 씨솔트 바디 스크럽",
    image: "/placeholder.svg?height=400&width=800",
    description: "호텔 스파에서 사용하는 동일한 천연 스크럽",
    price: "45,000원",
    link: "/store/3",
  },
]

export default function Home() {
  const router = useRouter()
  const { isLoggedIn, user, logout } = useAuth()
  // ✅ 여기 useEffect 추가
  useEffect(() => {
    if (isLoggedIn && (user?.role === "ADMIN" || user?.role === "STAFF")) {
      console.log("[Home] 관리자 상태로 메인 진입 -> 로그아웃")
      logout()
    }
  }, [isLoggedIn, user, logout])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")

  // 컴포넌트 마운트 시 체크인=오늘, 체크아웃=내일로 자동 설정
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setCheckInDate(todayStr);
    setCheckOutDate(tomorrowStr);
  }, []);

  const [currentDiningSlide, setCurrentDiningSlide] = useState(0)
  const [currentStoreSlide, setCurrentStoreSlide] = useState(0)

  const goToNextDiningSlide = () => {
    setCurrentDiningSlide((prev) => (prev === diningOptions.length - 1 ? 0 : prev + 1))
  }

  const goToPrevDiningSlide = () => {
    setCurrentDiningSlide((prev) => (prev === 0 ? diningOptions.length - 1 : prev - 1))
  }

  const goToNextStoreSlide = () => {
    setCurrentStoreSlide((prev) => (prev === storeItems.length - 1 ? 0 : prev + 1))
  }

  const goToPrevStoreSlide = () => {
    setCurrentStoreSlide((prev) => (prev === 0 ? storeItems.length - 1 : prev - 1))
  }

  return (
    <>
      {/* 메인 슬라이더 - Suspense로 감싸기 */}
      <Suspense fallback={<div className="h-[80vh] bg-gray-100 animate-pulse flex items-center justify-center"><span className="text-gray-500">슬라이더 로딩 중...</span></div>}>
        <MainSlider slides={slides} />
      </Suspense>

      {/* 예약 검색 */}
      <BookingSearch />

      {/* 객실 섹션 */}
      <RoomSection rooms={rooms} />

      {/* 다이닝 섹션 */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">다이닝 옵션</h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            세계적인 셰프들이 선보이는 신선한 지역 식재료로 준비한 다양한 요리를 즐기세요.
          </p>

          <div className="relative">
            <div
              className="overflow-hidden"
              style={{ borderRadius: "1rem" }}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentDiningSlide * 100}%)` }}
              >
                {diningOptions.map((option) => (
                  <div key={option.id} className="w-full flex-shrink-0 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="relative h-64 md:h-96">
                        <Image
                          src={option.image}
                          alt={option.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="p-8 md:p-12 bg-gray-50 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4">{option.name}</h3>
                        <p className="text-gray-600 mb-4">{option.description}</p>
                        <p className="text-sm font-medium mb-6">{option.hours}</p>
                        <Link
                          href="/dining"
                          className="inline-flex items-center justify-center py-3 px-6 rounded-md font-medium text-white transition-colors self-start"
                          style={{ backgroundColor: "#2dd4bf" }}
                        >
                          자세히 보기
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={goToPrevDiningSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-lg"
              aria-label="이전 다이닝 옵션"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNextDiningSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-lg"
              aria-label="다음 다이닝 옵션"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/dining"
              className="inline-flex items-center justify-center py-3 px-6 rounded-md font-medium border border-[#2dd4bf] text-[#2dd4bf] hover:bg-[#2dd4bf] hover:text-white transition-colors"
            >
              모든 다이닝 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 기프트샵 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">기프트샵</h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
            Chill Haven의 럭셔리한 경험을 집에서도 느낄 수 있는 특별한 제품들을 만나보세요.
          </p>

          <div className="relative">
            <div
              className="overflow-hidden"
              style={{ borderRadius: "1rem" }}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentStoreSlide * 100}%)` }}
              >
                {storeItems.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="relative h-64 md:h-96">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4">{item.name}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <p className="text-xl font-medium mb-6">{item.price}</p>
                        <Link
                          href={item.link}
                          className="inline-flex items-center justify-center py-3 px-6 rounded-md font-medium text-white transition-colors self-start"
                          style={{ backgroundColor: "#2dd4bf" }}
                        >
                          구매하기
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={goToPrevStoreSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-lg"
              aria-label="이전 상품"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNextStoreSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-lg"
              aria-label="다음 상품"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/store"
              className="inline-flex items-center justify-center py-3 px-6 rounded-md font-medium border border-[#2dd4bf] text-[#2dd4bf] hover:bg-[#2dd4bf] hover:text-white transition-colors"
            >
              기프트샵 방문하기
            </Link>
          </div>
        </div>
      </section>

      {/* 하단 CTA 섹션 */}
      <section className={styles.ctaSection}>
        <div className="container relative z-10 text-center py-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">특별한 경험이 여러분을 기다립니다</h2>
          <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
            여행의 새로운 차원을 발견하고 Chill Haven에서 잊을 수 없는 추억을 만들어보세요.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center py-4 px-8 rounded-md font-medium text-teal-500 bg-white hover:bg-gray-100 transition-colors text-lg"
          >
            지금 예약하기
          </Link>
        </div>
      </section>
    </>
  )
}

