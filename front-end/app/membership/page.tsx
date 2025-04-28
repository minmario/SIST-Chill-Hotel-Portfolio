"use client"

import { useEffect, useState } from "react"
import { Check, Info, Star, Award, Crown, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import styles from "./membership.module.css"
type MembershipLevel = {
  tier: string
  requiredPoint: number
  requiredStays: number
  membershipNumber: string
  savePercent: number
}
// 등급 데이터

// 포인트 적립/사용 데이터
const pointSources = [
  {
    table: "orders",
    description: "쇼핑몰 상품 주문 시 포인트 적립 또는 사용",
    type: "적립/사용",
    details: "주문 금액의 1~5% 적립 (회원 등급에 따라 다름), 포인트로 결제 가능",
  },
  {
    table: "reservation",
    description: "객실 예약 시 포인트 적립 또는 사용",
    type: "적립/사용",
    details: "객실 요금의 1~5% 적립 (회원 등급에 따라 다름), 포인트로 객실 요금 결제 가능",
  },
  {
    table: "user_activity_log",
    description: "로그인, 출석, 특정 활동에 따른 보상 지급",
    type: "적립",
    details: "로그인 50포인트, 연속 출석 시 추가 보너스, 이벤트 참여 시 포인트 지급",
  },
  {
    table: "membership",
    description: "등급 상승 시 포인트 보너스 지급",
    type: "적립",
    details: "실버 승급 시 5,000포인트, 골드 승급 시 20,000포인트, 플래티넘 승급 시 50,000포인트 보너스",
  },
  {
    table: "gift_shop",
    description: "포인트를 사용한 상품 직접 구매 (포인트몰)",
    type: "사용",
    details: "포인트로 호텔 굿즈, 바우처, 무료 숙박권 등 구매 가능",
  },
  {
    table: "qna",
    description: "문의/리뷰 작성 보상 포인트 지급 (이벤트성)",
    type: "적립",
    details: "호텔 이용 후기 작성 시 500포인트, 상품 리뷰 작성 시 300포인트 적립",
  },
  {
    table: "users",
    description: "회원가입 축하 포인트 적립",
    type: "적립",
    details: "신규 회원가입 시 1,000포인트 적립, 추천인 코드 입력 시 추가 1,000포인트",
  },
  {
    table: "others",
    description: "기타 이벤트 및 프로모션",
    type: "적립/사용",
    details: "시즌별 이벤트, 프로모션, 오류 보상 등 특별 포인트 지급",
  },
]
const getTierColor = (tier: string) => {
  switch (tier) {
    case "BRONZE": return "#CD7F32"
    case "SILVER": return "#C0C0C0"
    case "GOLD": return "#FFD700"
    case "VIP": return "#8A2BE2"
    default: return "#ccc"
  }
}

const getTierIcon = (tier: string) => {
  switch (tier) {
    case "BRONZE": return Star
    case "SILVER": return Star
    case "GOLD": return Award
    case "VIP": return Crown
    default: return Star
  }
}
const tierBenefitsMap: Record<string, string[]> = {
  BRONZE: ["객실 예약 시 3% 할인", "웰컴 드링크 제공", "무료 Wi-Fi"],
  SILVER: [
    "객실 예약 시 5% 할인",
    "웰컴 드링크 제공",
    "무료 Wi-Fi",
    "객실 업그레이드(연 1회)"
  ],
  GOLD: [
    "객실 예약 시 7% 할인",
    "웰컴 드링크 및 과일 제공",
    "무료 Wi-Fi",
    "객실 업그레이드(연 3회)",
    "레이트 체크아웃(월 1회)",
    "무료 조식(연 1회)",
    "오프라인 바우처(연 1회 50$)"
  ],
  VIP: [
    "객실 예약 시 10% 할인",
    "웰컴 패키지 제공 (음료, 과일, 스낵)",
    "무료 Wi-Fi",
    "객실 업그레이드(연 5회)",
    "레이트 체크아웃(월 2회)",
    "무료 조식(연 3회)",
    "오프라인 바우처(연 2회 50$)"
  ],
}
export default function PointSystem() {
  const [membershipLevels, setMembershipLevels] = useState<MembershipLevel[]>([])
  useEffect(() => {
    fetch("/api/membership") // URL은 실제 백엔드 주소로 교체
      .then(res => res.json())
      .then(data => setMembershipLevels(data))
      .catch(err => console.error("멤버십 등급 조회 실패:", err))
  }, [])
  const [expandedSection, setExpandedSection] = useState<string | null>("pointSources")

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <>
  <div className={styles.header} style={{position:'relative', width:'100%', height:'320px', marginBottom:'2rem', overflow:'hidden'}}>
  <Image
    src="/images/membership/membership-banner.png" // ✅ 네가 원하는 이미지 경로
    alt="포인트 및 등급 시스템"
    fill
    style={{objectFit:'cover'}}
    priority
  />
  <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.45)'}} />
  <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',zIndex:2}}>
    <div className="container">
      <h1 style={{color:'#fff',fontSize:'2.7rem',fontWeight:700,marginBottom:'1rem',textShadow:'0 2px 16px rgba(0,0,0,0.5)'}}>포인트 & 등급 시스템</h1>
      <p style={{color:'#fff',fontSize:'1.15rem',fontWeight:400,textAlign:'center',textShadow:'0 2px 12px rgba(0,0,0,0.5)'}}>럭스 호텔의 포인트 적립 방법과 회원 등급 혜택을 알아보세요.</p>
    </div>
  </div>
</div>


      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* 등급 시스템 설명 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("membershipLevels")}
              >
                <h2 className="text-2xl font-bold">회원 등급 시스템</h2>
                {expandedSection === "membershipLevels" ? (
                  <ChevronUp className="h-6 w-6 text-gray-500" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-500" />
                )}
              </div>

              {expandedSection === "membershipLevels" && (
                <div className="mt-6">
                  <p className="text-gray-600 mb-6">
                    럭스 호텔의 회원 등급은 적립 포인트와 숙박 횟수에 따라 결정됩니다. 등급이 올라갈수록 더 많은 할인과
                    혜택을 누릴 수 있습니다.
                  </p>

                  <div className="overflow-x-auto mb-6">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border px-4 py-3 text-left">등급</th>
                            <th className="border px-4 py-3 text-left">필요 포인트</th>
                            <th className="border px-4 py-3 text-left">필요 숙박 수</th>
                            <th className="border px-4 py-3 text-left">할인율</th>
                            <th className="border px-4 py-3 text-left">멤버십 번호</th>
                          </tr>
                        </thead>
                        <tbody>
                          {membershipLevels.map((level, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="border px-4 py-3 font-medium">
                                <div className="flex items-center">
                                  <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: getTierColor(level.tier) }}
                                  ></div>
                                  {level.tier}
                                </div>
                              </td>
                              <td className="border px-4 py-3">
                                {level.requiredPoint.toLocaleString()}P{level.tier !== "BRONZE" ? " 이상" : ""}
                              </td>
                              <td className="border px-4 py-3">
                                {level.requiredStays}회{level.tier !== "BRONZE" ? " 이상" : ""}
                              </td>
                              <td className="border px-4 py-3">{level.savePercent}%</td>
                              <td className="border px-4 py-3">{level.membershipNumber}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  <div className="space-y-8 mt-8">
                    {membershipLevels.map((level, index) => {
                      const color = getTierColor(level.tier)
                      const Icon = getTierIcon(level.tier)
                      const benefits = tierBenefitsMap[level.tier] || []

                      return (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div
                            className="p-4 text-white flex items-center justify-between"
                            style={{ backgroundColor: color }}
                          >
                            <div className="flex items-center">
                              <Icon className="h-6 w-6 mr-2" />
                              <h3 className="text-xl font-bold">{level.tier}</h3>
                            </div>
                            <div className="text-sm">
                              필요 포인트: {level.requiredPoint.toLocaleString()}P{level.tier !== "BRONZE" ? " 이상" : ""}
                            </div>
                          </div>

                          <div className="p-4 bg-white">
                            <h4 className="font-semibold mb-3">등급 혜택</h4>
                            <ul className="space-y-2">
                              {benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start">
                                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800">
                        회원 등급은 포인트 적립 또는 숙박 횟수 중 먼저 달성하는 조건을 기준으로 산정됩니다. 등급은 매월
                        1일에 갱신되며, 한번 획득한 등급은 해당 월부터 다음 등급 산정일까지 유지됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 포인트 적립/사용 방법 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("pointSources")}
              >
                <h2 className="text-2xl font-bold">포인트 적립 및 사용 방법</h2>
                {expandedSection === "pointSources" ? (
                  <ChevronUp className="h-6 w-6 text-gray-500" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-500" />
                )}
              </div>

              {expandedSection === "pointSources" && (
                <div className="mt-6">
                  <p className="text-gray-600 mb-6">
                    럭스 호텔에서는 다양한 활동을 통해 포인트를 적립하고 사용할 수 있습니다. 적립된 포인트는 객실 예약,
                    레스토랑, 스파 등 호텔 내 다양한 서비스 이용 시 현금처럼 사용 가능합니다.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-4 py-3 text-left">테이블명</th>
                          <th className="border px-4 py-3 text-left">포인트 관련 사유 설명</th>
                          <th className="border px-4 py-3 text-left">적립 or 사용</th>
                          <th className="border px-4 py-3 text-left">상세 내용</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pointSources.map((source, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border px-4 py-3">
                              <span className="inline-block bg-gray-200 rounded-md px-3 py-1 text-sm font-medium">
                                {source.table}
                              </span>
                            </td>
                            <td className="border px-4 py-3">{source.description}</td>
                            <td className="border px-4 py-3">
                              <span
                                className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${
                                  source.type === "적립"
                                    ? "bg-green-100 text-green-800"
                                    : source.type === "사용"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {source.type}
                              </span>
                            </td>
                            <td className="border px-4 py-3 text-sm">{source.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6 flex items-start">
                    <Info className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        포인트 유효기간은 적립일로부터 2년입니다. 소멸 예정인 포인트는 매월 이메일로 안내해 드립니다.
                        1,000포인트부터 현금처럼 사용 가능하며, 포인트 1포인트 = 1원으로 환산됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 포인트 계산 예시 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection("pointExamples")}
              >
                <h2 className="text-2xl font-bold">포인트 적립 예시</h2>
                {expandedSection === "pointExamples" ? (
                  <ChevronUp className="h-6 w-6 text-gray-500" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-500" />
                )}
              </div>

              {expandedSection === "pointExamples" && (
                <div className="mt-6">
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">스탠다드 회원 예시</h3>
                      <p className="text-gray-600 mb-3">스탠다드 회원이 200,000원 객실을 예약한 경우:</p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            객실 예약: 200,000원 × 1% = <strong>2,000 포인트</strong> 적립
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            체크인 출석: <strong>50 포인트</strong> 적립
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            호텔 이용 후기 작성: <strong>500 포인트</strong> 적립
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            총 적립 포인트: <strong>2,550 포인트</strong>
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">골드 회원 예시</h3>
                      <p className="text-gray-600 mb-3">
                        골드 회원이 300,000원 객실을 예약하고 레스토랑에서 100,000원 결제한 경우:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            객실 예약: 300,000원 × 3% = <strong>9,000 포인트</strong> 적립
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            레스토랑 이용: 100,000원 × 3% = <strong>3,000 포인트</strong> 적립
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            체크인 출석: <strong>50 포인트</strong> 적립
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            호텔 이용 후기 작성: <strong>500 포인트</strong> 적립
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>
                            총 적립 포인트: <strong>12,550 포인트</strong>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6 flex items-start">
                    <Info className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-800">
                        포인트는 결제 완료 후 자동으로 적립되며, 적립된 포인트는 다음 날부터 사용 가능합니다. 특별
                        프로모션 기간에는 추가 포인트 적립 혜택이 제공될 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  )
}