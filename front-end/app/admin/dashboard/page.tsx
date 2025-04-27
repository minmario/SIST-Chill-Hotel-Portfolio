"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCog, Hotel, Calendar, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  // 대시보드 통계 데이터 (가져오기 위한 변수들)
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [staffCount, setStaffCount] = useState<number | null>(null)

  // 최근 가입 회원 페이지네이션 상태
  const [recentCurrentPage, setRecentCurrentPage] = useState(1);
  const recentItemsPerPage = 3;
  const recentIndexOfLast = recentCurrentPage * recentItemsPerPage;
  const recentIndexOfFirst = recentIndexOfLast - recentItemsPerPage;
  const recentCurrentUsers = recentUsers.slice(recentIndexOfFirst, recentIndexOfLast);
  const recentTotalPages = Math.max(1, Math.ceil(recentUsers.length / recentItemsPerPage));
  const [newUserStats, setNewUserStats] = useState<{ today: number; changeRate: string } | null>(null)
  const [totalUserChange, setTotalUserChange] = useState<TotalUserChange | null>(null)
  // API 호출: 총 회원 수
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
  
    fetch('/api/user/count', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('응답 실패');
        return res.json();
      })
      .then((data) => setTotalUsers(data))
      .catch((err) => console.error('회원 수 불러오기 실패:', err));
  }, []);
  //API 호출: 최근 스태프 수
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("토큰이 없습니다. 로그인 후 이용해주세요.");
      return;
    }
  
    fetch("/api/user/staff-count", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('응답 실패');
        return res.json();
      })
      .then((data) => setStaffCount(data))
      .catch((err) => console.error("스태프 수 불러오기 실패:", err));
  }, []);
  //API 호출: 최근회원 수
  type RecentUser = {
    name: string
    email: string
    createdAt: string
  }
  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("토큰이 없습니다. 로그인 필요.");
      return;
    }
  
    fetch("/api/user/recent", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 실패");
        return res.json();
      })
      .then((data: RecentUser[]) => setRecentUsers(data))
      .catch((err) => console.error("최근 가입자 불러오기 실패:", err));
  }, []);
  //API 호출: 신규회원 변화량(하루 기준) 
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("토큰이 없습니다. 로그인 후 이용해주세요.");
      return;
    }
  
    fetch("/api/user/daily-change", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("응답 실패");
        return res.json();
      })
      .then((data) => {
        setNewUserStats({ today: data.today, changeRate: data.changeRate });
      })
      .catch((err) => console.error("신규 가입자 변화량 불러오기 실패:", err));
  }, []);
  //API 호출: 총회원 변화량(하루 기준)
  type TotalUserChange = {
    todayTotal: number;
    yesterdayTotal: number;
    changeRate: string;
  };
  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("토큰이 없습니다. 로그인 후 이용해주세요.");
      return;
    }
  
    fetch("/api/user/daily-total-change", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("응답 실패");
        return res.json();
      })
      .then((data: TotalUserChange) => setTotalUserChange(data))
      .catch((err) => console.error("누적 회원 변화율 불러오기 실패:", err));
  }, []);
  //API 호출: 스태프회원 변화량(하루 기준)
  const [staffDailyChange, setStaffDailyChange] = useState<{
    today: number;
    changeRate: string;
    trend: "up" | "down" | "neutral";
  }>({
    today: 0,
    changeRate: "0%",
    trend: "neutral",
  });
  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("토큰이 없습니다. 로그인 후 이용해주세요.");
      return;
    }
  
    fetch("/api/user/daily-staff-change", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("API 응답 실패");
        return res.json();
      })
      .then((data) => {
        const rate = parseFloat(data.changeRate.replace("%", ""));
        setStaffDailyChange({
          today: data.today,
          changeRate: data.changeRate,
          trend: rate > 0 ? "up" : rate < 0 ? "down" : "neutral",
        });
      })
      .catch((err) => console.error("신규 스태프 변화율 불러오기 실패:", err));
  }, []);
  const stats = [
    {
      title: "전체 회원 누적 변화",
  value: totalUserChange ? `${totalUserChange.todayTotal.toLocaleString()}명` : "로딩 중...",
  change: totalUserChange?.changeRate || "0%",
  trend: totalUserChange
    ? totalUserChange.changeRate.startsWith("-")
      ? "down"
      : totalUserChange.changeRate === "0%" ? "neutral" : "up"
    : "neutral",
  icon: Users,
  color: "bg-cyan-500",
    },
    {
      title: "신규 회원",
  value: newUserStats ? `${newUserStats.today.toLocaleString()}` : "로딩 중...",
  change: newUserStats ? newUserStats.changeRate : "로딩 중...",
  trend: newUserStats
    ? newUserStats.changeRate.includes("-")
      ? "down"
      : "up"
    : "neutral",
  icon: Users,
  color: "bg-green-500",
    },
    {
      title: "신규 스태프",
      value: staffDailyChange.today.toLocaleString(),
      change: staffDailyChange.changeRate,
      trend: staffDailyChange.trend,
      icon: UserCog,
      color: "bg-emerald-500",
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
          <Card key={index} className="border-none shadow-none bg-transparent">
            <div className="bg-gray-50 rounded-md p-4">
              <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between space-y-0 p-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-full`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
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
            </div>
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
                {recentCurrentUsers.length > 0 ? (
                  recentCurrentUsers.map((user, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400">최근 가입한 회원이 없습니다.</div>
                )}
              </div>
              {/* 페이지네이션 버튼 */}
              <div className="flex justify-center mt-4 gap-2 items-center">
                <button
                  onClick={() => setRecentCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={recentCurrentPage === 1}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  이전
                </button>
                {Array.from({ length: recentTotalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`px-2 py-1 border rounded text-sm font-medium transition-colors duration-150 ${pageNum === recentCurrentPage ? "bg-black text-white" : "bg-white text-black"}`}
                    onClick={() => setRecentCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setRecentCurrentPage((p) => Math.min(recentTotalPages, p + 1))}
                  disabled={recentCurrentPage === recentTotalPages}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  다음
                </button>
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

