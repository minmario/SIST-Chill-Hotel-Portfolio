"use client"

import { useState, useEffect } from "react"
import { Search, Filter, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button";
import PaginationButtons from "./PaginationButtons";
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

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
  userIdx?: number
}

// 서버 로그 인터페이스 정의
interface UserActivityLog {
  logIdx: number
  userIdx: number
  userName: string
  userId: string // 사용자 ID 필드 추가
  activityType: string
  activityDetails: string
  ipAddress: string | null
  createdAt: string
}

// 액티비티 타입에 따른 액션 타입 매핑
const mapActivityTypeToActionType = (activityType: string): ActionType => {
  switch (activityType) {
    case 'HOTEL_RESERVATION':
    case 'DINING_RESERVATION':
    case 'PAYMENT':
      return 'c'
    case 'PASSWORD_CHANGE':
      return 'u'
    case 'PAYMENT_CANCEL':
    case 'ACCOUNT_DELETE':
    case 'LOGOUT':
      return 'd'
    default:
      return 'c'
  }
}

// 액티비티 타입에 따른 로그 타입 매핑
const mapActivityTypeToLogType = (activityType: string): LogType => {
  return 'user'
}

// 서버 로그를 화면 로그로 변환
const convertServerLogToLogEntry = (log: UserActivityLog): LogEntry => {
  return {
    idx: log.logIdx,
    log_type: mapActivityTypeToLogType(log.activityType),
    type: mapActivityTypeToActionType(log.activityType),
    descript: log.activityDetails,
    date: new Date(log.createdAt),
    ip: log.ipAddress || undefined,
    id: log.userId || log.userName,
    userIdx: log.userIdx
  }
}

// 액션 타입 배지 표시
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

