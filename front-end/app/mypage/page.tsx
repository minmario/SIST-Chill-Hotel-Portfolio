"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, CreditCard, LogOut, Award, Gift, ChevronRight, Calendar } from "lucide-react"
import styles from "./mypage.module.css"
import Image from "next/image"



export default function MyPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [pointSummary, setPointSummary] = useState({
    totalPoints: 0,
    availablePoints: 0,
    expiringPoints: 0,
    currentTier: "",
    nextTier: "",
    pointForNextTier: 0,
  })
  const [staySummary, setStaySummary] = useState({
    totalStay: 0,
    stayForNextTier: 0,
    currentTier: "",
    nextTier: "",
  })

const [filteredHistory, setFilteredHistory] = useState<
  {
    id: number
    date: string
    category: string
    description: string
    earned: number
    used: number
    balance: number
  }[]
>([])
const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Pagination state for 6-month point/reservation history
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / itemsPerPage))
  // Reset to first page when data changes
  useEffect(() => { setCurrentPage(1) }, [filteredHistory])
const total = staySummary.totalStay + staySummary.stayForNextTier
const progress = total === 0 ? 0 : staySummary.totalStay / total
const dashOffset = (339.3 - 339.3 * progress).toString()
const pointTotal = pointSummary.totalPoints + pointSummary.pointForNextTier
const pointProgress = pointTotal === 0 ? 0 : pointSummary.totalPoints / pointTotal
const pointDashOffset = (339.3 - 339.3 * pointProgress).toString()
const formatK = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K"
  }
  return num.toString()
}

