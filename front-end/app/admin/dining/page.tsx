"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface Restaurant {
  id: number
  name: string
  capacity: number
}

interface ReservationCell {
  guestName: string
  partySize: number
  reservationNum: string
  status: string
  adults?: number
  children?: number
  phone?: string
  email?: string
  reservationTime?: string
  reservationDate?: string
  request?: string
}

interface TimeSlot {
  time: string
  [restaurantId: string]: ReservationCell[] | null | string
}

interface ApiReservation {
  restaurantId: number
  reservationTime: string
  guestName: string
  partySize: number
  adults: number
  children: number
  request: string
  reservationNum: string
  status: string
  phone?: string
  email?: string
  reservationDate?: string
}

function getStatusColor(status: string | undefined) {
  if (!status) return "bg-gray-100 text-gray-500 border-gray-200"
  switch (status.toUpperCase()) {
    case "CONFIRMED": return "bg-blue-100 text-blue-700 border-blue-300"
    case "CANCELLED": return "bg-red-100 text-red-700 border-red-300"
    case "PENDING": default: return "bg-green-100 text-green-700 border-green-300"
  }
}

function getStatusLabel(status: string | undefined) {
  if (!status) return "알 수 없음"
  switch (status.toUpperCase()) {
    case "CONFIRMED": return "예약 확정"
    case "CANCELLED": return "예약 취소"
    case "PENDING": default: return "대기중"
  }
}

