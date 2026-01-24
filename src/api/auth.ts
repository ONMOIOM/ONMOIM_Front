// 인증 관련 API
import axiosInstance from './axiosInstance';
import { BaseResponse } from '../constants/types';

// 로그인 API, Kaya

/** 이메일 인증 메일 발송 요청 */
export type EmailVerificationRequest = {
  email: string;
  turnstileToken: string;
};

/** 로그인 요청: POST /api/v1/users/login */
export type LoginRequest = {
  email: string;
  authcode: string;
};

/** 로그인 응답 data (명세서 예시는 []이나, 실제 토큰 반환 시 사용) */
export type LoginData = {
  accessToken?: string;
  refreshToken?: string;
};

/* 회원 조회 응답 data (배열) .. 이것도 누가 쓸건지 역할 분배 필요*/
export type MeData = {
  memberId: number;
  username: string;
  nickname: string;
  introduction: string;
  status: string;
  instagramId?: string | null;
  twitterId?: string | null;
  linkedinId?: string | null;
  createdAt: string;
  updatedAt: string;
  email: string;
  imageUrl: string;
};

// --- API 함수 ---

/** 이메일 인증 메일 발송: POST /api/v1/auth/email/verification */
export const requestEmailVerification = async (
  body: EmailVerificationRequest
): Promise<BaseResponse> => {
  const res = await axiosInstance.post<BaseResponse>(
    '/api/v1/auth/email/verification',
    body
  );
  return res.data;
};

/** 이메일 인증 코드 검증: POST /api/v1/auth/email/verify (request body에 code) */
export const verifyEmail = async (code: string): Promise<BaseResponse> => {
  const res = await axiosInstance.post<BaseResponse>(
    '/api/v1/auth/email/verify',
    { code }
  );
  return res.data;
};

/** 로그인: POST /api/v1/users/login */
export const login = async (
  body: LoginRequest
): Promise<BaseResponse<LoginData>> => {
  const res = await axiosInstance.post<BaseResponse<LoginData>>(
    '/api/v1/users/login',
    body
  );
  return res.data;
};

/** 회원 조회: GET /api/v1/users (bearerAuth) , 누가 해야 하는지 확실한 판단 필요, 확실하지 않음 */
export const getMe = async (): Promise<BaseResponse<MeData[]>> => {
  const res = await axiosInstance.get<BaseResponse<MeData[]>>('/api/v1/users');
  return res.data;
};
