import { createContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosInstance } from 'axios';
import { Member } from '../types/member';
import api from '../api/axiosConfig';

export interface AuthContextType {
  isAuthenticated: boolean;
  member: Member | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  authAxios: AxiosInstance;
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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchMember(storedToken);
    }
  }, []);

  const fetchMember = async (authToken: string) => {
    try {
      const response = await api.get<Member>('/api/members/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setMember(response.data);
    } catch (error) {
      console.error('Failed to fetch member data:', error);
    }
  };

  const login = (newToken: string, newRefreshToken: string) => {
    console.log('Received tokens:', newToken, newRefreshToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    setToken(newToken);
    setIsAuthenticated(true);
    fetchMember(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setIsAuthenticated(false);
    setMember(null);
  };

  const authAxios = axios.create({
    baseURL: '/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const contextValue: AuthContextType = {
    isAuthenticated,
    member,
    login,
    logout,
    authAxios,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
