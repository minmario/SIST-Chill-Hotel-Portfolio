"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, CreditCard, LogOut, Award, Gift, Search, Calendar } from "lucide-react"
import styles from "../mypage.module.css"
import Image from "next/image"

type PointTransaction = {
  id: number
  date: string
  description: string
  earned: number
  used: number
  balance: number
  referenceType: string
  referenceId: number
}

export default function PointsHistory() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [period, setPeriod] = useState("3개월")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filter, setFilter] = useState("전체")
  const [filteredHistory, setFilteredHistory] = useState<PointTransaction[]>([])
  const [summary, setSummary] = useState({
    totalPoints: 0,
    availablePoints: 0,
    expiringPoints: 0,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const currentItems = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    // 로그인 상태 확인
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  
    if (!loggedIn) {
      router.push("/login")
      return
    }
  
    // 현재 날짜 설정
    const today = new Date()
    const endDateStr = today.toISOString().split("T")[0]
    setEndDate(endDateStr)
  
    // 시작 날짜 설정 (6개월 전)
    const startDateObj = new Date(today)
    startDateObj.setMonth(today.getMonth() - 6) // 기본 6개월
    const startDateStr = startDateObj.toISOString().split("T")[0]
    setStartDate(startDateStr)
  
    // ✅ summary fetch
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await fetch("/api/user/points/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
  
        if (!res.ok) throw new Error("요약 정보 조회 실패")
        const data = await res.json()
        setSummary(data)
      } catch (err) {
        console.error("[요약 정보 fetch 오류]", err)
      }
    }
  
    // ✅ 포인트 내역 fetch
    const fetchPointHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await fetch(`/api/user/points?startDate=${startDateStr}&endDate=${endDateStr}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
  
        if (!res.ok) throw new Error("포인트 내역 조회 실패")
        const data = await res.json()
        setFilteredHistory(data)
      } catch (err) {
        console.error("[포인트 내역 fetch 오류]", err)
        setFilteredHistory([])
      }
    }
  
    fetchSummary()
    fetchPointHistory()
  }, [router])

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)

    const today = new Date()
    const endDateStr = today.toISOString().split("T")[0]

    const startDateObj = new Date(today)
    if (newPeriod === "1개월") {
      startDateObj.setMonth(today.getMonth() - 1)
    } else if (newPeriod === "6개월") {
      startDateObj.setMonth(today.getMonth() - 6)
    } else if (newPeriod === "1년") {
      startDateObj.setFullYear(today.getFullYear() - 1)
    }

    const startDateStr = startDateObj.toISOString().split("T")[0]
    setStartDate(startDateStr)
    setEndDate(endDateStr)
  }

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) throw new Error("토큰 없음")
  
      const res = await fetch(`/api/user/points?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!res.ok) throw new Error("포인트 내역 조회 실패")
  
      const data = await res.json()
  
      // 필터링: 전체, 적립, 사용
      const filtered = data.filter((item: PointTransaction) => {
        if (filter === "전체") return true
        if (filter === "적립") return item.earned > 0
        if (filter === "사용") return item.used > 0
        return true
      })
      setFilteredHistory(filtered)
    } catch (err) {
      console.error("[포인트 내역 fetch 오류]", err)
      setFilteredHistory([]) // 오류 시 빈 배열로 fallback
    }
  }

  if (!isLoggedIn) {
    return null // 로그인 페이지로 리디렉션 중
  }

  // 총 포인트 계산
  {summary.totalPoints.toLocaleString()} "P"
  {summary.availablePoints.toLocaleString()} "P"
  {summary.expiringPoints.toLocaleString()} "P"

  return (
    <>
      <div className={styles.header} style={{ position: 'relative', width: '100%', height: '300px', marginBottom: '2rem', overflow: 'hidden' }}>
  <Image
    src="/images/mypage/mypage-banner.PNG"   // ✅ 이 이미지 그대로 사용
    alt="마이페이지 배경"
    fill
    style={{ objectFit: 'cover' }}
    priority
  />
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.45)' }} />
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
    <div className="container">
      <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
        포인트 적립 내역 및 조회
      </h1>
      <p style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 400, textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        Chill Haven 회원 정보 및 포인트 현황을 확인하세요.
      </p>
    </div>
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
                    {`${summary.totalPoints.toLocaleString()} P`}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm text-gray-500 mb-2">사용 가능 포인트</h3>
                    <p className="text-3xl font-bold text-primary-color" style={{ color: "var(--primary-color)" }}>
                      {`${summary.availablePoints.toLocaleString()} P`}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm text-gray-500 mb-2">소멸 예정 포인트</h3>
                    <p className="text-3xl font-bold text-primary-color" style={{ color: "var(--primary-color)" }}>
                    {`${summary.expiringPoints.toLocaleString()} P`}
                    </p>
                    <p className="text-xs text-red-500 mt-1">* 1년 유효기간 기준</p>
                    </div>
                </div>
              </div>

              <h3 className={styles.sectionTitle}>포인트 내역 조회</h3>
              <p className="text-sm text-gray-500 mb-4">조회 기간과 포인트 유형을 선택하여 내역을 확인하세요.</p>

              <div className="mb-6">
                {/* 기간 선택 탭 */}
                <div className="flex mb-4">
                    <button
                      className={`px-4 py-2 rounded-md ${period === "1개월" ? "bg-primary-color text-white" : "bg-gray-100 text-gray-700"}`}
                      style={{
                        backgroundColor: period === "1개월" ? "var(--primary-color)" : "",
                        color: period === "1개월" ? "white" : "",
                      }}
                      onClick={() => handlePeriodChange("1개월")}
                    >
                      1개월
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md mx-2 ${period === "6개월" ? "bg-primary-color text-white" : "bg-gray-100 text-gray-700"}`}
                      style={{
                        backgroundColor: period === "6개월" ? "var(--primary-color)" : "",
                        color: period === "6개월" ? "white" : "",
                      }}
                      onClick={() => handlePeriodChange("6개월")}
                    >
                      6개월
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${period === "1년" ? "bg-primary-color text-white" : "bg-gray-100 text-gray-700"}`}
                      style={{
                        backgroundColor: period === "1년" ? "var(--primary-color)" : "",
                        color: period === "1년" ? "white" : "",
                      }}
                      onClick={() => handlePeriodChange("1년")}
                    >
                      1년
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
                      <th className="py-3 px-4 text-right border-b border-gray-200">연관 항목</th>
                      <th className="py-3 px-4 text-right border-b border-gray-200">연관 ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item: PointTransaction) => {
                        const isEarn = item.earned > 0
                        const category = isEarn ? "적립" : "사용"
                      
                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 border-b border-gray-200">{item.date.split("T")[0]}</td>
                            <td className="py-3 px-4 border-b border-gray-200">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  isEarn ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {category}
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
                            <td className="py-3 px-4 text-right border-b border-gray-200">{item.referenceType}</td>
                            <td className="py-3 px-4 text-right border-b border-gray-200">{item.referenceId}</td>
                          </tr>
                        )
                      })
                    ) : (
                            <tr key="no-data">
                              <td colSpan={8} className="py-8 text-center text-gray-500 border-b border-gray-200">
                                조회된 포인트 내역이 없습니다.
                              </td>
                            </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-6 gap-2">
  <button
    className="px-3 py-1 border rounded disabled:opacity-50"
    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
    disabled={currentPage === 1}
  >
    이전
  </button>
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      className={`px-3 py-1 border rounded ${
        page === currentPage ? "bg-primary-color text-white font-bold" : ""
      }`}
      onClick={() => setCurrentPage(page)}
    >
      {page}
    </button>
  ))}
  <button
    className="px-3 py-1 border rounded disabled:opacity-50"
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
  >
    다음
  </button>
</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

