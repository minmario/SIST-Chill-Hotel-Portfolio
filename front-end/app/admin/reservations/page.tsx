"use client"

import React from "react"

import { useState } from "react"
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { ko } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Search, ShoppingBag, Check, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// 객실 타입 정의
type Room = {
  id: string
  number: string
  type: string
  floor: string
  category: string
}

// 예약 타입 정의
type Reservation = {
  id: string
  roomId: string
  guestName: string
  checkIn: string
  checkOut: string
  status: "confirmed" | "pending" | "cancelled" | "checked-in" | "checked-out"
  guestCount: number
  contact: string
  specialRequests?: string
  email?: string
  paymentStatus?: "paid" | "pending" | "refunded"
  totalAmount?: number
  diningReservations?: Array<{
    id: number
    restaurant: string
    date: string
    time: string
    people: number
  }>
  giftShopPurchases?: Array<{
    id: number
    item: string
    price: number
    date: string
  }>
}

// 기프트샵 주문 타입 정의
type GiftShopOrder = {
  id: string
  orderId: string
  guestName: string
  roomId?: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    imageUrl?: string
  }>
  orderDate: string
  totalAmount: number
  status: "pending" | "ready" | "delivered" | "cancelled"
  paymentMethod: "room-charge" | "credit-card" | "cash"
  deliveryOption: "room-delivery" | "pickup"
  deliveryTime?: string
  specialInstructions?: string
  contactNumber: string
}

// 더미 객실 데이터
const rooms: Room[] = [
  // 스탠다드 객실 (1층)
  { id: "101", number: "101", type: "스탠다드", floor: "1층", category: "스탠다드" },
  { id: "102", number: "102", type: "스탠다드", floor: "1층", category: "스탠다드" },
  { id: "103", number: "103", type: "스탠다드", floor: "1층", category: "스탠다드" },
  { id: "104", number: "104", type: "스탠다드", floor: "1층", category: "스탠다드" },

  // 디럭스 객실 (2층)
  { id: "201", number: "201", type: "디럭스", floor: "2층", category: "디럭스" },
  { id: "202", number: "202", type: "디럭스", floor: "2층", category: "디럭스" },
  { id: "203", number: "203", type: "디럭스", floor: "2층", category: "디럭스" },
  { id: "204", number: "204", type: "디럭스", floor: "2층", category: "디럭스" },
  { id: "205", number: "205", type: "디럭스", floor: "2층", category: "디럭스" },
  { id: "206", number: "206", type: "디럭스", floor: "2층", category: "디럭스" },

  // 디럭스 더블 객실 (3층)
  { id: "301", number: "301", type: "디럭스 더블", floor: "3층", category: "디럭스 더블" },
  { id: "302", number: "302", type: "디럭스 더블", floor: "3층", category: "디럭스 더블" },
  { id: "303", number: "303", type: "디럭스 더블", floor: "3층", category: "디럭스 더블" },
  { id: "304", number: "304", type: "디럭스 더블", floor: "3층", category: "디럭스 더블" },

  // 패밀리 스위트 (4층)
  { id: "401", number: "401", type: "패밀리 스위트", floor: "4층", category: "패밀리" },
  { id: "402", number: "402", type: "패밀리 스위트", floor: "4층", category: "패밀리" },
  { id: "403", number: "403", type: "패밀리 스위트", floor: "4층", category: "패밀리" },
]

