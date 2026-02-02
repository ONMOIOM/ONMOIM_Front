// Axios 기본 설정 (BaseURL, Header 등)
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4010", // 지금은 Prism Mock 서버
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // ✅ refreshToken이 쿠키면 나중에 켜기
  // withCredentials: true,
});

// ✅ 요청 인터셉터: accessToken 있으면만 붙이기 (dummy 토큰 제거)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      // 토큰이 없으면 Authorization 자체를 보내지 않는 게 정상
      if (config.headers?.Authorization) {
        delete config.headers.Authorization;
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ✅ 응답 인터셉터: 401이면 accessToken 제거 (리다이렉트는 라우터/가드에서)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
