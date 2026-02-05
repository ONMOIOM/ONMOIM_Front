/**
 * openapi 스펙 기준 목데이터 (통계 + 행사 목록).
 * API 실패 시 폴백용. 세션시간(avgSession) 포함.
 */

import type { EventAnalysisData, StatisticsData } from "../api/analysis";
import type { EventInfoData } from "../api/eventInfo";

/** 분석 페이지 사이드바용 행사 목록 폴백 (API 명세 예시와 동일 7개) */
export const MOCK_EVENT_LIST: EventInfoData[] = [
  { eventId: 101, status: "published", title: "오늘의 하루 소개하기", schedule: { startDate: "2026-01-25T10:00:00Z", endDate: "2026-01-25T12:00:00Z" }, location: null, capacity: 8, price: 60000, playlist: null, information: null, hostName: "테스트닉", imageUrl: null, createdAt: "2026-01-01T00:00:00Z", updatedAt: null },
  { eventId: 102, status: "published", title: "주말 브런치 모임", schedule: { startDate: "2026-01-26T11:00:00Z", endDate: "2026-01-26T14:00:00Z" }, location: null, capacity: 6, price: 35000, playlist: null, information: null, hostName: "수호", imageUrl: null, createdAt: "2026-01-03T00:00:00Z", updatedAt: null },
  { eventId: 103, status: "published", title: "온모임 첫 네트워킹", schedule: { startDate: "2026-01-28T19:00:00Z", endDate: "2026-01-28T21:00:00Z" }, location: null, capacity: 20, price: 0, playlist: null, information: null, hostName: "온모임", imageUrl: null, createdAt: "2026-01-05T00:00:00Z", updatedAt: null },
  { eventId: 104, status: "published", title: "제주도 감귤 줍기", schedule: { startDate: "2026-02-01T09:00:00Z", endDate: "2026-02-01T12:00:00Z" }, location: null, capacity: 15, price: 25000, playlist: null, information: null, hostName: "제주농장", imageUrl: null, createdAt: "2026-01-10T00:00:00Z", updatedAt: null },
  { eventId: 105, status: "published", title: "서울 한강 러닝", schedule: { startDate: "2026-02-08T07:00:00Z", endDate: "2026-02-08T09:00:00Z" }, location: null, capacity: 30, price: 0, playlist: null, information: null, hostName: "러너", imageUrl: null, createdAt: "2026-01-12T00:00:00Z", updatedAt: null },
  { eventId: 106, status: "published", title: "부산 해운대 달맞이", schedule: { startDate: "2026-02-14T18:00:00Z", endDate: "2026-02-14T21:00:00Z" }, location: null, capacity: 25, price: 15000, playlist: null, information: null, hostName: "부산사랑", imageUrl: null, createdAt: "2026-01-14T00:00:00Z", updatedAt: null },
  { eventId: 107, status: "published", title: "제주 동문시장 투어", schedule: { startDate: "2026-02-20T10:00:00Z", endDate: "2026-02-20T13:00:00Z" }, location: null, capacity: 12, price: 20000, playlist: null, information: null, hostName: "제주가이드", imageUrl: null, createdAt: "2026-01-18T00:00:00Z", updatedAt: null },
];

/** 7일치 stats 한 세트 생성 (행사별로 다른 수치용) */
function makeStats(
  base: { click: number; part: number; rate: number; sec: number }
): StatisticsData[] {
  const dates = ["2026-01-15", "2026-01-16", "2026-01-17", "2026-01-18", "2026-01-19", "2026-01-20", "2026-01-21"];
  return dates.map((date, i) => ({
    date,
    clickCount: base.click + i * 10,
    participantCount: base.part + i * 5,
    avgSession: { minutes: Math.floor((base.sec + i * 8) / 60), seconds: (base.sec + i * 8) % 60 },
    participationRate: Math.min(99, base.rate + i * 1.5),
  }));
}

/** 목데이터: 행사별 통계 (eventId 101~107 각각 다른 수치, 목서버가 동일 응답을 주어도 화면에서는 행사별로 다르게 표시) */
export const MOCK_EVENT_ANALYSIS: EventAnalysisData[] = [
  { eventId: 101, stats: makeStats({ click: 120, part: 95, rate: 83.44, sec: 43 }) },
  { eventId: 102, stats: makeStats({ click: 80, part: 62, rate: 72.1, sec: 35 }) },
  { eventId: 103, stats: makeStats({ click: 200, part: 150, rate: 88.0, sec: 72 }) },
  { eventId: 104, stats: makeStats({ click: 95, part: 78, rate: 79.5, sec: 48 }) },
  { eventId: 105, stats: makeStats({ click: 310, part: 220, rate: 91.2, sec: 65 }) },
  { eventId: 106, stats: makeStats({ click: 140, part: 110, rate: 85.0, sec: 55 }) },
  { eventId: 107, stats: makeStats({ click: 68, part: 55, rate: 70.0, sec: 28 }) },
];