// 더미 예약 데이터
const initialReservations: Reservation[] = [
  {
    id: "RES-2025-1001",
    roomId: "101",
    guestName: "김철수",
    checkIn: "2025-03-31",
    checkOut: "2025-04-02",
    status: "confirmed",
    guestCount: 2,
    contact: "010-1234-5678",
    email: "kim@example.com",
    paymentStatus: "paid",
    totalAmount: 300000,
    specialRequests: "늦은 체크인, 추가 베개 요청",
    diningReservations: [{ id: 101, restaurant: "메인 레스토랑", date: "2025-03-31", time: "19:00", people: 2 }],
  },
  {
    id: "RES-2025-1002",
    roomId: "201",
    guestName: "이영희",
    checkIn: "2025-04-05",
    checkOut: "2025-04-07",
    status: "confirmed",
    guestCount: 2,
    contact: "010-2345-6789",
    email: "lee@example.com",
    paymentStatus: "paid",
    totalAmount: 450000,
    giftShopPurchases: [{ id: 201, item: "기념품 세트", price: 45000, date: "2025-04-05" }],
  },
  {
    id: "RES-2025-1003",
    roomId: "301",
    guestName: "박지민",
    checkIn: "2025-04-10",
    checkOut: "2025-04-15",
    status: "pending",
    guestCount: 3,
    contact: "010-3456-7890",
    email: "park@example.com",
    paymentStatus: "pending",
    totalAmount: 750000,
    specialRequests: "조용한 객실 요청",
    diningReservations: [{ id: 102, restaurant: "루프탑 바", date: "2025-04-11", time: "20:30", people: 3 }],
    giftShopPurchases: [{ id: 202, item: "와인 세트", price: 85000, date: "2025-04-10" }],
  },
  {
    id: "RES-2025-1004",
    roomId: "401",
    guestName: "최민준",
    checkIn: "2025-04-20",
    checkOut: "2025-04-25",
    status: "confirmed",
    guestCount: 4,
    contact: "010-4567-8901",
    email: "choi@example.com",
    paymentStatus: "paid",
    totalAmount: 1200000,
    specialRequests: "아이 동반, 유아용 침대 필요",
  },
  {
    id: "RES-2025-1005",
    roomId: "102",
    guestName: "정수연",
    checkIn: "2025-04-01",
    checkOut: "2025-04-03",
    status: "checked-in",
    guestCount: 1,
    contact: "010-5678-9012",
    email: "jung@example.com",
    paymentStatus: "paid",
    totalAmount: 300000,
  },
  {
    id: "RES-2025-1006",
    roomId: "202",
    guestName: "강동원",
    checkIn: "2025-04-15",
    checkOut: "2025-04-18",
    status: "cancelled",
    guestCount: 2,
    contact: "010-6789-0123",
    email: "kang@example.com",
    paymentStatus: "refunded",
    totalAmount: 450000,
    specialRequests: "알러지: 견과류",
  },
]

