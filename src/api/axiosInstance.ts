// Axios 기본 설정 (BaseURL, Header 등)
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4010', //지금은 Prism Mock 서버임
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json', // 서버한테 보낼 때 json 형식으로 보낸다고 알려줌
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 토큰이 있으면 실제 토큰 사용, 없으면 더미 토큰 사용 (임시 조치)
    const token = localStorage.getItem('token') || 'dummy-token-for-dev';
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 401 에러 시 토큰만 제거 (자동 리다이렉트 제거)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
