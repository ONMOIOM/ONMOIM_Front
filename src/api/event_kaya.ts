import { axiosInstance } from "./axios_kaya";
import { type BaseResponse } from "../constants/types";

// --- 타입 ---

// 행사 초안 생성: POST /api/v1/users/events
export type CreateEventData = {
    eventId: number;
};

// 행사 필드 채우기: PATCH /api/v1/users/events
export type SaveEventFieldBody = {
    eventId: number;
    status: string;
    title?: string | null;
    schedule?: { startDate: string; endDate: string } | null;
    location?: { streetAddress: string; lotNumber?: string | null } | null;
    capacity?: number | null;
    price?: number | null;
    playlist?: string | null;
    description?: string;
    createdAt: string;
    updatedAt?: string | null;
};


// --- API 함수 ---

// 행사 초안 생성: POST /api/v1/users/events
export const createEventDraft = async(): Promise<BaseResponse<CreateEventData>> => {
    const res = await axiosInstance.post<BaseResponse<CreateEventData>>("/users/events");
    return res.data;
};

// 행사 필드 채우기(초안): PATCH /api/v1/users/events
export const saveEventFields = async(
    body: SaveEventFieldBody
): Promise<BaseResponse> => {
    const res = await axiosInstance.patch<BaseResponse>("/users/events", body);
    return res.data;
};

// 행사 생성(publish): POST /api/v1/users/events/{eventId}/publish
export const publishEvent = async(
    eventId: number
): Promise<BaseResponse> => {
    const res = await axiosInstance.post<BaseResponse>(`/users/events/${eventId}/publish`);
    return res.data;
};