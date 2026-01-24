// 이벤트 관련 API, Kaya
import axiosInstance from './axiosInstance';
import { BaseResponse } from '../constants/types';

/** 행사 초안 생성 응답 data */
/*
사용되는 곳
- 행사 생성 : Kaya
*/
export type CreateEventData = {
  eventId: string;
  status: string;
  title?: string | null;
  schedule?: { startDate: string; endDate: string } | null;
  location?: { streetAddress: string; lotNumber?: string | null } | null;
  capacity?: number | null;
  price?: number | null;
  playlist?: string | null;
  information?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

/** 행사 정보 수정 요청 body: PATCH /api/v1/users/events/{eventId}*/
export type SaveEventFieldsBody = {
  title?: string;
  schedule?: {
    startDate: string;
    endDate: string;
  };
  location?: {
    streetAddress: string;
    lotNumber?: string | null;
  };
  capacity?: number;
  price?: number;
  playlist?: string;
  information?: string;
};

// --- API 함수 ---

/** 행사 초안 생성: POST /api/v1/users/events *  : Kaya*/
export const createEventDraft = async (): Promise<
  BaseResponse<CreateEventData>
> => {
  const res = await axiosInstance.post<BaseResponse<CreateEventData>>(
    '/api/v1/users/events'
  );
  return res.data;
};

/** 행사 정보 수정: PATCH /api/v1/users/events/{eventId} : Kaya */ 
export const saveEventFields = async (
  eventId: string,
  body: SaveEventFieldsBody
): Promise<BaseResponse<CreateEventData>> => {
  const res = await axiosInstance.patch<BaseResponse<CreateEventData>>(
    `/api/v1/users/events/${eventId}`,
    body
  );
  return res.data;
};

/** 행사 생성(발행): POST /api/v1/users/events/{eventId}/publish  : Kaya*/ 
export const publishEvent = async (
  eventId: string
): Promise<BaseResponse<CreateEventData>> => {
  const res = await axiosInstance.post<BaseResponse<CreateEventData>>(
    `/api/v1/users/events/${eventId}/publish`
  );
  return res.data;
};