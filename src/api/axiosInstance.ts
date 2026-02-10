// Axios 기본 설정 (BaseURL, Header 등)
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4010";

/** API 경로 + 메서드별 한국어 동작 설명 */
const getApiLabel = (method: string, url?: string): string => {
  const m = method?.toUpperCase();
  const u = url ?? "";
  if (u.includes("/auth/email/verification") && m === "POST") return "인증 이메일 발송";
  if (u.includes("/auth/email/verify") && m === "POST") return "이메일 인증 코드 검증";
  if (u.includes("/users/login") && m === "POST") return "로그인";
  if (u.includes("/users/signup") && m === "POST") return "회원가입";
  if (u.includes("/auth/refresh") && m === "POST") return "액세스 토큰 갱신";
  if (u === "/api/v1/users" && m === "GET") return "회원 정보 조회";
  if (u === "/api/v1/users" && m === "PATCH") return "내 프로필 수정";
  if (u.includes("/profile-image") && m === "POST") return "프로필 이미지 변경";
  if (u === "/api/v1/users" && m === "DELETE") return "회원 탈퇴";
  if (u === "/api/v1/users/events" && m === "GET") return "행사 목록 조회";
  if (u.includes("/events/participating") && m === "GET") return "내가 참여한 행사 조회";
  if (u.match(/\/users\/\d+\/events/) && m === "GET") return "내가 참여한 행사 조회 (userId)";
  if (u === "/api/v1/users/events" && m === "POST") return "행사 초안 생성";
  if (u.match(/\/users\/events\/\d+$/) && m === "GET") return "행사 상세 조회";
  if (u.match(/\/users\/events\/\d+$/) && m === "PATCH") return "행사 내용 수정";
  if (u.match(/\/users\/events\/\d+$/) && m === "DELETE") return "행사 삭제";
  if (u.includes("/published") && m === "POST") return "행사 최종 발행";
  if (u.match(/\/users\/events\/\d+\/participants$/) && m === "GET") return "행사 참여자 목록 조회";
  if (u.match(/\/participants\/\d+/) && m === "POST") return "행사 참여 투표";
  if (u.match(/\/events\/\d+\/participants$/) && m === "POST") return "행사 참여 투표 (POST)";
  if (u.includes("/analytics/total") && m === "GET") return "일주일치 통계 조회";
  if (u.match(/\/analytics\/\d+\/session$/) && m === "POST") return "입장 시간 기록";
  if (u.match(/\/analytics\/\d+\/session\/[\w-]+/) && m === "POST") return "퇴장 시간 기록";
  if (u.includes("/comments") && m === "GET") return "댓글 목록 조회";
  if (u.includes("/comments") && m === "POST") return "댓글 작성";
  if (u.includes("/comments/") && m === "DELETE") return "댓글 삭제";
  if (u === "/api/v1/users/events" && m === "PATCH") return "행사 초안 저장(제목/일정/장소 등)";
  return `${m} ${u}`;
};

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
    // FormData 전송 시 Content-Type 제거 → 브라우저가 multipart/form-data; boundary=... 자동 설정
    // (기본 application/json이 있으면 multipart 대신 x-www-form-urlencoded로 전송되는 문제 방지)
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
      if ("delete" in config.headers && typeof (config.headers as { delete: (k: string) => void }).delete === "function") {
        (config.headers as { delete: (k: string) => void }).delete("Content-Type");
      }
    }
    // 로그인 전(이메일 발송 등)에는 토큰 없음 → Authorization 헤더 추가 안 함
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // API 호출 로그 (한국어 동작, request)
    const label = getApiLabel(config.method ?? "", config.url);
    console.log(`[API REQUEST] ${label}:`, config.method?.toUpperCase(), config.url);
    console.log("[API REQUEST] config:", {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // API 응답 로그
    const label = getApiLabel(response.config.method ?? "", response.config.url);
    console.log(`[API RESPONSE] ${label}:`, response.config.method?.toUpperCase(), response.config.url);
    console.log("[API RESPONSE] status:", response.status);
    console.log("[API RESPONSE] data:", response.data);
    return response;
  },
  (error: AxiosError) => {
    // API 에러 로그
    const label = getApiLabel(error.config?.method ?? "", error.config?.url);
    console.log(`[API ERROR] ${label}:`, error.config?.method?.toUpperCase(), error.config?.url);
    console.log("[API ERROR] status:", error.response?.status);
    console.log("[API ERROR] response:", error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      // 로그인/회원가입 API 실패가 아닐 때만 로그인 페이지로 리다이렉트
      const url = error.config?.url ?? "";
      if (!url.includes("/login") && !url.includes("/signup")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
