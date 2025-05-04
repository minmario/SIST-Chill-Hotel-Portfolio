"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users, Calendar, Home, ChevronDown, X } from "lucide-react"
import styles from "../rooms/rooms.module.css"


export default function Booking() {
  const router = useRouter()
  const [rooms, setRooms] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("rooms") // 'rooms' or 'packages'
  const [sortOption, setSortOption] = useState("price-asc")
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [roomTypes, setRoomTypes] = useState<any[]>([]);

  // 스페셜 오퍼 상태 추가
  const [specialOffers, setSpecialOffers] = useState<any[]>([]);


  const [searchParams, setSearchParams] = useState({
    checkIn: "",
    checkOut: "",
    roomCount: "1",
    adults: "2",
    children: "0",
  })
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearchParams({
      checkIn: params.get("checkInDate") || "",
      checkOut: params.get("checkOutDate") || "",
      roomCount: params.get("roomCount") || "1",
      adults: params.get("adults") || "1",
      children: params.get("children") || "0",

    })

  }, [])

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!searchParams.checkIn || !searchParams.checkOut || !searchParams.adults) return

      try {
        const res = await fetch(
          `/api/room-types/available?checkInDate=${searchParams.checkIn}&checkOutDate=${searchParams.checkOut}&roomCount=${searchParams.roomCount}&adults=${searchParams.adults}&children=${searchParams.children}`
        )
        const data = await res.json()
        console.log("객실 API 응답:", data);
        if (Array.isArray(data)) {
          setRooms(data)
          console.log("가져온 객실 데이터:", data)
        } else {
          console.warn("객실 API 응답이 배열이 아닙니다:", data)
          setRooms([])
        }
      } catch (err) {
        console.error("객실 조회 실패:", err)
      }
    }

    fetchAvailableRooms()
  }, [searchParams.checkIn, searchParams.checkOut, searchParams.roomCount,searchParams.adults,searchParams.children])
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 검색 로직 구현
    console.log("검색 파라미터:", searchParams)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value)
  }

  const sortedRooms = [...rooms].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price
    if (sortOption === "price-desc") return b.price - a.price
    return 0
  })


  // 패키지 탭 활성화 시 스페셜 오퍼 데이터 패칭
  useEffect(() => {
    if (activeTab === "packages") {
      const fetchSpecialOffers = async () => {
        try {
          // JWT 토큰을 Authorization 헤더에 추가
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          const res = await fetch('/api/special-offers', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          });
          const data = await res.json();
          setSpecialOffers(Array.isArray(data) ? data : []);
        } catch (err) {
          setSpecialOffers([]);
        }
      };
      fetchSpecialOffers();
    }
  }, [activeTab]);


  const closeModal = () => {
    setModalOpen(false)
  }

  const handleBookNow = (roomType: any) => {
    const availableList = roomType.availableRoomIdxList || [];
    const count = parseInt(searchParams.roomCount || "1", 10);

    if (availableList.length < count) {
      alert("해당 객실 타입에는 예약 가능한 방이 없습니다.");
      return;
    }
    const selectedRoomIdxList = availableList.slice(0, count);
    const selected = {
      ...roomType,
      roomIdx: selectedRoomIdxList,
      roomCount: count,
    };

    localStorage.setItem("selectedRoom", JSON.stringify(selected));
    localStorage.setItem("bookingParams", JSON.stringify(searchParams));
    localStorage.removeItem("selectedSpecialOffer"); // 객실 예약 시 오퍼 정보 제거
    router.push("/booking/info");
  };

  return (
    <>
      <div className={styles.header} style={{ position: 'relative', width: '100%', height: '320px', marginBottom: '2rem', overflow: 'hidden' }}>
        <Image
          src="/images/rooms/reservation.png"
          alt="예약 상단 대표 이미지"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className={styles.roomsHeaderOverlay} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.45)' }} />
        <div className={styles.roomsHeaderText} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
          <div className="container">
            <h1 style={{ color: '#fff', fontSize: '2.7rem', fontWeight: 700, marginBottom: '1rem', textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>객실 예약</h1>
            <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 400, textAlign: 'center', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>럭스 호텔에서 특별한 경험을 예약하세요.</p>
          </div>
        </div>
      </div>

      <section className={styles.bookingSection}>
        <div className="container">
          <div className={styles.bookingSteps}>
            <div className={`${styles.bookingStep} ${styles.bookingStepActive}`}>
              <div className={styles.bookingStepNumber}>1</div>
              <div className={styles.bookingStepLabel}>객실 선택</div>
            </div>
            <div className={styles.bookingStep}>
              <div className={styles.bookingStepNumber}>2</div>
              <div className={styles.bookingStepLabel}>옵션 선택</div>
            </div>
            <div className={styles.bookingStep}>
              <div className={styles.bookingStepNumber}>3</div>
              <div className={styles.bookingStepLabel}>정보 입력</div>
            </div>
            <div className={styles.bookingStep}>
              <div className={styles.bookingStepNumber}>4</div>
              <div className={styles.bookingStepLabel}>예약 완료</div>
            </div>
          </div>

          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchGrid}>
              <div className={styles.searchGroup}>
                <label htmlFor="checkIn" className={styles.searchLabel}>
                  체크인
                </label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  className={styles.searchInput}
                  value={searchParams.checkIn}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className={styles.searchGroup}>
                <label htmlFor="checkOut" className={styles.searchLabel}>
                  체크아웃
                </label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  className={styles.searchInput}
                  value={searchParams.checkOut}
                  onChange={handleInputChange}
                  required
                  min={searchParams.checkIn
                    ? (() => {
                      const nextDay = new Date(searchParams.checkIn);
                      nextDay.setDate(nextDay.getDate() + 1);
                      return nextDay.toISOString().split('T')[0];
                    })()
                    : new Date().toISOString().split('T')[0]
                  }
                />
              </div>

              <div className={styles.searchGroup}>
                <label htmlFor="roomCount" className={styles.searchLabel}>
                  객실 수
                </label>
                <select
                  id="roomCount"
                  name="roomCount"
                  className={styles.searchSelect}
                  value={searchParams.roomCount}
                  onChange={handleInputChange}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}개
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.searchGroup}>
                <label htmlFor="guests" className={styles.searchLabel}>
                  인원
                </label>
                <div className="flex gap-2">
                  <select
                    id="adults"
                    name="adults"
                    className={styles.searchSelect}
                    value={searchParams.adults}
                    onChange={handleInputChange}
                  >
                    <option value="1">성인 1명</option>
                    <option value="2">성인 2명</option>
                    <option value="3">성인 3명</option>
                    <option value="4">성인 4명</option>
                  </select>

                  <select
                    id="children"
                    name="children"
                    className={styles.searchSelect}
                    value={searchParams.children}
                    onChange={handleInputChange}
                  >
                    <option value="0">어린이 0명</option>
                    <option value="1">어린이 1명</option>
                    <option value="2">어린이 2명</option>
                    <option value="3">어린이 3명</option>
                  </select>
                </div>
              </div>

              <button type="submit" className={`button button-primary ${styles.searchButton}`}>
                검색
              </button>
            </div>
          </form>

          <div className={styles.roomListHeader}>
            <div className={styles.roomListTabs}>
              <button
                className={`${styles.roomListTab} ${activeTab === "rooms" ? styles.roomListTabActive : ""}`}
                onClick={() => setActiveTab("rooms")}
              >
                객실
              </button>
              <button
                className={`${styles.roomListTab} ${activeTab === "packages" ? styles.roomListTabActive : ""}`}
                onClick={() => setActiveTab("packages")}
              >
                스페셜 오퍼
              </button>
            </div>

            <select className={styles.sortSelect} value={sortOption} onChange={handleSortChange}>
              <option value="price-asc">가격 낮은순</option>
              <option value="price-desc">가격 높은순</option>
            </select>
          </div>

          <div className="container py-10">
            {/* 객실 탭 - 객실 리스트만 렌더링 */}
            {activeTab === "rooms" && (
              <>
                <h1 className="text-2xl font-bold mb-6">예약 가능한 객실</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {sortedRooms.map((room) => (
                    <div key={room.roomTypesIdx} className="border rounded-lg overflow-hidden shadow-md">
                      <div className="relative w-full h-60">
                        <Link href={`/rooms/${room.roomTypesIdx}`} className="relative w-full h-60 block">
                          <Image
                            src={room.roomImage || "/placeholder.svg"}
                            alt={room.roomName}
                            fill
                            className="object-cover"
                          />
                        </Link>
                      </div>
                      <div className="p-4 space-y-2">
                        <h2 className="text-lg font-semibold">{room.roomName}</h2>
                        <p className="text-sm text-gray-600">{room.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <Home size={16} /> {room.size}㎡
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={16} /> 최대 {room.maxPeople}명
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div>
                            <div className="text-sm text-gray-500">평일가 기준</div>
                            <div className={styles.roomListPrice} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-color)' }}>₩{room.weekPrice.toLocaleString()}</div>
                          </div>
                          <button
                            onClick={() => handleBookNow(room)}
                            className={styles.roomListBookButton}
                            style={{ background: 'var(--primary-color)', color: '#fff', padding: '0.5rem 1.1rem', fontWeight: 600, borderRadius: '8px', fontSize: '1rem' }}
                          >
                            예약하기
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* 스페셜 오퍼 탭 - 오퍼 리스트만 렌더링 */}
            {activeTab === "packages" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">스페셜 오퍼 상품</h2>
                {specialOffers.filter((offer) => rooms.some(room => room.roomTypesIdx == offer.roomIdx)).length == 0 ? (
                  <div className="text-gray-500 text-sm">해당 객실에 적용 가능한 스페셜 오퍼가 없습니다.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {specialOffers
                      .filter((offer) => rooms.some(room => room.roomTypesIdx == offer.roomIdx))
                      .map((offer) => (
                        <div key={offer.id} className="border rounded-lg overflow-hidden shadow-md">
                          <div className="relative w-full h-60">
                            <Image
                              src={offer.image || "/main_room.png"}
                              alt={offer.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4 space-y-2">
                            <h3 className="text-lg font-semibold">{offer.title}</h3>
                            <p className="text-sm text-gray-600">{offer.subtitle}</p>
                            {offer.price && (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0' }}>
                                <div className={styles.roomListPrice} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                  ₩{Number(offer.price).toLocaleString()}
                                </div>
                                <button
                                  onClick={() => {
                                    localStorage.setItem("selectedSpecialOffer", JSON.stringify(offer));
                                    router.push(`/booking/info?offer_id=${offer.id}`);
                                  }}
                                  className={styles.roomListBookButton}
                                  style={{ background: 'var(--primary-color)', color: '#fff', padding: '0.5rem 1.1rem', fontWeight: 600, borderRadius: '8px', fontSize: '1rem' }}
                                >
                                  예약하기
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {modalOpen && selectedRoom && (
        <div className={styles.roomModal} onClick={closeModal}>
          <div className={styles.roomModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.roomModalClose} onClick={closeModal}>
              <X size={24} />
            </button>

            <div className={styles.roomModalImageContainer}>
              <Image
                src={selectedRoom.image || "/placeholder.svg"}
                alt={selectedRoom.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className={styles.roomModalInfo}>
              <h3 className={styles.roomModalName}>{selectedRoom.name}</h3>
              <p className={styles.roomModalDescription}>{selectedRoom.description}</p>

              <div className={styles.roomModalDetails}>
                <div className={styles.roomModalDetail}>
                  <Home size={18} className={styles.roomModalDetailIcon} />
                  <div>
                    <div className={styles.roomModalDetailLabel}>객실 크기</div>
                    <div className={styles.roomModalDetailValue}>{selectedRoom.details.size}</div>
                  </div>
                </div>

                <div className={styles.roomModalDetail}>
                  <Calendar size={18} className={styles.roomModalDetailIcon} />
                  <div>
                    <div className={styles.roomModalDetailLabel}>침대 타입</div>
                    <div className={styles.roomModalDetailValue}>{selectedRoom.details.bedType}</div>
                  </div>
                </div>

                <div className={styles.roomModalDetail}>
                  <Users size={18} className={styles.roomModalDetailIcon} />
                  <div>
                    <div className={styles.roomModalDetailLabel}>최대 인원</div>
                    <div className={styles.roomModalDetailValue}>{selectedRoom.details.maxOccupancy}인</div>
                  </div>
                </div>

                <div className={styles.roomModalDetail}>
                  <ChevronDown size={18} className={styles.roomModalDetailIcon} />
                  <div>
                    <div className={styles.roomModalDetailLabel}>전망</div>
                    <div className={styles.roomModalDetailValue}>{selectedRoom.details.view}</div>
                  </div>
                </div>
              </div>

              {selectedRoom.details.includes && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">스페셜 오퍼 포함 사항</h4>
                  <ul className="list-disc pl-5">
                    {selectedRoom.details.includes.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">1박 기준</div>
                  <div className="text-xl font-semibold text-primary-color">₩{selectedRoom.price.toLocaleString()}</div>
                </div>

                <button
                  className="button button-primary"
                  onClick={() => {
                    handleBookNow(selectedRoom)
                    closeModal()
                  }}
                >
                  예약하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

