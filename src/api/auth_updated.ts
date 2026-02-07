// 2월 2일 - 수정된 API 명세서 보고 다시 작업


// 인증 관련 API
import axiosInstance from './axiosInstance';
import { BaseResponse } from '../constants/types';

// 로그인 API, Kaya

/** 1. 인증 메일 발송 요청 */
export type VerificationEmailRequest = {
  email: string;
  turnstileToken: string;
};

/** 1. 인증 메일 발송 응답(수정!!!) */
export type VerificationEmailResponse = {
  email: string;
  sentAt: string;
  expiresInSeconds: number;
  isRegistered: boolean;
}

/** 2. 인증 코드 검증 요청, 3. 로그인 요청, 4. 회원가입 */
export type EmailAuthCodeRequest = {
  email: string;
  authCode: string;
};

/** 2. 인증 코드 검증 응답 */
export type VerifyEmailCodeResponse = {
  email: string;
  verifiedAt: string;
  status: string;
}

/** 3. 로그인 응답 */
export type LoginResponse = {
  userId: number;
  accessToken?: string;
};

/** 4. 회원가입 응답 */
export type SignUpResponse = {
    userId: number;
}


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

/** 1. 인증 메일 발송: POST /api/v1/auth/email/verification */
export const sendVerificationEmail = async (
  body: VerificationEmailRequest
): Promise<BaseResponse<VerificationEmailResponse>> => {
  const res = await axiosInstance.post<BaseResponse<VerificationEmailResponse>>(
    '/api/v1/auth/email/verification',
    body
  );
  return res.data;
};

/** 2. 인증 코드 검증: POST /api/v1/auth/email/verify (request body에 code) */
export const verifyEmailCode = async (
  body: EmailAuthCodeRequest
): Promise<BaseResponse<VerifyEmailCodeResponse>> => {
  const res = await axiosInstance.post<BaseResponse<VerifyEmailCodeResponse>>(
    '/api/v1/auth/email/verify',
    body
  );
  return res.data;
};

/** 3. 로그인: POST /api/v1/users/login */
export const login = async (
  body: EmailAuthCodeRequest
): Promise<BaseResponse<LoginResponse>> => {
  const res = await axiosInstance.post<BaseResponse<LoginResponse>>(
    '/api/v1/users/login',
    body
  );
  return res.data;
};

/** 4. 회원가입: POST /api/v1/users/signup */
export const signUp = async (
  body: EmailAuthCodeRequest
): Promise<BaseResponse<SignUpResponse>> => {
  const res = await axiosInstance.post<BaseResponse<SignUpResponse>>(
    '/api/v1/users/signup',
    body
  );
  return res.data;
};

/** 5. 리프레쉬 토큰 로테이션: POST /api/v1/auth/refresh */
export const rotateAccessToken = async (): Promise<BaseResponse<string>> => {
  const res = await axiosInstance.post<BaseResponse<string>>(
    '/api/v1/auth/refresh'
  );
  return res.data;
};