// 더미 기프트샵 주문 데이터
const initialGiftShopOrders: GiftShopOrder[] = [
  {
    id: "GS-2025-001",
    orderId: "ORD-2025-001",
    guestName: "김철수",
    roomId: "101",
    items: [
      {
        id: 1,
        name: "Chill Haven 시그니처 로브",
        price: 120000,
        quantity: 1,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
      { id: 2, name: "아로마 캔들 세트", price: 45000, quantity: 1, imageUrl: "/placeholder.svg?height=80&width=80" },
    ],
    orderDate: "2025-03-31",
    totalAmount: 165000,
    status: "pending",
    paymentMethod: "room-charge",
    deliveryOption: "room-delivery",
    deliveryTime: "2025-04-01 14:00",
    contactNumber: "010-1234-5678",
  },
  {
    id: "GS-2025-002",
    orderId: "ORD-2025-002",
    guestName: "이영희",
    roomId: "201",
    items: [
      {
        id: 3,
        name: "프리미엄 와인 세트",
        price: 180000,
        quantity: 1,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
    ],
    orderDate: "2025-04-05",
    totalAmount: 180000,
    status: "ready",
    paymentMethod: "credit-card",
    deliveryOption: "pickup",
    contactNumber: "010-2345-6789",
  },
  {
    id: "GS-2025-003",
    orderId: "ORD-2025-003",
    guestName: "박지민",
    roomId: "301",
    items: [
      {
        id: 4,
        name: "Chill Haven 시그니처 티셔츠",
        price: 45000,
        quantity: 2,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 5,
        name: "핸드메이드 초콜릿 박스",
        price: 35000,
        quantity: 1,
        imageUrl: "/placeholder.svg?height=80&width=80",
      },
    ],
    orderDate: "2025-04-11",
    totalAmount: 125000,
    status: "delivered",
    paymentMethod: "room-charge",
    deliveryOption: "room-delivery",
    specialInstructions: "문 앞에 놓아주세요",
    contactNumber: "010-3456-7890",
  },
  {
    id: "GS-2025-004",
    orderId: "ORD-2025-004",
    guestName: "최민준",
    roomId: "401",
    items: [
      { id: 6, name: "어린이용 인형 세트", price: 65000, quantity: 1, imageUrl: "/placeholder.svg?height=80&width=80" },
    ],
    orderDate: "2025-04-21",
    totalAmount: 65000,
    status: "pending",
    paymentMethod: "room-charge",
    deliveryOption: "room-delivery",
    deliveryTime: "2025-04-22 10:00",
    contactNumber: "010-4567-8901",
  },
  {
    id: "GS-2025-005",
    orderId: "ORD-2025-005",
    guestName: "정수연",
    roomId: "102",
    items: [
      { id: 7, name: "스파 기프트 세트", price: 85000, quantity: 1, imageUrl: "/placeholder.svg?height=80&width=80" },
    ],
    orderDate: "2025-04-02",
    totalAmount: 85000,
    status: "ready",
    paymentMethod: "cash",
    deliveryOption: "pickup",
    contactNumber: "010-5678-9012",
  },
]

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 31)) // 2025년 3월 31일
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [giftShopOrders, setGiftShopOrders] = useState<GiftShopOrder[]>(initialGiftShopOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [selectedGiftShopOrder, setSelectedGiftShopOrder] = useState<GiftShopOrder | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isGiftShopDetailDialogOpen, setIsGiftShopDetailDialogOpen] = useState(false)
  const [roomFilter, setRoomFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [giftShopStatusFilter, setGiftShopStatusFilter] = useState<string>("all")

  // 현재 월의 시작일과 종료일
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // 현재 월의 모든 날짜
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // 표시할 날짜 범위 (30일)
  const startDate = currentDate
  const endDate = addDays(startDate, 29)
  const daysToShow = eachDayOfInterval({ start: startDate, end: endDate })

  // 객실 카테고리별로 그룹화
  const roomsByCategory = rooms.reduce(
    (acc, room) => {
      if (!acc[room.category]) {
        acc[room.category] = []
      }
      acc[room.category].push(room)
      return acc
    },
    {} as Record<string, Room[]>,
  )

  // 날짜 이동 함수
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => addDays(prev, -30))
  }

  const goToNextMonth = () => {
    setCurrentDate((prev) => addDays(prev, 30))
  }

  // 예약 필터링
  const filteredReservations = reservations.filter((reservation) => {
    // 검색어 필터링
    const searchMatch =
      reservation.guestName.includes(searchTerm) ||
      reservation.contact.includes(searchTerm) ||
      reservation.id.includes(searchTerm)

    // 객실 필터링
    const roomMatch = roomFilter === "all" || reservation.roomId === roomFilter

    // 상태 필터링
    const statusMatch = statusFilter === "all" || reservation.status === statusFilter

    return searchMatch && roomMatch && statusMatch
  })

  // 기프트샵 주문 필터링
  const filteredGiftShopOrders = giftShopOrders.filter((order) => {
    // 검색어 필터링
    const searchMatch =
      order.guestName.includes(searchTerm) ||
      order.contactNumber.includes(searchTerm) ||
      order.orderId.includes(searchTerm)

    // 상태 필터링
    const statusMatch = giftShopStatusFilter === "all" || order.status === giftShopStatusFilter

    return searchMatch && statusMatch
  })

  // 특정 날짜와 객실에 예약이 있는지 확인
  const getReservationForDateAndRoom = (date: Date, roomId: string) => {
    const dateStr = format(date, "yyyy-MM-dd")
    // filteredReservations를 사용하여 검색어, 객실 필터, 상태 필터가 적용된 예약만 표시
    return filteredReservations.find((res) => {
      const checkIn = new Date(res.checkIn)
      const checkOut = new Date(res.checkOut)
      const currentDate = new Date(dateStr)

      return res.roomId === roomId && currentDate >= checkIn && currentDate < checkOut
    })
  }

  // 예약 상태에 따른 색상 클래스
  const getStatusColorClass = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 border-blue-300"
      case "pending":
        return "bg-yellow-100 border-yellow-300"
      case "cancelled":
        return "bg-red-100 border-red-300"
      case "checked-in":
        return "bg-green-100 border-green-300"
      case "checked-out":
        return "bg-gray-100 border-gray-300"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  // 예약 상태에 따른 배지 컴포넌트
  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-500">예약 확정</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">대기중</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">취소됨</Badge>
      case "checked-in":
        return <Badge className="bg-green-500">체크인</Badge>
      case "checked-out":
        return <Badge className="bg-gray-500">체크아웃</Badge>
      default:
        return <Badge>알 수 없음</Badge>
    }
  }

  // 기프트샵 주문 상태에 따른 배지 컴포넌트
  const getGiftShopStatusBadge = (status: GiftShopOrder["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">준비중</Badge>
      case "ready":
        return <Badge className="bg-blue-500">수령 대기</Badge>
      case "delivered":
        return <Badge className="bg-green-500">수령 완료</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">취소됨</Badge>
      default:
        return <Badge>알 수 없음</Badge>
    }
  }

  // 예약 상세 정보 보기
  const viewReservationDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setIsDetailDialogOpen(true)
  }

  // 기프트샵 주문 상세 정보 보기
  const viewGiftShopOrderDetails = (order: GiftShopOrder) => {
    setSelectedGiftShopOrder(order)
    setIsGiftShopDetailDialogOpen(true)
  }

  // 기프트샵 주문 상태 변경 처리
  const handleGiftShopStatusChange = (orderId: string, newStatus: GiftShopOrder["status"]) => {
    setGiftShopOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    if (selectedGiftShopOrder && selectedGiftShopOrder.id === orderId) {
      setSelectedGiftShopOrder({
        ...selectedGiftShopOrder,
        status: newStatus,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">예약 관리</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {format(currentDate, "yyyy년 M월 d일", { locale: ko })} -{" "}
            {format(endDate, "yyyy년 M월 d일", { locale: ko })}
          </span>
        </div>
      </div>

      <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="calendar">캘린더 뷰</TabsTrigger>
            <TabsTrigger value="list">리스트 뷰</TabsTrigger>
            <TabsTrigger value="giftshop">
              <ShoppingBag className="h-4 w-4 mr-2" />
              기프트샵 주문
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 캘린더 뷰 */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex items-center space-x-2">
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

            <Select value={roomFilter} onValueChange={setRoomFilter}>
              <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                <SelectValue placeholder="객실 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                <SelectItem value="all">모든 객실</SelectItem>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.number} ({room.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="confirmed">예약 확정</SelectItem>
                <SelectItem value="pending">대기중</SelectItem>
                <SelectItem value="cancelled">취소됨</SelectItem>
                <SelectItem value="checked-in">체크인</SelectItem>
                <SelectItem value="checked-out">체크아웃</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">객실 예약 현황</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-10 bg-white border-r border-gray-200 p-2 text-left w-24">객실</th>
                      {daysToShow.map((day) => (
                        <th key={day.toString()} className="p-2 min-w-[80px] border-b border-gray-200 text-center bg-white">
                          <div className="text-xs font-normal text-gray-500">{format(day, "EEE", { locale: ko })}</div>
                          <div className="font-medium">{format(day, "d", { locale: ko })}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(roomsByCategory).map(([category, categoryRooms]) => (
                      <React.Fragment key={category}>
                        <tr>
                          <td colSpan={daysToShow.length + 1} className="bg-gray-100 p-2 font-medium">
                            {category}
                          </td>
                        </tr>
                        {categoryRooms.map((room) => (
                          <tr key={room.id} className="border-b border-gray-100">
                            <td className="sticky left-0 z-10 bg-white border-r border-gray-200 p-2 font-medium">
                              {room.number}
                            </td>
                            {daysToShow.map((day) => {
                              const reservation = getReservationForDateAndRoom(day, room.id)
                              const isCheckIn = reservation && format(day, "yyyy-MM-dd") === reservation.checkIn
                              const isCheckOut = reservation && format(day, "yyyy-MM-dd") === reservation.checkOut

                              return (
                                <td
                                  key={day.toString()}
                                  className={`p-0 border border-gray-100 ${reservation ? getStatusColorClass(reservation.status) : "bg-white"}`}
                                  onClick={() => reservation && viewReservationDetails(reservation)}
                                >
                                  {reservation && (
                                    <div
                                      className={`h-full w-full p-1 cursor-pointer ${isCheckIn ? "border-l-4 border-l-blue-500" : ""} ${isCheckOut ? "border-r-4 border-r-green-500" : ""}`}
                                    >
                                      {isCheckIn && (
                                        <div className="text-xs font-medium truncate">{reservation.guestName}</div>
                                      )}
                                    </div>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </React.Fragment>
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
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span className="text-sm">대기중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm">체크인</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm">취소됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-sm">체크아웃</span>
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
                      <th className="text-left p-2">객실</th>
                      <th className="text-left p-2">고객명</th>
                      <th className="text-left p-2">체크인</th>
                      <th className="text-left p-2">체크아웃</th>
                      <th className="text-left p-2">인원</th>
                      <th className="text-left p-2">상태</th>
                      <th className="text-left p-2">연락처</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((reservation) => {
                      const room = rooms.find((r) => r.id === reservation.roomId)
                      return (
                        <tr
                          key={reservation.id}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => viewReservationDetails(reservation)}
                        >
                          <td className="p-2">{reservation.id}</td>
                          <td className="p-2">
                            {room?.number} ({room?.type})
                          </td>
                          <td className="p-2">{reservation.guestName}</td>
                          <td className="p-2">{reservation.checkIn}</td>
                          <td className="p-2">{reservation.checkOut}</td>
                          <td className="p-2">{reservation.guestCount}명</td>
                          <td className="p-2">{getStatusBadge(reservation.status)}</td>
                          <td className="p-2">{reservation.contact}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 기프트샵 주문 탭 */}
        <TabsContent value="giftshop">
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="주문자 이름 또는 연락처 검색..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={giftShopStatusFilter} onValueChange={setGiftShopStatusFilter}>
              <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="pending">준비중</SelectItem>
                <SelectItem value="ready">수령 대기</SelectItem>
                <SelectItem value="delivered">수령 완료</SelectItem>
                <SelectItem value="cancelled">취소됨</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">기프트샵 주문 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">주문 번호</th>
                      <th className="text-left p-2">주문자</th>
                      <th className="text-left p-2">객실</th>
                      <th className="text-left p-2">주문일</th>
                      <th className="text-left p-2">금액</th>
                      <th className="text-left p-2">배송 옵션</th>
                      <th className="text-left p-2">상태</th>
                      <th className="text-left p-2">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGiftShopOrders.map((order) => {
                      const room = order.roomId ? rooms.find((r) => r.id === order.roomId) : null
                      return (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{order.orderId}</td>
                          <td className="p-2">{order.guestName}</td>
                          <td className="p-2">{room ? `${room.number} (${room.type})` : "-"}</td>
                          <td className="p-2">{order.orderDate}</td>
                          <td className="p-2">{order.totalAmount.toLocaleString()}원</td>
                          <td className="p-2">
                            {order.deliveryOption === "room-delivery" ? "객실 배송" : "직접 수령"}
                          </td>
                          <td className="p-2">{getGiftShopStatusBadge(order.status)}</td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => viewGiftShopOrderDetails(order)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">상세보기</span>
                              </Button>

                              {order.status === "ready" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleGiftShopStatusChange(order.id, "delivered")}
                                >
                                  <Check className="h-4 w-4" />
                                  <span className="sr-only">수령 완료</span>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 예약 상세 정보 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
          <DialogHeader>
            <DialogTitle>예약 상세 정보</DialogTitle>
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
                        setReservations((prev) =>
                          prev.map((res) =>
                            res.id === selectedReservation.id
                              ? { ...res, status: value as Reservation["status"] }
                              : res,
                          ),
                        )
                        setSelectedReservation({
                          ...selectedReservation,
                          status: value as Reservation["status"],
                        })
                      }}
                    >
                      <SelectTrigger className=" bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                        <SelectItem value="confirmed">예약 확정</SelectItem>
                        <SelectItem value="pending">대기중</SelectItem>
                        <SelectItem value="cancelled">취소됨</SelectItem>
                        <SelectItem value="checked-in">체크인</SelectItem>
                        <SelectItem value="checked-out">체크아웃</SelectItem>
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
                      <p className="text-sm text-gray-500">체크인</p>
                      <p className="font-medium">{selectedReservation.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">체크아웃</p>
                      <p className="font-medium">{selectedReservation.checkOut}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">객실</p>
                      <p className="font-medium">
                        {rooms.find((r) => r.id === selectedReservation.roomId)?.number}(
                        {rooms.find((r) => r.id === selectedReservation.roomId)?.type})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">인원</p>
                      <p className="font-medium">{selectedReservation.guestCount}명</p>
                    </div>
                  </div>

                  {selectedReservation.totalAmount && (
                    <div>
                      <p className="text-sm text-gray-500">총 금액</p>
                      <p className="font-medium">{selectedReservation.totalAmount.toLocaleString()}원</p>
                    </div>
                  )}

                  {selectedReservation.paymentStatus && (
                    <div>
                      <p className="text-sm text-gray-500">결제 상태</p>
                      <Badge
                        className={
                          selectedReservation.paymentStatus === "paid"
                            ? "bg-green-500"
                            : selectedReservation.paymentStatus === "refunded"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }
                      >
                        {selectedReservation.paymentStatus === "paid"
                          ? "결제 완료"
                          : selectedReservation.paymentStatus === "refunded"
                            ? "환불됨"
                            : "결제 대기중"}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedReservation.specialRequests && (
                    <div>
                      <p className="text-sm text-gray-500">특별 요청사항</p>
                      <p className="font-medium">{selectedReservation.specialRequests}</p>
                    </div>
                  )}

                  {selectedReservation.diningReservations && selectedReservation.diningReservations.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">다이닝 예약</p>
                      <div className="space-y-2">
                        {selectedReservation.diningReservations.map((dining) => (
                          <div key={dining.id} className="bg-gray-50 p-2 rounded-md">
                            <p className="font-medium">{dining.restaurant}</p>
                            <p className="text-sm">
                              {dining.date} {dining.time} • {dining.people}명
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReservation.giftShopPurchases && selectedReservation.giftShopPurchases.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">기프트샵 구매</p>
                      <div className="space-y-2">
                        {selectedReservation.giftShopPurchases.map((purchase) => (
                          <div key={purchase.id} className="bg-gray-50 p-2 rounded-md">
                            <p className="font-medium">{purchase.item}</p>
                            <p className="text-sm">
                              {purchase.date} • {purchase.price.toLocaleString()}원
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              {selectedReservation &&
                selectedReservation.status !== "checked-in" &&
                selectedReservation.status !== "checked-out" &&
                selectedReservation.status !== "cancelled" && (
                  <Button
                    variant="default"
                    onClick={() => {
                      // 체크인 처리
                      setReservations((prev) =>
                        prev.map((res) => (res.id === selectedReservation.id ? { ...res, status: "checked-in" } : res)),
                      )
                      setSelectedReservation({
                        ...selectedReservation,
                        status: "checked-in",
                      })
                    }}
                  >
                    체크인 처리
                  </Button>
                )}

              {selectedReservation && selectedReservation.status === "checked-in" && (
                <Button
                  variant="default"
                  onClick={() => {
                    // 체크아웃 처리
                    setReservations((prev) =>
                      prev.map((res) => (res.id === selectedReservation.id ? { ...res, status: "checked-out" } : res)),
                    )
                    setSelectedReservation({
                      ...selectedReservation,
                      status: "checked-out",
                    })
                  }}
                >
                  체크아웃 처리
                </Button>
              )}

              {selectedReservation &&
                selectedReservation.status !== "cancelled" &&
                selectedReservation.status !== "checked-out" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // 예약 취소 처리
                      if (window.confirm("정말로 이 예약을 취소하시겠습니까?")) {
                        setReservations((prev) =>
                          prev.map((res) =>
                            res.id === selectedReservation.id ? { ...res, status: "cancelled" } : res,
                          ),
                        )
                        setSelectedReservation({
                          ...selectedReservation,
                          status: "cancelled",
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

      {/* 기프트샵 주문 상세 정보 다이얼로그 */}
      <Dialog open={isGiftShopDetailDialogOpen} onOpenChange={setIsGiftShopDetailDialogOpen}>
        <DialogContent className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
          <DialogHeader>
            <DialogTitle>기프트샵 주문 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedGiftShopOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">주문 번호</p>
                  <p className="font-medium">{selectedGiftShopOrder.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">상태</p>
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={selectedGiftShopOrder.status}
                      onValueChange={(value) => {
                        // 주문 상태 변경 처리
                        handleGiftShopStatusChange(selectedGiftShopOrder.id, value as GiftShopOrder["status"])
                      }}
                    >
                      <SelectTrigger className="bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                        <SelectItem value="pending">준비중</SelectItem>
                        <SelectItem value="ready">수령 대기</SelectItem>
                        <SelectItem value="delivered">수령 완료</SelectItem>
                        <SelectItem value="cancelled">취소됨</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">주문자</p>
                    <p className="font-medium">{selectedGiftShopOrder.guestName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">연락처</p>
                    <p className="font-medium">{selectedGiftShopOrder.contactNumber}</p>
                  </div>

                  {selectedGiftShopOrder.roomId && (
                    <div>
                      <p className="text-sm text-gray-500">객실</p>
                      <p className="font-medium">
                        {rooms.find((r) => r.id === selectedGiftShopOrder.roomId)?.number}(
                        {rooms.find((r) => r.id === selectedGiftShopOrder.roomId)?.type})
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">주문일</p>
                    <p className="font-medium">{selectedGiftShopOrder.orderDate}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">결제 방법</p>
                    <p className="font-medium">
                      {selectedGiftShopOrder.paymentMethod === "room-charge"
                        ? "객실 청구"
                        : selectedGiftShopOrder.paymentMethod === "credit-card"
                          ? "신용카드"
                          : "현금"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">배송 옵션</p>
                    <p className="font-medium">
                      {selectedGiftShopOrder.deliveryOption === "room-delivery" ? "객실 배송" : "직접 수령"}
                    </p>
                  </div>

                  {selectedGiftShopOrder.deliveryTime && (
                    <div>
                      <p className="text-sm text-gray-500">배송 시간</p>
                      <p className="font-medium">{selectedGiftShopOrder.deliveryTime}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">주문 상품</p>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {selectedGiftShopOrder.items.map((item) => (
                        <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-md">
                          {item.imageUrl && (
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                              <img
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                              <span>
                                {item.price.toLocaleString()}원 × {item.quantity}
                              </span>
                              <span className="font-medium">{(item.price * item.quantity).toLocaleString()}원</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">총 금액</p>
                      <p className="font-bold text-lg">{selectedGiftShopOrder.totalAmount.toLocaleString()}원</p>
                    </div>
                  </div>

                  {selectedGiftShopOrder.specialInstructions && (
                    <div>
                      <p className="text-sm text-gray-500">특별 요청사항</p>
                      <p className="font-medium">{selectedGiftShopOrder.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              {selectedGiftShopOrder && selectedGiftShopOrder.status === "pending" && (
                <Button variant="default" onClick={() => handleGiftShopStatusChange(selectedGiftShopOrder.id, "ready")}>
                  준비 완료
                </Button>
              )}

              {selectedGiftShopOrder && selectedGiftShopOrder.status === "ready" && (
                <Button
                  variant="default"
                  onClick={() => handleGiftShopStatusChange(selectedGiftShopOrder.id, "delivered")}
                >
                  수령 완료 처리
                </Button>
              )}

              {selectedGiftShopOrder &&
                (selectedGiftShopOrder.status === "pending" || selectedGiftShopOrder.status === "ready") && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // 주문 취소 처리
                      if (window.confirm("정말로 이 주문을 취소하시겠습니까?")) {
                        handleGiftShopStatusChange(selectedGiftShopOrder.id, "cancelled")
                      }
                    }}
                  >
                    주문 취소
                  </Button>
                )}
            </div>

            <Button variant="outline" onClick={() => setIsGiftShopDetailDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

