import axiosInstance from "./axiosInstance";
import { BaseResponse } from "../constants/types";

// 메인페이지에서의 API 관련 함수 구현 : Chillpan
//행사 수정, 조회, 삭제, 행사 참여 여부 투표, 행사 참여 여부 조회

/* 행사 초안 생성 응답 data */
//사용되는 곳- 행사 수정, 행사 조회

/* 수정용: Request Data (Swagger flat 구조 - PATCH /events/{eventId}) */
export type EditEventRequest = {
  title?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  streetAddress?: string | null;
  lotNumberAddress?: string | null;
  playlistUrl?: string | null;
  capacity?: number | null;
  price?: number | null;
  introduction?: string | null;
};

/* 조회용: Response Data (목록/수정 응답 - schedule, location 등) */
export type EventInfoData = {
  eventId: number;
  status: string;
  title?: string | null;
  schedule?: { startDate: string; endDate: string } | null;
  location?: { streetAddress: string; lotNumber?: string | null } | null;
  capacity?: number | null;
  price?: number | null;
  playlist?: string | null;
  information?: string | null;
  /** 호스트(개최자) 이름 - 행사 목록/상세 조회 시 서버에서 내려줌 */
  hostName?: string | null;
  /** 행사 대표 이미지 URL (목록/상세) */
  imageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

/* 행사 상세 조회용: Response Data (Swagger flat 구조 - GET /events/{eventId}) */
export type EventInfoDetailData = {
  eventId: number;
  title?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  introduction?: string | null;
  streetAddress?: string | null;
  lotNumberAddress?: string | null;
  price?: number | null;
  playlistUrl?: string | null;
  capacity?: number | null;
  status: string;
};

/* 행사 참여 여부 조회 Response Data (GET /participants) */
export type GetParticipantData = {
  userId: number;
  nickname: string;
  status: string;
};

// --- API 함수 구현  ---

/** 1. 행사 수정: PATCH /api/v1/users/events/{eventId} */
export const editEvent = async (
  eventId: number,
  updateData: EditEventRequest
): Promise<BaseResponse<EventInfoDetailData>> => {
  const res = await axiosInstance.patch<
    BaseResponse<EventInfoDetailData>
  >(`/api/v1/users/events/${eventId}`, updateData);
  return res.data;
};

/** 내가 참여한 행사 조회: GET /api/v1/users/{userId}/events */
export const getMyParticipatedEvents = async (
  userId: number
): Promise<BaseResponse<EventInfoDetailData[]>> => {
  const res = await axiosInstance.get<
    BaseResponse<EventInfoDetailData[]>
  >(`/api/v1/users/${userId}/events`);
  return res.data;
};

/** 행사 목록 조회: GET /api/v1/users/events (메인/탭용) */
export const getEventList = async (): Promise<
  BaseResponse<EventInfoData[]>
> => {
  const res = await axiosInstance.get<BaseResponse<EventInfoData[]>>(
    "/api/v1/users/events"
  );
  return res.data;
};

/** 2. 행사 상세 조회: GET /api/v1/users/events/{eventId} */
export const getEvent = async (
  eventId: number
): Promise<BaseResponse<EventInfoDetailData>> => {
  const res = await axiosInstance.get<BaseResponse<EventInfoDetailData>>(
    `/api/v1/users/events/${eventId}`
  );
  return res.data;
};

/** 3. 행사 삭제: DELETE /api/v1/users/events/{eventId} */
export const deleteEvent = async (
  eventId: number
): Promise<BaseResponse<Record<string, never>>> => {
  const res = await axiosInstance.delete<
    BaseResponse<Record<string, never>>
  >(`/api/v1/users/events/${eventId}`);
  return res.data;
};

/** 4. 행사 참여 여부 투표: POST /api/v1/users/events/{eventId}/participants/{userId} */
export const voteEventParticipation = async (
  eventId: number,
  userId: number,
  body: { status: string }
): Promise<BaseResponse<string>> => {
  const res = await axiosInstance.post<BaseResponse<string>>(
    `/api/v1/users/events/${eventId}/participants/${userId}`,
    body
  );
  return res.data;
};

/** 5. 행사 참여 여부 조회: GET api/v1/users/events/{eventId}/participants */
export const getEventParticipation = async (
  eventId: number
): Promise<BaseResponse<GetParticipantData[]>> => {
  const res = await axiosInstance.get<BaseResponse<GetParticipantData[]>>(
    `/api/v1/users/events/${eventId}/participants`
  );
  return res.data;
};
