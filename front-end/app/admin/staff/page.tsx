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
    // ✅ 추가
  
}



// 부서 목록


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
    id: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    status: "ACTIVE",
    role: "STAFF", // 기본 STAFF
    currentPassword: "",
    newPassword: "",
    confirmPassword: "", // ✅ 여기 추가!
  });
  // 스태프 데이터 로드 (API에서 가져옴)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetch("/api/admin/staff", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then((data: Staff[]) => setStaffList(data))
      .catch(() => setStaffList([]));
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
  const handleStatusToggle = async (staff: Staff, newStatus: string) => {
    const token = localStorage.getItem("accessToken")
    try {
      const res = await fetch(`/api/admin/staff/${staff.userIdx}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("상태 변경 실패")
  
      const updatedList = staffList.map((s) =>
        s.userIdx === staff.userIdx ? { ...s, status: newStatus } : s
      )
      setStaffList(updatedList)
    } catch (err) {
      alert("상태 변경에 실패했습니다.")
    }
  }
  // 스태프 추가 다이얼로그 열기
  const openAddDialog = (role: "ADMIN" | "STAFF" = "STAFF") => {
    setStaffForm({
      id: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      status: "ACTIVE",
      role, // ✅ 동적으로 설정
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsAddDialogOpen(true);
  };
  const openEditDialog = (staff: Staff) => {
    setSelectedStaff(staff);
    setStaffForm({
      id: staff.id,         // ✅ 추가
      password: "",         // ✅ 초기화
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      
    
      status: staff.status,
      role: staff.role,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
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
    const { id, password, name, email, phone } = staffForm;
  
    if (!id || !password || !name || !email || !phone) {
      alert("모든 필수 입력값을 채워주세요.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }
  
    if (password.length < 8) {
      alert("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
  
    if (password !== staffForm.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
  
    const cleanedPhone = phone.replace(/\D/g, "");
    if (!/^\d{10,11}$/.test(cleanedPhone)) {
      alert("전화번호는 숫자만 10~11자리여야 합니다.");
      return;
    }
  
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          pwd: password,
          name,
          email,
          phone: cleanedPhone,
          role: staffForm.role,
          status: staffForm.status,
        }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        if (errorText.includes("이미 존재")) {
          alert("이미 사용 중인 ID 또는 이메일입니다.");
        } else {
          alert("스태프 추가 실패: " + errorText);
        }
        return;
      }
  
      // 추가 성공 후 목록 다시 불러오기
      const refreshed = await fetch("/api/admin/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await refreshed.json();
      setStaffList(data);
      setIsAddDialogOpen(false);
  
    } catch (err) {
      console.error("스태프 추가 실패", err);
      alert("스태프 추가 중 네트워크 오류가 발생했습니다.");
    }
  };
  // 스태프 정보 수정 처리
  const handleUpdateStaff = async () => {
    if (!selectedStaff) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(staffForm.email)) {
    alert("유효한 이메일 주소를 입력해주세요.");
    return;
  }

  const cleanedPhone = staffForm.phone.replace(/\D/g, "");
  if (!/^\d{10,11}$/.test(cleanedPhone)) {
    alert("전화번호는 숫자만 10~11자리여야 합니다.");
    return;
  }
  
    if (!staffForm.email || staffForm.email.trim() === "") {
      alert("이메일은 필수 입력 항목입니다.");
      return;
    }
  
    // 비밀번호 변경 유효성 체크
    const isPasswordChange = staffForm.newPassword || staffForm.confirmPassword;
    if (isPasswordChange) {
      if (!staffForm.currentPassword) {
        alert("기존 비밀번호를 입력하세요.");
        return;
      }
      if (staffForm.newPassword !== staffForm.confirmPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }
    }
  
    try {
      // ✅ 일반 정보 업데이트
      const token = localStorage.getItem("accessToken");
      const updateInfoRes = await fetch(`/api/admin/staff/${selectedStaff.userIdx}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ 추가
        },
        body: JSON.stringify({
          id: staffForm.email.split("@")[0],
          name: staffForm.name,
          email: staffForm.email,
          phone: staffForm.phone,
          status: staffForm.status,
          role: staffForm.role,
        }),
      });
  
      if (!updateInfoRes.ok) {
        const errorText = await updateInfoRes.text();
        console.error("업데이트 실패:", errorText);
        alert("업데이트 실패: " + errorText);
        return;
      }
  
      // ✅ 비밀번호 변경
      if (staffForm.newPassword) {
        const passwordChangeRes = await fetch(`/api/admin/staff/${selectedStaff.userIdx}/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ 추가
          },
          body: JSON.stringify({
            currentPassword: staffForm.currentPassword,
            newPassword: staffForm.newPassword,
          }),
        });
      
        if (!passwordChangeRes.ok) {
          const errorText = await passwordChangeRes.text();
          console.error("비밀번호 변경 실패:", errorText);
          alert("비밀번호 변경 실패: " + errorText);
          return;
        }
      }
  
      // ✅ 성공 후 목록 갱신
      const refreshed = await fetch("/api/admin/staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const list = await refreshed.json();
      setStaffList(list);
      setIsEditDialogOpen(false);
      setSelectedStaff(null);
    } catch (err) {
      console.error("스태프 정보 수정 실패", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };
  // 스태프 삭제 처리
  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;
  
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/admin/staff/${selectedStaff.userIdx}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorJson = await res.json();
        alert(errorJson.message || "오류가 발생했습니다.");
        return;
      }
  
      const updatedList = staffList.filter((staff) => staff.userIdx !== selectedStaff.userIdx);
      setStaffList(updatedList);
      setIsDeleteDialogOpen(false);
      setSelectedStaff(null);
    } catch (err) {
      alert("삭제 중 네트워크 오류가 발생했습니다.");
      console.error(err);
    }
  };
  


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
          <Button
            onClick={() => openAddDialog("STAFF")}
            className="bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            스태프 추가
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>스태프 목록</CardTitle>
        </CardHeader>
        <CardContent className="bg-gray-50 rounded-b-lg">
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
                   
                    <TableCell>
                    {staff.role !== "ADMIN" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          staff.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                        }
                        onClick={() => handleStatusToggle(staff, staff.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                      >
                        {staff.status === "ACTIVE" ? "활성" : "비활성"}
                      </Button>
                    ) : (
                      <Button size ="sm"className="bg-gray-300 text-gray-700 hover:bg-gray-200 border-gray-200">고정</Button> // 버튼 대신 '고정' 뱃지 보여줄 수도 있음
                    )}
                  </TableCell>
                    <TableCell>{formatDate(staff.createdAt )?? "없음"}</TableCell>
                    <TableCell>{formatDate(staff.updatedAt )?? "없음"}</TableCell>
                    <TableCell>
  {staff.role !== "ADMIN" ? (
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
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
              disabled
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
              disabled
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
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
            <DialogTitle>관리자 추가</DialogTitle>
            <DialogDescription>새 관리자 정보를 입력하세요. 모든 필드를 올바르게 입력해주세요.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="add-id" className="text-right">ID</Label>
            <Input
              id="add-id"
              value={staffForm.id}
              onChange={(e) => setStaffForm({ ...staffForm, id: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="add-password" className="text-right">비밀번호</Label>
            <Input
              id="add-password"
              type="password"
              value={staffForm.password}
              onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
  <Label htmlFor="confirm-password" className="text-right">비밀번호 확인</Label>
  <Input
    id="confirm-password"
    type="password"
    value={staffForm.confirmPassword}
    onChange={(e) => setStaffForm({ ...staffForm, confirmPassword: e.target.value })}
    className="col-span-3"
  />
</div>
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
            <Button className="bg-black text-white hover:bg-gray-900" onClick={handleAddStaff}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 스태프 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="	bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 border border-gray-200">
        <DialogHeader>
          <DialogTitle>스태프 정보 수정</DialogTitle>
          <div className="text-sm text-gray-500 mt-1 space-y-1">
            <p>전화번호와 비밀번호를 수정할 수 있습니다.</p>
            <p className="text-gray-400">비밀번호를 변경하려면 기존 비밀번호와 새 비밀번호를 입력해주세요.</p>
          </div>
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
    disabled={selectedStaff?.role === "STAFF"} // ✅ 관리자면 비활성화
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
    disabled={selectedStaff?.role === "STAFF"} // ✅ 관리자면 비활성화
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
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-password" className="text-right">기존 비밀번호</Label>
              <Input
                id="current-password"
                type="password"
                value={staffForm.currentPassword}
                onChange={(e) => setStaffForm({ ...staffForm, currentPassword: e.target.value })}
                className="col-span-3"
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">새 비밀번호</Label>
              <Input
                id="new-password"
                type="password"
                value={staffForm.newPassword}
              onChange={(e) => setStaffForm({ ...staffForm, newPassword: e.target.value })}
              className="col-span-3"
              />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">새 비밀번호 확인</Label>
            <Input
              id="confirm-password"
              type="password"
              value={staffForm.confirmPassword}
              onChange={(e) => setStaffForm({ ...staffForm, confirmPassword: e.target.value })}
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

      
    </div>
  )
}
