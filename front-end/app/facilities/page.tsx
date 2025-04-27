"use client"

import { useState } from "react"
import Image from "next/image"
import { Share, Phone } from "lucide-react"
import styles from "./facilities.module.css"

const facilities = [
  {
    id: 1,
    name: "스파 & 웰니스 센터",
    description: "다양한 트리트먼트와 마사지를 통해 몸과 마음의 휴식을 경험하세요.",
    image: "https://images.unsplash.com/photo-1488345979593-09db0f85545f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNwYXxlbnwwfHwwfHx8MA%3D%3D",
    location: "호텔 3층",
    hours: "10:00 - 22:00 (매일)",
    details:
      "럭스 호텔의 스파 & 웰니스 센터는 고품질의 트리트먼트와 전문 테라피스트가 제공하는 서비스로 완벽한 휴식을 선사합니다. 다양한 마사지, 페이셜, 바디 트리트먼트를 통해 몸과 마음의 균형을 되찾으세요.",
  },
  {
    id: 2,
    name: "피트니스 센터",
    description: "최신 운동 장비를 갖춘 피트니스 센터에서 건강한 라이프스타일을 유지하세요.",
    image: "https://images.unsplash.com/photo-1542766788-a2f588f447ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zml0bmVzcyUyMGNlbnRlcnxlbnwwfHwwfHx8MA%3D%3D",
    location: "호텔 2층",
    hours: "24시간 운영",
    details:
      "럭스 호텔의 피트니스 센터는 24시간 운영되며, 최첨단 운동 장비를 갖추고 있습니다. 유산소 기구, 웨이트 트레이닝 장비, 요가 및 스트레칭 공간을 제공하여 투숙객분들의 건강한 라이프스타일을 지원합니다.",
  },
  {
    id: 3,
    name: "수영장",
    description: "자연 광이 들어오는 실내 수영장에서 여유로운 시간을 보내세요.",
    image: "https://images.unsplash.com/photo-1661098716612-eb2e12fbf601?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWwlMjBzd2ltbWluZyUyMHBvb2x8ZW58MHx8MHx8fDA%3D",
    location: "호텔 4층",
    hours: "06:00 - 22:00 (매일)",
    details:
      "럭스 호텔의 수영장은 자연 채광이 풍부한 실내에 위치하여 계절에 상관없이 편안한 수영을 즐기실 수 있습니다. 온도 조절된 25m 길이의 풀과 함께 자쿠지, 사우나 시설도 이용하실 수 있습니다.",
  },
  {
    id: 4,
    name: "비즈니스 센터",
    description: "최신 기술을 갖춘 비즈니스 센터에서 효율적인 업무 환경을 경험하세요.",
    image: "https://images.unsplash.com/photo-1631247022917-53f9af27d719?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8JUVCJUI5JTg0JUVDJUE2JTg4JUVCJThCJTg4JUVDJThBJUE0JTIwJUVDJTg0JUJDJUVEJTg0JUIwfGVufDB8fDB8fHww",
    location: "호텔 로비 층",
    hours: "07:00 - 23:00 (매일)",
    details:
      "럭스 호텔의 비즈니스 센터는 고속 인터넷, 컴퓨터 워크스테이션, 프린팅, 스캔, 팩스 서비스를 제공합니다. 또한 소규모 미팅룸도 이용 가능하여 비즈니스 미팅을 효율적으로 진행할 수 있습니다.",
  },
  {
    id: 5,
    name: "키즈 클럽",
    description: "다양한 놀이와 교육 프로그램으로 아이들에게 즐거운 경험을 제공합니다.",
    image: "https://images.unsplash.com/photo-1720729706252-40be12690f12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fCVFQyU4QiVBNCVFQiU4MiVCNCUyMCVFQiU4NiU4MCVFQyU5RCVCNCVFRCU4NCVCMHxlbnwwfHwwfHx8MA%3D%3D",
    location: "호텔 1층",
    hours: "09:00 - 18:00 (매일)",
    details:
      "럭스 호텔의 키즈 클럽은 어린이들을 위한 안전하고 즐거운 공간입니다. 숙련된 직원들의 감독하에 다양한 창의적 활동, 게임, 교육 프로그램을 제공하여 아이들에게 즐거운 추억을 선사합니다.",
  },
  {
    id: 6,
    name: "루프탑 라운지",
    description: "도시의 환상적인 전망을 감상하며 음료와 간단한 식사를 즐기세요.",
    image: "https://images.unsplash.com/photo-1621293954908-907159247fc8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JUVEJTk4JUI4JUVEJTg1JTk0JTIwJUVCJTlEJUJDJUVDJTlBJUI0JUVDJUE3JTgwfGVufDB8fDB8fHww",
    location: "호텔 최상층",
    hours: "16:00 - 24:00 (일-목), 16:00 - 02:00 (금-토)",
    details:
      "럭스 호텔의 루프탑 라운지는 도시의 파노라마 뷰를 자랑합니다. 다양한 시그니처 칵테일과 프리미엄 와인, 샴페인과 함께 경치를 즐기실 수 있으며, 세련된 분위기에서 간단한 식사도 가능합니다.",
  },
]

