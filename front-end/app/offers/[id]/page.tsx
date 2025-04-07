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
    period: "2023.01.01 - 2023.12.31",
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

바쁜 일상에서 벗어나 도심 속에서 즐기는 특별한 휴가, 스테이케이션 패키지를 소개합니다. 럭셔리한 객실에서의 숙박과 함께 특별한 혜택을 누려보세요.

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

## 이용 안내

- 예약은 체크인 최소 24시간 전까지 가능합니다.
- 패키지 요금은 2인 기준이며, 추가 인원 시 1인당 55,000원의 추가 요금이 발생합니다.
- 스파 트리트먼트는 사전 예약이 필요합니다.
- 레스토랑 할인은 룸서비스를 제외한 호텔 내 모든 레스토랑에서 적용됩니다.
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
  {
    id: "honeymoon-special",
    title: "허니문 스페셜",
    description: "평생 기억에 남을 로맨틱한 신혼여행을 위한 특별한 패키지를 준비했습니다.",
    image: "/placeholder.svg?height=800&width=1200",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    period: "2023.01.01 - 2023.12.31",
    price: 450000,
    discountPrice: 405000,
    discountRate: 10,
    rating: 4.9,
    reviewCount: 86,
    location: "럭스 호텔 스위트 객실",
    availableRooms: ["주니어 스위트", "이그제큐티브 스위트", "프레지덴셜 스위트"],
    checkIn: "14:00",
    checkOut: "16:00",
    content: `
# 허니문 스페셜

인생에서 가장 특별한 순간, 신혼여행을 위한 럭셔리한 허니문 패키지를 소개합니다. 로맨틱한 분위기와 특별한 서비스로 잊지 못할 추억을 만들어 드립니다.

## 패키지 구성

- 주니어 스위트 1박
- 2인 조식 인룸 다이닝 서비스
- 웰컴 샴페인 1병 및 과일 플레이트
- 커플 스파 트리트먼트 60분
- 로맨틱 객실 데코레이션
- 레이트 체크아웃(16:00까지)

## 추가 혜택

- 디너 레스토랑 예약 시 와인 1병 무료 제공
- 기념 사진 촬영 서비스
- 호텔 내 레스토랑 15% 할인
- 발레파킹 서비스 무료
- 공항 픽업 서비스 (추가 요금)

## 이용 안내

- 예약은 체크인 최소 3일 전까지 가능합니다.
- 패키지 요금은 2인 기준이며, 추가 인원은 불가합니다.
- 스파 트리트먼트는 사전 예약이 필요합니다.
- 객실 데코레이션은 체크인 시간에 맞춰 준비됩니다.
`,
    highlights: ["로맨틱한 객실 데코레이션", "커플 스파 트리트먼트", "웰컴 샴페인 및 과일", "인룸 조식 서비스"],
    terms: [
      "체크인 7일 전까지 무료 취소 가능",
      "체크인 7일 이내 취소 시 1박 요금의 50% 부과",
      "노쇼(No-show) 시 전액 위약금 부과",
      "패키지 요금은 세금 및 봉사료 포함 금액",
      "객실 상황에 따라 조기 마감될 수 있음",
    ],
  },
  {
    id: "weekend-escape",
    title: "위켄드 이스케이프",
    description: "주말을 맞이하여 특별한 휴식과 즐거움이 가득한 패키지를 만나보세요.",
    image: "/placeholder.svg?height=800&width=1200",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    period: "2023.01.01 - 2023.12.31 (금-일)",
    price: 380000,
    discountPrice: 342000,
    discountRate: 10,
    rating: 4.7,
    reviewCount: 156,
    location: "럭스 호텔 전 객실",
    availableRooms: ["디럭스", "프리미엄", "스위트"],
    checkIn: "15:00",
    checkOut: "15:00",
    content: `
# 위켄드 이스케이프

지친 일상에서 벗어나 주말 동안 특별한 휴식을 즐겨보세요. 위켄드 이스케이프 패키지는 활력을 되찾기 위한 완벽한 선택입니다.

## 패키지 구성

- 디럭스 룸 1박
- 2인 조식 뷔페
- 위켄드 애프터눈 티 세트
- 실내 수영장 및 사우나 이용
- 늦은 체크아웃(15:00까지)

## 추가 혜택

- 주변 관광지 입장권 할인
- 호텔 내 레스토랑 15% 할인(금-일 저녁)
- 웰컴 드링크 제공
- 발레파킹 서비스 무료

## 이용 안내

- 금요일, 토요일, 일요일 체크인만 가능합니다.
- 예약은 체크인 최소 24시간 전까지 가능합니다.
- 패키지 요금은 2인 기준이며, 추가 인원 시 1인당 55,000원의 추가 요금이 발생합니다.
- 애프터눈 티는 체크인 당일 또는 다음날 이용 가능합니다(사전 예약 필요).
`,
    highlights: ["주말 전용 패키지", "애프터눈 티 세트 포함", "늦은 체크아웃", "레스토랑 할인"],
    terms: [
      "체크인 3일 전까지 무료 취소 가능",
      "체크인 3일 이내 취소 시 1박 요금의 50% 부과",
      "노쇼(No-show) 시 전액 위약금 부과",
      "패키지 요금은 세금 및 봉사료 포함 금액",
      "객실 상황에 따라 조기 마감될 수 있음",
    ],
  },
]

