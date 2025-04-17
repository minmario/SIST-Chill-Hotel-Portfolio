"use client"

import { useEffect, useState } from "react"
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

// 타입 정의
type Restaurant = {
  restaurantsIdx: number
  name: string
  capacity: number
  location: string
  breakfastOpen: string
  breakfastClose: string
  lunchOpen: string
  lunchClose: string
  dinnerOpen: string
  dinnerClose: string
}


type DiningReservation = {
  id: string
  restaurantId: number
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

export default function DiningPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [diningReservations, setDiningReservations] = useState<DiningReservation[]>([])
  const [activeTab, setActiveTab] = useState("calendar")
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1)) // 4월 1일
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<DiningReservation | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [restaurantFilter, setRestaurantFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>(format(currentDate, "yyyy-MM-dd"))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const fetchRestaurants = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/restaurants")
      const data = await res.json()
      setRestaurants(data)
    } catch (err) {
      console.error("레스토랑 데이터를 불러오지 못했습니다", err)
    }
  }

  const fetchReservations = async () => {
    try {
      const res = await fetch(`http://localhost:8080/admin/dining/reservations?date=${format(currentDate, "yyyy-MM-dd")}`)
      const data = await res.json()
      setDiningReservations(data)
    } catch (err) {
      console.error("예약 데이터를 불러오지 못했습니다", err)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    fetchReservations()
  }, [currentDate])

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

  const filteredReservations = diningReservations.filter((reservation) => {
    const searchMatch =
      reservation.guestName.includes(searchTerm) ||
      reservation.contact.includes(searchTerm) ||
      reservation.id.includes(searchTerm) ||
      (reservation.roomNumber && reservation.roomNumber.includes(searchTerm))

    const restaurantMatch =
      restaurantFilter === "all" || String(reservation.restaurantId) === restaurantFilter

    const statusMatch = statusFilter === "all" || reservation.status === statusFilter

    const dateMatch = reservation.date === dateFilter

    return searchMatch && restaurantMatch && statusMatch && dateMatch
  })

  const getReservationsForTimeAndRestaurant = (time: string, restaurantId: number) => {
    return filteredReservations.filter((res) => res.time === time && res.restaurantId === restaurantId)
  }

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

  const getTimeSlots = (restaurantId: number) => {
    const restaurant = restaurants.find((r) => r.restaurantsIdx === restaurantId)
    if (!restaurant) return []
  
    // 가장 우선순위: 아침 → 점심 → 저녁
    if (restaurant.breakfastOpen && restaurant.breakfastClose) {
      return generateTimeSlots(restaurant.breakfastOpen, restaurant.breakfastClose)
    } else if (restaurant.lunchOpen && restaurant.lunchClose) {
      return generateTimeSlots(restaurant.lunchOpen, restaurant.lunchClose)
    } else if (restaurant.dinnerOpen && restaurant.dinnerClose) {
      return generateTimeSlots(restaurant.dinnerOpen, restaurant.dinnerClose)
    }
  
    // 전부 없으면 fallback
    return []
  }

  const allTimeSlots = (() => {
    const allOpenTimes: string[] = []
    const allCloseTimes: string[] = []
  
    restaurants.forEach((r) => {
      if (r.breakfastOpen) allOpenTimes.push(r.breakfastOpen)
      if (r.lunchOpen) allOpenTimes.push(r.lunchOpen)
      if (r.dinnerOpen) allOpenTimes.push(r.dinnerOpen)
      if (r.breakfastClose) allCloseTimes.push(r.breakfastClose)
      if (r.lunchClose) allCloseTimes.push(r.lunchClose)
      if (r.dinnerClose) allCloseTimes.push(r.dinnerClose)
    })
  
    // 정렬하여 가장 빠른 open, 가장 늦은 close 시간 구함
    const earliest = allOpenTimes.sort()[0]
    const latest = allCloseTimes.sort().reverse()[0]
  
    return generateTimeSlots(earliest, latest)
  })()
  

  // ✨ 이후 부분은 기존 코드와 동일하게 유지됨 (UI 구성, 리스트, 다이얼로그 등)

  return (
    <>
      {/* ⚙ 기존 구성 그대로 유지됨 */}
      {/* 위의 상태값 및 데이터만 수정되고, 전체 구조나 기능은 건드리지 않았어 */}
    </>
  )
}
