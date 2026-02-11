// 댓글 관련 API
import axiosInstance from "./axiosInstance";
import { BaseResponse } from "../constants/types";

/** 댓글 한 건 응답 */
export type CommentItem = {
  commentId: number;
  nickname: string;
  profileImageUrl: string;
  content: string;
  createdAt: string;
};

/** 댓글 목록 조회 응답 data */
export type CommentListData = {
  eventId: number;
  commentList: CommentItem[];
  nextCursor: number;
  hasNext: boolean;
};

/** 댓글 작성 요청 */
export type CreateCommentRequest = {
  content: string;
};

/** 댓글 작성 응답 data */
export type CreateCommentData = CommentItem;

/** 댓글 목록 조회: GET /api/v1/events/{eventId}/comments (커서 기반) */
export const getCommentList = async (
  eventId: number,
  lastCommentId?: number
): Promise<BaseResponse<CommentListData>> => {
  const params = lastCommentId !== undefined ? { lastCommentId } : {};
  const res = await axiosInstance.get<BaseResponse<CommentListData>>(
    `/api/v1/events/${eventId}/comments`,
    { params }
  );
  return res.data;
};

/** 댓글 작성: POST /api/v1/events/{eventId}/comments */
export const createComment = async (
  eventId: number,
  body: CreateCommentRequest
): Promise<BaseResponse<CreateCommentData>> => {
  const res = await axiosInstance.post<BaseResponse<CreateCommentData>>(
    `/api/v1/events/${eventId}/comments`,
    body
  );
  return res.data;
};

/** 댓글 삭제: DELETE /api/v1/comments/{commentId} */
export const deleteComment = async (
  commentId: number
): Promise<BaseResponse<string>> => {
  const res = await axiosInstance.delete<BaseResponse<string>>(
    `/api/v1/comments/${commentId}`
  );
  return res.data;
};
