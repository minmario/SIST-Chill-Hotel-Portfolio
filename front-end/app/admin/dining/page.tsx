"use client"
import { useState } from "react"
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { ko } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Search, Users, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// 레스토랑 타입 정의
type Restaurant = {
  id: string
  name: string
  capacity: number
  openingTime: string
  closingTime: string
  cuisine: string
  location: string
}

// 다이닝 예약 타입 정의
type DiningReservation = {
  id: string
  restaurantId: string
  guestName: string
  date: string
  time: string
  partySize: number
  status: "confirmed" | "pending" | "cancelled" | "seated" | "completed" | "no-show"
  contact: string
  email?: string
  specialRequests?: string
  roomNumber?: string
  isHotelGuest: boolean
  createdAt: string
  updatedAt?: string
}

// 더미 레스토랑 데이터
const restaurants: Restaurant[] = [
  {
    id: "rest-1",
    name: "아리아 레스토랑",
    capacity: 80,
    openingTime: "07:00",
    closingTime: "22:00",
    cuisine: "컨템포러리",
    location: "1층 로비",
  },
  {
    id: "rest-2",
    name: "사쿠라 일식당",
    capacity: 40,
    openingTime: "12:00",
    closingTime: "22:00",
    cuisine: "일식",
    location: "2층",
  },
  {
    id: "rest-3",
    name: "루프탑 바 & 그릴",
    capacity: 60,
    openingTime: "17:00",
    closingTime: "24:00",
    cuisine: "그릴 & 칵테일",
    location: "옥상",
  },
  {
    id: "rest-4",
    name: "카페 헤이븐",
    capacity: 30,
    openingTime: "08:00",
    closingTime: "20:00",
    cuisine: "카페 & 베이커리",
    location: "1층 정원",
  },
]

// 더미 다이닝 예약 데이터
const initialDiningReservations: DiningReservation[] = [
  {
    id: "DR-2025-1001",
    restaurantId: "rest-1",
    guestName: "김철수",
    date: "2025-04-01",
    time: "19:00",
    partySize: 2,
    status: "confirmed",
    contact: "010-1234-5678",
    email: "kim@example.com",
    roomNumber: "101",
    isHotelGuest: true,
    createdAt: "2025-03-25T14:30:00Z",
  },
  {
    id: "DR-2025-1002",
    restaurantId: "rest-2",
    guestName: "이영희",
    date: "2025-04-01",
    time: "12:30",
    partySize: 4,
    status: "confirmed",
    contact: "010-2345-6789",
    email: "lee@example.com",
    specialRequests: "창가 자리 요청",
    isHotelGuest: false,
    createdAt: "2025-03-26T10:15:00Z",
  },
  {
    id: "DR-2025-1003",
    restaurantId: "rest-3",
    guestName: "박지민",
    date: "2025-04-02",
    time: "20:00",
    partySize: 2,
    status: "pending",
    contact: "010-3456-7890",
    email: "park@example.com",
    specialRequests: "와인 페어링 요청",
    roomNumber: "301",
    isHotelGuest: true,
    createdAt: "2025-03-27T09:45:00Z",
  },
  {
    id: "DR-2025-1004",
    restaurantId: "rest-1",
    guestName: "최민준",
    date: "2025-04-02",
    time: "18:30",
    partySize: 6,
    status: "confirmed",
    contact: "010-4567-8901",
    email: "choi@example.com",
    specialRequests: "유아용 의자 2개 필요",
    isHotelGuest: false,
    createdAt: "2025-03-28T16:20:00Z",
  },
  {
    id: "DR-2025-1005",
    restaurantId: "rest-4",
    guestName: "정수연",
    date: "2025-04-01",
    time: "10:00",
    partySize: 3,
    status: "seated",
    contact: "010-5678-9012",
    roomNumber: "102",
    isHotelGuest: true,
    createdAt: "2025-03-29T11:10:00Z",
    updatedAt: "2025-04-01T10:05:00Z",
  },
  {
    id: "DR-2025-1006",
    restaurantId: "rest-2",
    guestName: "강동원",
    date: "2025-04-01",
    time: "13:00",
    partySize: 2,
    status: "cancelled",
    contact: "010-6789-0123",
    email: "kang@example.com",
    specialRequests: "알러지: 견과류",
    isHotelGuest: false,
    createdAt: "2025-03-30T09:30:00Z",
    updatedAt: "2025-03-31T14:20:00Z",
  },
  {
    id: "DR-2025-1007",
    restaurantId: "rest-3",
    guestName: "윤서진",
    date: "2025-04-03",
    time: "19:30",
    partySize: 4,
    status: "confirmed",
    contact: "010-7890-1234",
    email: "yoon@example.com",
    roomNumber: "205",
    isHotelGuest: true,
    createdAt: "2025-03-31T13:45:00Z",
  },
  {
    id: "DR-2025-1008",
    restaurantId: "rest-1",
    guestName: "송하은",
    date: "2025-04-03",
    time: "12:00",
    partySize: 2,
    status: "confirmed",
    contact: "010-8901-2345",
    email: "song@example.com",
    isHotelGuest: false,
    createdAt: "2025-04-01T10:30:00Z",
  },
]

