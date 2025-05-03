"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Wifi, Tv, Coffee, Bath, Utensils, Phone, Mail, Info, Check } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import styles from "../rooms.module.css"

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
    amenities: {
      room: ["무료 Wi-Fi", "55인치 스마트 TV", "미니바", "커피 머신", "개별 온도 조절", "금고", "책상", "슬리퍼"],
      bath: ["레인 샤워", "헤어 드라이어", "목욕 가운", "럭스 어메니티", "메이크업 거울"],
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
    amenities: {
      room: [
        "무료 Wi-Fi",
        "55인치 스마트 TV",
        "미니바",
        "네스프레소 커피 머신",
        "개별 온도 조절",
        "금고",
        "책상",
        "슬리퍼",
        "블루투스 스피커",
      ],
      bath: ["레인 샤워", "헤어 드라이어", "목욕 가운", "럭스 프리미엄 어메니티", "메이크업 거울", "대형 욕조"],
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
    amenities: {
      room: [
        "무료 고속 Wi-Fi",
        "65인치 스마트 TV",
        "미니바",
        "네스프레소 커피 머신",
        "개별 온도 조절",
        "금고",
        "책상",
        "슬리퍼",
        "블루투스 스피커",
        "웰컴 과일 바구니",
        "턴다운 서비스",
      ],
      bath: [
        "레인 샤워",
        "헤어 드라이어",
        "목욕 가운",
        "럭스 프리미엄 어메니티",
        "메이크업 거울",
        "대형 욕조",
        "히팅 플로어",
      ],
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
    },
    amenities: {
      room: [
        "무료 고속 Wi-Fi",
        "65인치 스마트 TV",
        "미니바",
        "네스프레소 커피 머신",
        "개별 온도 조절",
        "금고",
        "책상",
        "슬리퍼",
        "블루투스 스피커",
        "웰컴 과일 바구니",
        "턴다운 서비스",
        "라운지 액세스",
      ],
      bath: [
        "레인 샤워",
        "헤어 드라이어",
        "목욕 가운",
        "럭스 프리미엄 어메니티",
        "메이크업 거울",
        "대형 욕조",
        "히팅 플로어",
        "스팀 샤워",
      ],
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
    amenities: {
      room: [
        "무료 고속 Wi-Fi",
        "65인치 스마트 TV",
        "미니바",
        "네스프레소 커피 머신",
        "개별 온도 조절",
        "금고",
        "책상",
        "슬리퍼",
        "블루투스 스피커",
        "웰컴 과일 바구니",
        "턴다운 서비스",
        "라운지 액세스",
      ],
      bath: [
        "레인 샤워",
        "헤어 드라이어",
        "목욕 가운",
        "럭스 프리미엄 어메니티",
        "메이크업 거울",
        "대형 욕조",
        "히팅 플로어",
        "스팀 샤워",
      ],
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
    amenities: {
      room: [
        "무료 초고속 Wi-Fi",
        "75인치 스마트 TV",
        "미니바",
        "네스프레소 커피 머신",
        "개별 온도 조절",
        "금고",
        "책상",
        "슬리퍼",
        "블루투스 스피커",
        "웰컴 샴페인",
        "과일 및 디저트 플레이트",
        "턴다운 서비스",
        "라운지 액세스",
        "전용 컨시어지",
        "무료 공항 픽업 서비스",
      ],
      bath: [
        "레인 샤워",
        "헤어 드라이어",
        "목욕 가운",
        "럭셔리 브랜드 어메니티",
        "메이크업 거울",
        "자쿠지 욕조",
        "히팅 플로어",
        "스팀 샤워",
        "욕실 TV",
      ],
    },
  },
]

// 편의시설 데이터
const facilities = [
  {
    id: "pool",
    name: "수영장",
    description:
      "탁 트인 전망을 자랑하는 실내 수영장에서 여유로운 시간을 보내세요. 온도 조절이 가능한 수영장은 계절에 상관없이 편안한 수영을 즐기실 수 있습니다.",
    image: "/images/facility/swimpool.png?height=400&width=600",
  },
  {
    id: "spa",
    name: "스파",
    description:
      "럭스 스파에서 일상의 스트레스를 잊고 몸과 마음의 균형을 되찾으세요. 다양한 트리트먼트와 마사지 프로그램이 준비되어 있습니다.",
    image: "/images/facility/sauna.png?height=400&width=600",
  },
  {
    id: "fitness",
    name: "피트니스 센터",
    description:
      "최신 장비를 갖춘 24시간 피트니스 센터에서 건강한 라이프스타일을 유지하세요. 전문 트레이너의 도움을 받을 수 있습니다.",
    image: "/images/facility/fitness.png?height=400&width=600",
  },
]

// 안내사항 데이터
const notices = [
  "전 객실 금연입니다. 흡연 시 청소 비용이 추가로 부과됩니다.",
  "체크인은 오후 3시부터, 체크아웃은 오전 11시까지입니다. (객실 등급에 따라 다를 수 있음)",
  "추가 인원 1인당 55,000원의 추가 요금이 발생합니다. (만 12세 이상)",
  "반려동물은 동반 입실이 불가합니다. (안내견 제외)",
  "객실 내 취사는 금지되어 있습니다.",
  "귀중품은 객실 내 금고에 보관하시기 바랍니다. 분실 시 호텔은 책임지지 않습니다.",
  "미성년자는 보호자 동반 없이 투숙이 불가합니다.",
]

export default function RoomDetail() {
  const router = useRouter()
  const params = useParams()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const room = rooms.find((room) => room.id === params.id)

  if (!room) {
    return <div className="container py-20 text-center">객실을 찾을 수 없습니다.</div>
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>객실 및 스위트</h1>
          <p>럭스 호텔의 다양한 객실과 스위트룸에서 편안하고 럭셔리한 휴식을 경험하세요.</p>
        </div>
      </div>

      <section className={styles.roomDetailSection}>
        <div className="container">
          <div className={styles.roomDetailGrid}>
            <div className={styles.roomDetailImageContainer}>
              <Image
                src={room.images[activeImageIndex] || "/placeholder.svg"}
                alt={room.name}
                fill
                style={{ objectFit: "cover" }}
              />

              <div className={styles.carouselControls}>
                {room.images.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.carouselDot} ${index === activeImageIndex ? styles.activeDot : ""}`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`이미지 ${index + 1} 보기`}
                  ></button>
                ))}
              </div>
            </div>

            <div className={styles.roomDetailInfo}>
              <h2 className={styles.roomDetailName}>{room.name}</h2>
              <p className={styles.roomDetailDescription}>{room.description}</p>
              <div className={styles.roomDetailPrice}>₩{room.price.toLocaleString()}부터 / 1박</div>

              <div className={styles.roomDetailInfoCard}>
                <h3 className={styles.roomDetailInfoTitle}>객실 정보</h3>
                <div className={styles.roomDetailInfoGrid}>
                  <div className={styles.roomDetailInfoItem}>
                    <div className={styles.roomDetailInfoLabel}>방 구성</div>
                    <div className={styles.roomDetailInfoValue}>{room.details.composition}</div>
                  </div>
                  <div className={styles.roomDetailInfoItem}>
                    <div className={styles.roomDetailInfoLabel}>방 위치</div>
                    <div className={styles.roomDetailInfoValue}>{room.details.location}</div>
                  </div>
                  <div className={styles.roomDetailInfoItem}>
                    <div className={styles.roomDetailInfoLabel}>침대 타입</div>
                    <div className={styles.roomDetailInfoValue}>{room.details.bedType}</div>
                  </div>
                  <div className={styles.roomDetailInfoItem}>
                    <div className={styles.roomDetailInfoLabel}>방 크기</div>
                    <div className={styles.roomDetailInfoValue}>{room.details.size}</div>
                  </div>
                  <div className={styles.roomDetailInfoItem}>
                    <div className={styles.roomDetailInfoLabel}>체크인/체크아웃</div>
                    <div className={styles.roomDetailInfoValue}>
                      {room.details.checkIn} / {room.details.checkOut}
                    </div>
                  </div>
                  <div className={styles.roomDetailInfoItem}>
                    <div className={styles.roomDetailInfoLabel}>전망</div>
                    <div className={styles.roomDetailInfoValue}>{room.details.view}</div>
                  </div>
                  <div className={styles.roomDetailInfoItem}>
                    <div className={styles.roomDetailInfoLabel}>층 수</div>
                    <div className={styles.roomDetailInfoValue}>{room.details.floor}</div>
                  </div>
                </div>
              </div>

              <Link href="/booking" className={`button button-primary ${styles.roomDetailBookButton}`}>
                예약하러 가기
              </Link>
            </div>
          </div>

          <div className={styles.amenitiesSection}>
            <h3 className={styles.amenitiesTitle}>객실 어메니티</h3>
            <div className={styles.amenitiesGrid}>
              <div className={styles.amenitiesCard}>
                <h4 className={styles.amenitiesCardTitle}>ROOM</h4>
                <div className={styles.amenitiesList}>
                  {room.amenities.room.map((amenity, index) => (
                    <div key={index} className={styles.amenitiesItem}>
                      <span className={styles.amenityIcon}>
                        {amenity.includes("Wi-Fi") ? (
                          <Wifi size={16} />
                        ) : amenity.includes("TV") ? (
                          <Tv size={16} />
                        ) : amenity.includes("커피") ? (
                          <Coffee size={16} />
                        ) : (
                          <Check size={16} />
                        )}
                      </span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.amenitiesCard}>
                <h4 className={styles.amenitiesCardTitle}>BATH</h4>
                <div className={styles.amenitiesList}>
                  {room.amenities.bath.map((amenity, index) => (
                    <div key={index} className={styles.amenitiesItem}>
                      <span className={styles.amenityIcon}>
                        {amenity.includes("샤워") ? (
                          <Bath size={16} />
                        ) : amenity.includes("어메니티") ? (
                          <Utensils size={16} />
                        ) : (
                          <Check size={16} />
                        )}
                      </span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.facilitiesSection}>
            <h3 className={styles.facilitiesTitle}>편의시설</h3>
            {facilities.map((facility) => (
              <div key={facility.id} className={styles.facilityCard}>
                <div className={styles.facilityImageContainer}>
                  <Image
                    src={facility.image || "/placeholder.svg"}
                    alt={facility.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.facilityInfo}>
                  <h4 className={styles.facilityName}>{facility.name}</h4>
                  <p className={styles.facilityDescription}>{facility.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.noticeSection}>
            <h3 className={styles.noticeTitle}>안내 사항</h3>
            <div className={styles.noticeCard}>
              <ul className={styles.noticeList}>
                {notices.map((notice, index) => (
                  <li key={index} className={styles.noticeItem}>
                    <Info size={16} className={styles.noticeIcon} />
                    <span>{notice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.contactSection}>
            <h3 className={styles.contactTitle}>문의 / 예약</h3>
            <div className={styles.contactCard}>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <Phone size={20} className={styles.contactIcon} />
                  <span className={styles.contactLabel}>전화:</span>
                  <span>02-123-4567</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={20} className={styles.contactIcon} />
                  <span className={styles.contactLabel}>이메일:</span>
                  <span>reservation@luxehotel.com</span>
                </div>
              </div>
            </div>
          </div>

          <Link href="/rooms" className={`button button-outline ${styles.backToListButton}`}>
            <ChevronLeft size={16} /> 객실 목록으로 돌아가기
          </Link>
        </div>
      </section>
    </>
  )
}

