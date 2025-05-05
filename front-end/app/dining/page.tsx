"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./dining.module.css";
import { Search } from "lucide-react";

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

interface Menu {
  name: string;
  description: string;
  image: string;
  category: string;
}

export default function DiningPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [menuModalRestaurant, setMenuModalRestaurant] = useState<Restaurant | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menusLoading, setMenusLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleViewMenu = async (restaurant: Restaurant) => {
    setMenuModalRestaurant(restaurant);
    setMenus([]);
    setMenusLoading(true);
    try {
      const res = await fetch(`/api/restaurants/${restaurant.id}/menus`);
      const data = await res.json();
      setMenus(data);
      setActiveCategory(null);
    } catch (error) {
      console.error("메뉴 로딩 실패:", error);
      setMenus([]);
    } finally {
      setMenusLoading(false);
    }
  };

  const fetchRestaurants = async (page: number, keyword: string) => {
    setLoading(true);
    try {
      const url = `/api/restaurants?page=${page}&size=4${keyword ? `&keyword=${keyword}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
  
      if (Array.isArray(data.content)) {
        setRestaurants(data.content);
        setTotalPages(data.totalPages);
      } else {
        setRestaurants([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("레스토랑 불러오기 실패:", error);
      setRestaurants([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRestaurants(currentPage, keyword);
  }, [currentPage, keyword]);

  const handleSearch = () => {
    setCurrentPage(0);
    setKeyword(searchInput.trim());
  };

  return (
    <div className="container mx-auto py-20 px-4">
      <div className={styles.header + " mb-12 text-center"}>
        <h1 className="text-3xl font-bold mb-2">다이닝</h1>
        <p className="text-gray-600">럭셔리 호텔의 다양한 다이닝 옵션을 경험해보세요</p>
      </div>

      <div className="container flex justify-center mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center mb-8"
        >
          <input
            type="text"
            placeholder="검색어 입력..."
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);
              if (value.trim() === "") {
                setCurrentPage(0);
                setKeyword("");
              }
            }}
            className="border rounded-l px-4 py-2 w-64"
          />
          <button type="submit" className="button button-primary w-32 ml-4 flex items-center justify-center">
            <Search size={16} className="mr-1" /> 검색
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">레스토랑 정보를 불러오는 중입니다...</div>
      ) : restaurants.length === 0 ? (
        <div className="text-center text-red-500">등록된 레스토랑이 없습니다.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="relative border rounded-lg shadow-md overflow-hidden">
                <div className="relative w-full h-64">
                  <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill style={{ objectFit: "cover" }} />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                  <p className="inline-block px-3 py-1 text-xs text-gray-700 bg-gray-200 rounded-full mb-2">
                    {restaurant.type}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">{restaurant.description}</p>

                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li><strong>위치:</strong> {restaurant.location}</li>
                    <li><strong>좌석 수:</strong> {restaurant.capacity}석</li>
                    <li>
                      <strong>운영시간:</strong>{" "}
                      {restaurant.breakfastOpen && <>아침 {restaurant.breakfastOpen}~{restaurant.breakfastClose} </>}
                      {restaurant.lunchOpen && <>점심 {restaurant.lunchOpen}~{restaurant.lunchClose} </>}
                      {restaurant.dinnerOpen && <>저녁 {restaurant.dinnerOpen}~{restaurant.dinnerClose}</>}
                    </li>
                    {restaurant.price && (
                      <li>
                        <strong>가격:</strong> 성인 {restaurant.price.adult.toLocaleString()}원 / 어린이 {restaurant.price.child.toLocaleString()}원
                      </li>
                    )}
                  </ul>
                </div>

                <div className="px-6 pb-6">
                  <div className="w-full max-w-[520px] mx-auto flex gap-2">
                    <Link
                      href={`/dining/reserve/${restaurant.id}`}
                      className="w-[60%] px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 text-center"
                    >
                      예약하기
                    </Link>
                    <button
                      onClick={() => handleViewMenu(restaurant)}
                      className="w-[40%] px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-center"
                    >
                      메뉴보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-4 py-2 border text-sm rounded-md transition ${
                  currentPage === i
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {menuModalRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-lg relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setMenuModalRestaurant(null)}>
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-center">{menuModalRestaurant.name} 메뉴</h2>

            {/* 카테고리 필터 버튼 */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1 rounded-full border ${!activeCategory ? 'bg-teal-500 text-white' : 'bg-white text-gray-700'}`}
              >
                전체
              </button>
              {[...new Set(menus.filter(menu => menu.category && menu.category.trim() !== '').map(menu => menu.category))].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full border ${activeCategory === cat ? 'bg-teal-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {menusLoading ? (
              <p className="text-center text-gray-500">메뉴를 불러오는 중입니다...</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                {menus
                  .filter(menu => !activeCategory || menu.category === activeCategory)
                  .map((menu, idx) => (
                    <li key={idx} className="bg-gray-50 rounded-lg shadow-sm border p-4 text-center">
                      <div
                        className="w-full h-40 mb-3 rounded-md overflow-hidden cursor-pointer"
                        onClick={() => setPreviewImage(menu.image)}
                      >
                        <img
                          src={menu.image}
                          alt={menu.name}
                          className="object-cover w-full h-full transition-transform hover:scale-105"
                          // className="object-contain w-full h-full transition-transform"
                        />
                      </div>
                      <h3 className="text-base font-semibold text-gray-800">{menu.name}</h3>
                      <p className="text-sm text-gray-600">{menu.description}</p>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={() => setPreviewImage(null)}>
          <div className="max-w-3xl w-full p-4" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="확대 이미지" className="w-full max-h-[80vh] object-contain rounded-lg shadow-xl" />
            <button className="absolute top-8 right-8 text-white text-3xl" onClick={() => setPreviewImage(null)}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