const formatDate = (date: Date) => {
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function LogPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10 // 한 페이지당 표시할 로그 수
  const [logs, setLogs] = useState<LogEntry[]>([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 각 탭별 필터 상태 관리
  const [allTabFilters, setAllTabFilters] = useState({
    logType: "all",
    actionType: "all",
    user: "all", // 테이블 대신 user 필드로 변경
  })

  const [userTabFilters, setUserTabFilters] = useState({
    actionType: "all",
    user: "all", // 테이블 대신 user 필드로 변경
  })

  const [staffTabFilters, setStaffTabFilters] = useState({
    actionType: "all",
    user: "all", // 테이블 대신 user 필드로 변경
  })

  // 관리자 탭 필터 추가
  const [adminTabFilters, setAdminTabFilters] = useState({
    actionType: "all",
    user: "all", // 테이블 대신 user 필드로 변경
  })
  
  // 고유한 사용자 목록
  const uniqueUsers = Array.from(new Set(logs.map((log) => log.userIdx)))
    .filter(Boolean)
    .map(id => id!.toString()) // number | undefined 타입을 string으로 변환
  
  // 전체 로그 필터링
  const filteredAllLogs = logs.filter((log) => {
    // ID로만 검색
    const matchesSearch = searchTerm === "" || (log.id && log.id.toLowerCase().includes(searchTerm.toLowerCase()))

    // 로그 타입 필터 (user/staff/admin)
    const matchesLogType = allTabFilters.logType === "all" || log.log_type === allTabFilters.logType

    // 액션 타입 필터 (c/u/d)
    const matchesActionType = allTabFilters.actionType === "all" || log.type === allTabFilters.actionType

    // 사용자 필터
    const matchesUser = allTabFilters.user === "all" || (log.userIdx !== undefined && log.userIdx.toString() === allTabFilters.user)

    return matchesSearch && matchesLogType && matchesActionType && matchesUser
  })
  
  // 회원 로그 필터링
  const filteredUserLogs = logs
    .filter((log) => {
      // 회원 로그만 필터링
      if (log.log_type !== "user") return false

      // ID로만 검색
      const matchesSearch = searchTerm === "" || (log.id && log.id.toLowerCase().includes(searchTerm.toLowerCase()))

      // 액션 타입 필터 (c/u/d)
      const matchesActionType = userTabFilters.actionType === "all" || log.type === userTabFilters.actionType

      // 사용자 필터
      const matchesUser = userTabFilters.user === "all" || (log.userIdx !== undefined && log.userIdx.toString() === userTabFilters.user)

      return matchesSearch && matchesActionType && matchesUser
    })
    // 날짜 내림차순 정렬 (최신순)
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  // 페이징된 회원 로그 목록
  const paginatedUserLogs = filteredUserLogs.slice((currentPage - 1) * perPage, currentPage * perPage)
  
  // 스태프 로그 필터링
  const filteredStaffLogs = logs
    .filter((log) => {
      // 스태프 로그만 필터링
      if (log.log_type !== "staff") return false

      // ID로만 검색
      const matchesSearch = searchTerm === "" || (log.id && log.id.toLowerCase().includes(searchTerm.toLowerCase()))

      // 액션 타입 필터 (c/u/d)
      const matchesActionType = staffTabFilters.actionType === "all" || log.type === staffTabFilters.actionType

      // 사용자 필터
      const matchesUser = staffTabFilters.user === "all" || (log.userIdx !== undefined && log.userIdx.toString() === staffTabFilters.user)

      return matchesSearch && matchesActionType && matchesUser
    })
    // 날짜 내림차순 정렬 (최신순)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
  
  // 페이징된 스태프 로그 목록
  const paginatedStaffLogs = filteredStaffLogs.slice((currentPage - 1) * perPage, currentPage * perPage)
  
  // 관리자 로그 필터링
  const filteredAdminLogs = logs
    .filter((log) => {
      // 관리자 로그만 필터링
      if (log.log_type !== "admin") return false

      // ID로만 검색
      const matchesSearch = searchTerm === "" || (log.id && log.id.toLowerCase().includes(searchTerm.toLowerCase()))

      // 액션 타입 필터 (c/u/d)
      const matchesActionType = adminTabFilters.actionType === "all" || log.type === adminTabFilters.actionType

      // 사용자 필터
      const matchesUser = adminTabFilters.user === "all" || (log.userIdx !== undefined && log.userIdx.toString() === adminTabFilters.user)

      return matchesSearch && matchesActionType && matchesUser
    })
    // 날짜 내림차순 정렬 (최신순)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
  
  // 페이징된 관리자 로그 목록
  const paginatedAdminLogs = filteredAdminLogs.slice((currentPage - 1) * perPage, currentPage * perPage)

  // 각 탭별 totalPages 계산
  const totalAllPages = Math.max(1, Math.ceil(filteredAllLogs.length / perPage));
  const totalUserPages = Math.max(1, Math.ceil(filteredUserLogs.length / perPage));
  const totalStaffPages = Math.max(1, Math.ceil(filteredStaffLogs.length / perPage));
  const totalAdminPages = Math.max(1, Math.ceil(filteredAdminLogs.length / perPage));

  // 실제 서버에서 로그 데이터를 가져오는 함수
  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setError('인증 토큰이 없습니다. 관리자로 로그인해주세요.')
        setLoading(false)
        return
      }
      
      console.log('로그 API 요청 시작: /api/user/activity/logs')
      const response = await axios.get<UserActivityLog[]>('/api/user/activity/logs', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          includeUserDetails: true // 사용자 ID 정보 포함 요청
        }
      })
      console.log('로그 API 응답 완료:', response.status)
      
      const convertedLogs = response.data.map(convertServerLogToLogEntry)
      setLogs(convertedLogs)
    } catch (err) {
      console.error('로그 데이터 로드 실패:', err)
      if (axios.isAxiosError(err)) {
        console.error('API 오류 상세:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url
        })
      }
      setError('로그 데이터를 불러오는데 실패했습니다.')
      
      // 서버 연결 실패시 샘플 데이터로 대체 (개발 및 테스트용)
      const sampleLogs = generateSampleLogs()
      setLogs(sampleLogs)
    } finally {
      setLoading(false)
    }
  }
  
  // 컴포넌트 마운트 시 로그 데이터 로드
  useEffect(() => {
    fetchLogs()
  }, [])

  // 로그 데이터 새로고침
  const refreshLogs = () => {
    fetchLogs()
  }

  // 페이지 이동 핸들러
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  // totalPages 계산
  const getFilteredLogsForActiveTab = () => {
    if (activeTab === 0) return filteredAllLogs
    if (activeTab === 1) return filteredUserLogs
    if (activeTab === 2) return filteredStaffLogs
    return filteredAdminLogs
  }

  const [filterType, setFilterType] = useState<string | undefined>()
  const [filterAction, setFilterAction] = useState<string | undefined>()
  
  // 필터링된 로그 목록
  const filteredLogs = logs
    .filter((log) => {
      // 검색어 필터
      const searchTermLower = searchTerm.toLowerCase()
      return (
        searchTerm === "" ||
        log.descript.toLowerCase().includes(searchTermLower) ||
        (log.id && log.id.toLowerCase().includes(searchTermLower)) ||
        (log.ip && log.ip.includes(searchTerm))
      )
    })
    .filter((log) => {
      // 로그 타입 필터
      return !filterType || log.log_type === filterType
    })
    .filter((log) => {
      // 액션 타입 필터
      return !filterAction || log.type === filterAction
    })
    // 날짜 내림차순 정렬 (최신순)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
  
  // 페이징된 로그 목록
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * perPage, currentPage * perPage)
  
  // 페이지 수
  const totalPages = Math.ceil(filteredLogs.length / perPage)

  const handleLogDetail = (log: LogEntry) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  }

  const closeDetailModal = () => {
    setShowDetailModal(false);
  }

  return (
    <div className="space-y-6">
      {/* 로그 상세 정보 모달 */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 모달 배경 (반투명) */}
          <div 
            className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm" 
            onClick={closeDetailModal}
          />
          
          {/* 모달 컨텐츠 */}
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            {/* 닫기 버튼 */}
            <button 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              onClick={closeDetailModal}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">닫기</span>
            </button>
            
            {/* 모달 헤더 */}
            <div className="mb-5 border-b pb-3">
              <h2 className="text-lg font-semibold">로그 상세 정보</h2>
            </div>
            
            {/* 모달 본문 */}
            <div className="space-y-5">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-semibold text-gray-700">번호</div>
                <div className="col-span-3">{selectedLog.idx}</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="font-semibold text-gray-700">날짜</div>
                <div className="col-span-3 font-mono">{formatDate(selectedLog.date)}</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="font-semibold text-gray-700">사용자 타입</div>
                <div className="col-span-3">
                  {selectedLog.log_type === "user"
                    ? "회원"
                    : selectedLog.log_type === "staff"
                      ? "스태프"
                      : "관리자"}
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="font-semibold text-gray-700">액션 타입</div>
                <div className="col-span-3">
                  {selectedLog.type === "c" ? "생성" : selectedLog.type === "u" ? "수정" : "삭제"}
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="font-semibold text-gray-700">내용</div>
                <div className="col-span-3">{selectedLog.descript}</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="font-semibold text-gray-700">사용자 ID</div>
                <div className="col-span-3">{selectedLog.id || "-"}</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="font-semibold text-gray-700">IP</div>
                <div className="col-span-3">{selectedLog.ip || "-"}</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="font-semibold text-gray-700">사용자 번호</div>
                <div className="col-span-3">{selectedLog.userIdx || "-"}</div>
              </div>
            </div>
            
            {/* 모달 푸터 */}
            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={closeDetailModal}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">시스템 로그</h1>
        <Button variant="outline" size="sm" onClick={refreshLogs}>
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(Number(value))}>
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

              {activeTab === 0 && (
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
                    value={allTabFilters.user}
                    onValueChange={(value) => setAllTabFilters({ ...allTabFilters, user: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="사용자" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueUsers.map((user) => (
                        <SelectItem key={user} value={user}>
                          {user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === 1 && (
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
                    value={userTabFilters.user}
                    onValueChange={(value) => setUserTabFilters({ ...userTabFilters, user: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="사용자" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueUsers.map((user) => (
                        <SelectItem key={user} value={user}>
                          {user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === 2 && (
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
                    value={staffTabFilters.user}
                    onValueChange={(value) => setStaffTabFilters({ ...staffTabFilters, user: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="사용자" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueUsers.map((user) => (
                        <SelectItem key={user} value={user}>
                          {user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === 3 && (
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
                    value={adminTabFilters.user}
                    onValueChange={(value) => setAdminTabFilters({ ...adminTabFilters, user: value })}
                  >
                    <SelectTrigger className="w-[120px] bg-white/90 backdrop-blur-md border border-gray-300 rounded-md">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="사용자" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-md text-sm">
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueUsers.map((user) => (
                        <SelectItem key={user} value={user}>
                          {user}
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
                      <TableHead className="w-[120px]">ID</TableHead>
                      <TableHead className="w-[120px]">IP</TableHead>
                      <TableHead className="w-[80px]">상세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((log) => (
                      <TableRow key={log.idx}>
                        <TableCell>{log.idx}</TableCell>
                        <TableCell className="font-mono text-xs">{formatDate(log.date)}</TableCell>
                        <TableCell>{getUserTypeBadge(log.log_type)}</TableCell>
                        <TableCell>{getActionTypeBadge(log.type)}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{log.descript}</TableCell>
                        <TableCell>{log.id || "-"}</TableCell>
                        <TableCell>{log.ip || "-"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleLogDetail(log)}>
                            보기
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredLogs.length === 0 && (
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
                  총 {filteredLogs.length}개 로그 중 {Math.min(perPage, filteredLogs.length)}개 표시
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={handlePreviousPage}>
                    이전
                  </Button>
                  <PaginationButtons totalPages={totalAllPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                  <Button variant="outline" size="sm" disabled={currentPage >= totalAllPages} onClick={handleNextPage}>
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
                      <TableHead className="w-[120px]">ID</TableHead>
                      <TableHead className="w-[120px]">IP</TableHead>
                      <TableHead className="w-[80px]">상세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUserLogs.map((log) => (
                      <TableRow key={log.idx}>
                        <TableCell>{log.idx}</TableCell>
                        <TableCell className="font-mono text-xs">{formatDate(log.date)}</TableCell>
                        <TableCell>{getActionTypeBadge(log.type)}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{log.descript}</TableCell>
                        <TableCell>{log.id || "-"}</TableCell>
                        <TableCell>{log.ip || "-"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleLogDetail(log)}>
                            보기
                          </Button>
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
                  총 {filteredUserLogs.length}개 로그 중 {Math.min(perPage, filteredUserLogs.length)}개 표시
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={handlePreviousPage}>
                    이전
                  </Button>
                  <PaginationButtons totalPages={totalUserPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                  <Button variant="outline" size="sm" disabled={currentPage >= totalUserPages} onClick={handleNextPage}>
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
                      <TableHead className="w-[120px]">ID</TableHead>
                      <TableHead className="w-[120px]">IP</TableHead>
                      <TableHead className="w-[80px]">상세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStaffLogs.map((log) => (
                      <TableRow key={log.idx}>
                        <TableCell>{log.idx}</TableCell>
                        <TableCell className="font-mono text-xs">{formatDate(log.date)}</TableCell>
                        <TableCell>{getActionTypeBadge(log.type)}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{log.descript}</TableCell>
                        <TableCell>{log.id || "-"}</TableCell>
                        <TableCell>{log.ip || "-"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleLogDetail(log)}>
                            보기
                          </Button>
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
                  총 {filteredStaffLogs.length}개 로그 중 {Math.min(perPage, filteredStaffLogs.length)}개 표시
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={handlePreviousPage}>
                    이전
                  </Button>
                  <PaginationButtons totalPages={totalStaffPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                  <Button variant="outline" size="sm" disabled={currentPage >= totalStaffPages} onClick={handleNextPage}>
                    다음
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">번호</TableHead>
                      <TableHead className="w-[150px]">날짜</TableHead>
                      <TableHead className="w-[80px]">액션</TableHead>
                      <TableHead>내용</TableHead>
                      <TableHead className="w-[120px]">ID</TableHead>
                      <TableHead className="w-[120px]">IP</TableHead>
                      <TableHead className="w-[80px]">상세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAdminLogs.map((log) => (
                      <TableRow key={log.idx}>
                        <TableCell>{log.idx}</TableCell>
                        <TableCell className="font-mono text-xs">{formatDate(log.date)}</TableCell>
                        <TableCell>{getActionTypeBadge(log.type)}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{log.descript}</TableCell>
                        <TableCell>{log.id || "-"}</TableCell>
                        <TableCell>{log.ip || "-"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleLogDetail(log)}>
                            보기
                          </Button>
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
                  총 {filteredAdminLogs.length}개 로그 중 {Math.min(perPage, filteredAdminLogs.length)}개 표시
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={handlePreviousPage}>
                    이전
                  </Button>
                  <PaginationButtons totalPages={totalAdminPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                  <Button variant="outline" size="sm" disabled={currentPage >= totalAdminPages} onClick={handleNextPage}>
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

// 샘플 로그 생성 함수 (서버 연결 실패 시 폴백용)
const generateSampleLogs = (): LogEntry[] => {
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

    // 사용자 번호 랜덤 생성
    const userIdx = Math.floor(Math.random() * 10) + 1;

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
      userIdx
    })
  }

  // 날짜 기준 내림차순 정렬
  return logs.sort((a, b) => b.date.getTime() - a.date.getTime())
}

