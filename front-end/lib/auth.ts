import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type User = {
  userId: string
  name: string
  email: string
  role: string
}

type AuthState = {
  user: User | null
  isLoggedIn: boolean
  accessToken: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

// ✅ 동일한 storage 인스턴스를 persist와 logout에서 함께 사용
const storage = createJSONStorage(() => localStorage)

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      accessToken: null,

      login: (user, token) => {
        console.log("✅ 로그인:", user)
        set({ user, isLoggedIn: true, accessToken: token })
      },

      logout: () => {
        console.log("🚪 로그아웃 실행")
        set({ user: null, isLoggedIn: false, accessToken: null })

        // ✅ 여기서 같은 storage 인스턴스를 사용해야 동작함
        storage?.removeItem("auth-storage")
      },
    }),
    {
      name: "auth-storage",
      storage, // ✅ 여기에도 동일한 인스턴스 연결
    }
  )
)