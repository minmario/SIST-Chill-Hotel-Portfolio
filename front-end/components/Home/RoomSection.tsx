"use client"

import Link from "next/link"
import Image from "next/image"

interface Room {
  id: number;
  name: string;
  image: string;
  description: string;
  size: string;
  capacity: string;
  link: string;
}

interface RoomSectionProps {
  rooms: Room[];
}

export default function RoomSection({ rooms }: RoomSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">객실 및 스위트</h2>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          편안함과 안락함이 결합된 Chill Haven의 객실에서 몸과 마음의 휴식을 경험하세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-56">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                  <span>{room.size}</span>
                  <span>•</span>
                  <span>{room.capacity}</span>
                </div>
                <p className="text-gray-600 mb-6">{room.description}</p>
                <Link
                  href={room.link}
                  className="block text-center py-3 px-4 rounded-lg font-medium text-white transition-colors"
                  style={{ backgroundColor: "#2dd4bf" }}
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center py-3 px-6 rounded-md font-medium border border-[#2dd4bf] text-[#2dd4bf] hover:bg-[#2dd4bf] hover:text-white transition-colors"
          >
            모든 객실 보기
          </Link>
        </div>
      </div>
    </section>
  )
} 