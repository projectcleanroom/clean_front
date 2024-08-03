import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import axios, { AxiosInstance } from 'axios';

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
    if(accessToken){
      localStorage.setItem('token', accessToken)
    } else {
      localStorage.removeItem('token')
    }
    if(refreshToken){
      localStorage.setItem('refreshToken', refreshToken)
    } else {
      localStorage.removeItem('refreshToken')
    }
  };

  const login = (newToken: string, newRefreshToken: string): void => {
    setTokens(newToken, newRefreshToken);
  };

  const logout = useCallback((): void => {
    setTokens(null, null);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken')
    if (storedToken && isTokenValid(storedToken)) {
      setTokens(storedToken, storedRefreshToken);
      setIsAuthenticated(true);
    } else {
      logout();
    }
    setIsLoading(false);
  }, [logout]);

  const refreshAccessToken = async (): Promise<string> => {
    try {
      const response = await axios.post(`/refresh`, {
        refreshToken,
      });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
      throw new Error('Session expired. Please login again.');
    }
  };

  const authAxios = axios.create({
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
  });

  authAxios.interceptors.request.use(
    (config) => {
      if(token){
        config.headers['Authorization'] = `Bearer ${token}`
      }
      console.log('Request config:', config);
      return config
    },
    (error) => Promise.reject(error)
  );

  authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if(error.response?.status === 401 && refreshToken){
        try {
          const newToken = await refreshAccessToken()
          error.config.headers['Authorization'] = `Bearer ${newToken}`
          return authAxios(error.config)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }
      return Promise.reject(error)
    }
  )

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
