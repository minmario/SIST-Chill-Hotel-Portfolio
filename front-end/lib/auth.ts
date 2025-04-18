"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type User = {
  userId: string
  name: string
  email: string
  role: string
}

type AuthState = {
  user: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => {
        console.log("로그인 실행:", user)
        set({ user, isLoggedIn: true })
        return true
      },
      logout: () => {
        console.log("로그아웃 실행")
        set({ user: null, isLoggedIn: false })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

