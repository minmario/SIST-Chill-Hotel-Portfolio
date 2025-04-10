"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { CreditCard, Search, Filter, Eye, CheckCircle, XCircle, Clock } from "lucide-react"

// 결제 상태 타입
type PaymentStatus = "completed" | "pending" | "failed" | "refunded"

// 결제 방법 타입
type PaymentMethod = "credit_card" | "bank_transfer" | "paypal" | "point"

// 결제 타입
type PaymentType = "reservation" | "membership" | "gift_shop" | "dining"

// 결제 내역 타입
interface Payment {
  id: string
  customerId: string
  customerName: string
  amount: number
  status: PaymentStatus
  method: PaymentMethod
  type: PaymentType
  date: string
  reference: string
  email: string
  phone: string
  details: {
    items?: Array<{
      name: string
      quantity: number
      price: number
    }>
    reservationId?: string
    membershipId?: string
    orderId?: string
  }
}

// 더미 데이터 생성
const generateDummyPayments = (): Payment[] => {
  const paymentTypes: PaymentType[] = ["reservation", "membership", "gift_shop", "dining"]
  const paymentMethods: PaymentMethod[] = ["credit_card", "bank_transfer", "paypal", "point"]
  const paymentStatuses: PaymentStatus[] = ["completed", "pending", "failed", "refunded"]

  return Array.from({ length: 50 }, (_, i) => {
    const type = paymentTypes[Math.floor(Math.random() * paymentTypes.length)]
    const amount = Math.floor(Math.random() * 1000000) + 50000 // 5만원 ~ 105만원

    return {
      id: `PAY-${String(i + 1).padStart(5, "0")}`,
      customerId: `CUST-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      customerName: `고객 ${i + 1}`,
      amount,
      status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      type,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      reference: `REF-${String(Math.floor(Math.random() * 10000)).padStart(5, "0")}`,
      email: `customer${i + 1}@example.com`,
      phone: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
      details: {
        items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
          name: `상품 ${j + 1}`,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: Math.floor(Math.random() * 100000) + 10000,
        })),
        ...(type === "reservation"
          ? { reservationId: `RES-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}` }
          : {}),
        ...(type === "membership"
          ? { membershipId: `MEM-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}` }
          : {}),
        ...(type === "gift_shop"
          ? { orderId: `ORD-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}` }
          : {}),
      },
    }
  })
}

// 결제 상태에 따른 배지 컴포넌트
const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const statusConfig = {
    completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    failed: { color: "bg-red-100 text-red-800", icon: XCircle },
    refunded: { color: "bg-gray-100 text-gray-800", icon: CreditCard },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>
        {status === "completed" && "결제 완료"}
        {status === "pending" && "결제 대기"}
        {status === "failed" && "결제 실패"}
        {status === "refunded" && "환불 완료"}
      </span>
    </div>
  )
}

// 결제 방법 표시 컴포넌트
const PaymentMethodDisplay = ({ method }: { method: PaymentMethod }) => {
  const methodNames = {
    credit_card: "신용카드",
    bank_transfer: "계좌이체",
    paypal: "페이팔",
    point: "포인트 결제",
  }

  return <span>{methodNames[method]}</span>
}

// 결제 유형 표시 컴포넌트
const PaymentTypeDisplay = ({ type }: { type: PaymentType }) => {
  const typeNames = {
    reservation: "객실 예약",
    membership: "멤버십 가입",
    gift_shop: "기프트샵",
    dining: "다이닝",
  }

  return <span>{typeNames[type]}</span>
}

// 금액 포맷팅 함수
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount)
}

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(generateDummyPayments())
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all")
  const [typeFilter, setTypeFilter] = useState<PaymentType | "all">("all")

  const itemsPerPage = 10

  // 필터링 및 검색 적용
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesType = typeFilter === "all" || payment.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // 페이지네이션 적용
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">결제 내역</h1>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="결제 ID, 고객명, 이메일 검색"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-4 h-4" />
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | "all")}
          >
            <option value="all">모든 상태</option>
            <option value="completed">결제 완료</option>
            <option value="pending">결제 대기</option>
            <option value="failed">결제 실패</option>
            <option value="refunded">환불 완료</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-4 h-4" />
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as PaymentType | "all")}
          >
            <option value="all">모든 유형</option>
            <option value="reservation">객실 예약</option>
            <option value="membership">멤버십 가입</option>
            <option value="gift_shop">기프트샵</option>
            <option value="dining">다이닝</option>
          </select>
        </div>
      </div>

      {/* 결제 내역 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">결제 ID</TableHead>
              <TableHead>고객명</TableHead>
              <TableHead>결제 유형</TableHead>
              <TableHead>결제 금액</TableHead>
              <TableHead>결제 방법</TableHead>
              <TableHead>결제 상태</TableHead>
              <TableHead>결제 일자</TableHead>
              <TableHead className="text-right">상세보기</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>
                    <PaymentTypeDisplay type={payment.type} />
                  </TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <PaymentMethodDisplay method={payment.method} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          상세보기
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200
                         max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>결제 상세 정보</DialogTitle>
                        </DialogHeader>
                        {selectedPayment && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">결제 ID</h3>
                                <p className="mt-1">{selectedPayment.id}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">결제 상태</h3>
                                <div className="mt-1">
                                  <StatusBadge status={selectedPayment.status} />
                                </div>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">결제 금액</h3>
                                <p className="mt-1 font-semibold">{formatCurrency(selectedPayment.amount)}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">결제 일자</h3>
                                <p className="mt-1">{selectedPayment.date}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">결제 방법</h3>
                                <p className="mt-1">
                                  <PaymentMethodDisplay method={selectedPayment.method} />
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">결제 유형</h3>
                                <p className="mt-1">
                                  <PaymentTypeDisplay type={selectedPayment.type} />
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500">참조 번호</h3>
                                <p className="mt-1">{selectedPayment.reference}</p>
                              </div>
                              {selectedPayment.type === "reservation" && selectedPayment.details.reservationId && (
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">예약 ID</h3>
                                  <p className="mt-1">{selectedPayment.details.reservationId}</p>
                                </div>
                              )}
                              {selectedPayment.type === "membership" && selectedPayment.details.membershipId && (
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">멤버십 ID</h3>
                                  <p className="mt-1">{selectedPayment.details.membershipId}</p>
                                </div>
                              )}
                              {selectedPayment.type === "gift_shop" && selectedPayment.details.orderId && (
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">주문 ID</h3>
                                  <p className="mt-1">{selectedPayment.details.orderId}</p>
                                </div>
                              )}
                            </div>

                            <div className="border-t pt-4">
                              <h3 className="text-sm font-medium text-gray-500 mb-2">고객 정보</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-xs font-medium text-gray-500">고객 ID</h4>
                                  <p className="mt-1">{selectedPayment.customerId}</p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-medium text-gray-500">고객명</h4>
                                  <p className="mt-1">{selectedPayment.customerName}</p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-medium text-gray-500">이메일</h4>
                                  <p className="mt-1">{selectedPayment.email}</p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-medium text-gray-500">전화번호</h4>
                                  <p className="mt-1">{selectedPayment.phone}</p>
                                </div>
                              </div>
                            </div>

                            {selectedPayment.details.items && selectedPayment.details.items.length > 0 && (
                              <div className="border-t pt-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">결제 항목</h3>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>항목</TableHead>
                                      <TableHead className="text-right">수량</TableHead>
                                      <TableHead className="text-right">가격</TableHead>
                                      <TableHead className="text-right">소계</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedPayment.details.items.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                        <TableCell className="text-right">
                                          {formatCurrency(item.price * item.quantity)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow>
                                      <TableCell colSpan={3} className="text-right font-medium">
                                        총액
                                      </TableCell>
                                      <TableCell className="text-right font-bold">
                                        {formatCurrency(selectedPayment.amount)}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            )}

                            <div className="flex justify-end gap-2">
                              {selectedPayment.status === "completed" && (
                                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                  환불 처리
                                </button>
                              )}
                              {selectedPayment.status === "pending" && (
                                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                  결제 승인
                                </button>
                              )}
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                영수증 출력
                              </button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {filteredPayments.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) handlePageChange(currentPage - 1)
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // 현재 페이지 주변의 페이지만 표시
                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
              })
              .map((page, i, array) => {
                // 생략 부분 표시
                if (i > 0 && array[i - 1] !== page - 1) {
                  return (
                    <PaginationItem key={`ellipsis-${page}`}>
                      <span className="px-4 py-2">...</span>
                    </PaginationItem>
                  )
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page)
                      }}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) handlePageChange(currentPage + 1)
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

