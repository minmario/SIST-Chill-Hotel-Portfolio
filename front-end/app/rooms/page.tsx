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
      "/images/rooms/comfort/comfort1.png?height=600&width=800",
      "/images/rooms/comfort/comfort2.png?height=600&width=800",
      "/images/rooms/comfort/comfort3.png?height=600&width=800",
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
      "/images/rooms/harmony/harmony1.png?height=600&width=800",
      "/images/rooms/harmony/harmony2.png?height=600&width=800",
      "/images/rooms/harmony/harmony3.png?height=600&width=800",
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
      "/images/rooms/serenity/serenity1.png?height=600&width=800",
      "/images/rooms/serenity/serenity2.png?height=600&width=800",
      "/images/rooms/serenity/serenity3.png?height=600&width=800",
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
    name: "Chill Family",
    description:
      "가족이 함께 머물기 좋은 넓은 패밀리룸입니다. 더블+싱글 침대 구성, 키즈 어메니티, 넓은 거실과 다양한 수납공간, 어린이 안전용품까지 모두 준비되어 있어 가족 여행에 최적입니다.",
    price: 420000,
    images: [
      "/images/rooms/family/family1.png?height=600&width=800",
      "/images/rooms/family/family2.png?height=600&width=800",
      "/images/rooms/family/family3.png?height=600&width=800",
    ],
    details: {
      composition: "침실 2, 욕실 2, 거실 1",
      location: "10-15층",
      bedType: "더블 + 싱글 또는 패밀리 침대",
      size: "56㎡",
      checkIn: "15:00",
      checkOut: "12:00",
      view: "시티 뷰 또는 파크 뷰",
      floor: "10-15층",
      amenities: [
        "유아/어린이 어메니티 세트",
        "추가 침대/유아용 침대 요청 가능",
        "키즈 슬리퍼 및 가운",
        "가족용 테이블/소파",
        "어린이 안전용품(코너 보호대 등)",
        "무료 Wi-Fi, TV, 냉장고, 금연실"
      ]
    },
  },
  {
    id: "5",
    name: "Chill Lake",
    description:
      "아름다운 호수 전망을 자랑하는 객실로, 자연과 도시가 조화를 이루는 특별한 경험을 제공합니다. 넓은 창문을 통해 들어오는 자연광이 객실을 밝게 비춥니다.",
    price: 400000,
    images: [
      "/images/rooms/lake/lake1.png?height=600&width=800",
      "/images/rooms/lake/lake2.png?height=600&width=800",
      "/images/rooms/lake/lake3.png?height=600&width=800",
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
    id: "6",
    name: "Ultimate Chill Suite",
    description:
      "럭스 호텔의 최상급 스위트룸으로, 넓은 공간과 최고급 인테리어, 프라이빗 라운지 액세스 등 특별한 서비스를 제공합니다. 도시의 파노라마 전망을 감상할 수 있는 완벽한 공간입니다.",
    price: 600000,
    images: [
      "/images/rooms/ultimate/ultimate1.png?height=600&width=800",
      "/images/rooms/ultimate/ultimate2.png?height=600&width=800",
      "/images/rooms/ultimate/ultimate3.png?height=600&width=800",
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
      <div className={styles.header} style={{position:'relative',width:'100%',height:'320px',marginBottom:'2rem',overflow:'hidden'}}>
        <Image
          src="/images/rooms/family/family1.png"
          alt="객실 및 스위트 대표 이미지"
          fill
          style={{objectFit:'cover'}}
          priority
        />
        <div className={styles.roomsHeaderOverlay} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.45)'}} />
        <div className={styles.roomsHeaderText} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',zIndex:2}}>
          <div className="container">
            <h1 style={{color:'#fff',fontSize:'2.7rem',fontWeight:700,marginBottom:'1rem',textShadow:'0 2px 16px rgba(0,0,0,0.5)'}}>객실 및 스위트</h1>
            <p style={{color:'#fff',fontSize:'1.15rem',fontWeight:400,textAlign:'center',textShadow:'0 2px 12px rgba(0,0,0,0.5)'}}>럭스 호텔의 다양한 객실과 스위트룸에서 편안하고 럭셔리한 휴식을 경험하세요.</p>
          </div>
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

