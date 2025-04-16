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
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

// 회원 타입 정의
type Member = {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string | null
  updatedAt: string | null
  status: "active" | "inactive"
  membershipLevel: string
  points: number
}

export default function MembersPage() {
  // 회원 목록 상태
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
    membershipLevel: "",
    points: 0,
  })

  // 회원 데이터 로드 (실제로는 API에서 가져와야 함)
  useEffect(() => {
    fetch("http://localhost:8080/api/admin/members")
      .then((res) => res.json())
      .then((data: Member[]) => {
        setMembers(data)
      })
      .catch((err) => {
        console.error("회원 목록 불러오기 실패:", err)
      })
  }, [])

  // 검색 필터링된 회원 목록
  const filteredMembers = members.filter(
    (member) =>
      member.name.includes(searchTerm) || member.email.includes(searchTerm) || member.phone.includes(searchTerm),
  )

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // 한 페이지에 보여줄 회원 수
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirst, indexOfLast);

  // 전체 페이지 수 계산
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage));

  // 검색어가 바뀌면 1페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 회원 수정 다이얼로그 열기
  const openEditDialog = (member: Member) => {
    setSelectedMember(member)
    setEditForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      status: member.status,
      membershipLevel: member.membershipLevel,
      points: member.points,
    })
    setIsEditDialogOpen(true)
  }

  // 회원 삭제 다이얼로그 열기
  const openDeleteDialog = (member: Member) => {
    setSelectedMember(member)
    setIsDeleteDialogOpen(true)
  }

  // 회원 정보 수정 처리
  const handleUpdateMember = () => {
    if (!selectedMember) return

    // 회원 정보 업데이트
    const updatedMembers = members.map((member) =>
      member.id === selectedMember.id
        ? {
            ...member,
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            status: editForm.status as "active" | "inactive",
            membershipLevel: editForm.membershipLevel,
            points: editForm.points,
          }
        : member,
    )

    setMembers(updatedMembers)
    setIsEditDialogOpen(false)
    setSelectedMember(null)
  }

  // 회원 삭제 처리
  const handleDeleteMember = () => {
    if (!selectedMember) return

    // 회원 삭제
    const updatedMembers = members.filter((member) => member.id !== selectedMember.id)
    setMembers(updatedMembers)
    setIsDeleteDialogOpen(false)
    setSelectedMember(null)
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

  // 등급에 따른 색상
  const getMembershipColor = (level: string) => {
    switch (level) {
      case "DIAMOND":
        return "text-blue-500"
      case "GOLD":
        return "text-yellow-500"
      case "SILVER":
        return "text-gray-500"
      case "BRONZE":
        return "text-amber-700"
      default:
        return ""
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">회원 관리</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="회원 검색..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>회원 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>업데이트일</TableHead>
                <TableHead>등급</TableHead>
                <TableHead>포인트</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMembers.length > 0 ? (
                currentMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.createdAt ? member.createdAt.slice(0, 10) : "없음"}</TableCell>
                    <TableCell>{member.updatedAt ? member.updatedAt.slice(0, 10) : "없음"}</TableCell>
                    <TableCell className={getMembershipColor(member.membershipLevel)}>
                      {member.membershipLevel}
                    </TableCell>
                    <TableCell>{member.points.toLocaleString()} P</TableCell>
                    <TableCell>
                      {member.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                          onClick={() => {
                            const updatedMembers = members.map((m) =>
                              m.id === member.id ? { ...m, status: "inactive" as const } : m,
                            )
                            setMembers(updatedMembers)
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
                            const updatedMembers = members.map((m) =>
                              m.id === member.id ? { ...m, status: "active" as const } : m,
                            )
                            setMembers(updatedMembers)
                          }}
                        >
                          비활성
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 페이지네이션 버튼 */}
      <div className="flex justify-center mt-4 gap-2 items-center">
        <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
          이전
        </Button>
        {/* 숫자 버튼 */}
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === currentPage ? "default" : "outline"}
            size="sm"
            className={
              pageNum === currentPage
                ? "font-bold bg-black text-white hover:bg-black"
                : ""
            }
            onClick={() => setCurrentPage(pageNum)}
          >
            {pageNum}
          </Button>
        ))}
        <Button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </div>

      {/* 회원 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>회원 정보 수정</DialogTitle>
            <DialogDescription>회원 정보를 수정합니다. 모든 필드를 올바르게 입력해주세요.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            {/* 상태 변경 드롭다운 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                상태
              </Label>
              <select
                id="status"
                value={editForm.status}
                onChange={async (e) => {
                  const newStatus = e.target.value as "active" | "inactive";
                  setEditForm({ ...editForm, status: newStatus });
                  if (selectedMember) {
                    await fetch(`/api/admin/members/${selectedMember.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...selectedMember, status: newStatus }),
                    });
                  }
                }}
                className="col-span-3 border rounded px-2 py-1"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                이메일
              </Label>
              <Input
                id="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                전화번호
              </Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                상태
              </Label>
              <select
                id="status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="membershipLevel" className="text-right">
                등급
              </Label>
              <select
                id="membershipLevel"
                value={editForm.membershipLevel}
                onChange={(e) => setEditForm({ ...editForm, membershipLevel: e.target.value })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="DIAMOND">DIAMOND</option>
                <option value="GOLD">GOLD</option>
                <option value="SILVER">SILVER</option>
                <option value="BRONZE">BRONZE</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                포인트
              </Label>
              <Input
                id="points"
                type="number"
                value={editForm.points}
                onChange={(e) => setEditForm({ ...editForm, points: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleUpdateMember}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 회원 삭제 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>회원 삭제</DialogTitle>
            <DialogDescription>정말로 이 회원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedMember && (
              <div className="p-4 bg-gray-50 rounded-md">
                <p>
                  <strong>이름:</strong> {selectedMember.name}
                </p>
                <p>
                  <strong>이메일:</strong> {selectedMember.email}
                </p>
                <p>
                  <strong>가입일:</strong> {selectedMember.joinDate}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

