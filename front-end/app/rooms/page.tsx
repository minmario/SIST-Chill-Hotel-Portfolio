"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import styles from "./rooms.module.css"

// 객실 데이터
const rooms = [
  {
    id: "1",
    name: "Chill Comfort",
    description:
      "편안함과 실용성을 갖춘 객실로, 비즈니스와 레저 여행객 모두에게 적합합니다. 모던한 인테리어와 필수 편의시설을 갖추고 있어 편안한 휴식을 제공합니다.",
    price: 250000,
    images: [
      "/main_room.png?height=600&width=800",
      "/images/rooms/comfort/comfort1.png?height=600&width=800",
      "/images/rooms/comfort/comfort2.png?height=600&width=800",
    ],
    details: {
      composition: "침실 1, 욕실 1",
      location: "2-10층",
      bedType: "킹 또는 트윈",
      size: "36㎡",
      checkIn: "15:00",
      checkOut: "11:00",
      view: "시티 뷰",
      floor: "2-10층",
    },
  },
  {
    id: "2",
    name: "Chill Harmony",
    description:
      "조화로운 디자인과 넓은 공간이 특징인 객실로, 도시의 스카이라인을 감상할 수 있습니다. 고급스러운 인테리어와 편안한 침구로 완벽한 휴식을 제공합니다.",
    price: 300000,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    details: {
      composition: "침실 1, 욕실 1",
      location: "11-15층",
      bedType: "킹 또는 트윈",
      size: "42㎡",
      checkIn: "15:00",
      checkOut: "11:00",
      view: "시티 뷰",
      floor: "11-15층",
    },
  },
  {
    id: "3",
    name: "Chill Serenity",
    description:
      "고요함과 평온함을 느낄 수 있는 객실로, 프리미엄 어메니티와 넓은 공간을 제공합니다. 도시의 번잡함에서 벗어나 진정한 휴식을 경험할 수 있습니다.",
    price: 350000,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    details: {
      composition: "침실 1, 욕실 1",
      location: "16-20층",
      bedType: "킹",
      size: "48㎡",
      checkIn: "15:00",
      checkOut: "12:00",
      view: "시티 뷰 또는 리버 뷰",
      floor: "16-20층",
    },
  },
  {
    id: "4",
    name: "Chill Lake",
    description:
      "아름다운 호수 전망을 자랑하는 객실로, 자연과 도시가 조화를 이루는 특별한 경험을 제공합니다. 넓은 창문을 통해 들어오는 자연광이 객실을 밝게 비춥니다.",
    price: 400000,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    details: {
      composition: "침실 1, 욕실 1",
      location: "21-25층",
      bedType: "킹",
      size: "52㎡",
      checkIn: "15:00",
      checkOut: "12:00",
      view: "레이크 뷰",
      floor: "21-25층",
    },
  },
  {
    id: "5",
    name: "Ultimate Chill Suite",
    description:
      "럭스 호텔의 최상급 스위트룸으로, 넓은 공간과 최고급 인테리어, 프라이빗 라운지 액세스 등 특별한 서비스를 제공합니다. 도시의 파노라마 전망을 감상할 수 있는 완벽한 공간입니다.",
    price: 600000,
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    details: {
      composition: "침실 1, 거실 1, 욕실 2",
      location: "26-30층",
      bedType: "킹",
      size: "76㎡",
      checkIn: "14:00",
      checkOut: "13:00",
      view: "파노라마 뷰",
      floor: "26-30층",
    },
  },
]

export default function Rooms() {
  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>객실 및 스위트</h1>
          <p>럭스 호텔의 다양한 객실과 스위트룸에서 편안하고 럭셔리한 휴식을 경험하세요.</p>
        </div>
      </div>

      <section className={styles.roomsSection}>
        <div className="container">
          {rooms.map((room, index) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </>
  )
}

function RoomCard({ room }: { room: any }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  return (
    <div className={styles.roomCard}>
      <div className={styles.roomImageContainer}>
        <div className={styles.roomCarousel}>
          {room.images.map((image: string, index: number) => (
            <Link
              href={`/rooms/${room.id}`}
              key={index}
              className={`${styles.roomImage} ${index === activeImageIndex ? styles.activeImage : ""}`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${room.name} 이미지 ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </Link>
          ))}

          <div className={styles.carouselControls}>
            {room.images.map((_: string, index: number) => (
              <button
                key={index}
                className={`${styles.carouselDot} ${index === activeImageIndex ? styles.activeDot : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveImageIndex(index)
                }}
                aria-label={`이미지 ${index + 1} 보기`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.roomInfo}>
        <h2 className={styles.roomName}>{room.name}</h2>
        <p className={styles.roomDescription}>{room.description}</p>
        <div className={styles.roomPrice}>₩{room.price.toLocaleString()}부터 / 1박</div>
        <Link href={`/rooms/${room.id}`} className={styles.viewMoreLink}>
          <ChevronLeft size={16} /> 자세히 보기
        </Link>
      </div>
    </div>
  )
}

