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

// 스태프 타입 정의
type Staff = {
  userIdx: number
  id: string
  name: string
  phone: string
  email: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
  position?: string   // ✅ 추가
  department?: string // ✅ 추가
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
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 7

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

  // 스태프 데이터 로드 (API에서 가져옴)
  useEffect(() => {
    fetch("http://localhost:8080/admin/staff")
      .then(res => res.json())
      .then((data: Staff[]) => setStaffList(data))
      .catch(() => setStaffList([]))
  }, [])

  // 검색 필터링된 스태프 목록
  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.includes(searchTerm) ||
      staff.email.includes(searchTerm) ||
      staff.phone.includes(searchTerm)
  )
  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredStaff.length / pageSize)
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // 검색어나 데이터 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, staffList])

  // 스태프 추가 다이얼로그 열기
  const openAddDialog = () => {
    setStaffForm({
      name: "",
      email: "",
      phone: "",
      position: "스태프",
      department: "일반",
      status: "active",
      role: "staff",
    })
    setIsAddDialogOpen(true)
  }
  const openEditDialog = (staff: Staff) => {
  setSelectedStaff(staff);
  setStaffForm({
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    status: staff.status,
    role: staff.role,
    position: staff.position ?? "스태프",
    department: staff.department ?? "일반"
  });
  setIsEditDialogOpen(true);
};



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
  const handleAddStaff = async () => {
    try {
      await fetch("http://localhost:8080/admin/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: staffForm.email.split("@")[0], // 로그인용 ID: 예시로 이메일 앞부분 사용
          pwd: "default1234",                // 초기 비밀번호 (백엔드에서 암호화됨)
          name: staffForm.name,
          email: staffForm.email,
          phone: staffForm.phone
        })
      });
  
      // 추가 성공 후 목록 다시 불러오기
      const res = await fetch("http://localhost:8080/admin/staff");
      const data = await res.json();
      setStaffList(data);
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("스태프 추가 실패", err);
      alert("스태프 추가 중 오류가 발생했습니다.");
    }
  };
  // 스태프 정보 수정 처리
  const handleUpdateStaff = () => {
    if (!selectedStaff) return

    // 스태프 정보 업데이트 - 이름, 이메일, 전화번호만 업데이트
    const updatedStaffList = staffList.map((staff) =>
      staff.id === selectedStaff.id
        ? {
            ...staff,
            name: staffForm.name,
            email: staffForm.email,
            phone: staffForm.phone,
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
    switch (role.toLowerCase()) {
      case "admin":
        return <Badge className="bg-red-500 text-white hover:bg-red-600">관리자</Badge>
      case "staff":
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">스태프</Badge>
      default:
        return <Badge>알 수 없음</Badge>
    }
  }

  // 날짜 포맷 함수
  function formatDate(dateStr?: string) {
    if (!dateStr) return "없음"
    return new Date(dateStr).toLocaleString("ko-KR")
  }

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">활성</Badge>
      case "INACTIVE":
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
                <TableHead>ID</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>수정일</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStaff.length > 0 ? (
                paginatedStaff.map((staff) => (
                  <TableRow key={staff.userIdx}>
                    <TableCell>{staff.id ?? "없음"}</TableCell>
                    <TableCell>{staff.name ?? "없음"}</TableCell>
                    <TableCell>{staff.phone ?? "없음"}</TableCell>
                    <TableCell>{staff.email ?? "없음"}</TableCell>
                    <TableCell>{getRoleBadge(staff.role) ?? "없음"}</TableCell>
                    <TableCell>{getStatusBadge(staff.status) ?? "없음"}</TableCell>
                    <TableCell>{formatDate(staff.createdAt )?? "없음"}</TableCell>
                    <TableCell>{formatDate(staff.updatedAt )?? "없음"}</TableCell>
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
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        {/* 페이지네이션 UI */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            이전
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              className={currentPage === i + 1 ? "bg-black text-white hover:bg-black" : ""}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            다음
          </Button>
        </div>
      </CardContent>
    </Card>

      {/* 스태프 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="	bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
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
        <DialogContent className="	bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
          <DialogHeader>
            <DialogTitle>스태프 정보 수정</DialogTitle>
            <DialogDescription>스태프의 이름, 이메일, 전화번호 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                이름
              </Label>
              <Input
                id="edit-name"
                value={staffForm.name}
                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                이메일
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                전화번호
              </Label>
              <Input
                id="edit-phone"
                value={staffForm.phone}
                onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                className="col-span-3"
              />
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
        <DialogContent className="	bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
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
                  <strong>전화번호:</strong> {selectedStaff.phone}
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
        <DialogContent className="	bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
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
                <p>
                  <strong>전화번호:</strong> {selectedStaff.phone}
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