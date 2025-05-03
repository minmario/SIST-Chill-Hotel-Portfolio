'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  userId: string | null;
  login: (user: User,token: string) => void;  // ✅ 수정
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 카트 컨텍스트를 위한 순환 참조 방지
let cartClearFunction: (() => void) | null = null;
export const registerCartClear = (clearFn: () => void) => {
  cartClearFunction = clearFn;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 초기화 시작
    const initialize = () => {
      try {
        // 세션 스토리지에 앱 시작 여부를 확인
        const isAppStarted = sessionStorage.getItem('appStarted');
        
        // 앱이 처음 시작되는 경우 (새로운 세션)
        if (!isAppStarted) {
          console.log('[Auth] 앱 첫 시작 감지: 토큰과 장바구니 초기화');
          
          // 로컬 스토리지 정보 제거
          localStorage.removeItem('userName');
          localStorage.removeItem('userToken');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRole');
          
          // 장바구니 데이터 제거
          localStorage.removeItem('guestCart');
          
          // 장바구니 상태 초기화 (등록된 함수가 있으면 호출)
          if (cartClearFunction) {
            cartClearFunction();
          }
          
          // 앱 시작 상태 저장
          sessionStorage.setItem('appStarted', 'true');
        }
        
        // 초기 로드 시 로그인 상태 확인
        const token = localStorage.getItem('accessToken');
        const storedUserId = localStorage.getItem('userId');
        const storedUserRole = localStorage.getItem('userRole');
        
        if (token) {
          console.log('[Auth] 저장된 토큰: ', token);
          console.log('[Auth] 로그인 상태: true');
        } else {
          console.log('[Auth] 저장된 토큰 없음');
          console.log('[Auth] 로그인 상태: false');
        }
        
        if (token && storedUserId && storedUserRole) {
          setIsLoggedIn(true);
          setUserId(storedUserId);
          setUserRole(storedUserRole);
        } else {
          setIsLoggedIn(false);
          setUserId(null);
          setUserRole(null);
        }
      } finally {
        // 초기화 완료 표시
        setInitialized(true);
      }
    };

    initialize();
  }, []);

  const login = (user: User, token: string) => {
    console.log('[Auth] 로그인 시도: ', user);
  
    localStorage.setItem('accessToken', token); // ✅ 실제 토큰 저장
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('userRole', user.role);
  
    setIsLoggedIn(true);
    setUserId(user.userId);
    setUserRole(user.role);
  };

  const logout = async () => {
    console.log('[Auth] 로그아웃 시도');
  
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch('/api/user/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('[Auth] 서버 로그아웃 요청 실패:', error);
    }
  
    // ✅ 상태 확실히 초기화
    localStorage.clear();
    sessionStorage.clear();
  
    setIsLoggedIn(false);
    setUserId(null);
    setUserRole(null);
  
    // ✅ 강제로 "/"로 이동 (새로고침 말고 router로)
    window.location.href = "/";
  };

  // 초기화가 완료되기 전에는 로딩 상태를 반환
  if (!initialized) {
    return (
      <AuthContext.Provider 
        value={{ 
          isLoggedIn: false, 
          userRole: null, 
          userId: null, 
          login,
          logout 
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 