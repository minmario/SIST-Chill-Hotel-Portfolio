"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./dining.module.css";

export interface Restaurant {
  id: number;
  name: string;
  type: string;
  description: string;
  image: string;
  location: string;
  capacity: number;
  breakfastOpen?: string | null;
  breakfastClose?: string | null;
  lunchOpen?: string | null;
  lunchClose?: string | null;
  dinnerOpen?: string | null;
  dinnerClose?: string | null;
  price: {
    adult: number;
    child: number;
  };
}

export default function DiningPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/restaurants");
        const data = await res.json();

        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          console.error("응답 형식이 배열이 아닙니다:", data);
          setRestaurants([]);
        }
      } catch (error) {
        console.error("레스토랑 불러오기 실패:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-20 px-4">
      <div className={styles.header + " mb-12 text-center"}>
        <h1 className="text-3xl font-bold mb-2">다이닝</h1>
        <p className="text-gray-600">럭셔리 호텔의 다양한 다이닝 옵션을 경험해보세요</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">레스토랑 정보를 불러오는 중입니다...</div>
      ) : restaurants.length === 0 ? (
        <div className="text-center text-red-500">등록된 레스토랑이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="relative border rounded-lg shadow-md overflow-hidden">
            <div className="relative w-full h-64">
              <Image
                src={restaurant.image || "/placeholder.svg"}
                alt={restaurant.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          
            <div className="p-6 pb-16"> {/* 아래 버튼 공간 확보 */}
              <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="inline-block px-3 py-1 text-xs text-gray-700 bg-gray-200 rounded-full mb-2">
              {restaurant.type}
              </p>
              <p className="text-sm text-gray-600 mb-4">{restaurant.description}</p>
          
              {/* ✅ 호텔 추가 정보 */}
              <ul className="text-sm text-gray-700 space-y-1 mb-4">
                <li><strong>위치:</strong> {restaurant.location}</li>
                <li><strong>좌석 수:</strong> {restaurant.capacity}석</li>
                <li>
                  <strong>운영시간:</strong>{" "}
                  {restaurant.breakfastOpen && <>아침 {restaurant.breakfastOpen.slice(0, 5)}~{restaurant.breakfastClose?.slice(0, 5)} </>}
                  {restaurant.lunchOpen && <>점심 {restaurant.lunchOpen.slice(0, 5)}~{restaurant.lunchClose?.slice(0, 5)} </>}
                  {restaurant.dinnerOpen && <>저녁 {restaurant.dinnerOpen.slice(0, 5)}~{restaurant.dinnerClose?.slice(0, 5)}</>}
                </li>
                {restaurant.price && (
                  <li>
                    <strong>가격:</strong> 성인 {restaurant.price.adult.toLocaleString()}원 / 어린이 {restaurant.price.child.toLocaleString()}원
                  </li>
                )}
              </ul>
            </div>
          
            {/* 왼쪽 하단 고정된 버튼 */}
            <Link
              href={`/dining/reserve/${restaurant.id}`}
              className="absolute bottom-4 left-4 w-80 mx-auto px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 text-center"
            >
              예약하기
            </Link>
          </div>
          
          ))}
        </div>
      )}
    </div>
  );
}
