/**
 * openapi 스펙 기준 목데이터 (통계 + 행사 목록).
 * API 실패 시 폴백용. 세션시간(avgSession) 포함.
 */

import type { EventAnalysisData } from "../api/analysis";
import type { EventInfoData } from "../api/eventInfo";

/** 분석 페이지 사이드바용 행사 목록 폴백 */
export const MOCK_EVENT_LIST: EventInfoData[] = [
  {
    eventId: 101,
    status: "published",
    title: "제주도 감귤 줍기",
    schedule: { startDate: "2026-01-15T09:00:00Z", endDate: "2026-01-15T12:00:00Z" },
    location: null,
    capacity: 8,
    price: null,
    playlist: null,
    information: null,
    hostName: "호스트",
    imageUrl: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: null,
  },
  {
    eventId: 102,
    status: "published",
    title: "서울 한강 러닝",
    schedule: { startDate: "2026-01-20T07:00:00Z", endDate: "2026-01-20T09:00:00Z" },
    location: null,
    capacity: 20,
    price: null,
    playlist: null,
    information: null,
    hostName: "호스트",
    imageUrl: null,
    createdAt: "2026-01-02T00:00:00Z",
    updatedAt: null,
  },
];

/** 목데이터: 행사별 통계 (날짜별 clickCount, participantCount, avgSession, participationRate) */
export const MOCK_EVENT_ANALYSIS: EventAnalysisData[] = [
  {
    eventId: 101,
    stats: [
      {
        date: "2026-01-15",
        clickCount: 120,
        participantCount: 95,
        avgSession: { minutes: 0, seconds: 43 },
        participationRate: 83.44,
      },
      {
        date: "2026-01-16",
        clickCount: 98,
        participantCount: 88,
        avgSession: { minutes: 1, seconds: 12 },
        participationRate: 78.5,
      },
      {
        date: "2026-01-17",
        clickCount: 145,
        participantCount: 120,
        avgSession: { minutes: 0, seconds: 55 },
        participationRate: 92.0,
      },
      {
        date: "2026-01-18",
        clickCount: 132,
        participantCount: 105,
        avgSession: { minutes: 1, seconds: 5 },
        participationRate: 85.2,
      },
      {
        date: "2026-01-19",
        clickCount: 110,
        participantCount: 92,
        avgSession: { minutes: 0, seconds: 38 },
        participationRate: 80.1,
      },
      {
        date: "2026-01-20",
        clickCount: 158,
        participantCount: 130,
        avgSession: { minutes: 1, seconds: 22 },
        participationRate: 88.6,
      },
      {
        date: "2026-01-21",
        clickCount: 142,
        participantCount: 118,
        avgSession: { minutes: 0, seconds: 51 },
        participationRate: 95.0,
      },
    ],
  },
];
