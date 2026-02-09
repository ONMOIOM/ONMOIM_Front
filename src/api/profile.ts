// 프로필 관련 API
import axiosInstance from './axiosInstance';
import { BaseResponse } from '../constants/types';

/** 회원 조회 응답 data (GET /api/v1/users) */
export type ProfileData = {
  id: number;
  email: string;
  nickname: string;
  introduction: string;
  instagramId?: string | null;
  twitterId?: string | null;
  linkedinId?: string | null;
  profileImageUrl: string;
};

/** 내 프로필 수정 요청 (PATCH /api/v1/users) */
export type UpdateProfileRequest = {
  nickname?: string | null;
  introduction?: string | null;
  instagramId?: string | null;
  twitterId?: string | null;
  linkedinId?: string | null;
};

export const profileAPI = {
  /** 프로필 조회: GET /api/v1/users (bearerAuth)*/
  getProfile: async (): Promise<BaseResponse<ProfileData>> => {
    const res = await axiosInstance.get<BaseResponse<ProfileData>>(
      '/api/v1/users'
    );
    return res.data;
  },
  /** 내 프로필 수정: PATCH /api/v1/users (bearerAuth) */
  updateProfile: async (
    body: UpdateProfileRequest
  ): Promise<BaseResponse<ProfileData>> => {
    const res = await axiosInstance.patch<BaseResponse<ProfileData>>(
      '/api/v1/users',
      body
    );
    return res.data;
  },
  /** 프로필 이미지 변경: POST /api/v1/users/profile-image (bearerAuth) */
  uploadProfileImage: async (
    imageFile: File
  ): Promise<BaseResponse<string>> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const res = await axiosInstance.post<BaseResponse<string>>(
      '/api/v1/users/profile-image',
      formData
    );
    return res.data;
  },
  /** 회원 탈퇴: DELETE /api/v1/users (bearerAuth) */
  deleteProfile: async (): Promise<
    BaseResponse<Record<string, never>>
  > => {
    const res = await axiosInstance.delete<
      BaseResponse<Record<string, never>>
    >('/api/v1/users');
    return res.data;
  },
};