useEffect(() => {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true"
  const token = localStorage.getItem("accessToken")
  console.log("[MyPage] accessToken:", token)

  setIsLoggedIn(loggedIn)

  if (!loggedIn || !token) {
    router.push("/login")
    return
  }

  const today = new Date()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(today.getMonth() - 6)

  const format = (d: Date) => d.toISOString().split("T")[0]
  const startDateStr = format(sixMonthsAgo)
  const endDateStr = format(today)

  // ✅ 이 부분 추가
  const triggerMembershipUpdate = async () => {
    try {
      await fetch("/api/user/summary/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (err) {
      console.error("등급 갱신 트리거 실패:", err)
    }
  }

  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/user/points/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("요약 정보 응답 오류")
      const data = await res.json()
      setPointSummary(data)
    } catch (err) {
      console.error("요약 정보 fetch 실패:", err)
    }
  }

  const fetchStaySummary = async () => {
    try {
      const res = await fetch("/api/user/stays/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("등급 요약 응답 오류")
      const data = await res.json()
      setStaySummary(data)
    } catch (err) {
      console.error("숙박 등급 요약 fetch 실패:", err)
    }
  }

  const fetchPoints = async () => {
    try {
      const res = await fetch(
        `/api/user/points?startDate=${startDateStr}&endDate=${endDateStr}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok) throw new Error("포인트 내역 응답 오류")
      const data = await res.json()
      setFilteredHistory(data)
    } catch (err) {
      console.error("포인트 내역 fetch 실패:", err)
      setFilteredHistory([])
    }
  }

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("사용자 정보 응답 오류")
      const data = await res.json()
      setUserName(data.name || data.id)
    } catch (err) {
      console.error("사용자 정보 fetch 실패:", err)
    }
  }

  // 👇 순서 중요!
  const initializePage = async () => {
    await triggerMembershipUpdate()
    await fetchSummary()
    await fetchStaySummary()
    await fetchPoints()
    await fetchUserInfo()
  }

  initializePage()

}, [router])
const getTierMessage = () => {
  const isEligible =
    pointSummary.pointForNextTier === 0 &&
    staySummary.stayForNextTier === 0;

    const isTopTier = 
    pointSummary.pointForNextTier === 0 &&
    staySummary.stayForNextTier === 0 &&
    !pointSummary.nextTier &&
    pointSummary.totalPoints > 0 &&
    staySummary.totalStay > 0;

  if (isTopTier) {
    return `${userName || "회원"}님은 최고 등급입니다 🎉`;
  }

  if (isEligible && pointSummary.nextTier) {
    return `${userName || "회원"}님은 다음 등급(${pointSummary.nextTier}) 조건을 모두 충족했습니다! 🎉`;
  }

  return `${pointSummary.nextTier} 등급까지 포인트 ${pointSummary.pointForNextTier.toLocaleString()}P, 숙박 ${staySummary.stayForNextTier}박 남음`;
};
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
        마이페이지
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
                  <Link href="/mypage" className={`${styles.sidebarNavLink} ${styles.sidebarNavLinkActive}`}>
                    <Award size={18} />
                    Chill Haven 등급 및 포인트
                  </Link>
                </li>
                <li className={styles.sidebarNavItem}>
                  <Link href="/mypage/points" className={styles.sidebarNavLink}>
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
              {/* 회원 등급 정보 */}
              <div className={styles.membershipCard}>
                <div className={styles.membershipIcon}>
                  <Award size={30} />
                </div>
                <div className={styles.membershipInfo}>
                  <div className={styles.membershipTitle}>회원 등급</div>
                  <div className={styles.membershipName}>
                    {userName || "회원"}님은{" "}
                    <span className="text-primary-color font-bold" style={{ color: "var(--primary-color)" }}>
                      {pointSummary.currentTier || "-"}
                    </span>{" "}
                    회원입니다.
                  </div>
                </div>
              </div>

              {/* 포인트 요약 정보 */}
              <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-sm text-gray-500 mb-2">총 포인트</h3>
                    <p className="text-3xl font-bold text-primary-color" style={{ color: "var(--primary-color)" }}>
                    {pointSummary.totalPoints.toLocaleString()} P
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm text-gray-500 mb-2">사용 가능 포인트</h3>
                    <p className="text-3xl font-bold text-primary-color" style={{ color: "var(--primary-color)" }}>
                    {pointSummary.availablePoints.toLocaleString()} P
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm text-gray-500 mb-2">소멸 예정 포인트</h3>
                    <p className="text-3xl font-bold text-primary-color" style={{ color: "var(--primary-color)" }}>
                    {pointSummary.expiringPoints.toLocaleString()} P
                    </p>
                    <p className="text-xs text-red-500 mt-1">* 3개월 이내 소멸 예정</p>
                  </div>
                </div>
              </div>

              {/* 등급 현황 */}
              <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <div className={styles.statTitle}>
                  <Calendar size={18} className={styles.statIcon} />
                  박수기준
                </div>
                <div className={styles.statCircle}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" strokeWidth="12" />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="var(--primary-color)"
                      strokeWidth="12"
                      strokeDasharray="339.3"
                      strokeDashoffset={
                        (staySummary.totalStay + staySummary.stayForNextTier) === 0
                          ? "339.3"
                          : (339.3 - 339.3 * (staySummary.totalStay / (staySummary.totalStay + staySummary.stayForNextTier))).toString()
                      }
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className={styles.statValue}>
                    {staySummary.totalStay}
                    <span className={styles.statUnit}>박</span>
                  </div>
                </div>
                <div className={styles.statTarget}>
                  {getTierMessage()}
                </div>
                  
              </div>

                <div className={styles.statCard}>
                  <div className={styles.statTitle}>
                    <Gift size={18} className={styles.statIcon} />
                    포인트기준
                  </div>
                  <div className={styles.statCircle}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" strokeWidth="12" />
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="var(--primary-color)"
                        strokeWidth="12"
                        strokeDasharray="339.3"
                        strokeDashoffset={pointDashOffset}
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className={styles.statValue}>
                      {formatK(pointSummary.totalPoints)}
                      <span className={styles.statUnit}>P</span>
                    </div>
                  </div>
                  <div className={styles.statTarget}>
                    {getTierMessage()}
                  </div>
                </div>
              </div>

              {/* 최근 포인트 내역 */}
              <div>
                <h3 className={styles.sectionTitle}>
                  최근 6개월 내 포인트 적립/사용 내역
                  <Link href="/mypage/points" className={styles.viewAllLink}>
                    전체 포인트 조회 <ChevronRight size={16} />
                  </Link>
                </h3>

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
                        filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
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
                            최근 6개월 내 포인트 내역이 없습니다.
                          </td>
                        </tr>
                      )}

                  {/* 페이지네이션 컨트롤 */}
                  <tr>
                    <td colSpan={6} className="pt-4 pb-2 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                          이전
                        </button>
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            className={`px-2 py-1 border rounded text-sm font-medium transition-colors duration-150 ${pageNum === currentPage ? "bg-black text-white" : "bg-white text-black"}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                          다음
                        </button>
                      </div>
                    </td>
                  </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}