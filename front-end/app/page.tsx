"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./page.module.css"
import { useRouter } from "next/navigation"





const slides = [
  {
    id: 1,
    image: "/placeholder.svg?height=1080&width=1920",
    title: "Your Ultimate Healing Retreat",
    description: "Experience tranquility and rejuvenation at Chill Haven Resort & Spa",
    buttonText: "Begin Your Journey",
    buttonLink: "/rooms",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=1080&width=1920",
    title: "Luxury Meets Nature",
    description: "Immerse yourself in the perfect blend of luxury and natural beauty",
    buttonText: "Explore Our Resort",
    buttonLink: "/facilities",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=1080&width=1920",
    title: "Culinary Excellence",
    description: "Indulge in exceptional dining experiences with breathtaking views",
    buttonText: "Discover Dining",
    buttonLink: "/dining",
  },
]

export default function Home() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [currentDiningSlide, setCurrentDiningSlide] = useState(0)
  const [currentStoreSlide, setCurrentStoreSlide] = useState(0)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [roomCount, setRoomCount] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

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

  const formatDate = (date: string | number | Date) => {
    const d = new Date(date)
    const day = d.getDate().toString().padStart(2, "0")
    const month = (d.getMonth() + 1).toString().padStart(2, "0")
    const year = d.getFullYear()
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()]
    return `${year}.${month}.${day} (${dayOfWeek})`
  }
  const handleSearch = () => {
    router.push(`/booking?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomCount=${roomCount}&adults=${adults}&children=${children}`)
  }
  // 객실 정보
  const rooms = [
    {
      id: 1,
      name: "Chill Harmony Room",
      image: "/placeholder.svg?height=300&width=400",
      description: "A peaceful retreat with panoramic mountain views with harmonious design elements.",
      size: "30m²",
      capacity: "성인 2인 기준 / 최대 3인",
      link: "/rooms/harmony",
    },
    {
      id: 2,
      name: "Chill Serenity Room",
      image: "/placeholder.svg?height=300&width=400",
      description: "A tranquil space with modern amenities and soothing natural views.",
      size: "35m²",
      capacity: "성인 2인 기준 / 최대 3인",
      link: "/rooms/serenity",
    },
    {
      id: 3,
      name: "Chill Family Suite",
      image: "/placeholder.svg?height=300&width=400",
      description: "A spacious suite with separate living areas and a luxurious suite designed for family well-being.",
      size: "50m²",
      capacity: "성인 4인 기준 / 최대 5인",
      link: "/rooms/family",
    },
  ]

  // 다이닝 정보
  const diningOptions = [
    {
      id: 1,
      name: "Sunset Lounge",
      image: "/placeholder.svg?height=400&width=800",
      description: "석양을 바라보며 즐기는 커피향과 가벼운 식사",
      hours: "매일 17:00 - 22:00",
      link: "/dining/sunset-lounge",
    },
    {
      id: 2,
      name: "Ocean View Restaurant",
      image: "/placeholder.svg?height=400&width=800",
      description: "신선한 해산물과 지역 식재료로 준비한 정통 요리",
      hours: "매일 07:00 - 22:00",
      link: "/dining/ocean-view",
    },
    {
      id: 3,
      name: "Harmony Bar",
      image: "/placeholder.svg?height=400&width=800",
      description: "프리미엄 위스키와 칵테일을 즐길 수 있는 분위기 있는 바",
      hours: "매일 18:00 - 01:00",
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
      name: "Chill Haven 아로마 디퓨저",
      image: "/placeholder.svg?height=400&width=800",
      description: "호텔에서 경험한 그 향기 그대로, 프리미엄 아로마 디퓨저",
      price: "85,000원",
      link: "/store/2",
    },
    {
      id: 3,
      name: "Chill Haven 오가닉 티 세트",
      image: "/placeholder.svg?height=400&width=800",
      description: "유기농 재료로 만든 5가지 블렌드 티 컬렉션",
      price: "48,000원",
      link: "/store/3",
    },
  ]

  return (
    <div className={styles.main}>
      {/* 히어로 섹션 */}
      <section className={styles.heroSection}>
        {slides.map((slide, index) => (
          <div key={slide.id} className={`${styles.slide} ${index === currentSlide ? styles.activeSlide : ""}`}>
            <div className={styles.slideBackground} style={{ backgroundImage: `url(${slide.image})` }}></div>
            <div className={styles.slideContent}>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <Link href={slide.buttonLink} className={`button button-primary ${styles.heroButton}`}>
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}

        <button
          className={`${styles.sliderControl} ${styles.prevControl}`}
          onClick={goToPrevSlide}
          aria-label="이전 슬라이드"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className={`${styles.sliderControl} ${styles.nextControl}`}
          onClick={goToNextSlide}
          aria-label="다음 슬라이드"
        >
          <ChevronRight size={24} />
        </button>

        <div className={styles.sliderIndicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.activeIndicator : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            ></button>
          ))}
        </div>

        {/* 예약 폼 */}
        <div className={styles.heroBookingBarContainer}>
          <div className="container">
            <div className={styles.bookingForm}>
              <div className={styles.bookingFormField}>
                <label htmlFor="check-in">체크인</label>
                <input
                  type="date"
                  id="check-in"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className={styles.bookingInput}
                />
                {checkInDate && <div className={styles.formattedDate}>{formatDate(checkInDate)}</div>}
              </div>
              <div className={styles.bookingFormField}>
                <label htmlFor="check-out">체크아웃</label>
                <input
                  type="date"
                  id="check-out"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className={styles.bookingInput}
                />
                {checkOutDate && <div className={styles.formattedDate}>{formatDate(checkOutDate)}</div>}
              </div>
              <div className={styles.bookingFormField}>
                <label htmlFor="roomCount">객실 수</label>
                <select
                  id="roomCount"
                  value={roomCount}
                  onChange={(e) => setRoomCount(Number(e.target.value))}
                  className={styles.bookingInput}
                >
                  <option value={1}>1개</option>
                  <option value={2}>2개</option>
                  <option value={3}>3개</option>
                  <option value={4}>4개</option>
                </select>
              </div>
              <div className={styles.bookingFormField}>
                <label htmlFor="adults">성인</label>
                <select
                  id="adults"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className={styles.bookingInput}
                >
                  <option value={1}>1명</option>
                  <option value={2}>2명</option>
                  <option value={3}>3명</option>
                  <option value={4}>4명</option>
                </select>
              </div>

              <div className={styles.bookingFormField}>
                <label htmlFor="children">어린이</label>
                <select
                  id="children"
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className={styles.bookingInput}
                >
                  <option value={0}>0명</option>
                  <option value={1}>1명</option>
                  <option value={2}>2명</option>
                  <option value={3}>3명</option>
                </select>
              </div>
              <div className={styles.bookingFormButton}>
              <button onClick={handleSearch} className={styles.searchButton}>
                객실 검색
              </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 객실 소개 섹션 */}
      <section className={styles.roomsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>객실 안내</h2>
          <p className={styles.sectionDescription}>
            Chill Haven Resort & Spa의 다양한 객실에서 편안한 휴식을 경험해보세요. 고객님의 취향과 필요에 맞는 최적의
            공간을 제공합니다.
          </p>

          <div className={styles.roomsGrid}>
            {rooms.map((room) => (
              <div key={room.id} className={styles.roomCard}>
                <div className={styles.roomImageContainer}>
                  <Image
                    src={room.image || "/placeholder.svg"}
                    alt={room.name}
                    width={400}
                    height={300}
                    className={styles.roomImage}
                  />
                </div>
                <div className={styles.roomInfo}>
                  <h3 className={styles.roomName}>{room.name}</h3>
                  <p className={styles.roomDescription}>{room.description}</p>
                  <div className={styles.roomDetails}>
                    <span className={styles.roomSize}>{room.size}</span>
                    <span className={styles.roomCapacity}>{room.capacity}</span>
                  </div>
                  <Link href={room.link} className={styles.roomDetailsButton}>
                    자세히 보기 →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.viewAllContainer}>
            <Link href="/booking" className={styles.viewAllButton}>
              객실 예약하기
            </Link>
          </div>
        </div>
      </section>

      {/* 다이닝 섹션 */}
      <section className={styles.diningSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>다이닝</h2>
          <p className={styles.sectionDescription}>
            지역과 함께 즐기는 고품격 다이닝 경험을 통해 오감을 만족시켜 드립니다.
          </p>

          <div className={styles.diningSlider}>
            <button
              className={`${styles.sliderControl} ${styles.prevControl}`}
              onClick={goToPrevDiningSlide}
              aria-label="이전 다이닝"
            >
              <ChevronLeft size={24} />
            </button>

            {diningOptions.map((dining, index) => (
              <div
                key={dining.id}
                className={`${styles.diningSlide} ${index === currentDiningSlide ? styles.activeDiningSlide : ""}`}
              >
                <div className={styles.diningImageContainer}>
                  <Image
                    src={dining.image || "/placeholder.svg"}
                    alt={dining.name}
                    width={800}
                    height={400}
                    className={styles.diningImage}
                  />
                </div>
                <div className={styles.diningInfo}>
                  <h3 className={styles.diningName}>{dining.name}</h3>
                  <p className={styles.diningDescription}>{dining.description}</p>
                  <p className={styles.diningHours}>{dining.hours}</p>
                </div>
              </div>
            ))}

            <button
              className={`${styles.sliderControl} ${styles.nextControl}`}
              onClick={goToNextDiningSlide}
              aria-label="다음 다이닝"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className={styles.diningIndicators}>
            {diningOptions.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === currentDiningSlide ? styles.activeIndicator : ""}`}
                onClick={() => setCurrentDiningSlide(index)}
                aria-label={`다이닝 ${index + 1}로 이동`}
              ></button>
            ))}
          </div>

          <div className={styles.viewAllContainer}>
            <Link href="/dining" className={styles.viewAllButton}>
              전체 다이닝 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 기프트샵 섹션 */}
      <section className={styles.storeSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>기프트샵</h2>
          <p className={styles.sectionDescription}>
            Chill Haven의 특별한 경험을 집에서도 느낄 수 있는 프리미엄 상품들을 만나보세요.
          </p>

          <div className={styles.storeSlider}>
            <button
              className={`${styles.sliderControl} ${styles.prevControl}`}
              onClick={goToPrevStoreSlide}
              aria-label="이전 상품"
            >
              <ChevronLeft size={24} />
            </button>

            {storeItems.map((item, index) => (
              <div
                key={item.id}
                className={`${styles.storeSlide} ${index === currentStoreSlide ? styles.activeStoreSlide : ""}`}
              >
                <div className={styles.storeImageContainer}>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={800}
                    height={400}
                    className={styles.storeImage}
                  />
                </div>
                <div className={styles.storeInfo}>
                  <h3 className={styles.storeName}>{item.name}</h3>
                  <p className={styles.storeDescription}>{item.description}</p>
                  <p className={styles.storePrice}>{item.price}</p>
                  <Link href={item.link} className={styles.storeDetailsButton}>
                    자세히 보기 →
                  </Link>
                </div>
              </div>
            ))}

            <button
              className={`${styles.sliderControl} ${styles.nextControl}`}
              onClick={goToNextStoreSlide}
              aria-label="다음 상품"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className={styles.storeIndicators}>
            {storeItems.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === currentStoreSlide ? styles.activeIndicator : ""}`}
                onClick={() => setCurrentStoreSlide(index)}
                aria-label={`상품 ${index + 1}로 이동`}
              ></button>
            ))}
          </div>

          <div className={styles.viewAllContainer}>
            <Link href="/store" className={styles.viewAllButton}>
              전체 상품 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

