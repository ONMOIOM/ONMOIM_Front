// 프로필 관련 API
import axiosInstance from './axiosInstance';
import { BaseResponse } from '../constants/types';

export type ProfileData = {
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

export type UpdateProfileRequest = {
  memberId?: number;
  username?: string;
  nickname?: string;
  introduction?: string;
  status?: string;
  instagramId?: string | null;
  twitterId?: string | null;
  linkedinId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  imageUrl?: string;
};

export const profileAPI = {
  /** 프로필 조회: GET /api/v1/users (bearerAuth) */
  getProfile: async (): Promise<BaseResponse<ProfileData>> => {
    const res = await axiosInstance.get<BaseResponse<ProfileData>>(
      '/api/v1/users'
    );
    return res.data;
  },
  /** 회원정보 수정: POST /api/v1/users (bearerAuth) */
  updateProfile: async (
    body: UpdateProfileRequest
  ): Promise<BaseResponse> => {
    const res = await axiosInstance.post<BaseResponse>('/api/v1/users', body);
    return res.data;
  },
  /** 회원 탈퇴: DELETE /api/v1/users (bearerAuth) */
  deleteProfile: async (): Promise<BaseResponse> => {
    const res = await axiosInstance.delete<BaseResponse>('/api/v1/users');
    return res.data;
  },
};
