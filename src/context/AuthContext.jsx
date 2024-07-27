import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import axios from 'axios';
import serverUrl from '../redux/config/serverUrl';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenValid = (token) => {
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  };

  const setTokens = (accessToken, refreshToken) => {
    setToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(!!accessToken);
    localStorage.setItem('toekn', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const login = (newToken, newRefreshToken) => {
    setToken(newToken, newRefreshToken);
  };

  const logout = useCallback(() => {
    setTokens(null, null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    // if (storedToken && isTokenValid(storedToken)) {
      if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      logout();
    }
    setIsLoading(false);
  }, [logout]);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${serverUrl}/refresh`, {
        refreshToken,
      });
      const { accessToken, refreshToeken: newRefreshToken } = response.data;
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
      if (error.response.status === 401 && refreshToken) {
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

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, authAxios, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
