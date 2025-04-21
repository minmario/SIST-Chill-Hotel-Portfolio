"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
}

interface TimeSlot {
  time: string
  [restaurantId: string]: ReservationCell | null | string
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
}

function getStatusColor(status: string | undefined) {
  console.log("상태값:", status); // 디버깅용
  if (!status) return "bg-gray-100 text-gray-500 border-gray-200"; // ✅ fallback
  switch (status.toUpperCase()) {
    case "CONFIRMED": return "bg-blue-100 text-blue-700 border-blue-300";
    case "CANCELLED": return "bg-red-100 text-red-700 border-red-300";
    case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-300";
    default: return "bg-gray-100 text-gray-500 border-gray-200"; // ✅ 예상치 못한 값 fallback
  }
}


function getStatusLabel(status: string | undefined) {
  if (!status) return "알 수 없음"
  console.log("상태값:", status); // 디버깅용
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return "예약 확정";
    case "CANCELLED":
      return "예약 취소";
    case "PENDING":
    default:
      return "대기중";
  }
}

export default function AdminDiningSchedulePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [schedule, setSchedule] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split("T")[0])
  const [selectedReservation, setSelectedReservation] = useState<ReservationCell | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch("http://localhost:8080/api/restaurants")
      const data = await res.json()
      setRestaurants(data)
    }

    fetchRestaurants()
  }, [])

  // fetchSchedule을 컴포넌트 함수 바깥으로 이동
  const fetchSchedule = async (selectedDate: string, restaurants: Restaurant[], setSchedule: (v: TimeSlot[]) => void) => {
    const res = await fetch(`http://localhost:8080/admin/dining/schedule?date=${selectedDate}`)
    const data: ApiReservation[] = await res.json()
    console.log("응답 데이터", data)
    const start = 7
    const end = 22
    const times: TimeSlot[] = []
    for (let h = start; h < end; h++) {
      ["00", "30"].forEach((m) => {
        const time = `${h.toString().padStart(2, "0")}:${m}`
        const row: TimeSlot = { time }
        restaurants.forEach((r) => {
          row[r.id] = null
        })
        data.forEach((r) => {
          if (r.reservationTime === time) {
            console.log("상태", r.status)
            row[r.restaurantId] = {
              guestName: r.guestName,
              partySize: r.partySize,
              reservationNum: r.reservationNum,
              adults: r.adults,
              children: r.children,
              status: r.status || "PENDING"
            }
          }
        })
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
      const res = await fetch("http://localhost:8080/admin/dining/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationNum: selectedReservation.reservationNum,
          status: newStatus
        })
      })
      if (res.ok) {
        setSelectedReservation({ ...selectedReservation, status: newStatus })
        // 상태 변경 성공 시 스케줄 즉시 갱신
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
      const res = await fetch(`http://localhost:8080/admin/dining/${selectedReservation.reservationNum}`, {
        method: "DELETE"
      })
      if (res.ok) {
        alert("예약이 삭제되었습니다.")
        setSelectedReservation(null)
        window.location.reload() // 간단한 방식으로 새로고침 (향후 fetchSchedule 재호출로 개선 가능)
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
                      className={`px-4 py-2 border text-center text-sm cursor-pointer hover:bg-teal-50 ${cell && typeof cell !== "string" ? getStatusColor(cell.status) : ""}`}
                      onClick={() => cell && typeof cell !== "string" && setSelectedReservation(cell)}
                    >
                      {cell && typeof cell !== "string" ? (
                        <div title={cell.guestName}>
                          <div className="font-semibold">{cell.guestName}</div>
                          <div className="text-xs">{cell.partySize}명</div>
                          <div className="mt-1">
                            <span className="inline-block rounded px-2 py-0.5 text-xs font-semibold bg-white bg-opacity-50">
                              {getStatusLabel(cell.status)}
                            </span>
                          </div>
                        </div>
                      ) : "-"}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 예약 상세 모달 */}
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
              <div>
                <label className="block font-medium mb-1">예약 상태</label>
                <Select value={selectedReservation.status} onValueChange={handleStatusChange} disabled={updating}>
                  <SelectTrigger className="w-full text-base font-medium" >
                    <SelectValue placeholder="예약 상태 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="PENDING" className="py-2 text-sm hover:bg-gray-100">⏳ 대기중</SelectItem>
                    <SelectItem value="CONFIRMED" className="py-2 text-sm text-green-600 font-semibold hover:bg-green-50">✅ 예약 확정</SelectItem>
                    <SelectItem value="CANCELLED" className="py-2 text-sm text-red-600 hover:bg-red-50">❌ 예약 취소</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4">
                <Button variant="destructive" onClick={handleDelete} disabled={updating}>
                  예약 삭제
                </Button>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button onClick={() => setSelectedReservation(null)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
