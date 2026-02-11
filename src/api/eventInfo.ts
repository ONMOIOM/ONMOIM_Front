import axiosInstance from "./axiosInstance";
import { BaseResponse } from "../constants/types";

// 메인페이지에서의 API 관련 함수 구현 : Chillpan
//행사 수정, 조회, 삭제, 행사 참여 여부 투표, 행사 참여 여부 조회

/* 행사 초안 생성 응답 data */
//사용되는 곳- 행사 수정, 행사 조회

/* 수정용: Request Data */
export type EditEventRequest = {
  title?: string | null;
  schedule?: { startDate: string; endDate: string } | null;
  location?: { streetAddress: string; lotNumber?: string | null } | null;
  capacity?: number | null;
  price?: number | null;
  playlist?: string | null;
  information?: string | null;
};

/* 조회용: Response Data */
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
  createdAt: string;
  updatedAt?: string | null;
};

/* 행사 참여 여부 투표 Response Data */
export type VoteParticipantData = {
  eventUserID: string;
  eventId: number;
  userId: string;
  status: string;
};

/*행사 참여 여부 조회 Response Data */
export type GetParticipantData = {
  userId: string;
  nickname: string; // API 응답은 nickname 필드 사용
  status: string;
  profileImageUrl?: string; // 프로필 이미지 (선택적)
};

/* 내가 만든 행사 조회용 Response Data (flat 구조) */
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

// --- API 함수 구현  ---

/** 1. 행사 수정: PATCH /api/v1/users/events/{eventId} */
export const editEvent = async (
  eventId: number,
  updateData: EditEventRequest,
): Promise<BaseResponse<EventInfoData>> => {
  const res = await axiosInstance.patch<BaseResponse<EventInfoData>>(
    `/api/v1/users/events/${eventId}`,
    updateData,
  );
  return res.data;
};

/** 행사 목록 조회: GET /api/v1/users/events (메인/탭용) */
export const getEventList = async (): Promise<
  BaseResponse<EventInfoData[]>
> => {
  const res = await axiosInstance.get<BaseResponse<EventInfoData[]>>(
    "/api/v1/users/events",
  );
  return res.data;
};

/** 2. 행사 상세 조회: GET /api/v1/users/events/{eventId} */
export const getEvent = async (
  eventId: number,
): Promise<BaseResponse<EventInfoData>> => {
  const res = await axiosInstance.get<BaseResponse<EventInfoData>>(
    `/api/v1/users/events/${eventId}`,
  );
  return res.data;
};

/** 3. 행사 삭제: DELETE /api/v1/users/events/{eventId} */
export const deleteEvent = async (
  eventId: number,
): Promise<BaseResponse<EventInfoData>> => {
  const res = await axiosInstance.delete<BaseResponse<EventInfoData>>(
    `/api/v1/users/events/${eventId}`,
  );
  return res.data;
};

/** 4. 행사 참여 여부 투표: PUT /api/v1/users/events/{eventId}/participants/{userId} */
export const voteEventParticipation = async (
  eventId: number,
  userId: string,
  status: string,
): Promise<BaseResponse<VoteParticipantData>> => {
  const res = await axiosInstance.put<BaseResponse<VoteParticipantData>>(
    `/api/v1/users/events/${eventId}/participants/${userId}`,
    { status },
  );
  return res.data;
};

/** 행사 참여 투표: POST /api/v1/users/events/{eventId}/participants (ATTEND/PENDING/ABSENT) */
export type ParticipationStatus = "ATTEND" | "PENDING" | "ABSENT";

export const voteParticipation = async (
  eventId: number,
  status: ParticipationStatus
): Promise<BaseResponse<unknown>> => {
  const res = await axiosInstance.post<BaseResponse<unknown>>(
    `/api/v1/users/events/${eventId}/participants`,
    { status },
  );
  return res.data;
};

/** 5. 행사 참여 여부 조회: GET api/v1/users/events/{eventId}/participants */
export const getEventParticipation = async (
  eventId: number,
): Promise<BaseResponse<GetParticipantData[]>> => {
  const res = await axiosInstance.get<BaseResponse<GetParticipantData[]>>(
    `/api/v1/users/events/${eventId}/participants`,
  );
  return res.data;
};

/** 내가 만든 행사 조회: GET /api/v1/users/events/hosted */
export const getMyHostedEvents = async (): Promise<
  BaseResponse<EventInfoDetailData[]>
> => {
  const res = await axiosInstance.get<
    BaseResponse<EventInfoDetailData[]>
  >("/api/v1/users/events/hosted");
  return res.data;
};

/** 내가 참여한 행사 조회: GET /api/v1/users/events/participating */
export const getMyParticipatedEvents = async (): Promise<
  BaseResponse<EventInfoDetailData[]>
> => {
  const res = await axiosInstance.get<
    BaseResponse<EventInfoDetailData[]>
  >("/api/v1/users/events/participating");
  return res.data;
};
