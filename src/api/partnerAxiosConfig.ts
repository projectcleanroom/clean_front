import axios from 'axios';

const baseURL = import.meta.env.PROD
  ? '/partner'
  : import.meta.env.VITE_PARTNER_API_URL;

const partnerApi = axios.create({ baseURL });

partnerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

partnerApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(`${baseURL}/refresh`, { refreshToken });
        const { token } = res.data;
        localStorage.setItem('token', token);
        partnerApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return partnerApi(originalRequest);
      } catch (refreshError) {
        throw refreshError;
      }
    }
    return Promise.reject(error);
  },
);

export default partnerApi;