export default function Facilities() {
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null)
  const [showPhoneNumber, setShowPhoneNumber] = useState(false)

  const facility = selectedFacility !== null ? facilities.find((f) => f.id === selectedFacility) : null

  const shareFacility = () => {
    if (navigator.share && facility) {
      navigator
        .share({
          title: `럭스 호텔 - ${facility.name}`,
          text: facility.description,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("공유하기 에러:", error)
        })
    } else {
      alert("URL이 클립보드에 복사되었습니다.")
    }
  }

  if (selectedFacility !== null && facility) {
    return (
      <>
        <div className={styles.header}>
          <div className="container">
            <h1>편의시설</h1>
            <p>럭스 호텔의 다양한 편의시설을 통해 완벽한 휴식과 즐거움을 경험하세요.</p>
          </div>
        </div>

        <section className={styles.facilityDetailSection}>
          <div className="container">
            <div className={styles.facilityDetail}>
              <div className={styles.facilityDetailHeader}>
                <h2 className={styles.facilityDetailTitle}>{facility.name}</h2>
                <p className={styles.facilityDetailSubtitle}>{facility.description}</p>
              </div>

              <div className={styles.facilityImageGallery}>
                <div className={styles.facilityImageMain}>
                  <Image
                    src={facility.image || "/placeholder.svg"}
                    alt={facility.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* <div className={styles.facilityThumbnails}>
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`${styles.facilityThumbnail} ${index === 0 ? styles.facilityThumbnailActive : ""}`}
                    >
                      <Image
                        src={facility.image || "/placeholder.svg"}
                        alt={`${facility.name} 이미지 ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div> */}
              </div>

              <div className={styles.facilityInfo}>
                <div className={styles.facilityDescription}>
                  <p>{facility.details}</p>

                  <div className={styles.buttonContainer}>
                    <button className="button button-outline" onClick={() => setShowPhoneNumber(!showPhoneNumber)}>
                      <Phone size={16} className="mr-2" /> 유선 문의
                    </button>
                    <button className="button button-outline" onClick={shareFacility}>
                      <Share size={16} className="mr-2" /> 공유하기
                    </button>
                  </div>

                  {showPhoneNumber && (
                    <div className={styles.phoneNumberPopup}>
                      <p>전화 문의: 02-123-4567</p>
                    </div>
                  )}
                </div>

                <div className={styles.facilityDetailsCard}>
                  <h3 className={styles.facilityDetailsTitle}>시설 정보</h3>

                  <div className={styles.facilityDetailsRow}>
                    <span className={styles.facilityDetailLabel}>위치</span>
                    <span>{facility.location}</span>
                  </div>

                  <div className={styles.facilityDetailsRow}>
                    <span className={styles.facilityDetailLabel}>운영 시간</span>
                    <span>{facility.hours}</span>
                  </div>

                  <div className={styles.facilityDetailsRow}>
                    <span className={styles.facilityDetailLabel}>이용 대상</span>
                    <span>호텔 투숙객 전용</span>
                  </div>

                  <div className={styles.facilityDetailsRow}>
                    <span className={styles.facilityDetailLabel}>예약 필요 여부</span>
                    <span>사전 예약 권장</span>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <button className="button button-outline" onClick={() => setSelectedFacility(null)}>
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
          <h1>편의시설</h1>
          <p>럭스 호텔의 다양한 편의시설을 통해 완벽한 휴식과 즐거움을 경험하세요.</p>
        </div>
      </div>

      <section className={styles.facilitiesSection}>
        <div className="container">
          <div className={styles.facilitiesList}>
            {facilities.map((facility) => (
              <div key={facility.id} className={styles.facilityCard}>
                <div className={styles.facilityImage}>
                  <Image
                    src={facility.image || "/placeholder.svg"}
                    alt={facility.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.facilityContent}>
                  <h3 className={styles.facilityTitle}>{facility.name}</h3>
                  <p className={styles.facilityDescription}>{facility.description}</p>
                  <div className={styles.facilityMeta}>
                    <span>{facility.location}</span>
                    <span>{facility.hours}</span>
                  </div>
                  <div className="mt-4">
                    <button className="button button-primary w-full" onClick={() => setSelectedFacility(facility.id)}>
                      자세히 보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