// 시간대 생성 함수
const generateTimeSlots = (start: string, end: string, interval = 30) => {
  const slots = []
  const startTime = new Date(`2000-01-01T${start}:00`)
  const endTime = new Date(`2000-01-01T${end}:00`)

  let currentTime = startTime
  while (currentTime < endTime) {
    slots.push(format(currentTime, "HH:mm"))
    currentTime = new Date(currentTime.getTime() + interval * 60000)
  }

  return slots
}

export default function DiningPage() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1)) // 2025년 4월 1일
  const [diningReservations, setDiningReservations] = useState<DiningReservation[]>(initialDiningReservations)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<DiningReservation | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [restaurantFilter, setRestaurantFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>(format(currentDate, "yyyy-MM-dd"))

  // 현재 월의 시작일과 종료일
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // 현재 월의 모든 날짜
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // 날짜 이동 함수
  const goToPreviousDay = () => {
    const newDate = addDays(currentDate, -1)
    setCurrentDate(newDate)
    setDateFilter(format(newDate, "yyyy-MM-dd"))
  }

  const goToNextDay = () => {
    const newDate = addDays(currentDate, 1)
    setCurrentDate(newDate)
    setDateFilter(format(newDate, "yyyy-MM-dd"))
  }

  // 예약 필터링
  const filteredReservations = diningReservations.filter((reservation) => {
    // 검색어 필터링
    const searchMatch =
      reservation.guestName.includes(searchTerm) ||
      reservation.contact.includes(searchTerm) ||
      reservation.id.includes(searchTerm) ||
      (reservation.roomNumber && reservation.roomNumber.includes(searchTerm))

    // 레스토랑 필터링
    const restaurantMatch = restaurantFilter === "all" || reservation.restaurantId === restaurantFilter

    // 상태 필터링
    const statusMatch = statusFilter === "all" || reservation.status === statusFilter

    // 날짜 필터링
    const dateMatch = reservation.date === dateFilter

    return searchMatch && restaurantMatch && statusMatch && dateMatch
  })

  // 특정 시간대와 레스토랑에 예약이 있는지 확인
  const getReservationsForTimeAndRestaurant = (time: string, restaurantId: string) => {
    return filteredReservations.filter((res) => res.time === time && res.restaurantId === restaurantId)
  }

  // 예약 상태에 따른 배지 컴포넌트
  const getStatusBadge = (status: DiningReservation["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-500">예약 확정</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">대기중</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">취소됨</Badge>
      case "seated":
        return <Badge className="bg-green-500">착석</Badge>
      case "completed":
        return <Badge className="bg-purple-500">완료</Badge>
      case "no-show":
        return <Badge className="bg-gray-500">노쇼</Badge>
      default:
        return <Badge>알 수 없음</Badge>
    }
  }

  // 예약 상세 정보 보기
  const viewReservationDetails = (reservation: DiningReservation) => {
    setSelectedReservation(reservation)
    setIsDetailDialogOpen(true)
  }

  // 레스토랑별 시간대 생성
  const getTimeSlots = (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId)
    if (!restaurant) return []
    return generateTimeSlots(restaurant.openingTime, restaurant.closingTime)
  }

  // 모든 레스토랑의 시간대 통합 (중복 제거)
  const allTimeSlots = Array.from(
    new Set(restaurants.flatMap((restaurant) => generateTimeSlots(restaurant.openingTime, restaurant.closingTime))),
  ).sort()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">다이닝 예약 관리</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{format(currentDate, "yyyy년 M월 d일", { locale: ko })}</span>
        </div>
      </div>

      <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="calendar">시간대별 뷰</TabsTrigger>
            <TabsTrigger value="list">리스트 뷰</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                setCurrentDate(new Date(e.target.value))
              }}
              className="w-40"
            />
            <Button variant="outline" size="icon" onClick={goToNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 필터링 옵션 */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="예약자 이름 또는 연락처 검색..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={restaurantFilter} onValueChange={setRestaurantFilter}>
            <SelectTrigger className="w-[180px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
              <SelectValue placeholder="레스토랑 선택" />
            </SelectTrigger>
            <SelectContent className = "bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
              <SelectItem value="all">모든 레스토랑</SelectItem>
              {restaurants.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent className = "bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
              <SelectItem value="all">모든 상태</SelectItem>
              <SelectItem value="confirmed">예약 확정</SelectItem>
              <SelectItem value="pending">대기중</SelectItem>
              <SelectItem value="cancelled">취소됨</SelectItem>
              <SelectItem value="seated">착석</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
              <SelectItem value="no-show">노쇼</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 시간대별 뷰 */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">시간대별 예약 현황</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 bg-white border-r border-gray-200 p-2 text-left w-24">시간</th>
                      {restaurants.map((restaurant) => (
                        <th key={restaurant.id} className="p-2 min-w-[200px] border-b border-gray-200 text-center bg-white">
                          <div className="font-medium">{restaurant.name}</div>
                          <div className="text-xs text-gray-500">({restaurant.capacity}석)</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allTimeSlots.map((timeSlot) => (
                      <tr key={timeSlot} className="border-b border-gray-100">
                        <td className="sticky left-0 z-10 bg-white border-r border-gray-200 p-2 font-medium">
                          {timeSlot}
                        </td>
                        {restaurants.map((restaurant) => {
                          const reservations = getReservationsForTimeAndRestaurant(timeSlot, restaurant.id)
                          const totalGuests = reservations.reduce((sum, res) => sum + res.partySize, 0)
                          const isFullyBooked = totalGuests >= restaurant.capacity * 0.8 // 80% 이상 예약 시 만석으로 간주

                          return (
                            <td
                              key={restaurant.id}
                              className={`p-2 border border-gray-100 ${
                                isFullyBooked ? "bg-red-50" : reservations.length > 0 ? "bg-blue-50" : "bg-white"
                              }`}
                            >
                              {reservations.length > 0 ? (
                                <div className="space-y-2">
                                  {reservations.map((reservation) => (
                                    <div
                                      key={reservation.id}
                                      className={`p-2 rounded cursor-pointer ${
                                        reservation.status === "cancelled"
                                          ? "bg-red-100"
                                          : reservation.status === "seated"
                                            ? "bg-green-100"
                                            : reservation.status === "completed"
                                              ? "bg-purple-100"
                                              : reservation.status === "no-show"
                                                ? "bg-gray-100"
                                                : "bg-blue-100"
                                      }`}
                                      onClick={() => viewReservationDetails(reservation)}
                                    >
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium">{reservation.guestName}</span>
                                        <span className="text-xs">{reservation.partySize}명</span>
                                      </div>
                                      {reservation.roomNumber && (
                                        <div className="text-xs">객실: {reservation.roomNumber}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center text-gray-400 text-xs">-</div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-start gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm">예약 확정</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm">착석</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
              <span className="text-sm">완료</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm">취소됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-sm">노쇼</span>
            </div>
          </div>
        </TabsContent>

        {/* 리스트 뷰 */}
        <TabsContent value="list">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">예약 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">예약 번호</th>
                      <th className="text-left p-2">레스토랑</th>
                      <th className="text-left p-2">고객명</th>
                      <th className="text-left p-2">시간</th>
                      <th className="text-left p-2">인원</th>
                      <th className="text-left p-2">상태</th>
                      <th className="text-left p-2">객실</th>
                      <th className="text-left p-2">연락처</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.length > 0 ? (
                      filteredReservations.map((reservation) => {
                        const restaurant = restaurants.find((r) => r.id === reservation.restaurantId)
                        return (
                          <tr
                            key={reservation.id}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => viewReservationDetails(reservation)}
                          >
                            <td className="p-2">{reservation.id}</td>
                            <td className="p-2">{restaurant?.name}</td>
                            <td className="p-2">{reservation.guestName}</td>
                            <td className="p-2">{reservation.time}</td>
                            <td className="p-2">{reservation.partySize}명</td>
                            <td className="p-2">{getStatusBadge(reservation.status)}</td>
                            <td className="p-2">{reservation.roomNumber || "-"}</td>
                            <td className="p-2">{reservation.contact}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-gray-500">
                          예약 내역이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 예약 상세 정보 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
    <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200 text-black">

    <DialogHeader>
      <DialogTitle>다이닝 예약 상세 정보</DialogTitle>
    </DialogHeader>
          {selectedReservation && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">예약 번호</p>
                  <p className="font-medium">{selectedReservation.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">상태</p>
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={selectedReservation.status}
                      onValueChange={(value) => {
                        // 예약 상태 변경 처리
                        setDiningReservations((prev) =>
                          prev.map((res) =>
                            res.id === selectedReservation.id
                              ? {
                                  ...res,
                                  status: value as DiningReservation["status"],
                                  updatedAt: new Date().toISOString(),
                                }
                              : res,
                          ),
                        )
                        setSelectedReservation({
                          ...selectedReservation,
                          status: value as DiningReservation["status"],
                          updatedAt: new Date().toISOString(),
                        })
                      }}
                    >
                      <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className = "bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                        <SelectItem value="confirmed">예약 확정</SelectItem>
                        <SelectItem value="pending">대기중</SelectItem>
                        <SelectItem value="cancelled">취소됨</SelectItem>
                        <SelectItem value="seated">착석</SelectItem>
                        <SelectItem value="completed">완료</SelectItem>
                        <SelectItem value="no-show">노쇼</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">고객명</p>
                    <p className="font-medium">{selectedReservation.guestName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">연락처</p>
                    <p className="font-medium">{selectedReservation.contact}</p>
                  </div>

                  {selectedReservation.email && (
                    <div>
                      <p className="text-sm text-gray-500">이메일</p>
                      <p className="font-medium">{selectedReservation.email}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">날짜</p>
                      <p className="font-medium">{selectedReservation.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">시간</p>
                      <p className="font-medium">{selectedReservation.time}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">레스토랑</p>
                      <p className="font-medium">
                        {restaurants.find((r) => r.id === selectedReservation.restaurantId)?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">인원</p>
                      <p className="font-medium">{selectedReservation.partySize}명</p>
                    </div>
                  </div>

                  {selectedReservation.roomNumber && (
                    <div>
                      <p className="text-sm text-gray-500">객실 번호</p>
                      <p className="font-medium">{selectedReservation.roomNumber}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">호텔 투숙객 여부</p>
                    <p className="font-medium">{selectedReservation.isHotelGuest ? "예" : "아니오"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedReservation.specialRequests && (
                    <div>
                      <p className="text-sm text-gray-500">특별 요청사항</p>
                      <p className="font-medium">{selectedReservation.specialRequests}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">예약 생성일</p>
                    <p className="font-medium">{new Date(selectedReservation.createdAt).toLocaleString()}</p>
                  </div>

                  {selectedReservation.updatedAt && (
                    <div>
                      <p className="text-sm text-gray-500">마지막 업데이트</p>
                      <p className="font-medium">{new Date(selectedReservation.updatedAt).toLocaleString()}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <Label htmlFor="notes" className="text-sm text-gray-500">
                      메모 추가
                    </Label>
                    <Textarea id="notes" placeholder="예약에 대한 메모를 입력하세요" className="mt-1" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              {selectedReservation &&
                selectedReservation.status !== "seated" &&
                selectedReservation.status !== "completed" &&
                selectedReservation.status !== "cancelled" &&
                selectedReservation.status !== "no-show" && (
                  <Button
                    variant="default"
                    onClick={() => {
                      // 착석 처리
                      setDiningReservations((prev) =>
                        prev.map((res) =>
                          res.id === selectedReservation.id
                            ? { ...res, status: "seated", updatedAt: new Date().toISOString() }
                            : res,
                        ),
                      )
                      setSelectedReservation({
                        ...selectedReservation,
                        status: "seated",
                        updatedAt: new Date().toISOString(),
                      })
                    }}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    착석 처리
                  </Button>
                )}

              {selectedReservation && selectedReservation.status === "seated" && (
                <Button
                  variant="default"
                  onClick={() => {
                    // 완료 처리
                    setDiningReservations((prev) =>
                      prev.map((res) =>
                        res.id === selectedReservation.id
                          ? { ...res, status: "completed", updatedAt: new Date().toISOString() }
                          : res,
                      ),
                    )
                    setSelectedReservation({
                      ...selectedReservation,
                      status: "completed",
                      updatedAt: new Date().toISOString(),
                    })
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  완료 처리
                </Button>
              )}

              {selectedReservation &&
                selectedReservation.status !== "cancelled" &&
                selectedReservation.status !== "completed" &&
                selectedReservation.status !== "no-show" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // 예약 취소 처리
                      if (window.confirm("정말로 이 예약을 취소하시겠습니까?")) {
                        setDiningReservations((prev) =>
                          prev.map((res) =>
                            res.id === selectedReservation.id
                              ? { ...res, status: "cancelled", updatedAt: new Date().toISOString() }
                              : res,
                          ),
                        )
                        setSelectedReservation({
                          ...selectedReservation,
                          status: "cancelled",
                          updatedAt: new Date().toISOString(),
                        })
                      }
                    }}
                  >
                    예약 취소
                  </Button>
                )}
            </div>

            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

