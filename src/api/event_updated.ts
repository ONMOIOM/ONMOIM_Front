// 이벤트 관련 API, Kaya
import axiosInstance from './axiosInstance';
import { BaseResponse } from '../constants/types';

/** 행사 초안 생성 / 최종 생성 응답 data (Swagger flat 구조) */
export type CreateEventResponse = {
  eventId: number;
  title?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  streetAddress?: string | null;
  lotNumberAddress?: string | null;
  price?: number | null;
  playlistUrl?: string | null;
  capacity?: number | null;
  introduction?: string | null;
  status: string;
};

/** 2. 행사 제목 생성 요청 */
export type SaveEventTitleRequest = {
  title?: string | null;
};

/** 2. 행사 일자 생성 요청 */
export type SaveEventScheduleRequest = {
  schedule?: {
    startDate: string;
    endDate: string;
  } | null;
};

/** 2. 행사 위치 생성 요청 */
export type SaveEventLocationRequest = {
  location?: {
    streetAddress: string;
    lotNumber: string | null;
  } | null;
};

/** 2. 행사 참여자 생성 요청 */
export type SaveEventCapacityRequest = {
  capacity?: number | null;
};

/** 2. 행사 참여 가격 생성 요청 data */
export type SaveEventPriceRequest = {
  price?: number | null;
};

/** 2. 행사 플레이리스트 생성 요청 data */
export type SaveEventPlaylistRequest = {
  playlist?: string | null;
};

/** 2. 행사 소개글 생성 요청 data */
export type SaveEventInformationRequest = {
  information?: string | null;
};


// --- API 함수 ---

/** 1. 행사 초안 생성: POST /api/v1/users/events *  : Kaya*/
export const createEventDraft = async (): Promise<
  BaseResponse<CreateEventResponse>
> => {
  const res = await axiosInstance.post<BaseResponse<CreateEventResponse>>(
    '/api/v1/users/events'
  );
  return res.data;
};

/** 2. 행사 제목 생성: PATCH  /api/v1/users/events: Kaya*/
export const saveEventTitle = async (
  body: SaveEventTitleRequest
): Promise<BaseResponse<CreateEventResponse>> => {
  const res = await axiosInstance.patch<BaseResponse<CreateEventResponse>>(
    `/api/v1/users/events`,
    body
  );
  return res.data;
};

/** 2. 행사 일자 생성: PATCH  /api/v1/users/events: Kaya*/
export const saveEventSchedule = async (
  body: SaveEventScheduleRequest
): Promise<BaseResponse<CreateEventResponse>> => {
  const res = await axiosInstance.patch<BaseResponse<CreateEventResponse>>(
    `/api/v1/users/events`,
    body
  );
  return res.data;
};

/** 2. 행사 위치 생성: PATCH  /api/v1/users/events: Kaya*/
export const saveEventLocation = async (
  body: SaveEventLocationRequest
): Promise<BaseResponse<CreateEventResponse>> => {
  const res = await axiosInstance.patch<BaseResponse<CreateEventResponse>>(
    `/api/v1/users/events`,
    body
  );
  return res.data;
};

/** 2. 행사 참여자 생성: PATCH  /api/v1/users/events: Kaya*/
export const saveEventCapacity = async (
  body: SaveEventCapacityRequest
): Promise<BaseResponse<CreateEventResponse>> => {
  const res = await axiosInstance.patch<BaseResponse<CreateEventResponse>>(
    `/api/v1/users/events`,
    body
  );
  return res.data;
};

/** 2. 행사 참여 가격 생성: PATCH  /api/v1/users/events: Kaya*/
export const saveEventPrice = async (
  body: SaveEventPriceRequest
): Promise<BaseResponse<CreateEventResponse>> => {
  const res = await axiosInstance.patch<BaseResponse<CreateEventResponse>>(
    `/api/v1/users/events`,
    body
  );
  return res.data;
};

/** 2. 행사 플레이리스트 생성: PATCH  /api/v1/users/events: Kaya*/
export const saveEventPlaylist = async (
  body: SaveEventPlaylistRequest
): Promise<BaseResponse<CreateEventResponse>> => {
  const res = await axiosInstance.patch<BaseResponse<CreateEventResponse>>(
    `/api/v1/users/events`,
    body
  );
  return res.data;
};

/** 2. 행사 소개글 생성: PATCH  /api/v1/users/events: Kaya*/
export const saveEventInformation = async (
  body: SaveEventInformationRequest
): Promise<BaseResponse<CreateEventResponse>> => {
  const res = await axiosInstance.patch<BaseResponse<CreateEventResponse>>(
    `/api/v1/users/events`,
    body
  );
  return res.data;
};

/** 3. 행사 최종 생성(발행): POST /api/v1/users/events/{eventId}/published */
export const publishEvent = async (
  eventId: number
): Promise<BaseResponse<CreateEventResponse>> => {
  const res = await axiosInstance.post<BaseResponse<CreateEventResponse>>(
    `/api/v1/users/events/${eventId}/published`
  );
  return res.data;
};
