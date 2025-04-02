"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, CreditCard, LogOut, Award, Gift, Search, Calendar } from "lucide-react"
import styles from "../mypage.module.css"

// 포인트 내역 데이터
const pointsHistory = [
  {
    id: 1,
    date: "2024-03-15",
    category: "적립",
    description: "객실 이용",
    earned: 2500,
    used: 0,
    balance: 2500,
  },
  {
    id: 2,
    date: "2024-03-20",
    category: "적립",
    description: "레스토랑 이용",
    earned: 1000,
    used: 0,
    balance: 3500,
  },
  {
    id: 3,
    date: "2024-04-05",
    category: "사용",
    description: "객실 예약 포인트 사용",
    earned: 0,
    used: 2000,
    balance: 1500,
  },
]

export default function PointsHistory() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [period, setPeriod] = useState("3개월")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filter, setFilter] = useState("전체")
  const [filteredHistory, setFilteredHistory] = useState(pointsHistory)

  useEffect(() => {
    // 로그인 상태 확인
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)

    if (!loggedIn) {
      router.push("/login")
    }

    // 현재 날짜 설정
    const today = new Date()
    const endDateStr = today.toISOString().split("T")[0]
    setEndDate(endDateStr)

    // 시작 날짜 설정 (3개월 전)
    const startDateObj = new Date(today)
    startDateObj.setMonth(today.getMonth() - 3)
    const startDateStr = startDateObj.toISOString().split("T")[0]
    setStartDate(startDateStr)
  }, [router])

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod)

    const today = new Date()
    const endDateStr = today.toISOString().split("T")[0]

    const startDateObj = new Date(today)
    if (newPeriod === "1주일") {
      startDateObj.setDate(today.getDate() - 7)
    } else if (newPeriod === "1개월") {
      startDateObj.setMonth(today.getMonth() - 1)
    } else if (newPeriod === "3개월") {
      startDateObj.setMonth(today.getMonth() - 3)
    }

    const startDateStr = startDateObj.toISOString().split("T")[0]
    setStartDate(startDateStr)
    setEndDate(endDateStr)
  }

  const handleSearch = () => {
    // 실제로는 API 호출 등이 필요하지만, 여기서는 필터링만 수행
    let filtered = [...pointsHistory]

    if (filter !== "전체") {
      filtered = filtered.filter((item) => item.category === filter)
    }

    // 날짜 필터링
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return itemDate >= start && itemDate <= end
      })
    }

    setFilteredHistory(filtered)
  }

  if (!isLoggedIn) {
    return null // 로그인 페이지로 리디렉션 중
  }

  // 총 포인트 계산
  const totalPoints = 12500
  const availablePoints = 10000
  const expiringPoints = 2500

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>포인트 적립 내역 및 조회</h1>
          <p>Chill Haven 포인트 적립 및 사용 내역을 확인하세요.</p>
        </div>
      </div>

      <section className={styles.mypageSection}>
        <div className="container">
          <div className={styles.mypageContainer}>
            {/* 사이드바 */}
            <div className={styles.sidebar}>
              <h2 className={styles.sidebarTitle}>
                <User size={20} className={styles.sidebarIcon} />
                마이페이지
              </h2>

              <ul className={styles.sidebarNav}>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage" className={styles.sidebarNavLink}>
                    <Award size={18} />
                    Chill Haven 등급 및 포인트
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/points" className={`${styles.sidebarNavLink} ${styles.sidebarNavLinkActive}`}>
                    <Gift size={18} />
                    포인트 적립 내역 및 조회
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/info" className={styles.sidebarNavLink}>
                    <User size={18} />
                    마이페이지 정보 수정
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/withdraw" className={styles.sidebarNavLink}>
                    <LogOut size={18} />
                    회원 탈퇴
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/payment" className={styles.sidebarNavLink}>
                    <CreditCard size={18} />
                    결제관리
                  </Link>
                </li>
              </ul>

              <div className={styles.customerService}>
                <h3 className={styles.customerServiceTitle}>고객 지원</h3>
                <p className={styles.customerServiceHours}>평일 09:00 - 18:00</p>
                <p className={styles.customerServicePhone}>1588-1234</p>
              </div>
            </div>

            {/* 콘텐츠 영역 */}
            <div className={styles.contentArea}>
              {/* 포인트 요약 정보 */}
              <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-sm text-gray-500 mb-2">총 포인트</h3>
                    <p className="text-3xl font-bold text-primary-color" style={{ color: "var(--primary-color)" }}>
                      {totalPoints.toLocaleString()} P
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm text-gray-500 mb-2">사용 가능 포인트</h3>
                    <p className="text-3xl font-bold text-primary-color" style={{ color: "var(--primary-color)" }}>
                      {availablePoints.toLocaleString()} P
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm text-gray-500 mb-2">소멸 예정 포인트</h3>
                    <p className="text-3xl font-bold text-primary-color" style={{ color: "var(--primary-color)" }}>
                      {expiringPoints.toLocaleString()} P
                    </p>
                    <p className="text-xs text-red-500 mt-1">* 3개월 이내 소멸 예정</p>
                  </div>
                </div>
              </div>

              <h3 className={styles.sectionTitle}>포인트 내역 조회</h3>
              <p className="text-sm text-gray-500 mb-4">조회 기간과 포인트 유형을 선택하여 내역을 확인하세요.</p>

              <div className="mb-6">
                {/* 기간 선택 탭 */}
                <div className="flex mb-4">
                  <button
                    className={`px-4 py-2 rounded-md ${period === "1주일" ? "bg-primary-color text-white" : "bg-gray-100 text-gray-700"}`}
                    style={{
                      backgroundColor: period === "1주일" ? "var(--primary-color)" : "",
                      color: period === "1주일" ? "white" : "",
                    }}
                    onClick={() => handlePeriodChange("1주일")}
                  >
                    1주일
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md mx-2 ${period === "1개월" ? "bg-primary-color text-white" : "bg-gray-100 text-gray-700"}`}
                    style={{
                      backgroundColor: period === "1개월" ? "var(--primary-color)" : "",
                      color: period === "1개월" ? "white" : "",
                    }}
                    onClick={() => handlePeriodChange("1개월")}
                  >
                    1개월
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${period === "3개월" ? "bg-primary-color text-white" : "bg-gray-100 text-gray-700"}`}
                    style={{
                      backgroundColor: period === "3개월" ? "var(--primary-color)" : "",
                      color: period === "3개월" ? "white" : "",
                    }}
                    onClick={() => handlePeriodChange("3개월")}
                  >
                    3개월
                  </button>
                </div>

                {/* 날짜 선택 및 검색 */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="date"
                        className="p-2 border border-gray-300 rounded-md pr-8"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Calendar
                        size={16}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    <span className="mx-2">~</span>
                    <div className="relative">
                      <input
                        type="date"
                        className="p-2 border border-gray-300 rounded-md pr-8"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <Calendar
                        size={16}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>

                  <select
                    className="p-2 border border-gray-300 rounded-md"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="전체">전체</option>
                    <option value="적립">적립</option>
                    <option value="사용">사용</option>
                  </select>

                  <button
                    className="px-4 py-2 bg-primary-color text-white rounded-md flex items-center"
                    style={{ backgroundColor: "var(--primary-color)", color: "white" }}
                    onClick={handleSearch}
                  >
                    <Search size={16} className="mr-1" /> 조회
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">총 {filteredHistory.length}건의 포인트 내역이 있습니다.</p>

              {/* 포인트 내역 탭 */}
              <div className="mb-4">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-2 ${filter === "전체" ? "border-b-2 border-primary-color font-medium" : ""}`}
                    style={{ borderColor: filter === "전체" ? "var(--primary-color)" : "" }}
                    onClick={() => setFilter("전체")}
                  >
                    전체
                  </button>
                  <button
                    className={`px-4 py-2 ${filter === "적립" ? "border-b-2 border-primary-color font-medium" : ""}`}
                    style={{ borderColor: filter === "적립" ? "var(--primary-color)" : "" }}
                    onClick={() => setFilter("적립")}
                  >
                    적립
                  </button>
                  <button
                    className={`px-4 py-2 ${filter === "사용" ? "border-b-2 border-primary-color font-medium" : ""}`}
                    style={{ borderColor: filter === "사용" ? "var(--primary-color)" : "" }}
                    onClick={() => setFilter("사용")}
                  >
                    사용
                  </button>
                </div>
              </div>

              {/* 포인트 내역 테이블 */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left border-b border-gray-200">날짜</th>
                      <th className="py-3 px-4 text-left border-b border-gray-200">구분</th>
                      <th className="py-3 px-4 text-left border-b border-gray-200">내용</th>
                      <th className="py-3 px-4 text-right border-b border-gray-200">적립 포인트</th>
                      <th className="py-3 px-4 text-right border-b border-gray-200">사용 포인트</th>
                      <th className="py-3 px-4 text-right border-b border-gray-200">잔여 포인트</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 border-b border-gray-200">{item.date}</td>
                          <td className="py-3 px-4 border-b border-gray-200">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${item.category === "적립" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                            >
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-b border-gray-200">{item.description}</td>
                          <td className="py-3 px-4 text-right border-b border-gray-200 text-green-600">
                            {item.earned > 0 ? `+${item.earned.toLocaleString()}` : "-"}
                          </td>
                          <td className="py-3 px-4 text-right border-b border-gray-200 text-blue-600">
                            {item.used > 0 ? `-${item.used.toLocaleString()}` : "-"}
                          </td>
                          <td className="py-3 px-4 text-right border-b border-gray-200 font-medium">
                            {item.balance.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500 border-b border-gray-200">
                          조회된 포인트 내역이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