export default function OfferDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showPhoneNumber, setShowPhoneNumber] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // 현재 오퍼 찾기
  const offer = offers.find((offer) => offer.id === params.id)

  // 오퍼가 없는 경우
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

  // 마크다운 형식의 콘텐츠를 HTML로 변환 (간단한 구현)
  const renderMarkdown = (content: string) => {
    const lines = content.split("\n")
    return lines.map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h2 key={index} className="text-2xl font-bold mb-4">
            {line.substring(2)}
          </h2>
        )
      } else if (line.startsWith("## ")) {
        return (
          <h3 key={index} className="text-xl font-semibold mb-3 mt-6">
            {line.substring(3)}
          </h3>
        )
      } else if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-5 mb-2">
            {line.substring(2)}
          </li>
        )
      } else if (line.trim() === "") {
        return <br key={index} />
      } else {
        return (
          <p key={index} className="mb-4">
            {line}
          </p>
        )
      }
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `럭스 호텔 - ${offer.title}`,
          text: offer.description,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("공유하기 에러:", error)
          setShowShareOptions(true)
        })
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
          {/* 브레드크럼 네비게이션 */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary-color transition-colors">
              홈
            </Link>
            <span className="mx-2">›</span>
            <Link href="/offers" className="hover:text-primary-color transition-colors">
              스페셜 오퍼
            </Link>
            <span className="mx-2">›</span>
            <span className="text-primary-color" style={{ color: "var(--primary-color)" }}>
              {offer.title}
            </span>
          </div>

          {/* 오퍼 상세 정보 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            {/* 헤더 이미지 */}
            <div className="relative h-96 w-full">
              <Image
                src={offer.image || "/placeholder.svg"}
                alt={offer.title}
                fill
                priority
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center mb-2">
                  <span
                    className="bg-primary-color text-white text-xs font-bold px-3 py-1 rounded-full mr-2"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    {offer.discountRate}% 할인
                  </span>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{offer.rating}</span>
                    <span className="text-xs ml-1">({offer.reviewCount})</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">{offer.title}</h1>
                <p className="text-lg">{offer.description}</p>
              </div>
            </div>

            {/* 오퍼 정보 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* 왼쪽 컬럼: 오퍼 상세 내용 */}
              <div className="lg:col-span-2 p-8">
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <Calendar size={18} className="text-primary-color mr-2" style={{ color: "var(--primary-color)" }} />
                    <span className="text-sm">{offer.period}</span>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <MapPin size={18} className="text-primary-color mr-2" style={{ color: "var(--primary-color)" }} />
                    <span className="text-sm">{offer.location}</span>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <Clock size={18} className="text-primary-color mr-2" style={{ color: "var(--primary-color)" }} />
                    <span className="text-sm">
                      체크인 {offer.checkIn} / 체크아웃 {offer.checkOut}
                    </span>
                  </div>
                </div>

                {/* 이미지 갤러리 */}
                <div className="mb-8">
                  <div className="relative h-80 w-full rounded-lg overflow-hidden mb-2">
                    <Image
                      src={offer.gallery[activeImageIndex] || "/placeholder.svg"}
                      alt={`${offer.title} 이미지 ${activeImageIndex + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {offer.gallery.map((image, index) => (
                      <button
                        key={index}
                        className={`relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 ${index === activeImageIndex ? "ring-2 ring-primary-color" : ""}`}
                        style={{ borderColor: index === activeImageIndex ? "var(--primary-color)" : "" }}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${offer.title} 썸네일 ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 하이라이트 */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">패키지 하이라이트</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {offer.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start">
                        <Check
                          size={20}
                          className="text-primary-color mr-2 mt-0.5 flex-shrink-0"
                          style={{ color: "var(--primary-color)" }}
                        />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 오퍼 상세 내용 */}
                <div className="prose max-w-none">{renderMarkdown(offer.content)}</div>

                {/* 이용 약관 */}
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Info size={18} className="mr-2 text-primary-color" style={{ color: "var(--primary-color)" }} />
                    이용 약관 및 취소 정책
                  </h3>
                  <ul className="space-y-2">
                    {offer.terms.map((term, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-color mr-2" style={{ color: "var(--primary-color)" }}>
                          •
                        </span>
                        <span className="text-gray-700">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 오른쪽 컬럼: 예약 정보 */}
              <div className="border-t lg:border-t-0 lg:border-l border-gray-200">
                <div className="p-8 sticky top-20">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500 line-through">₩{offer.price?.toLocaleString()}</span>
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                        {offer.discountRate}% 할인
                      </span>
                    </div>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold text-primary-color" style={{ color: "var(--primary-color)" }}>
                        ₩{offer.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-gray-500 ml-1">/ 1박</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">* 세금 및 봉사료 포함</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-2">이용 가능 객실</h4>
                    <div className="flex flex-wrap gap-2">
                      {offer.availableRooms.map((room, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                          {room}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/booking"
                    className="block w-full py-3 bg-primary-color text-white text-center rounded-md hover:bg-primary-hover transition-colors mb-4"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    예약하기
                  </Link>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                      onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                    >
                      <Phone size={18} className="mr-2" />
                      문의하기
                    </button>
                    <button
                      className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center relative"
                      onClick={handleShare}
                    >
                      <Share size={18} className="mr-2" />
                      공유하기
                      {showShareOptions && (
                        <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md p-2 z-10 w-48">
                          <button
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center"
                            onClick={copyToClipboard}
                          >
                            URL 복사하기
                          </button>
                        </div>
                      )}
                    </button>
                  </div>

                  {showPhoneNumber && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-md text-center">
                      <p className="font-medium">전화 문의: 02-123-4567</p>
                      <p className="text-sm text-gray-600">09:00 - 18:00 (매일)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/offers"
              className="inline-flex items-center text-primary-color hover:underline"
              style={{ color: "var(--primary-color)" }}
            >
              <ChevronLeft size={18} className="mr-1" />
              모든 오퍼 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

