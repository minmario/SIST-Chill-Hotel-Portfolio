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
      
        // 상태 초기화
        set({ user: null, isLoggedIn: false, accessToken: null })
      
        // localStorage 정리
        localStorage.removeItem("auth-storage")  // zustand persist 저장된 인증정보 삭제
        localStorage.removeItem("accessToken")    // 만약 직접 따로 저장한 accessToken이 있으면 삭제
        localStorage.removeItem("userRole")        // role도 직접 저장했다면 같이 삭제
        localStorage.removeItem("userId")          // userId도 저장했다면 삭제
        
        console.log("🧹 모든 localStorage 관련 항목 제거 완료")
      },
    }),
    {
      name: "auth-storage",
      storage, // ✅ 여기에도 동일한 인스턴스 연결
    }
  )
)