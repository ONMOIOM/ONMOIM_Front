import { axiosInstance } from "./axios_kaya";
import { type BaseResponse } from "../constants/types";

// --- 타입 ---

// 인증 메일 발송 요청
export type EmailVerificationRequest = {
    email: string;
    turnstileToken: string;
}
// 로그인 요청: POST /api/v1/users/login
export type LoginRequest = {
    email: string;
    code: string;
};

// 로그인 응답
export type LoginData = {
    accessToken: string;
    refreshToken: string;
};


// --- API 함수 ---

// 이메일 인증 메일 발송: POST /api/v1/auth/email/verification
export const requestEmailVerification = async(
    body: EmailVerificationRequest
):Promise<BaseResponse> => {
    const res = await axiosInstance.post<BaseResponse>("/auth/email/verification", body);
    return res.data;
};

// 이메일 인증 코드 검증(request body에 인증코드 담아서 전달): POST /api/v1/auth/email/verify 
export const verifyEmail = async(
    code: string
): Promise<BaseResponse> => {
    const res = await axiosInstance.post<BaseResponse>("/auth/email/verify", {code});
    return res.data;
};

// 로그인: POST api/v1/users/login
export const login = async(
    body: LoginRequest
): Promise<BaseResponse<LoginData>> => {
    const res = await axiosInstance.post<BaseResponse<LoginData>>("/users/login", body);
    return res.data;
};

// 회원 조회 타임(내가 하는 거 맞나??)
export type MeData = {
    id: number;
    email: string;
}

// 회원 조회: GET api/v1/users (내가 하는 거 맞나??)
export const getMe = async(): Promise<BaseResponse<MeData>> => {
    const res = await axiosInstance.get<BaseResponse<MeData>>("/users");
    return res.data;
}