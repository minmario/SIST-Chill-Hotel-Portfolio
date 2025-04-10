"use client"
import Link from "next/link"
import Image from "next/image"
import { Phone, Share2 } from "lucide-react"
import styles from "./dining.module.css"

export default function DiningPage() {
  const restaurants = [
    {
      id: 1,
      name: "라 테라스",
      type: "뷔페",
      description:
        "신선한 제철 식재료로 준비한 인터내셔널 뷔페 레스토랑. 아침, 점심, 저녁 다양한 요리를 즐기실 수 있습니다.",
      image: "/placeholder.svg?height=400&width=600",
      location: "호텔 1층",
      seats: "150석",
<<<<<<< HEAD
      hours: "아침 06:30-10:30, 점심 12:00-14:30, 저녁 18:00-22:00",
=======
      hours: "점심 12:00-14:30, 저녁 18:00-22:00",
>>>>>>> graz1e
    },
    {
      id: 2,
      name: "아리아",
      type: "이탈리안",
      description:
        "정통 이탈리안 요리를 현대적으로 재해석한 파인 다이닝 레스토랑. 엄선된 와인 리스트와 함께 특별한 식사를 즐겨보세요.",
      image: "/placeholder.svg?height=400&width=600",
      location: "호텔 2층",
      seats: "80석",
      hours: "점심 12:00-15:00, 저녁 18:00-22:00 (월요일 휴무)",
    },
    {
      id: 3,
      name: "사쿠라",
      type: "일식",
      description:
        "최고급 식재료로 준비한 정통 일식 오마카세. 숙련된 일본 요리사가 선보이는 계절 요리를 카운터에서 직접 즐겨보세요.",
      image: "/placeholder.svg?height=400&width=600",
      location: "호텔 3층",
      seats: "30석 (카운터 12석)",
      hours: "점심 12:00-14:30, 저녁 18:00-22:00 (일요일 휴무)",
    },
  ]

  return (
    <div className="container mx-auto py-20 px-4">
      <div className={styles.header || "mb-12 text-center"}>
        <h1 className="text-3xl font-bold mb-2">다이닝</h1>
        <p className="text-gray-600">럭셔리 호텔의 다양한 다이닝 옵션을 경험해보세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-60">
              <Image
                src={restaurant.image || "/placeholder.svg"}
                alt={restaurant.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="p-6">
              <div className="mb-4">
                <span className="text-sm text-gray-500">{restaurant.type}</span>
                <h2 className="text-xl font-bold">{restaurant.name}</h2>
              </div>

              <p className="text-gray-600 mb-6 line-clamp-3">{restaurant.description}</p>

              <div className="flex items-center text-sm mb-2">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span>{restaurant.location}</span>
              </div>

              <div className="flex items-center text-sm mb-2">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5"
                  ></path>
                </svg>
                <span>{restaurant.seats}</span>
              </div>

              <div className="flex items-center text-sm mb-6">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>{restaurant.hours}</span>
              </div>

              <div className="flex gap-2">
                <Link
<<<<<<< HEAD
                  href={`/dining/reserve?restaurant=${restaurant.id}`}
=======
                  href={`/dining/reserve/${restaurant.id}`}
>>>>>>> graz1e
                  className="flex-1 py-2 text-center rounded-md font-medium text-white"
                  style={{ backgroundColor: "#2dd4bf" }}
                >
                  예약하기
                </Link>
                <button className="p-2 border border-gray-300 rounded-md">
                  <Phone size={18} />
                </button>
                <button className="p-2 border border-gray-300 rounded-md">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

