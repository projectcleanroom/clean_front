import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axiosConfig';
import { Member } from '../types/member';

export interface AuthContextType {
  isAuthenticated: boolean;
  member: Member | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get<Member>('/members/profile');
      setMember(response.data);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      // 에러 처리 (예: 토큰이 유효하지 않은 경우 로그아웃)
      logout();
    }
  };

  const login = (token: string, refreshToken: string) => {
    console.log('Received tokens:', token, refreshToken);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
    fetchProfile();
    // 프로필 정보를 즉시 가져오지 않고, 필요할 때 fetchProfile을 호출하도록 변경
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setMember(null);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    member,
    login,
    logout,
    fetchProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
