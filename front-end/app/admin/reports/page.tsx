"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// 매출 데이터 (더미)
const revenueData = [
  { month: "1월", 객실: 4000, 다이닝: 2400, 기프트샵: 1200, 멤버십: 800 },
  { month: "2월", 객실: 3500, 다이닝: 2100, 기프트샵: 1100, 멤버십: 750 },
  { month: "3월", 객실: 4200, 다이닝: 2700, 기프트샵: 1300, 멤버십: 900 },
  { month: "4월", 객실: 5000, 다이닝: 3000, 기프트샵: 1500, 멤버십: 1000 },
  { month: "5월", 객실: 4800, 다이닝: 2800, 기프트샵: 1400, 멤버십: 950 },
  { month: "6월", 객실: 5500, 다이닝: 3200, 기프트샵: 1600, 멤버십: 1100 },
  { month: "7월", 객실: 6000, 다이닝: 3500, 기프트샵: 1800, 멤버십: 1200 },
  { month: "8월", 객실: 6500, 다이닝: 3800, 기프트샵: 2000, 멤버십: 1300 },
  { month: "9월", 객실: 6200, 다이닝: 3600, 기프트샵: 1900, 멤버십: 1250 },
  { month: "10월", 객실: 5800, 다이닝: 3400, 기프트샵: 1700, 멤버십: 1150 },
  { month: "11월", 객실: 5200, 다이닝: 3100, 기프트샵: 1550, 멤버십: 1050 },
  { month: "12월", 객실: 6800, 다이닝: 4000, 기프트샵: 2200, 멤버십: 1400 },
]

// 예약 데이터 (더미)
const bookingData = [
  { month: "1월", 예약수: 120, 취소수: 10 },
  { month: "2월", 예약수: 130, 취소수: 12 },
  { month: "3월", 예약수: 140, 취소수: 15 },
  { month: "4월", 예약수: 160, 취소수: 18 },
  { month: "5월", 예약수: 150, 취소수: 14 },
  { month: "6월", 예약수: 170, 취소수: 20 },
  { month: "7월", 예약수: 190, 취소수: 22 },
  { month: "8월", 예약수: 210, 취소수: 25 },
  { month: "9월", 예약수: 200, 취소수: 23 },
  { month: "10월", 예약수: 180, 취소수: 21 },
  { month: "11월", 예약수: 170, 취소수: 19 },
  { month: "12월", 예약수: 220, 취소수: 28 },
]

// 객실 점유율 데이터 (더미)
const occupancyData = [
  { month: "1월", 점유율: 65 },
  { month: "2월", 점유율: 68 },
  { month: "3월", 점유율: 72 },
  { month: "4월", 점유율: 78 },
  { month: "5월", 점유율: 75 },
  { month: "6월", 점유율: 82 },
  { month: "7월", 점유율: 88 },
  { month: "8월", 점유율: 92 },
  { month: "9월", 점유율: 85 },
  { month: "10월", 점유율: 80 },
  { month: "11월", 점유율: 76 },
  { month: "12월", 점유율: 90 },
]

