"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Check if the user is an admin
    if (user?.role !== "ADMIN") {
      // Redirect non-admin users to the dashboard
      router.push("/admin")
    }
  }, [user, router])

  // Don't render anything until we've checked permissions
  if (user?.role !== "ADMIN") {
    return null
  }

  return <>{children}</>
}

