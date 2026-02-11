// 이벤트 관련 API, Kaya
import axiosInstance from "./axiosInstance";
import { BaseResponse } from "../constants/types";
import type { EditEventRequest } from "./eventInfo";

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

// --- API 함수 ---

/** 1. 행사 초안 생성: POST /api/v1/users/events */
export const createEventDraft = async (): Promise<
  BaseResponse<CreateEventResponse>
> => {
  const res = await axiosInstance.post<BaseResponse<CreateEventResponse>>(
    "/api/v1/users/events",
  );
  return res.data;
};

/** 2. 행사 내용 수정: PATCH /api/v1/users/events/{eventId} (Swagger 스펙) */
export const patchEvent = async (
  eventId: number,
  body: Partial<EditEventRequest>,
): Promise<BaseResponse<CreateEventResponse>> => {
  const res = await axiosInstance.patch<BaseResponse<CreateEventResponse>>(
    `/api/v1/users/events/${eventId}`,
    body,
  );
  return res.data;
};

/** 3. 행사 최종 생성(발행): POST /api/v1/users/events/{eventId}/published */
export const publishEvent = async (
  eventId: number,
): Promise<BaseResponse<CreateEventResponse>> => {
  const res = await axiosInstance.post<BaseResponse<CreateEventResponse>>(
    `/api/v1/users/events/${eventId}/published`,
  );
  return res.data;
};

/** 4. 행사 이미지 업로드: POST /api/v1/users/events/{eventId}/image */
export const uploadEventImage = async (
  eventId: number,
  imageFile: File
): Promise<BaseResponse<string>> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const res = await axiosInstance.post<BaseResponse<string>>(
    `/api/v1/users/events/${eventId}/image`,
    formData
  );
  return res.data;
};