// 회원 등급 분포 데이터 (더미)
const membershipData = [
  { name: "일반", value: 400 },
  { name: "실버", value: 300 },
  { name: "골드", value: 200 },
  { name: "플래티넘", value: 100 },
  { name: "VIP", value: 50 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

// 객실 유형별 예약 데이터 (더미)
const roomTypeData = [
  { name: "스탠다드", value: 35 },
  { name: "디럭스", value: 25 },
  { name: "스위트", value: 20 },
  { name: "패밀리", value: 15 },
  { name: "프레지덴셜", value: 5 },
]

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">보고서 및 통계</h1>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
              <SelectValue placeholder="기간 선택" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
              <SelectItem value="daily">일별</SelectItem>
              <SelectItem value="weekly">주별</SelectItem>
              <SelectItem value="monthly">월별</SelectItem>
              <SelectItem value="yearly">연별</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
  variant="outline"
  className="w-[240px] justify-start text-left font-normal bg-white/90 backdrop-blur-md border border-gray-300 rounded-md"
>
  <CalendarIcon className="mr-2 h-4 w-4" />
  {date ? format(date, "PPP") : <span>날짜 선택</span>}
</Button>
            </PopoverTrigger>
            <PopoverContent
  className="w-auto p-0 bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md"
  align="start"
>
  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
</PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">매출 통계</TabsTrigger>
          <TabsTrigger value="bookings">예약 통계</TabsTrigger>
          <TabsTrigger value="occupancy">객실 점유율</TabsTrigger>
          <TabsTrigger value="membership">회원 통계</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 통계</CardTitle>
              <CardDescription>카테고리별 월간 매출 추이를 확인할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
                    <Legend />
                    <Bar dataKey="객실" fill="#8884d8" />
                    <Bar dataKey="다이닝" fill="#82ca9d" />
                    <Bar dataKey="기프트샵" fill="#ffc658" />
                    <Bar dataKey="멤버십" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>매출 요약</CardTitle>
                <CardDescription>주요 매출 지표 요약</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">총 매출</span>
                    <span className="font-bold">₩57,500,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">객실 매출</span>
                    <span className="font-bold">₩32,000,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">다이닝 매출</span>
                    <span className="font-bold">₩15,500,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">기프트샵 매출</span>
                    <span className="font-bold">₩6,500,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">멤버십 매출</span>
                    <span className="font-bold">₩3,500,000</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">전월 대비</span>
                    <span className="font-bold text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">전년 동월 대비</span>
                    <span className="font-bold text-green-600">+18.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>매출 분포</CardTitle>
                <CardDescription>카테고리별 매출 비중</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "객실", value: 32000000 },
                          { name: "다이닝", value: 15500000 },
                          { name: "기프트샵", value: 6500000 },
                          { name: "멤버십", value: 3500000 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: "객실", value: 32000000 },
                          { name: "다이닝", value: 15500000 },
                          { name: "기프트샵", value: 6500000 },
                          { name: "멤버십", value: 3500000 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${(Number(value) / 1000000).toFixed(1)}백만원`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>월별 예약 통계</CardTitle>
              <CardDescription>월간 예약 및 취소 추이를 확인할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="예약수" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="취소수" stroke="#ff8042" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>예약 요약</CardTitle>
                <CardDescription>주요 예약 지표 요약</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">총 예약 수</span>
                    <span className="font-bold">1,840건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">취소 예약 수</span>
                    <span className="font-bold">227건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">취소율</span>
                    <span className="font-bold">12.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">평균 숙박 일수</span>
                    <span className="font-bold">2.4일</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">평균 객실 요금</span>
                    <span className="font-bold">₩280,000</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">전월 대비 예약</span>
                    <span className="font-bold text-green-600">+8.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">전년 동월 대비 예약</span>
                    <span className="font-bold text-green-600">+15.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>객실 유형별 예약 분포</CardTitle>
                <CardDescription>객실 유형별 예약 비중</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roomTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roomTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>월별 객실 점유율</CardTitle>
              <CardDescription>월간 객실 점유율 추이를 확인할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={occupancyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="점유율" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>평균 점유율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">79.2%</div>
                <p className="text-sm text-muted-foreground mt-2">전년 대비 +5.3%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>최고 점유율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">92%</div>
                <p className="text-sm text-muted-foreground mt-2">8월 성수기</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>최저 점유율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">65%</div>
                <p className="text-sm text-muted-foreground mt-2">1월 비수기</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>객실 유형별 점유율</CardTitle>
              <CardDescription>객실 유형별 평균 점유율을 확인할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>스탠다드</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>디럭스</span>
                    <span>82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "82%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>스위트</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>패밀리</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>프레지덴셜</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>회원 등급 분포</CardTitle>
              <CardDescription>회원 등급별 분포를 확인할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={membershipData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {membershipData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>회원 통계 요약</CardTitle>
                <CardDescription>주요 회원 지표 요약</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">총 회원 수</span>
                    <span className="font-bold">1,050명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">신규 회원 (이번 달)</span>
                    <span className="font-bold">85명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">활성 회원 비율</span>
                    <span className="font-bold">78.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">평균 회원 유지 기간</span>
                    <span className="font-bold">2.7년</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">회원당 평균 지출</span>
                    <span className="font-bold">₩450,000/년</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">전월 대비 회원 증가율</span>
                    <span className="font-bold text-green-600">+3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">전년 대비 회원 증가율</span>
                    <span className="font-bold text-green-600">+12.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>회원 등급별 통계</CardTitle>
                <CardDescription>등급별 회원 수 및 평균 지출</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">일반 회원</h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span>회원 수: 400명</span>
                      <span>평균 지출: ₩250,000/년</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">실버 회원</h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span>회원 수: 300명</span>
                      <span>평균 지출: ₩450,000/년</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">골드 회원</h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span>회원 수: 200명</span>
                      <span>평균 지출: ₩650,000/년</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">플래티넘 회원</h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span>회원 수: 100명</span>
                      <span>평균 지출: ₩950,000/년</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">VIP 회원</h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span>회원 수: 50명</span>
                      <span>평균 지출: ₩1,800,000/년</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

