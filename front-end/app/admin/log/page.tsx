"use client"

import { useState } from "react"
import { Search, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// 로그 타입에 "admin" 추가
type LogType = "user" | "staff" | "admin"
type ActionType = "c" | "u" | "d"

interface LogEntry {
  idx: number
  log_type: LogType
  type: ActionType
  descript: string
  date: Date
  ip?: string
  id?: string
  record_id: string
}

const generateSampleLogs = (): LogEntry[] => {
  const tables = ["members", "reservations", "payments", "rooms", "dining", "gift_shop"]
  const userIds = ["user123", "user456", "user789", ""]
  const staffIds = ["staff1", "staff2", "manager1", "manager2"]
  const adminIds = ["admin", "superadmin", "sysadmin", "rootadmin"] // 관리자 ID 추가

  const createDescriptions = [
    "새 회원 등록",
    "예약 생성",
    "결제 정보 추가",
    "객실 정보 추가",
    "다이닝 예약 생성",
    "상품 주문 생성",
  ]

  const updateDescriptions = [
    "회원 정보 수정",
    "예약 정보 변경",
    "결제 상태 업데이트",
    "객실 상태 변경",
    "다이닝 예약 수정",
    "주문 상태 변경",
  ]

  const deleteDescriptions = [
    "회원 탈퇴",
    "예약 취소",
    "결제 정보 삭제",
    "객실 정보 삭제",
    "다이닝 예약 취소",
    "주문 취소",
  ]

  // 관리자 전용 액션 설명 추가
  const adminCreateDescriptions = [
    "새 스태프 계정 생성",
    "시스템 설정 추가",
    "권한 그룹 생성",
    "프로모션 코드 생성",
    "시스템 공지 등록",
  ]

  const adminUpdateDescriptions = [
    "스태프 권한 변경",
    "시스템 설정 변경",
    "권한 그룹 수정",
    "프로모션 코드 수정",
    "시스템 공지 수정",
  ]

  const adminDeleteDescriptions = [
    "스태프 계정 삭제",
    "시스템 설정 삭제",
    "권한 그룹 삭제",
    "프로모션 코드 삭제",
    "시스템 공지 삭제",
  ]

  const logs: LogEntry[] = []

  // 현재 날짜에서 30일 전
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  // 로그 생성
  for (let i = 0; i < 100; i++) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (new Date().getTime() - startDate.getTime()))

    // 로그 타입 랜덤 선택 (user/staff/admin)
    const typeRandom = Math.random()
    let log_type: LogType
    if (typeRandom < 0.4) {
      log_type = "user"
    } else if (typeRandom < 0.7) {
      log_type = "staff"
    } else {
      log_type = "admin"
    }

    // 액션 타입 랜덤 선택 (c/u/d)
    const actionRandom = Math.random()
    let type: ActionType
    let descript: string

    if (actionRandom < 0.4) {
      type = "c"
      if (log_type === "admin") {
        descript = adminCreateDescriptions[Math.floor(Math.random() * adminCreateDescriptions.length)]
      } else {
        descript = createDescriptions[Math.floor(Math.random() * createDescriptions.length)]
      }
    } else if (actionRandom < 0.8) {
      type = "u"
      if (log_type === "admin") {
        descript = adminUpdateDescriptions[Math.floor(Math.random() * adminUpdateDescriptions.length)]
      } else {
        descript = updateDescriptions[Math.floor(Math.random() * updateDescriptions.length)]
      }
    } else {
      type = "d"
      if (log_type === "admin") {
        descript = adminDeleteDescriptions[Math.floor(Math.random() * adminDeleteDescriptions.length)]
      } else {
        descript = deleteDescriptions[Math.floor(Math.random() * deleteDescriptions.length)]
      }
    }

    // 테이블 랜덤 선택
    const record_id = tables[Math.floor(Math.random() * tables.length)]

    // IP 주소 생성 (비회원용)
    const ip = Math.random() < 0.3 ? `192.168.1.${Math.floor(Math.random() * 255)}` : undefined

    // ID 선택
    let id
    if (log_type === "user") {
      id = userIds[Math.floor(Math.random() * userIds.length)]
    } else if (log_type === "staff") {
      id = staffIds[Math.floor(Math.random() * staffIds.length)]
    } else {
      id = adminIds[Math.floor(Math.random() * adminIds.length)]
    }

    logs.push({
      idx: i + 1,
      log_type,
      type,
      descript,
      date: randomDate,
      ip,
      id: id || undefined,
      record_id,
    })
  }

  // 날짜 기준 내림차순 정렬
  return logs.sort((a, b) => b.date.getTime() - a.date.getTime())
}

