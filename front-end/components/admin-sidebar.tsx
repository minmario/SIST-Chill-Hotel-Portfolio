"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, UserCog, LayoutDashboard, Calendar, CreditCard, FileText, Utensils, AlertCircle, Package, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

type MenuItem = {
  title: string
  href: string
  icon: React.ElementType
  section?: string
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  // 객실 관리 메뉴 항목 제거
  // 메뉴 아이템 정의에서 객실 관리 항목을 제거합니다

  // 기존 메뉴 아이템 배열에서 객실 관리 항목을 제거합니다
  const menuItems: MenuItem[] = [
    {
      title: "대시보드",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      section: "대시보드",
    },
    // Only show these items if the user is an admin
    ...(user?.role.toUpperCase() === "ADMIN"
      ? [
          {
            title: "회원 관리",
            href: "/admin/members",
            icon: Users,
            section: "사용자 관리",
          },
          {
            title: "스태프 관리",
            href: "/admin/staff",
            icon: UserCog,
            section: "사용자 관리",
          },
        ]
      : []),
    {
      title: "예약 관리",
      href: "/admin/reservations",
      icon: Calendar,
      section: "시설 관리",
    },
    {
      title: "다이닝 예약 관리",
      href: "/admin/dining",
      icon: Utensils,
      section: "시설 관리",
    },
    {
      title: "기프트샵 관리",
      href: "/admin/giftshop",
      icon: Package,
      section: "시설 관리",
    },
    {
      title: "결제 내역",
      href: "/admin/payments",
      icon: CreditCard,
      section: "매출 관리",
    },
    {
      title: "매출 보고서",
      href: "/admin/reports",
      icon: FileText,
      section: "매출 관리",
    },
    {
      title: "문의 관리",
      href: "/admin/qna",
      icon: Mail,
      section: "고객 문의",
    },
    {
      title: "시스템 로그",
      href: "/admin/log",
      icon: AlertCircle,
      section: "시스템 관리",
    },
  ]

  // 섹션별로 메뉴 아이템 그룹화
  const sections = menuItems.reduce(
    (acc, item) => {
      if (!item.section) return acc

      if (!acc[item.section]) {
        acc[item.section] = []
      }

      acc[item.section].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  return (
    <div className="w-full min-h-screen bg-[#0f172a] text-white flex flex-col">
      <div className="p-6 flex-1 flex flex-col overflow-y-auto">
        <nav className="space-y-5">
          {Object.entries(sections).map(([sectionName, items]) => (
            <div key={sectionName}>
              <h3 className="text-2xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{sectionName}</h3>
              <ul className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-3 py-1.5 rounded-md transition-colors text-sm
                          ${isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"}
                        `}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

