"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Calendar, Share, Phone, MapPin, Clock, Star, Check, Info } from "lucide-react"
import styles from "../offers.module.css"

// 오퍼 데이터
const offers = [
  {
    id: "staycation-package",
    title: "스테이케이션 패키지",
    description: "일상 속 특별한 휴식이 필요할 때, 도심 속 완벽한 휴가를 경험하세요.",
    image: "/placeholder.svg?height=800&width=1200",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    period: "2025.02.01 - 2025.11.30",
    price: 350000,
    discountPrice: 315000,
    discountRate: 10,
    rating: 4.8,
    reviewCount: 124,
    location: "럭스 호텔 전 객실",
    availableRooms: ["디럭스", "프리미엄", "스위트"],
    checkIn: "15:00",
    checkOut: "12:00",
    content: `
# 스테이케이션 패키지

바쁜 일상에서 벗어나 도심 속에서 즐기는 특별한 휴가, 스테이케이션 패키지를 소개합니다.

## 패키지 구성

- 디럭스 룸 1박
- 2인 조식 뷔페
- 실내 수영장 및 피트니스 센터 이용
- 웰컴 음료 제공
- 레이트 체크아웃(14:00까지)

## 추가 혜택

- 스파 트리트먼트 20% 할인
- 호텔 내 레스토랑 10% 할인
- 객실 내 미니바 1회 무료 제공
- 발레파킹 서비스 무료
`,
    highlights: ["도심 속 완벽한 휴식", "2인 조식 포함", "스파 및 레스토랑 할인", "레이트 체크아웃"],
    terms: [
      "체크인 3일 전까지 무료 취소 가능",
      "체크인 3일 이내 취소 시 1박 요금의 50% 부과",
      "노쇼(No-show) 시 전액 위약금 부과",
      "패키지 요금은 세금 및 봉사료 포함 금액",
      "객실 상황에 따라 조기 마감될 수 있음",
    ],
  },
  // (다른 오퍼들 추가 가능)
]

export default function OfferDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showPhoneNumber, setShowPhoneNumber] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  const offer = offers.find((offer) => offer.id === params.id)

  if (!offer) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">요청하신 오퍼를 찾을 수 없습니다</h2>
        <p className="mb-8">URL을 확인하시거나 다른 오퍼를 선택해주세요.</p>
        <Link href="/offers" className="button button-primary">
          오퍼 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const renderMarkdown = (content: string) => {
    const lines = content.split("\n")
    return lines.map((line, index) => {
      if (line.startsWith("# ")) {
        return <h2 key={index} className="text-2xl font-bold mb-4">{line.substring(2)}</h2>
      } else if (line.startsWith("## ")) {
        return <h3 key={index} className="text-xl font-semibold mb-3 mt-6">{line.substring(3)}</h3>
      } else if (line.startsWith("- ")) {
        return <li key={index} className="ml-5 mb-2">{line.substring(2)}</li>
      } else if (line.trim() === "") {
        return <br key={index} />
      } else {
        return <p key={index} className="mb-4">{line}</p>
      }
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `럭스 호텔 - ${offer.title}`,
        text: offer.description,
        url: window.location.href,
      }).catch(() => setShowShareOptions(true))
    } else {
      setShowShareOptions(true)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("URL이 클립보드에 복사되었습니다.")
    setShowShareOptions(false)
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>스페셜 오퍼</h1>
          <p>럭스 호텔에서 준비한 다양한 특별 패키지와 프로모션을 만나보세요.</p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container">
          {/* 오퍼 상세 정보 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            {/* 헤더 이미지 */}
            <div className="relative h-96 w-full">
              <Image src={offer.image || "/placeholder.svg"} alt={offer.title} fill priority style={{ objectFit: "cover" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">{offer.title}</h1>
                <p className="text-lg">{offer.description}</p>
              </div>
            </div>

            {/* 상세 내용 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* 왼쪽 */}
              <div className="lg:col-span-2 p-8">
                {renderMarkdown(offer.content)}

                {/* 예약하기 버튼 */}
                <div className="mt-8 flex gap-4">
                  <Link
                    href="/booking"
                    className="flex-1 py-3 bg-primary-color text-white text-center rounded-md hover:bg-primary-hover transition-colors"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    예약하기
                  </Link>
                  <Link
                    href="/booking"
                    className="flex-1 py-3 bg-primary-color text-white text-center rounded-md hover:bg-primary-hover transition-colors"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    지금 예약하기
                  </Link>
                </div>
              </div>

              {/* 오른쪽 */}
              <div className="border-t lg:border-t-0 lg:border-l border-gray-200 p-8 sticky top-20">
                <div className="mb-6">
                  <span className="text-gray-500 line-through">₩{offer.price.toLocaleString()}</span>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-primary-color ml-2" style={{ color: "var(--primary-color)" }}>
                      ₩{offer.discountPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">* 세금 및 봉사료 포함</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/offers" className="inline-flex items-center text-primary-color hover:underline" style={{ color: "var(--primary-color)" }}>
              <ChevronLeft size={18} className="mr-1" /> 모든 오퍼 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
