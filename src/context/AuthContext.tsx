import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import axios, { AxiosInstance } from 'axios';
import serverUrl from '../redux/config/serverUrl';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (newToken: string, newRefreshToken: string) => void;
  logout: () => void;
  authAxios: AxiosInstance;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isTokenValid = (token: string): boolean => {
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  };

  const setTokens = (
    accessToken: string | null,
    refreshToken: string | null,
  ): void => {
    setToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(!!accessToken);
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const login = (newToken: string, newRefreshToken: string): void => {
    setToken(newToken, newRefreshToken);
  };

  const logout = useCallback((): void => {
    setTokens(null, null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && isTokenValid(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      logout();
    }
    setIsLoading(false);
  }, [logout]);

  const refreshAccessToken = async (): Promise<string> => {
    try {
      const response = await axios.post(`${serverUrl}/refresh`, {
        refreshToken,
      });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      setTokens(accessToken, newRefreshToken);
      return accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
      throw new Error('Session expired. Please login again.');
    }
  };

  const authAxios = axios.create({
    baseURL: serverUrl,
  });

  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && refreshToken) {
        try {
          const newToken = await refreshAccessToken();
          error.config.header['Authorization'] = `Bearer ${newToken}`;
          return authAxios(error.comfig);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );

  const contextValue: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    authAxios,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
