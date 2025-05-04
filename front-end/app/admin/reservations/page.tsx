"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns"
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
// 기프트샵 주문 타입 정의 (백엔드 OrderResponse 기반)
type GiftShopOrder = {
  orderIdx: number;
  userName: string;
  orderStatus: string;
  orderDate: string;
  totalAmount: number;
  items: GiftShopOrderItem[];
}

type GiftShopOrderItem = {
  itemName: string;
  quantity: number;
  price: number;
}

type StatusValue = "CONFIRMED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED"
type Room = {
  roomIdx: number;      // 객실 고유 번호
  roomNum: string;      // 객실 번호
  roomTypeIdx: number;  // 객실 타입(카테고리) 고유 번호
};
interface Reservation {
  reservationNum: string;
  fullName: string;
  phone: string;
  email: string;
  status: string;
  checkIn: string;
  checkOut: string;
  roomCount: number;
  adultCount: number;
  childCount: number;
  roomNumber: string;
  roomTypeIdx: number; // number로 변경
  roomGrade: string;
  total: number;
  specialRequests: string;
}

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 31)) // 2025년 3월 31일
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [giftShopOrders, setGiftShopOrders] = useState<GiftShopOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>(undefined)
  const [selectedGiftShopOrder, setSelectedGiftShopOrder] = useState<GiftShopOrder | undefined>(undefined)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isGiftShopDetailDialogOpen, setIsGiftShopDetailDialogOpen] = useState(false)
  const [roomFilter, setRoomFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [giftShopStatusFilter, setGiftShopStatusFilter] = useState<string>("all")
  const [rooms, setRooms] = useState<Room[]>([])
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchReservations = async () => {
      const res = await fetch("/api/admin/reservations", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setReservations(data)
      } else if (data && typeof data === 'object') {
        setReservations([data])
      } else {
        setReservations([])
      }
    }
    fetchReservations()
  }, [])
  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch("/api/admin/rooms/minimal", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
      }) // 백엔드 URL 맞게 수정
      const data = await res.json()
      setRooms(data)
    }
    fetchRooms()
  }, [])
  useEffect(() => {
    const fetchGiftShopOrders = async () => {
      const res = await fetch("/api/admin/gift_shop/orders", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include",
      });
      const data = await res.json();
      setGiftShopOrders(Array.isArray(data) ? data : []);
    };
    fetchGiftShopOrders();
  }, []);
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
  const roomsByCategory = Array.isArray(rooms)
    ? rooms.reduce(
      (acc, room) => {
        if (!acc[room.roomTypeIdx]) {
          acc[room.roomTypeIdx] = [];
        }
        acc[room.roomTypeIdx].push(room);
        return acc;
      },
      {} as Record<string, Room[]>,
    )
    : {};

  // 날짜 이동 함수
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => addDays(prev, -30))
  }

  const goToNextMonth = () => {
    setCurrentDate((prev) => addDays(prev, 30))
  }

  // 예약 필터링 (상태 대소문자 구분 없이 비교)
  const filteredReservations = reservations.filter((reservation) => {
    // 검색어 필터링
    const searchMatch =
      reservation.fullName?.includes(searchTerm) ||
      reservation.phone?.includes(searchTerm) ||
      reservation.reservationNum?.includes(searchTerm)

    // 객실 필터링
    const roomMatch = roomFilter === "all" || reservation.roomNumber === roomFilter

    // 상태 필터링 (대소문자 무시)
    const statusMatch =
      statusFilter === "all" ||
      reservation.status === statusFilter;

    return searchMatch && roomMatch && statusMatch;
  });

  // 기프트샵 주문 필터링
  const filteredGiftShopOrders = giftShopOrders.filter((order) => {
    // 검색어 필터링 (OrderResponse 구조에 맞게 userName, orderIdx만 사용)
    const searchMatch =
      order.userName?.includes(searchTerm) ||
      order.orderIdx?.toString().includes(searchTerm);

    // 상태 필터링 (orderStatus 기준)
    const statusMatch =
      giftShopStatusFilter === "all" ||
      order.orderStatus === giftShopStatusFilter;

    return searchMatch && statusMatch;
  })

  // 특정 날짜와 객실에 예약이 있는지 확인
  const getReservationForDateAndRoom = (date: Date, roomId: string) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const currentDate = new Date(dateStr)
  
    const reservations = filteredReservations.filter((res) => {
      const checkIn = new Date(res.checkIn)
      const checkOut = new Date(res.checkOut)
  
      return (
        res.roomNumber === roomId &&
        currentDate >= checkIn &&
        currentDate < checkOut
      )
    })
  
    // 1순위: 정상 예약
    const normal = reservations.find(
      (res) =>
        res.status === "CONFIRMED" ||
        res.status === "CHECKED_IN" ||
        res.status === "COMPLETED"
    )
  
    if (normal) return normal
  
    // 2순위: 취소된 예약
    return reservations.find((res) => res.status === "CANCELLED")
  }

  // roomTypeIdx를 이름으로 변환하는 함수
  const getroomTypeIdx = (roomTypeIdx: number | undefined) => {
    switch (roomTypeIdx) {
      case 1:
        return "chill comfort";
      case 2:
        return "chill harmony";
      case 3:
        return "chill serenity";
      case 4:
        return "chill family";
      case 5:
        return "chill lake";
      case 6:
        return "ultimate chill suite";
      default:
        return `타입 ${roomTypeIdx}`;
    }
  };

  // 예약 상태에 따른 색상 클래스
  const getStatusColorClass = (status: Reservation["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 border-blue-300"
      case "CANCELLED":
        return "bg-red-100 border-red-300"
      case "CHECKED_IN":
        return "bg-green-100 border-green-300"
      case "COMPLETED":
        return "bg-gray-100 border-gray-300"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }
  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-blue-500">예약 확정</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-500">취소됨</Badge>
      case "CHECKED_IN":
        return <Badge className="bg-green-500">체크인</Badge>
      case "COMPLETED":
        return <Badge className="bg-gray-500">체크아웃</Badge>
      default:
        return <Badge>알 수 없음</Badge>
    }
  }

  const getEditableStatusBadge = (reservation: Reservation) => {
    return (
      <span className="cursor-pointer" title="상세에서 상태 변경 가능">
        {getStatusBadge(reservation.status)}
      </span>
    );
  }

  // 기프트샵 주문 상태에 따른 배지 컴포넌트
  const getGiftShopStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-500">결제 대기</Badge>;
      case "PAID":
        return <Badge className="bg-blue-500">결제 완료</Badge>;
      case "DELIVERED":
        return <Badge className="bg-green-500">수령 완료</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500">취소됨</Badge>;
      default:
        return <Badge>알 수 없음</Badge>;
    }
  } // orderStatus 필드 기준으로

  // 예약 상세 정보 보기
  const viewReservationDetails = async (reservationNum: string) => {
    try {
      const res = await fetch(`/api/admin/reservations/${reservationNum}`)
      const data = await res.json()
      setSelectedReservation(data)
      setIsDetailDialogOpen(true)
    } catch (err) {
      console.error("예약 상세 불러오기 실패", err)
      alert("예약 상세를 불러올 수 없습니다.")
    }
  }

  // 기프트샵 주문 상세 정보 보기
  const viewGiftShopOrderDetails = (order: GiftShopOrder) => {
    setSelectedGiftShopOrder(order)
    setIsGiftShopDetailDialogOpen(true)
  }

  // 기프트샵 주문 상태 변경 처리
  const handleGiftShopStatusChange = async (orderIdx: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/gift_shop/orders/${orderIdx}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        throw new Error("주문 상태 변경 실패");
      }
      setGiftShopOrders((prev) => prev.map((order) => (order.orderIdx === orderIdx ? { ...order, orderStatus: newStatus } : order)));
      if (selectedGiftShopOrder && selectedGiftShopOrder.orderIdx === orderIdx) {
        setSelectedGiftShopOrder({
          ...selectedGiftShopOrder,
          orderStatus: newStatus,
        });
      }
    } catch (err) {
      alert("주문 상태 변경에 실패했습니다.");
    }
  } // orderIdx, orderStatus 기준으로

  async function updateReservationStatus(reservationNum: string, newStatus: string) {
    const res = await fetch(`/api/admin/reservations/${reservationNum}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    })

    if (!res.ok) {
      throw new Error("예약 상태 변경 실패")
    }
  }

  function mapToApiStatus(status: StatusValue): string {
    switch (status) {
      case "CONFIRMED":
        return "예약 확정"
      case "CHECKED_IN":
        return "체크인"
      case "COMPLETED":
        return "체크아웃"
      case "CANCELLED":
        return "취소됨"
      default:
        return status
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
                {Array.isArray(rooms) && rooms.map((room) => (
                  <SelectItem key={room.roomIdx} value={room.roomNum}>
                    {room.roomNum} ({getroomTypeIdx(room.roomTypeIdx)})
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
                <SelectItem value="CONFIRMED">예약 확정</SelectItem>
                <SelectItem value="CANCELLED">취소됨</SelectItem>
                <SelectItem value="CHECKED_IN">체크인</SelectItem>
                <SelectItem value="COMPLETED">체크아웃</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">객실 예약 현황</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[600px] overflow-y-auto">
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
                            {getroomTypeIdx(Number(category))}
                          </td>
                        </tr>
                        {categoryRooms.map((room) => (
                          <tr key={room.roomIdx} className="border-b border-gray-100">
                            <td className="sticky left-0 z-10 bg-white border-r border-gray-200 p-2 font-medium">
                              {room.roomNum}
                            </td>
                            {daysToShow.map((day) => {
                              const reservation = getReservationForDateAndRoom(day, room.roomNum)
                              const isCheckIn = reservation && format(day, "yyyy-MM-dd") === reservation.checkIn
                              const isCheckOut = reservation && format(day, "yyyy-MM-dd") === reservation.checkOut
                              return (
                                <td
                                  key={day.toString()}
                                  className={`p-0 box-border border-gray-100 ${reservation ? getStatusColorClass(reservation.status) : "bg-white"}`}
                                  onClick={() => reservation && viewReservationDetails(reservation.reservationNum)}
                                >
                                  {reservation ? (
                                    <div
                                      className={`h-full w-full p-1 cursor-pointer ${isCheckIn ? "border-l-4 border-l-blue-500" : ""} ${isCheckOut ? "border-r-4 border-r-green-500" : ""}`}
                                    >
                                      {isCheckIn && (
                                        <div className="text-xs font-medium truncate">{reservation.fullName}</div>
                                      )}
                                    </div>
                                  ) : null}
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
              <div className="overflow-auto max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">예약 번호</th>
                      <th className="text-left p-2">객실</th>
                      <th className="text-left p-2">고객명</th>
                      <th className="text-left p-2">체크인</th>
                      <th className="text-left p-2">체크아웃</th>
                      <th className="text-left p-2">총 인원</th>
                      <th className="text-left p-2">상태</th>
                      <th className="text-left p-2">연락처</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((reservation) => {
                      const room = rooms.find((r) => r.roomNum === reservation.roomNumber)
                      return (
                        <tr
                          key={reservation.reservationNum}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => viewReservationDetails(reservation.reservationNum)}
                        >
                          <td className="p-2">{reservation.reservationNum}</td>
                          <td className="p-2">
                            {room?.roomNum} ({getroomTypeIdx(room?.roomTypeIdx)})
                          </td>
                          <td className="p-2">{reservation.fullName}</td>
                          <td className="p-2">{reservation.checkIn}</td>
                          <td className="p-2">{reservation.checkOut}</td>
                          <td className="p-2">{(reservation.adultCount ?? 0) + (reservation.childCount ?? 0)}명</td>
                          <td className="p-2">{getEditableStatusBadge(reservation)}</td>
                          <td className="p-2">{reservation.phone}</td>
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
                <SelectItem value="PENDING">결제 대기</SelectItem>
                <SelectItem value="PAID">결제 완료</SelectItem>
                <SelectItem value="DELIVERED">수령 완료</SelectItem>
                <SelectItem value="CANCELLED">취소됨</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">기프트샵 주문 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">주문 번호</th>
                      <th className="text-left p-2">주문자</th>
                      <th className="text-left p-2">주문일</th>
                      <th className="text-left p-2">금액</th>
                      <th className="text-left p-2">상태</th>
                      <th className="text-left p-2">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGiftShopOrders.map((order) => {
                      return (
                        <tr key={order.orderIdx} className="border-b hover:bg-gray-50">
                          <td className="p-2">{order.orderIdx}</td>
                          <td className="p-2">{order.userName}</td>
                          <td className="p-2">{order.orderDate}</td>
                          <td className="p-2">{order.totalAmount.toLocaleString()}원</td>
                          <td className="p-2">{getGiftShopStatusBadge(order.orderStatus)}</td>
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

                              {order.orderStatus === "PAID" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleGiftShopStatusChange(order.orderIdx, "DELIVERED")}
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
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">주문 상태</span>
                {getGiftShopStatusBadge(selectedGiftShopOrder?.orderStatus)}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">예약 번호</p>
                  <p className="font-medium">{selectedReservation.reservationNum}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">상태</p>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">
                      {getStatusBadge(selectedReservation.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">고객명</p>
                    <p className="font-medium">{selectedReservation.fullName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">연락처</p>
                    <p className="font-medium">{selectedReservation.phone}</p>
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
                        {selectedReservation.roomNumber}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">성인</p>
                      <p className="font-medium">{selectedReservation.adultCount}명</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">어린이</p>
                      <p className="font-medium">{selectedReservation.childCount}명</p>
                    </div>
                  </div>


                  {selectedReservation.total && (
                    <div>
                      <p className="text-sm text-gray-500">총 금액</p>
                      <p className="font-medium">{selectedReservation.total.toLocaleString()}원</p>
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

                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              {selectedReservation &&
                selectedReservation.status !== "CHECKED_IN" &&
                selectedReservation.status !== "COMPLETED" &&
                selectedReservation.status !== "CANCELLED" && (
                  <Button
                    variant="default"
                    onClick={async () => {
                      await updateReservationStatus(selectedReservation.reservationNum, "CHECKED_IN");
                      setReservations((prev) =>
                        prev.map((res) =>
                          res.reservationNum === selectedReservation.reservationNum
                            ? { ...res, status: "CHECKED_IN" }
                            : res,
                        ),
                      );
                      setSelectedReservation({
                        ...selectedReservation,
                        status: "CHECKED_IN",
                      });
                      setIsDetailDialogOpen(false);
                    }}
                  >
                    체크인 처리
                  </Button>
                )}

              {selectedReservation && selectedReservation.status === "CANCELLED" && (
                <Button
                  variant="default"
                  onClick={async () => {
                    await updateReservationStatus(selectedReservation.reservationNum, "CONFIRMED");
                    setReservations((prev) =>
                      prev.map((res) =>
                        res.reservationNum === selectedReservation.reservationNum
                          ? { ...res, status: "CONFIRMED" }
                          : res,
                      ),
                    );
                    setSelectedReservation({
                      ...selectedReservation,
                      status: "CONFIRMED",
                    });
                    setIsDetailDialogOpen(false);
                  }}
                >
                  예약 확정
                </Button>
              )}

              {selectedReservation && selectedReservation.status === "COMPLETED" && (
                <Button
                  variant="default"
                  onClick={async () => {
                    await updateReservationStatus(selectedReservation.reservationNum, "CHECKED_IN");
                    setReservations((prev) =>
                      prev.map((res) =>
                        res.reservationNum === selectedReservation.reservationNum
                          ? { ...res, status: "CHECKED_IN" }
                          : res,
                      ),
                    );
                    setSelectedReservation({
                      ...selectedReservation,
                      status: "CHECKED_IN",
                    });
                  }}
                >
                  체크인
                </Button>
              )}

              {selectedReservation && selectedReservation.status === "CHECKED_IN" && (
                <Button
                  variant="default"
                  onClick={async () => {
                    await updateReservationStatus(selectedReservation.reservationNum, "COMPLETED");
                    setReservations((prev) =>
                      prev.map((res) =>
                        res.reservationNum === selectedReservation.reservationNum
                          ? { ...res, status: "COMPLETED" }
                          : res,
                      ),
                    );
                    setSelectedReservation({
                      ...selectedReservation,
                      status: "COMPLETED",
                    });
                  }}
                >
                  체크아웃 처리
                </Button>
              )}

              {selectedReservation &&
                selectedReservation.status !== "CANCELLED" &&
                selectedReservation.status !== "COMPLETED" && (
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (window.confirm("정말로 이 예약을 취소하시겠습니까?")) {
                        await updateReservationStatus(selectedReservation.reservationNum, "CANCELLED");
                        setReservations((prev) =>
                          prev.map((res) =>
                            res.reservationNum === selectedReservation.reservationNum
                              ? { ...res, status: "CANCELLED" }
                              : res,
                          ),
                        );
                        setSelectedReservation({
                          ...selectedReservation,
                          status: "CANCELLED",
                        });
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
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">주문 상태</span>
                {getGiftShopStatusBadge(selectedGiftShopOrder.orderStatus)}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">주문 번호</p>
                  <p className="font-medium">{selectedGiftShopOrder.orderIdx}</p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">주문자</p>
                    <p className="font-medium">{selectedGiftShopOrder.userName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">주문일</p>
                    <p className="font-medium">{selectedGiftShopOrder.orderDate}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">주문 상품</p>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {Array.isArray(selectedGiftShopOrder?.items) && selectedGiftShopOrder.items.length > 0 ? (
                        selectedGiftShopOrder.items.map((item) => (
                          <div key={item.itemName} className="flex gap-3 bg-gray-50 p-3 rounded-md">
                            <div className="flex-1">
                              <p className="font-medium">{item.itemName}</p>
                              <div className="flex justify-between text-sm text-gray-600 mt-1">
                                <span>
                                  {item.price.toLocaleString()}원 × {item.quantity}
                                </span>
                                <span className="font-medium">{(item.price * item.quantity).toLocaleString()}원</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-center py-4">주문 상품 내역이 없습니다.</div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">총 금액</p>
                      <p className="font-bold text-lg">{selectedGiftShopOrder.totalAmount.toLocaleString()}원</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              {selectedGiftShopOrder && selectedGiftShopOrder.orderStatus === "pending" && (
                <Button variant="default" onClick={() => handleGiftShopStatusChange(selectedGiftShopOrder.orderIdx, "ready")}>
                  준비 완료
                </Button>
              )}

              {selectedGiftShopOrder && selectedGiftShopOrder.orderStatus === "ready" && (
                <Button
                  variant="default"
                  onClick={() => handleGiftShopStatusChange(selectedGiftShopOrder.orderIdx, "delivered")}
                >
                  수령 완료 처리
                </Button>
              )}

              {selectedGiftShopOrder &&
                (selectedGiftShopOrder.orderStatus === "pending" || selectedGiftShopOrder.orderStatus === "ready") && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // 주문 취소 처리
                      if (window.confirm("정말로 이 주문을 취소하시겠습니까?")) {
                        handleGiftShopStatusChange(selectedGiftShopOrder.orderIdx, "cancelled")
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
