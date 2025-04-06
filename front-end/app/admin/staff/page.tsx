"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, UserPlus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 스태프 타입 정의
type Staff = {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  joinDate: string
  status: "active" | "inactive"
  role: "admin" | "staff"
}

// 직책 목록
const positions = [
  "총괄 매니저",
  "프론트 매니저",
  "하우스키핑 매니저",
  "레스토랑 매니저",
  "스파 테라피스트",
  "시설 관리자",
  "인사 담당자",
  "마케팅 담당자",
  "회계 담당자",
  "예약 담당자",
]

// 부서 목록
const departments = [
  "경영관리",
  "프론트 데스크",
  "하우스키핑",
  "F&B",
  "스파 & 웰니스",
  "시설관리",
  "인사",
  "마케팅",
  "재무",
  "IT",
]

export default function StaffPage() {
  // 스태프 목록 상태
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    status: "active",
    role: "staff",
  })

  // 스태프 데이터 로드 (실제로는 API에서 가져와야 함)
  useEffect(() => {
    // 더미 데이터
    const dummyStaff: Staff[] = [
      {
        id: "1",
        name: "김관리",
        email: "kim.admin@chillhaven.com",
        phone: "010-1111-2222",
        position: "총괄 매니저",
        department: "경영관리",
        joinDate: "2022-01-10",
        status: "active",
        role: "admin",
      },
      {
        id: "2",
        name: "이프론트",
        email: "lee.front@chillhaven.com",
        phone: "010-2222-3333",
        position: "프론트 매니저",
        department: "프론트 데스크",
        joinDate: "2022-03-15",
        status: "active",
        role: "staff",
      },
      {
        id: "3",
        name: "박하우스",
        email: "park.house@chillhaven.com",
        phone: "010-3333-4444",
        position: "하우스키핑 매니저",
        department: "하우스키핑",
        joinDate: "2022-05-20",
        status: "active",
        role: "staff",
      },
      {
        id: "4",
        name: "최레스토랑",
        email: "choi.restaurant@chillhaven.com",
        phone: "010-4444-5555",
        position: "레스토랑 매니저",
        department: "F&B",
        joinDate: "2022-07-25",
        status: "active",
        role: "staff",
      },
      {
        id: "5",
        name: "정스파",
        email: "jung.spa@chillhaven.com",
        phone: "010-5555-6666",
        position: "스파 테라피스트",
        department: "스파 & 웰니스",
        joinDate: "2022-09-30",
        status: "inactive",
        role: "staff",
      },
    ]

    setStaffList(dummyStaff)
  }, [])

  // 검색 필터링된 스태프 목록
  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.includes(searchTerm) ||
      staff.email.includes(searchTerm) ||
      staff.position.includes(searchTerm) ||
      staff.department.includes(searchTerm),
  )

  // 스태프 추가 다이얼로그 열기
  const openAddDialog = () => {
    setStaffForm({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      status: "active",
      role: "staff",
    })
    setIsAddDialogOpen(true)
  }

  // 스태프 수정 다이얼로그 열기
  const openEditDialog = (staff: Staff) => {
    setSelectedStaff(staff)
    setStaffForm({
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      position: staff.position,
      department: staff.department,
      status: staff.status,
      role: staff.role,
    })
    setIsEditDialogOpen(true)
  }

  // 스태프 삭제 다이얼로그 열기
  const openDeleteDialog = (staff: Staff) => {
    setSelectedStaff(staff)
    setIsDeleteDialogOpen(true)
  }

  // 비밀번호 초기화 다이얼로그 열기
  const openResetPasswordDialog = (staff: Staff) => {
    setSelectedStaff(staff)
    setIsResetPasswordDialogOpen(true)
  }

  // 스태프 추가 처리
  const handleAddStaff = () => {
    // 새 스태프 ID 생성 (실제로는 백엔드에서 처리)
    const newId = (staffList.length + 1).toString()

    // 현재 날짜를 가입일로 설정
    const joinDate = new Date().toISOString().split("T")[0]

    // 새 스태프 객체 생성
    const newStaff: Staff = {
      id: newId,
      name: staffForm.name,
      email: staffForm.email,
      phone: staffForm.phone,
      position: staffForm.position,
      department: staffForm.department,
      joinDate,
      status: staffForm.status as "active" | "inactive",
      role: staffForm.role as "admin" | "staff",
    }

    // 스태프 목록에 추가
    setStaffList([...staffList, newStaff])
    setIsAddDialogOpen(false)
  }

  // 스태프 정보 수정 처리
  const handleUpdateStaff = () => {
    if (!selectedStaff) return

    // 스태프 정보 업데이트
    const updatedStaffList = staffList.map((staff) =>
      staff.id === selectedStaff.id
        ? {
            ...staff,
            position: staffForm.position,
            department: staffForm.department,
            role: staffForm.role as "admin" | "staff",
          }
        : staff,
    )

    setStaffList(updatedStaffList)
    setIsEditDialogOpen(false)
    setSelectedStaff(null)
  }

  // 스태프 삭제 처리
  const handleDeleteStaff = () => {
    if (!selectedStaff) return

    // 스태프 삭제
    const updatedStaffList = staffList.filter((staff) => staff.id !== selectedStaff.id)
    setStaffList(updatedStaffList)
    setIsDeleteDialogOpen(false)
    setSelectedStaff(null)
  }

  // 비밀번호 초기화 처리
  const handleResetPassword = () => {
    // 실제로는 API를 통해 비밀번호 초기화 처리
    alert(`${selectedStaff?.name}의 비밀번호가 초기화되었습니다.`)
    setIsResetPasswordDialogOpen(false)
    setSelectedStaff(null)
  }

  // 역할에 따른 배지 색상
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">관리자</Badge>
      case "staff":
        return <Badge className="bg-green-500">스태프</Badge>
      default:
        return <Badge>알 수 없음</Badge>
    }
  }

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">활성</Badge>
      case "inactive":
        return <Badge className="bg-gray-500">비활성</Badge>
      default:
        return <Badge>알 수 없음</Badge>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">스태프 관리</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="스태프 검색..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={openAddDialog}>
            <UserPlus className="mr-2 h-4 w-4" />
            스태프 추가
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>스태프 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>직책</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>입사일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.position}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>{staff.joinDate}</TableCell>
                    <TableCell>{getRoleBadge(staff.role)}</TableCell>
                    <TableCell>
                      {staff.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                          onClick={() => {
                            const updatedStaffList = staffList.map((s) =>
                              s.id === staff.id ? { ...s, status: "inactive" as const } : s,
                            )
                            setStaffList(updatedStaffList)
                          }}
                        >
                          활성
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                          onClick={() => {
                            const updatedStaffList = staffList.map((s) =>
                              s.id === staff.id ? { ...s, status: "active" as const } : s,
                            )
                            setStaffList(updatedStaffList)
                          }}
                        >
                          비활성
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openEditDialog(staff)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">수정</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                          onClick={() => openDeleteDialog(staff)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">삭제</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 스태프 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
          <DialogHeader>
            <DialogTitle>스태프 추가</DialogTitle>
            <DialogDescription>새 스태프 정보를 입력하세요. 모든 필드를 올바르게 입력해주세요.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-name" className="text-right">
                이름
              </Label>
              <Input
                id="add-name"
                value={staffForm.name}
                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-email" className="text-right">
                이메일
              </Label>
              <Input
                id="add-email"
                type="email"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-phone" className="text-right">
                전화번호
              </Label>
              <Input
                id="add-phone"
                value={staffForm.phone}
                onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-position" className="text-right">
                직책
              </Label>
              <Select
                value={staffForm.position}
                onValueChange={(value) => setStaffForm({ ...staffForm, position: value })}
              >
                <SelectTrigger id="add-position" className="col-span-3 h-10 rounded-md border border-gray-300 bg-white/90 backdrop-blur-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="직책 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg rounded-md border border-gray-200 text-sm">
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-department" className="text-right">
                부서
              </Label>
              <Select
                value={staffForm.department}
                onValueChange={(value) => setStaffForm({ ...staffForm, department: value })}
              >
                <SelectTrigger className="col-span-3 h-10 rounded-md border border-gray-300 bg-white/90 backdrop-blur-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" id="add-department" >
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg rounded-md border border-gray-200 text-sm">
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-status" className="text-right">
                상태
              </Label>
              <Select
                value={staffForm.status}
                onValueChange={(value) => setStaffForm({ ...staffForm, status: value as "active" | "inactive" })}
              >
                <SelectTrigger id="add-status" className="col-span-3 h-10 rounded-md border border-gray-300 bg-white/90 backdrop-blur-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg rounded-md border border-gray-200 text-sm">
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-role" className="text-right">
                역할
              </Label>
              <Select
                value={staffForm.role}
                onValueChange={(value) => setStaffForm({ ...staffForm, role: value as "admin" | "staff" })}
              >
                <SelectTrigger id="add-role" className="col-span-3 h-10 rounded-md border border-gray-300 bg-white/90 backdrop-blur-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg rounded-md border border-gray-200 text-sm">
                  <SelectItem value="admin">관리자</SelectItem>
                  <SelectItem value="staff">스태프</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddStaff}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 스태프 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
          <DialogHeader>
            <DialogTitle>스태프 정보 수정</DialogTitle>
            <DialogDescription>스태프의 직책, 부서, 역할 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="p-4 bg-gray-50 rounded-md mb-4">
              <p className="font-medium text-gray-700">
                <strong>이름:</strong> {selectedStaff?.name}
              </p>
              <p className="text-gray-600">
                <strong>이메일:</strong> {selectedStaff?.email}
              </p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-position" className="text-right">
                직책
              </Label>
              <Select
                value={staffForm.position}
                onValueChange={(value) => setStaffForm({ ...staffForm, position: value })}
              >
                <SelectTrigger id="edit-position" className="col-span-3 h-10 rounded-md border border-gray-300 bg-white/90 backdrop-blur-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="직책 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg rounded-md border border-gray-200 text-sm">
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                부서
              </Label>
              <Select
                value={staffForm.department}
                onValueChange={(value) => setStaffForm({ ...staffForm, department: value })}
              >
                <SelectTrigger id="edit-department" className="col-span-3 h-10 rounded-md border border-gray-300 bg-white/90 backdrop-blur-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg rounded-md border border-gray-200 text-sm">
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                역할
              </Label>
              <Select
                value={staffForm.role}
                onValueChange={(value) => setStaffForm({ ...staffForm, role: value as "admin" | "staff" })}
              >
                <SelectTrigger id="edit-role" className="col-span-3 h-10 rounded-md border border-gray-300 bg-white/90 backdrop-blur-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md shadow-lg rounded-md border border-gray-200 text-sm">
                  <SelectItem value="admin">관리자</SelectItem>
                  <SelectItem value="staff">스태프</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleUpdateStaff}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 스태프 삭제 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
          <DialogHeader>
            <DialogTitle>스태프 삭제</DialogTitle>
            <DialogDescription>정말로 이 스태프를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedStaff && (
              <div className="p-4 bg-gray-50 rounded-md">
                <p>
                  <strong>이름:</strong> {selectedStaff.name}
                </p>
                <p>
                  <strong>이메일:</strong> {selectedStaff.email}
                </p>
                <p>
                  <strong>직책:</strong> {selectedStaff.position}
                </p>
                <p>
                  <strong>부서:</strong> {selectedStaff.department}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteStaff}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 비밀번호 초기화 다이얼로그 */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
          <DialogHeader>
            <DialogTitle>비밀번호 초기화</DialogTitle>
            <DialogDescription>
              이 스태프의 비밀번호를 초기화하시겠습니까? 초기화 후 임시 비밀번호가 생성됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedStaff && (
              <div className="p-4 bg-gray-50 rounded-md">
                <p>
                  <strong>이름:</strong> {selectedStaff.name}
                </p>
                <p>
                  <strong>이메일:</strong> {selectedStaff.email}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleResetPassword}>비밀번호 초기화</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