export default function AdminDiningSchedulePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [schedule, setSchedule] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split("T")[0])
  const [selectedReservation, setSelectedReservation] = useState<ReservationCell | null>(null)
  const [updating, setUpdating] = useState(false)
  const [viewMode, setViewMode] = useState("table")
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch("/api/restaurants", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: "include"
      });
      const data = await res.json()
      console.log("restaurant data:", data.content)
      setRestaurants(data.content)
    }
    fetchRestaurants()
  }, [])

  const fetchSchedule = async (selectedDate: string, restaurants: Restaurant[], setSchedule: (v: TimeSlot[]) => void) => {
    const res = await fetch(`http://13.209.111.149:8080/admin/dining/schedule?date=${selectedDate}`, {
      credentials: "include"
    });
    const data: ApiReservation[] = await res.json()
    console.log('서버에서 받아온 예약 data:', data)
    const start = 7, end = 22, times: TimeSlot[] = []
    for (let h = start; h < end; h++) {
      ["00", "30"].forEach((m) => {
        const time = `${h.toString().padStart(2, "0")}:${m}`
        const row: TimeSlot = { time }
        restaurants.forEach((r) => { row[r.id] = null })
        data.forEach((r) => {
          if (r.reservationTime === time) {
            if (!row[r.restaurantId]) {
              row[r.restaurantId] = [] as ReservationCell[];
            }
            (row[r.restaurantId] as ReservationCell[]).push({
              guestName: r.guestName,
              partySize: r.partySize,
              reservationNum: r.reservationNum,
              adults: r.adults,
              children: r.children,
              status: r.status ?? "PENDING",
              phone: r.phone,
              email: r.email,
              reservationTime: r.reservationTime,
              reservationDate: r.reservationDate,
              request: r.request
            });
          }
        });
        times.push(row)
      })
    }
    setSchedule(times)
  }

  useEffect(() => {
    if (restaurants.length > 0) {
      fetchSchedule(selectedDate, restaurants, setSchedule)
    }
  }, [selectedDate, restaurants])

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedReservation) return
    try {
      setUpdating(true)
      const res = await fetch("http://13.209.111.149:8080/admin/dining/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationNum: selectedReservation.reservationNum,
          status: newStatus
        }),
        credentials: "include"
      })
      if (res.ok) {
        setSelectedReservation({ ...selectedReservation, status: newStatus })
        fetchSchedule(selectedDate, restaurants, setSchedule)
      } else {
        alert("상태 변경 실패")
      }
    } catch (err) {
      alert("에러 발생")
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedReservation) return
    const confirmed = window.confirm("정말로 이 예약을 삭제하시겠습니까?")
    if (!confirmed) return

    try {
      const res = await fetch(`http://13.209.111.149:8080/admin/dining/${selectedReservation.reservationNum}`, {
        method: "DELETE",
        credentials: "include"
      })
      if (res.ok) {
        alert("예약이 삭제되었습니다.")
        setSelectedReservation(null)
        window.location.reload()
      } else {
        alert("삭제 실패")
      }
    } catch (err) {
      alert("에러 발생")
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">시간대별 예약 현황</h1>

      <div className="mb-4">
        <label className="font-medium mr-2">조회 날짜:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="table">테이블 뷰</TabsTrigger>
            <TabsTrigger value="list">리스트 뷰</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-4 text-sm items-center ml-auto">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-blue-200 border border-blue-400"></div>
            예약 확정
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-200 border border-red-400"></div>
            취소됨
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-green-200 border border-green-400"></div>
            대기중
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">시간</th>
                {restaurants.map((r) => (
                  <th key={r.id} className="px-4 py-2 border">
                    {r.name} <span className="text-xs text-gray-500">({r.capacity}석)</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map((slot) => (
                <tr key={slot.time}>
                  <td className="px-4 py-2 border font-mono text-sm bg-gray-50">{slot.time}</td>
                  {restaurants.map((r) => {
                    const cell = slot[r.id]
                    return (
                      <td
                        key={r.id}
                        className="px-4 py-2 border text-center text-sm cursor-pointer hover:bg-teal-50"
                      >
                        {Array.isArray(cell) ? (
                          cell.map((res) => (
                            <div
                              key={res.reservationNum}
                              title={res.guestName}
                              onClick={() => setSelectedReservation(res)}
                              className={`mb-1 last:mb-0 ${getStatusColor(res.status)}`}
                            >
                              <div className="font-semibold">{res.guestName}</div>
                              <div className="text-xs">{res.partySize}명</div>
                            </div>
                          ))
                        ) : "-"}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.flatMap((slot) =>
            restaurants.map((r) => {
              const cellArray = slot[r.id]
              if (!Array.isArray(cellArray)) return null

              return cellArray.map((cell) => (
                <div
                  key={cell.reservationNum}
                  className={`border rounded p-3 ${getStatusColor(cell.status)}`}
                  onClick={() => setSelectedReservation(cell)}
                >
                  <div className="font-semibold">{slot.time} | {r.name}</div>
                  <div className="text-sm">👤 {cell.guestName} | 👪 {cell.partySize}명 (성인 {cell.adults} / 어린이 {cell.children})</div>
                  <div className="text-xs mt-1">상태: {getStatusLabel(cell.status)}</div>
                </div>
              ))
            })
          )}
        </div>
      )}

      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <DialogHeader>
            <DialogTitle>예약 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-2 text-sm text-gray-800">
              <p><strong>예약번호:</strong> {selectedReservation.reservationNum}</p>
              <p><strong>이름:</strong> {selectedReservation.guestName}</p>
              <p><strong>인원:</strong> {selectedReservation.adults ?? "-"}명 / 어린이 {selectedReservation.children ?? 0}명</p>
              <p><strong>전화번호:</strong> {selectedReservation.phone ?? "-"}</p>
              <p><strong>이메일:</strong> {selectedReservation.email ?? "-"}</p>
              <p><strong>예약날짜:</strong> {selectedReservation.reservationDate ?? selectedDate}</p>
              <p><strong>예약시간:</strong> {selectedReservation.reservationTime ?? "-"}</p>
              <p><strong>요청사항:</strong> {selectedReservation.request ?? "-"}</p>
              <div>
                <label className="block font-medium mb-1">예약 상태</label>
                <Select value={selectedReservation.status} onValueChange={handleStatusChange} disabled={updating}>
                  <SelectTrigger className="w-full text-base font-medium">
                    <SelectValue placeholder="예약 상태 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="PENDING" className="py-2 text-sm hover:bg-gray-100">⏳ 대기중</SelectItem>
                    <SelectItem value="CONFIRMED" className="py-2 text-sm text-green-600 font-semibold hover:bg-green-50">✅ 예약 확정</SelectItem>
                    <SelectItem value="CANCELLED" className="py-2 text-sm text-red-600 hover:bg-red-50">❌ 예약 취소</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4 flex flex-row justify-between">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={updating}
              className="font-bold border-2 rounded-lg bg-gray-100 text-gray-700 border-gray-300 shadow hover:bg-gray-200 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              예약 삭제
            </Button>
            <Button onClick={() => setSelectedReservation(null)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