const getActionTypeBadge = (type: ActionType) => {
  switch (type) {
    case "c":
      return <Badge className="bg-green-500">생성</Badge>
    case "u":
      return <Badge className="bg-blue-500">수정</Badge>
    case "d":
      return <Badge className="bg-red-500">삭제</Badge>
  }
}

// 사용자 타입에 따른 배지 색상 함수 추가
const getUserTypeBadge = (type: LogType) => {
  switch (type) {
    case "user":
      return (
        <Badge variant="outline" className="border-blue-500">
          회원
        </Badge>
      )
    case "staff":
      return (
        <Badge variant="outline" className="border-purple-500">
          스태프
        </Badge>
      )
    case "admin":
      return (
        <Badge variant="outline" className="border-red-500">
          관리자
        </Badge>
      )
  }
}

// 날짜 포맷 함수
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}

export default function LogPage() {
  const [logs] = useState<LogEntry[]>(generateSampleLogs())
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // 각 탭별 필터 상태 관리
  const [allTabFilters, setAllTabFilters] = useState({
    logType: "all",
    actionType: "all",
    table: "all",
  })

  const [userTabFilters, setUserTabFilters] = useState({
    actionType: "all",
    table: "all",
  })

  const [staffTabFilters, setStaffTabFilters] = useState({
    actionType: "all",
    table: "all",
  })

  // 관리자 탭 필터 추가
  const [adminTabFilters, setAdminTabFilters] = useState({
    actionType: "all",
    table: "all",
  })

  // 고유한 테이블 목록
  const uniqueTables = Array.from(new Set(logs.map((log) => log.record_id)))

  // 전체 로그 필터링
  const filteredAllLogs = logs.filter((log) => {
    // ID로만 검색
    const matchesSearch = searchTerm === "" || (log.id && log.id.toLowerCase().includes(searchTerm.toLowerCase()))

    // 로그 타입 필터 (user/staff/admin)
    const matchesLogType = allTabFilters.logType === "all" || log.log_type === allTabFilters.logType

    // 액션 타입 필터 (c/u/d)
    const matchesActionType = allTabFilters.actionType === "all" || log.type === allTabFilters.actionType

    // 테이블 필터
    const matchesTable = allTabFilters.table === "all" || log.record_id === allTabFilters.table

    return matchesSearch && matchesLogType && matchesActionType && matchesTable
  })

  // 회원 로그 필터링
  const filteredUserLogs = logs.filter((log) => {
    // 회원 로그만 필터링
    if (log.log_type !== "user") return false

    // ID로만 검색
    const matchesSearch = searchTerm === "" || (log.id && log.id.toLowerCase().includes(searchTerm.toLowerCase()))

    // 액션 타입 필터 (c/u/d)
    const matchesActionType = userTabFilters.actionType === "all" || log.type === userTabFilters.actionType

    // 테이블 필터
    const matchesTable = userTabFilters.table === "all" || log.record_id === userTabFilters.table

    return matchesSearch && matchesActionType && matchesTable
  })

  // 스태프 로그 필터링
  const filteredStaffLogs = logs.filter((log) => {
    // 스태프 로그만 필터링
    if (log.log_type !== "staff") return false

    // ID로만 검색
    const matchesSearch = searchTerm === "" || (log.id && log.id.toLowerCase().includes(searchTerm.toLowerCase()))

    // 액션 타입 필터 (c/u/d)
    const matchesActionType = staffTabFilters.actionType === "all" || log.type === staffTabFilters.actionType

    // 테이블 필터
    const matchesTable = staffTabFilters.table === "all" || log.record_id === staffTabFilters.table

    return matchesSearch && matchesActionType && matchesTable
  })

  // 관리자 로그 필터링
  const filteredAdminLogs = logs.filter((log) => {
    // 관리자 로그만 필터링
    if (log.log_type !== "admin") return false

    // ID로만 검색
    const matchesSearch = searchTerm === "" || (log.id && log.id.toLowerCase().includes(searchTerm.toLowerCase()))

    // 액션 타입 필터 (c/u/d)
    const matchesActionType = adminTabFilters.actionType === "all" || log.type === adminTabFilters.actionType

    // 테이블 필터
    const matchesTable = adminTabFilters.table === "all" || log.record_id === adminTabFilters.table

    return matchesSearch && matchesActionType && matchesTable
  })

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">시스템 로그</h1>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value)}>
        <div className="mb-4">
          <TabsList>
            <TabsTrigger value="all">전체 로그</TabsTrigger>
            <TabsTrigger value="user">회원 활동</TabsTrigger>
            <TabsTrigger value="staff">스태프 활동</TabsTrigger>
            <TabsTrigger value="admin">관리자 활동</TabsTrigger>
          </TabsList>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>로그 조회</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="ID로 검색..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {activeTab === "all" && (
                <div className="flex gap-2">
                  <Select
                    value={allTabFilters.logType}
                    onValueChange={(value) => setAllTabFilters({ ...allTabFilters, logType: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="사용자 타입" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="user">회원</SelectItem>
                      <SelectItem value="staff">스태프</SelectItem>
                      <SelectItem value="admin">관리자</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={allTabFilters.actionType}
                    onValueChange={(value) => setAllTabFilters({ ...allTabFilters, actionType: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="액션 타입" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="c">생성</SelectItem>
                      <SelectItem value="u">수정</SelectItem>
                      <SelectItem value="d">삭제</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={allTabFilters.table}
                    onValueChange={(value) => setAllTabFilters({ ...allTabFilters, table: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="테이블" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueTables.map((table) => (
                        <SelectItem key={table} value={table}>
                          {table}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === "user" && (
                <div className="flex gap-2">
                  <Select
                    value={userTabFilters.actionType}
                    onValueChange={(value) => setUserTabFilters({ ...userTabFilters, actionType: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="액션 타입" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="c">생성</SelectItem>
                      <SelectItem value="u">수정</SelectItem>
                      <SelectItem value="d">삭제</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={userTabFilters.table}
                    onValueChange={(value) => setUserTabFilters({ ...userTabFilters, table: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="테이블" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueTables.map((table) => (
                        <SelectItem key={table} value={table}>
                          {table}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === "staff" && (
                <div className="flex gap-2">
                  <Select
                    value={staffTabFilters.actionType}
                    onValueChange={(value) => setStaffTabFilters({ ...staffTabFilters, actionType: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="액션 타입" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="c">생성</SelectItem>
                      <SelectItem value="u">수정</SelectItem>
                      <SelectItem value="d">삭제</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={staffTabFilters.table}
                    onValueChange={(value) => setStaffTabFilters({ ...staffTabFilters, table: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="테이블" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueTables.map((table) => (
                        <SelectItem key={table} value={table}>
                          {table}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === "admin" && (
                <div className="flex gap-2">
                  <Select
                    value={adminTabFilters.actionType}
                    onValueChange={(value) => setAdminTabFilters({ ...adminTabFilters, actionType: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="액션 타입" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="c">생성</SelectItem>
                      <SelectItem value="u">수정</SelectItem>
                      <SelectItem value="d">삭제</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={adminTabFilters.table}
                    onValueChange={(value) => setAdminTabFilters({ ...adminTabFilters, table: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="테이블" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueTables.map((table) => (
                        <SelectItem key={table} value={table}>
                          {table}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">번호</TableHead>
                      <TableHead className="w-[150px]">날짜</TableHead>
                      <TableHead className="w-[100px]">사용자 타입</TableHead>
                      <TableHead className="w-[80px]">액션</TableHead>
                      <TableHead>내용</TableHead>
                      <TableHead className="w-[100px]">테이블</TableHead>
                      <TableHead className="w-[120px]">ID</TableHead>
                      <TableHead className="w-[120px]">IP</TableHead>
                      <TableHead className="w-[80px]">상세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAllLogs.slice(0, 20).map((log) => (
                      <TableRow key={log.idx}>
                        <TableCell>{log.idx}</TableCell>
                        <TableCell className="font-mono text-xs">{formatDate(log.date)}</TableCell>
                        <TableCell>{getUserTypeBadge(log.log_type)}</TableCell>
                        <TableCell>{getActionTypeBadge(log.type)}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{log.descript}</TableCell>
                        <TableCell>{log.record_id}</TableCell>
                        <TableCell>{log.id || "-"}</TableCell>
                        <TableCell>{log.ip || "-"}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                                보기
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>로그 상세 정보</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">번호</div>
                                  <div className="col-span-3">{selectedLog?.idx}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">날짜</div>
                                  <div className="col-span-3 font-mono">
                                    {selectedLog && formatDate(selectedLog.date)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">사용자 타입</div>
                                  <div className="col-span-3">
                                    {selectedLog?.log_type === "user"
                                      ? "회원"
                                      : selectedLog?.log_type === "staff"
                                        ? "스태프"
                                        : "관리자"}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">액션 타입</div>
                                  <div className="col-span-3">
                                    {selectedLog?.type === "c" ? "생성" : selectedLog?.type === "u" ? "수정" : "삭제"}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">내용</div>
                                  <div className="col-span-3">{selectedLog?.descript}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">테이블</div>
                                  <div className="col-span-3">{selectedLog?.record_id}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">ID</div>
                                  <div className="col-span-3">{selectedLog?.id || "-"}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">IP</div>
                                  <div className="col-span-3">{selectedLog?.ip || "-"}</div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredAllLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  총 {filteredAllLogs.length}개 로그 중 {Math.min(20, filteredAllLogs.length)}개 표시
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={filteredAllLogs.length <= 20}>
                    이전
                  </Button>
                  <Button variant="outline" size="sm" disabled={filteredAllLogs.length <= 20}>
                    다음
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="user" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">번호</TableHead>
                      <TableHead className="w-[150px]">날짜</TableHead>
                      <TableHead className="w-[80px]">액션</TableHead>
                      <TableHead>내용</TableHead>
                      <TableHead className="w-[100px]">테이블</TableHead>
                      <TableHead className="w-[120px]">ID</TableHead>
                      <TableHead className="w-[120px]">IP</TableHead>
                      <TableHead className="w-[80px]">상세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUserLogs.slice(0, 20).map((log) => (
                      <TableRow key={log.idx}>
                        <TableCell>{log.idx}</TableCell>
                        <TableCell className="font-mono text-xs">{formatDate(log.date)}</TableCell>
                        <TableCell>{getActionTypeBadge(log.type)}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{log.descript}</TableCell>
                        <TableCell>{log.record_id}</TableCell>
                        <TableCell>{log.id || "-"}</TableCell>
                        <TableCell>{log.ip || "-"}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                                보기
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>로그 상세 정보</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">번호</div>
                                  <div className="col-span-3">{selectedLog?.idx}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">날짜</div>
                                  <div className="col-span-3 font-mono">
                                    {selectedLog && formatDate(selectedLog.date)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">사용자 타입</div>
                                  <div className="col-span-3">회원</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">액션 타입</div>
                                  <div className="col-span-3">
                                    {selectedLog?.type === "c" ? "생성" : selectedLog?.type === "u" ? "수정" : "삭제"}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">내용</div>
                                  <div className="col-span-3">{selectedLog?.descript}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">테이블</div>
                                  <div className="col-span-3">{selectedLog?.record_id}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">ID</div>
                                  <div className="col-span-3">{selectedLog?.id || "-"}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">IP</div>
                                  <div className="col-span-3">{selectedLog?.ip || "-"}</div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredUserLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  총 {filteredUserLogs.length}개 로그 중 {Math.min(20, filteredUserLogs.length)}개 표시
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={filteredUserLogs.length <= 20}>
                    이전
                  </Button>
                  <Button variant="outline" size="sm" disabled={filteredUserLogs.length <= 20}>
                    다음
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="staff" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">번호</TableHead>
                      <TableHead className="w-[150px]">날짜</TableHead>
                      <TableHead className="w-[80px]">액션</TableHead>
                      <TableHead>내용</TableHead>
                      <TableHead className="w-[100px]">테이블</TableHead>
                      <TableHead className="w-[120px]">스태프 ID</TableHead>
                      <TableHead className="w-[80px]">상세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaffLogs.slice(0, 20).map((log) => (
                      <TableRow key={log.idx}>
                        <TableCell>{log.idx}</TableCell>
                        <TableCell className="font-mono text-xs">{formatDate(log.date)}</TableCell>
                        <TableCell>{getActionTypeBadge(log.type)}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{log.descript}</TableCell>
                        <TableCell>{log.record_id}</TableCell>
                        <TableCell>{log.id || "-"}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                                보기
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>로그 상세 정보</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">번호</div>
                                  <div className="col-span-3">{selectedLog?.idx}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">날짜</div>
                                  <div className="col-span-3 font-mono">
                                    {selectedLog && formatDate(selectedLog.date)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">사용자 타입</div>
                                  <div className="col-span-3">스태프</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">액션 타입</div>
                                  <div className="col-span-3">
                                    {selectedLog?.type === "c" ? "생성" : selectedLog?.type === "u" ? "수정" : "삭제"}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">내용</div>
                                  <div className="col-span-3">{selectedLog?.descript}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">테이블</div>
                                  <div className="col-span-3">{selectedLog?.record_id}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">스태프 ID</div>
                                  <div className="col-span-3">{selectedLog?.id || "-"}</div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredStaffLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  총 {filteredStaffLogs.length}개 로그 중 {Math.min(20, filteredStaffLogs.length)}개 표시
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={filteredStaffLogs.length <= 20}>
                    이전
                  </Button>
                  <Button variant="outline" size="sm" disabled={filteredStaffLogs.length <= 20}>
                    다음
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* 관리자 활동 탭 추가 */}
            <TabsContent value="admin" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">번호</TableHead>
                      <TableHead className="w-[150px]">날짜</TableHead>
                      <TableHead className="w-[80px]">액션</TableHead>
                      <TableHead>내용</TableHead>
                      <TableHead className="w-[100px]">테이블</TableHead>
                      <TableHead className="w-[120px]">관리자 ID</TableHead>
                      <TableHead className="w-[80px]">상세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdminLogs.slice(0, 20).map((log) => (
                      <TableRow key={log.idx}>
                        <TableCell>{log.idx}</TableCell>
                        <TableCell className="font-mono text-xs">{formatDate(log.date)}</TableCell>
                        <TableCell>{getActionTypeBadge(log.type)}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{log.descript}</TableCell>
                        <TableCell>{log.record_id}</TableCell>
                        <TableCell>{log.id || "-"}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                                보기
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>로그 상세 정보</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">번호</div>
                                  <div className="col-span-3">{selectedLog?.idx}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">날짜</div>
                                  <div className="col-span-3 font-mono">
                                    {selectedLog && formatDate(selectedLog.date)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">사용자 타입</div>
                                  <div className="col-span-3">관리자</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">액션 타입</div>
                                  <div className="col-span-3">
                                    {selectedLog?.type === "c" ? "생성" : selectedLog?.type === "u" ? "수정" : "삭제"}
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">내용</div>
                                  <div className="col-span-3">{selectedLog?.descript}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">테이블</div>
                                  <div className="col-span-3">{selectedLog?.record_id}</div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="font-semibold">관리자 ID</div>
                                  <div className="col-span-3">{selectedLog?.id || "-"}</div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredAdminLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  총 {filteredAdminLogs.length}개 로그 중 {Math.min(20, filteredAdminLogs.length)}개 표시
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={filteredAdminLogs.length <= 20}>
                    이전
                  </Button>
                  <Button variant="outline" size="sm" disabled={filteredAdminLogs.length <= 20}>
                    다음
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}

