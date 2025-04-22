"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, CreditCard, LogOut, Award, Gift, ChevronRight, Calendar } from "lucide-react"
import styles from "./mypage.module.css"



export default function MyPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [pointSummary, setPointSummary] = useState({
    totalPoints: 0,
    availablePoints: 0,
    expiringPoints: 0,
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

  const fetchSummary = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/user/points/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("요약 정보 응답 오류")
      const data = await res.json()
      setPointSummary(data)
    } catch (err) {
      console.error("요약 정보 fetch 실패:", err)
    }
  }

  const fetchPoints = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/user/points?startDate=${startDateStr}&endDate=${endDateStr}`,
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

  fetchSummary()
  fetchPoints()
}, [router])
  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>마이페이지</h1>
          <p>Chill Haven 회원 정보 및 포인트 현황을 확인하세요.</p>
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
                    테스트 사용자님은{" "}
                    <span className="text-primary-color font-bold" style={{ color: "var(--primary-color)" }}>
                      BRONZE
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
                        strokeDashoffset="322.3"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className={styles.statValue}>
                      0.5
                      <span className={styles.statUnit}>박</span>
                    </div>
                  </div>
                  <div className={styles.statTarget}>SILVER 등급까지 0.5박</div>
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
                        strokeDashoffset="254.5"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className={styles.statValue}>
                      50
                      <span className={styles.statUnit}>P</span>
                    </div>
                  </div>
                  <div className={styles.statTarget}>SILVER 등급까지 50 P</div>
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
                            최근 6개월 내 포인트 내역이 없습니다.
                          </td>
                        </tr>
                      )}
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

