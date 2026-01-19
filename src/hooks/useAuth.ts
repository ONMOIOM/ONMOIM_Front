// 전역 커스텀 훅 - 인증 관련
import { useState, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';

interface UseAuthReturn {
  user: ReturnType<typeof useUserStore>['user'];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const { user, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 토큰 확인 및 사용자 정보 로드
    const token = localStorage.getItem('token');
    if (token) {
      // 사용자 정보 로드 로직
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // 로그인 로직
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    clearUser();
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
};
