import axiosInstance from './axiosInstance';
import { BaseResponse } from '../constants/types';
// 분석 관련 API 함수 : Chillpan
//통계 값 획득, 세션 시간 측정 시작 / 클릭 수 증가, 세션 시간 측정 종료

/* 통계 형식 Data */
export type StatisticsData = {
  date: string;
  clickCount: number;
  participantCount: number;
  avgSession: {
    minutes: number;
    seconds: number;
  };
  participationRate: number;
};

/*Response data*/
export type EventAnalysisData = {
  eventId: number;
  stats: StatisticsData[]; // 여러 날짜의 데이터가 배열로 들어옴
};

export type SessionResponseData = {
  sessionId: string;
};



/* API 함수 */

/* 1. 통계값 획득 : GET /api/v1/analytics/total */
export const getEventAnalysis = async (
  eventId: number
): Promise<BaseResponse<EventAnalysisData[]>> => {
  const res = await axiosInstance.get<BaseResponse<EventAnalysisData[]>>(
    `/api/v1/analytics/total`,
    {
      params: {
        Event_id: eventId
      }
    }
  );
  return res.data;
};

/* 2. 세션 시작: POST /api/v1/analytics/session */
export const startSession = async (
  eventId: number
): Promise<BaseResponse<SessionResponseData>> => {
  const res = await axiosInstance.post<BaseResponse<SessionResponseData>>(
    `/api/v1/analytics/${eventId}/sessions`,
    {
      eventId
    }
  );
  return res.data;
};

/* 3. 세션 종료: PATCH /api/v1/analytics/session/{sessionId} */
export const endSession = async (
  eventId: number,
  sessionId: string
): Promise<BaseResponse<SessionResponseData>> => {
  const res = await axiosInstance.patch<BaseResponse<SessionResponseData>>(
    `/api/v1/analytics/${eventId}/sessions/${sessionId}`
  );
  return res.data;
}