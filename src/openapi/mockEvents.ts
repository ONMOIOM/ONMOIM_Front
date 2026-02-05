/**
 * openapi 스펙(행사 목록 조회) 기준 목데이터
 * 가로 스크롤/UI 확인용. 실제 API 연동 시 제거하거나 mock 서버로 이전
 */

import type { EventInfoData } from "../api/eventInfo";

/** 목데이터: 맨 우측에 추가해 스크롤 넘침 확인용 */
export const MOCK_EVENT_RIGHT: EventInfoData = {
  eventId: 0,
  status: "published",
  title: "목업 (스크롤 확인용)",
  schedule: {
    startDate: "2026-02-15T14:00:00Z",
    endDate: "2026-02-15T16:00:00Z",
  },
  location: null,
  capacity: null,
  price: null,
  playlist: null,
  information: null,
  hostName: "목업",
  imageUrl: null,
  createdAt: "2026-02-01T00:00:00Z",
  updatedAt: null,
};
