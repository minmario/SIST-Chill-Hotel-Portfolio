"use client"

import { useEffect, useState } from "react"
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { ko } from "date-fns/locale"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ChevronLeft, ChevronRight, Search, Users, Check } from "lucide-react"
import { Input } from "../../../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Badge } from "../../../components/ui/badge"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"

// 타입 정의
interface Restaurant {
  id: string
  name: string
  capacity: number
  openingTime: string
  closingTime: string
  cuisine: string
  location: string
}

interface DiningReservation {
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

export default function DiningPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [diningReservations, setDiningReservations] = useState<DiningReservation[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("http://localhost:8080/dining/restaurants")
        const data = await res.json()
        setRestaurants(data)
      } catch (e) {
        console.error("식당 불러오기 오류:", e)
      }
    }
    fetchRestaurants()
  }, [])

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch(`http://localhost:8080/admin/dining/reservations?date=${format(currentDate, "yyyy-MM-dd")}`)
        const data = await res.json()
        setDiningReservations(data)
      } catch (e) {
        console.error("예약 불러오기 오류:", e)
      }
    }
    fetchReservations()
  }, [currentDate])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">다이닝 예약 관리</h1>
      <div className="flex items-center gap-2 mb-4">
        <Button onClick={() => setCurrentDate(addDays(currentDate, -1))}><ChevronLeft className="w-4 h-4" /></Button>
        <Input type="date" value={format(currentDate, "yyyy-MM-dd")} onChange={(e) => setCurrentDate(new Date(e.target.value))} className="w-40" />
        <Button onClick={() => setCurrentDate(addDays(currentDate, 1))}><ChevronRight className="w-4 h-4" /></Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diningReservations.map((reservation) => {
          const restaurant = restaurants.find(r => r.id === reservation.restaurantId)
          return (
            <Card key={reservation.id}>
              <CardHeader>
                <CardTitle>{reservation.guestName} ({reservation.partySize}명)</CardTitle>
              </CardHeader>
              <CardContent>
                <p>식당: {restaurant?.name || reservation.restaurantId}</p>
                <p>시간: {reservation.time}</p>
                <p>상태: {reservation.status}</p>
                <p>연락처: {reservation.contact}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
