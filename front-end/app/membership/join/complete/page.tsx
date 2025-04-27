"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function RegistrationCompletePage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">가입 완료!</CardTitle>
          <CardDescription>회원가입이 성공적으로 완료되었습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">회원 아이디</p>
              <p className="text-xl font-bold">{userId}</p>
            </div>
            <p className="text-sm text-gray-500">이 아이디로 로그인하여 서비스를 이용하실 수 있습니다.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/login">로그인 페이지로 돌아가기</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}