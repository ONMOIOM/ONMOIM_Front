// Axios 기본 설정 (BaseURL, Header 등)
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4010";

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", // 서버한테 보낼 때 json 형식으로 보낸다고 알려줌
  },
  // refreshToken이 쿠키
  // withCredentials: true,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 로그인 전(이메일 발송 등)에는 토큰 없음 → Authorization 헤더 추가 안 함
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
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
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
