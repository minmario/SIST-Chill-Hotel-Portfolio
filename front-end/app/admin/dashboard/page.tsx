import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCog, Hotel, Calendar, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function AdminDashboard() {
  // 대시보드 통계 데이터 (실제로는 API에서 가져와야 함)
  const stats = [
    {
      title: "총 회원수",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "신규 회원",
      value: "56",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "총 스태프",
      value: "32",
      change: "0%",
      trend: "neutral",
      icon: UserCog,
      color: "bg-purple-500",
    },
    {
      title: "객실 예약률",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: Hotel,
      color: "bg-amber-500",
    },
    {
      title: "이번달 예약",
      value: "245",
      change: "-3%",
      trend: "down",
      icon: Calendar,
      color: "bg-indigo-500",
    },
    {
      title: "이번달 매출",
      value: "₩123.4M",
      change: "+15%",
      trend: "up",
      icon: CreditCard,
      color: "bg-rose-500",
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <div className="text-sm text-gray-500">최종 업데이트: {new Date().toLocaleString("ko-KR")}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.color} p-2 rounded-full`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : stat.trend === "down" ? (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-gray-500 mr-1" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-gray-500"
                  }
                >
                  {stat.change} 지난달 대비
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>최근 가입 회원</CardTitle>
            <CardDescription>지난 7일간 가입한 회원 목록</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 실제로는 API에서 데이터를 가져와야 함 */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <div className="font-medium">김철수</div>
                  <div className="text-sm text-gray-500">kimcs@example.com</div>
                </div>
                <div className="text-sm text-gray-500">2023-06-15</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <div className="font-medium">이영희</div>
                  <div className="text-sm text-gray-500">leeyh@example.com</div>
                </div>
                <div className="text-sm text-gray-500">2023-06-14</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <div className="font-medium">박지민</div>
                  <div className="text-sm text-gray-500">parkjm@example.com</div>
                </div>
                <div className="text-sm text-gray-500">2023-06-13</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 예약</CardTitle>
            <CardDescription>최근 처리된 예약 목록</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 실제로는 API에서 데이터를 가져와야 함 */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <div className="font-medium">디럭스 룸</div>
                  <div className="text-sm text-gray-500">김철수 • 2023-06-20 ~ 2023-06-22</div>
                </div>
                <div className="text-sm font-medium text-green-600">확정</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <div className="font-medium">스위트 룸</div>
                  <div className="text-sm text-gray-500">이영희 • 2023-06-18 ~ 2023-06-19</div>
                </div>
                <div className="text-sm font-medium text-amber-600">대기중</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <div className="font-medium">스탠다드 룸</div>
                  <div className="text-sm text-gray-500">박지민 • 2023-06-15 ~ 2023-06-17</div>
                </div>
                <div className="text-sm font-medium text-green-600">확정</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

