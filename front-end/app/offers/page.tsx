"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Search, Calendar, Share, Phone } from "lucide-react"
import styles from "./offers.module.css"

const offers = [
  {
    id: 1,
    title: "스테이케이션 패키지",
    description: "일상 속 특별한 휴식이 필요할 때, 도심 속 완벽한 휴가를 경험하세요.",
    image: "https://plus.unsplash.com/premium_photo-1664475924785-7ded40a12945?q=80&w=2610&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    period: "2025.02.01 - 2025.11.30",
    price: "₩350,000부터",
    content:
      "도심 속에서 즐기는 특별한 휴가, 스테이케이션 패키지를 소개합니다.\n\n패키지 구성:\n- 디럭스 룸 1박\n- 2인 조식 뷔페\n- 실내 수영장 및 피트니스 센터 이용\n- 웰컴 음료 제공\n- 레이트 체크아웃(14:00까지)\n\n추가 혜택:\n- 스파 트리트먼트 20% 할인\n- 호텔 내 레스토랑 10% 할인",
  },
  {
    id: 2,
    title: "허니문 스페셜",
    description: "평생 기억에 남을 로맨틱한 신혼여행을 위한 특별한 패키지를 준비했습니다.",
    image: "https://media.istockphoto.com/id/1324700640/ko/%EC%82%AC%EC%A7%84/%EC%97%AC%EB%A6%84-%EC%98%B7%EC%9D%98-%EC%9A%B0%EC%95%84%ED%95%9C-%EB%B6%80%EB%B6%80%EB%8A%94-%EC%88%98%EC%98%81%EC%9E%A5-%EC%98%86%EC%97%90-%EC%95%89%EC%95%84-%EC%A7%80%EC%A4%91%ED%95%B4%EC%9D%98-%EC%A0%84%EB%A7%9D%EC%9D%84-%EC%A6%90%EA%B8%B4%EB%8B%A4.webp?a=1&b=1&s=612x612&w=0&k=20&c=wW54wkSex0Gue2AR3jfN6o-_2MJlgIBuhqC3-ZSYOhA=",
    period: "2025.03.01 - 2025.10.31",
    price: "₩450,000부터",
    content:
      "로맨틱한 분위기와 특별한 서비스를 제공하는 허니문 스페셜 패키지입니다.\n\n패키지 구성:\n- 주니어 스위트 1박\n- 2인 조식 인룸 다이닝 서비스\n- 웰컴 샴페인 및 과일 플레이트\n- 커플 스파 트리트먼트 60분\n- 로맨틱 객실 데코레이션\n\n추가 혜택:\n- 디너 레스토랑 예약 시 와인 1병 무료 제공\n- 기념 사진 촬영 서비스",
  },
  {
    id: 3,
    title: "위켄드 이스케이프",
    description: "주말을 맞이하여 특별한 휴식과 즐거움이 가득한 패키지를 만나보세요.",
    image: "https://media.istockphoto.com/id/519867614/ko/%EC%82%AC%EC%A7%84/%EB%B2%A8%EB%AA%AC%ED%8A%B8%EC%97%90-%EC%8B%9C%EA%B0%84.webp?a=1&b=1&s=612x612&w=0&k=20&c=wwTCst9UZc6AgqRopPtjKVasGgH-7QoJpqGR-qwbqGk=",
    period: "2025.01.01 - 2025.12.31",
    price: "₩580,000부터",
    content:
      "주말 동안 완벽한 휴식을 위한 위켄드 이스케이프 패키지를 소개합니다.\n\n패키지 구성:\n- 디럭스 룸 1박\n- 2인 조식 뷔페\n- 위켄드 애프터눈 티 세트\n- 실내 수영장 및 사우나 이용\n\n추가 혜택:\n- 주변 관광지 입장권 할인\n- 호텔 내 레스토랑 15% 할인(금-일 저녁)",
  },
  {
    id: 4,
    title: "가족 패키지",
    description: "아이들과 함께하는 특별한 가족 여행을 위한 맞춤형 패키지입니다.",
    image: "https://plus.unsplash.com/premium_photo-1663091105701-3201658e1c82?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZhbWlseSUyMHZhY2F0aW9uJTIwaG90ZWx8ZW58MHx8MHx8fDA%3D",
    period: "2025.05.01 - 2025.08.31",
    price: "₩500,000부터",
    content:
      "소중한 가족과 함께 특별한 시간을 보내세요.\n\n패키지 구성:\n- 패밀리 디럭스 룸 1박\n- 최대 2인 성인, 2인 어린이 조식 뷔페\n- 키즈 웰컴 키트 제공\n- 키즈클럽 무료 이용(4시간)\n- 패밀리 무비 나이트 셋업\n\n추가 혜택:\n- 인근 테마파크 셔틀 서비스\n- 어린이 메뉴 30% 할인\n- 추가 침구류 무료 제공",
  },
  {
    id: 5,
    title: "비즈니스 트래블 패키지",
    description: "업무 출장도 편안하게, 비즈니스 여행객을 위한 맞춤 패키지입니다.",
    image: "https://plus.unsplash.com/premium_photo-1661903986017-673f1bd6b47e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXhlY3V0aXZlJTIwYnVzaW5lc3MlMjBzdWl0ZXxlbnwwfHwwfHx8MA%3D%3D",
    period: "2025.01.01 - 2025.12.31",
    price: "₩600,000부터",
    content:
      "비즈니스 출장의 효율성과 편안함을 고려한 트래블 패키지를 제공합니다.\n\n패키지 구성:\n- 비즈니스 디럭스 룸 1박\n- 조식 뷔페\n- 비즈니스 센터 2시간 무료 이용\n- 프리미엄 WiFi 제공\n\n추가 혜택:\n- 공항 픽업 서비스 20% 할인\n- 회의실 대여 10% 할인\n- 익스프레스 체크인/체크아웃",
  },
  {
    id: 6,
    title: "시즌 스페셜 - 여름 패키지",
    description: "무더운 여름을 시원하게 보낼 수 있는 특별한 패키지를 만나보세요.",
    image: "https://images.unsplash.com/photo-1613192195514-6ae0febccc29?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHN1bW1lciUyMHJlc29ydCUyMHBvb2x8ZW58MHx8MHx8fDA%3D",
    period: "2025.06.01 - 2025.08.31",
    price: "₩780,000부터",
    content:
      "여름 시즌을 위한 시원한 혜택 패키지입니다.\n\n패키지 구성:\n- 디럭스 룸 1박\n- 2인 조식 뷔페\n- 시원한 웰컴 드링크 제공\n- 야외 수영장 무료 이용 및 선베드 우선 예약\n\n추가 혜택:\n- 썸머 칵테일 2잔 무료 제공\n- 선크림 키트 제공\n- 수영장 카바나 이용 20% 할인",
  },
]


