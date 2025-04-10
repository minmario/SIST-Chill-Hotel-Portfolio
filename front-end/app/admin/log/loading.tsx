import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LogLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-9 w-28" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">전체 로그</TabsTrigger>
            <TabsTrigger value="user">회원 활동</TabsTrigger>
            <TabsTrigger value="staff">스태프 활동</TabsTrigger>
          </TabsList>

          <Skeleton className="h-9 w-28" />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>로그 조회</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Skeleton className="h-10 flex-1" />

              <div className="flex gap-2">
                <Skeleton className="h-10 w-[130px]" />
                <Skeleton className="h-10 w-[130px]" />
              </div>
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
                    {Array(10)
                      .fill(0)
                      .map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-16" />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-5 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}

