/**
 * openapi 스펙 기준 목데이터 (회원/프로필).
 * API 실패 시 폴백용.
 */

import type { ProfileData } from "../api/profile";

/** 회원 조회 목데이터 (GET /api/v1/users) */
export const MOCK_PROFILE: ProfileData = {
  id: 1,
  email: "test@example.com",
  nickname: "테스트닉",
  introduction: "안녕하세요. 온모임을 이용해주셔서 감사합니다.",
  instagramId: "k_dohyun_0503",
  twitterId: null,
  linkedinId: null,
  profileImageUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=400&h=400&q=80",
};
