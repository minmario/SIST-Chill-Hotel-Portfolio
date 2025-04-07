"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import styles from "./membership.module.css"

// 멤버십 데이터
const membershipTiers = [
  {
    id: "premium",
    name: "프리미엄 멤버십",
    price: 1000000,
    points: 200000,
    discount: "5%",
    color: "#8B4513", // 브라운 색상
    benefits: [
      "객실 예약 시 5% 할인",
      "프리미엄 어메니티 무료 제공",
      "얼리 체크인 서비스 (가능 시)",
      "웰컴 드링크 제공",
    ],
  },
  {
    id: "vip",
    name: "VIP 멤버십",
    price: 5000000,
    points: 500000,
    discount: "10%",
    color: "#B8860B", // 골드 색상
    benefits: [
      "객실 예약 시 10% 할인",
      "럭셔리 어메니티 무료 제공",
      "레스토랑 다이닝 1회 무료 (2인)",
      "얼리 체크인 및 레이트 체크아웃",
      "웰컴 과일 바구니 및 와인 제공",
      "발렛 파킹 서비스 무료",
    ],
  },
  {
    id: "platinum",
    name: "플래티넘 멤버십",
    price: 10000000,
    points: 1200000,
    discount: "15%",
    color: "#2F4F4F", // 다크 틸 색상
    benefits: [
      "객실 예약 시 15% 할인",
      "최고급 어메니티 무료 제공",
      "레스토랑 다이닝 무제한 10% 할인",
      "스파 트리트먼트 2회 무료 (1인)",
      "프라이빗 체크인/체크아웃",
      "객실 업그레이드 보장 (가능 시)",
      "공항 픽업 서비스 1회 무료",
      "멤버십 전용 컨시어지 서비스",
    ],
  },
]

export default function Membership() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>멤버십</h1>
          <p>럭스 호텔 멤버십에 가입하고 다양한 혜택을 누려보세요.</p>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">멤버십 등급 및 혜택</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              럭스 호텔의 멤버십 프로그램은 고객님께 최상의 서비스와 특별한 혜택을 제공합니다. 다양한 등급의 멤버십
              중에서 원하시는 혜택에 맞는 멤버십을 선택하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {membershipTiers.map((tier) => (
              <div
                key={tier.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:translate-y-[-8px]"
              >
                <div className="p-6 text-white" style={{ backgroundColor: tier.color }}>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold mb-2">{tier.price.toLocaleString()}원</div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm mr-2">즉시 지급 포인트:</span>
                    <span className="font-bold">{tier.points.toLocaleString()} P</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">객실 할인:</span>
                    <span className="font-bold">{tier.discount}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-bold text-lg mb-4">주요 혜택</h4>
                  <ul className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <Check
                          size={18}
                          className="text-primary-color mr-2 mt-0.5 flex-shrink-0"
                          style={{ color: "var(--primary-color)" }}
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="w-full py-3 rounded-md font-medium transition-colors"
                    style={{
                      backgroundColor: tier.color,
                      color: "white",
                    }}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    멤버십 가입하기
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">멤버십 프로그램 안내</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <span
                    className="w-8 h-8 rounded-full bg-primary-color text-white flex items-center justify-center mr-2"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    1
                  </span>
                  멤버십 가입 방법
                </h4>
                <p className="text-gray-600 mb-4">
                  럭스 호텔 멤버십은 온라인 또는 호텔 프론트 데스크에서 가입하실 수 있습니다. 가입 시 회원 정보와 결제
                  정보를 입력하시면 즉시 멤버십 혜택을 이용하실 수 있습니다.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Check
                      size={16}
                      className="text-primary-color mr-2 mt-1"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <span>온라인: 웹사이트에서 멤버십 가입 페이지를 통해 신청</span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      size={16}
                      className="text-primary-color mr-2 mt-1"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <span>오프라인: 호텔 프론트 데스크에서 직원에게 문의</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <span
                    className="w-8 h-8 rounded-full bg-primary-color text-white flex items-center justify-center mr-2"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    2
                  </span>
                  포인트 적립 및 사용
                </h4>
                <p className="text-gray-600 mb-4">
                  멤버십 회원은 호텔 내 모든 서비스 이용 시 포인트를 적립하실 수 있으며, 적립된 포인트는 객실 예약,
                  레스토랑, 스파 등에서 사용하실 수 있습니다.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Check
                      size={16}
                      className="text-primary-color mr-2 mt-1"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <span>객실 이용: 결제 금액의 5% 적립</span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      size={16}
                      className="text-primary-color mr-2 mt-1"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <span>레스토랑 이용: 결제 금액의 3% 적립</span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      size={16}
                      className="text-primary-color mr-2 mt-1"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <span>스파 이용: 결제 금액의 3% 적립</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <span
                    className="w-8 h-8 rounded-full bg-primary-color text-white flex items-center justify-center mr-2"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    3
                  </span>
                  멤버십 유효 기간
                </h4>
                <p className="text-gray-600 mb-4">
                  멤버십은 가입일로부터 1년간 유효하며, 연장을 원하시는 경우 갱신 수수료를 납부하시면 됩니다. 포인트는
                  적립일로부터 2년간 유효합니다.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Check
                      size={16}
                      className="text-primary-color mr-2 mt-1"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <span>멤버십 갱신: 기존 등급의 20% 할인된 가격으로 갱신 가능</span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      size={16}
                      className="text-primary-color mr-2 mt-1"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <span>포인트 소멸 예정 시 이메일로 안내</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <span
                    className="w-8 h-8 rounded-full bg-primary-color text-white flex items-center justify-center mr-2"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    4
                  </span>
                  문의 및 고객 지원
                </h4>
                <p className="text-gray-600 mb-4">
                  멤버십 관련 문의사항은 전용 고객센터를 통해 지원해드립니다. 멤버십 회원을 위한 전담 상담사가 신속하게
                  응대해 드립니다.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Check
                      size={16}
                      className="text-primary-color mr-2 mt-1"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <span>전화: 02-123-4567 (평일 09:00-18:00)</span>
                  </li>
                  <li className="flex items-start">
                    <Check
                      size={16}
                      className="text-primary-color mr-2 mt-1"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <span>이메일: membership@luxehotel.com</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/membership/join"
                className="inline-block px-8 py-3 bg-primary-color text-white rounded-md hover:bg-primary-hover transition-colors"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                멤버십 가입하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 멤버십 가입 모달 */}
      {selectedTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {membershipTiers.find((tier) => tier.id === selectedTier)?.name} 가입
            </h3>
            <p className="text-gray-600 mb-6">선택하신 멤버십에 가입하시려면 로그인 후 진행해주세요.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedTier(null)}
              >
                취소
              </button>
              <Link
                href="/login"
                className="px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-hover transition-colors"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                로그인하기
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

