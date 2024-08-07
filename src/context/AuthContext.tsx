import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axiosConfig';
import { Member } from '../types/member';

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  member: Member | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<Boolean>;
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
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get<Member>('/members/profile');
      setMember(response.data);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        await fetchProfile();
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);
    fetchProfile();
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
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