export default function Offers() {
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showPhoneNumber, setShowPhoneNumber] = useState(false)

  const itemsPerPage = 4

  const filteredOffers = offers.filter(
    (offer) =>
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage)

  const paginatedOffers = filteredOffers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const shareOffer = () => {
    if (selectedOffer !== null) {
      const offer = offers.find((o) => o.id === selectedOffer)
      if (offer && navigator.share) {
        navigator
          .share({
            title: `럭스 호텔 - ${offer.title}`,
            text: offer.description,
            url: window.location.href,
          })
          .catch((error) => {
            console.log("공유하기 에러:", error)
          })
      } else {
        alert("URL이 클립보드에 복사되었습니다.")
      }
    }
  }

  if (selectedOffer !== null) {
    const offer = offers.find((o) => o.id === selectedOffer)

    if (!offer) {
      return <div className="container py-10">잘못된 접근입니다.</div>
    }

    return (
      <>
        <div className={styles.header}>
          <div className="container">
            <h1>스페셜 오퍼</h1>
            <p>럭스 호텔에서 준비한 다양한 특별 패키지와 프로모션을 만나보세요.</p>
          </div>
        </div>

        <section className={styles.offerDetailSection}>
          <div className="container">
            <div className={styles.offerDetail}>
              <div className={styles.offerDetailHeader}>
                <h2 className={styles.offerDetailTitle}>{offer.title}</h2>
                <p className={styles.offerDetailSubtitle}>{offer.description}</p>
                <p className={styles.offerDetailMeta}>
                  <Calendar size={16} className="inline-block mr-1" /> {offer.period}
                </p>
              </div>

              <div className={styles.offerImageGallery}>
                <div className={styles.offerImageMain}>
                  <Image
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>

              <div className={styles.offerInfo}>
                <div className={styles.offerDescription}>
                  {offer.content.split("\n\n").map((paragraph, i) => (
                    <div key={i} className="mb-4">
                      {paragraph.split("\n").map((line, j) => (
                        <p key={j} className={j === 0 && line.endsWith(":") ? "font-semibold" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}

                  <div className={styles.buttonContainer}>
                    <button
                      className="button button-primary"
                      onClick={() => {
                        // 오늘 날짜 기준으로 checkIn/checkOut, 인원 기본값 설정
                        const today = new Date();
                        const tomorrow = new Date(today);
                        tomorrow.setDate(today.getDate() + 1);
                        const pad = (n: number) => n.toString().padStart(2, '0');
                        const checkIn = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
                        const checkOut = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
                        window.location.href = `/booking?checkInDate=${checkIn}&checkOutDate=${checkOut}&roomCount=1&adults=2&children=0`;
                      }}
                    >
                      예약하기
                    </button>
                    <button className="button button-outline" onClick={() => setShowPhoneNumber(!showPhoneNumber)}>
                      <Phone size={16} className="mr-2" /> 문의하기
                    </button>
                    <button className="button button-outline" onClick={shareOffer}>
                      <Share size={16} className="mr-2" /> 공유하기
                    </button>
                  </div>

                  {showPhoneNumber && (
                    <div className={styles.phoneNumberPopup}>
                      <p>전화 문의: 02-123-4567</p>
                    </div>
                  )}
                </div>

                <div>
                  <div className={styles.offerDetailsCard}>
                    <h3 className={styles.offerDetailsTitle}>패키지 정보</h3>

                    <div className={styles.offerDetailsRow}>
                      <span className={styles.offerDetailLabel}>기간</span>
                      <span>{offer.period}</span>
                    </div>

                    <div className={styles.offerDetailsRow}>
                      <span className={styles.offerDetailLabel}>가격</span>
                      <span>{offer.price}</span>
                    </div>

                    <div className={styles.offerDetailsRow}>
                      <span className={styles.offerDetailLabel}>예약 조건</span>
                      <span>사전 예약 필수</span>
                    </div>

                    <div className={styles.offerDetailsRow}>
                      <span className={styles.offerDetailLabel}>취소 정책</span>
                      <span>체크인 3일 전까지 무료 취소</span>
                    </div>
                  </div>

                  <div className={styles.offerPriceCard}>
                    <h3 className={styles.offerPriceTitle}>프로모션 가격</h3>
                    <div className={styles.offerPriceAmount}>{offer.price}</div>
                    <p className={styles.offerPriceDescription}>
                      * 세금 및 봉사료 별도
                      <br />* 성수기 및 주말 요금은 상이할 수 있습니다.
                    </p>
                    <button className="button button-primary w-full">지금 예약하기</button>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <button className="button button-outline" onClick={() => setSelectedOffer(null)}>
                  목록으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>스페셜 오퍼</h1>
          <p>럭스 호텔에서 준비한 다양한 특별 패키지와 프로모션을 만나보세요.</p>
        </div>
      </div>

      <section className={styles.offersSection}>
        <div className="container">
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch} className="flex w-full max-w-md">
              <input
                type="text"
                placeholder="검색어 입력..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="button button-primary w-32">
                <Search size={16} className="mr-1" /> 검색
              </button>
            </form>
          </div>

          <div className={styles.offersList}>
            {paginatedOffers.map((offer) => (
              <div key={offer.id} className={styles.offerCard}>
                <div className={styles.offerImage}>
                  <Image
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.offerContent}>
                  <h3 className={styles.offerTitle}>{offer.title}</h3>
                  <p className={styles.offerDescription}>{offer.description}</p>
                  <div className={styles.offerMeta}>
                    <span>
                      <Calendar size={14} className="inline-block mr-1" /> {offer.period}
                    </span>
                    <span className={styles.offerPrice}>{offer.price}</span>
                  </div>
                  <div className="mt-4">
                    <button className="button button-primary w-full" onClick={() => setSelectedOffer(offer.id)}>
                      자세히 보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${styles.pageButton} ${page === currentPage ? styles.activePageButton : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
