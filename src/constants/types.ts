/**
 * 전 서버 공통 응답 규격 (추측임. 디스코드 답변 따라 달라질 수 있음)
 */
export interface BaseResponse<T = undefined> {
  success: boolean | string; // 백엔드가 문자열로 줄 수도 있어 union 처리
  code: string; // 응답 코드
  message: string; // 응답 메시지
  data?: T; // 알맹이 데이터 (Optional)
}

/* 진짜 예시 사용 코드

// src/services/eventService.ts
import axiosInstance from '../api/axiosInstance';
import { BaseResponse } from '../constants/type';
import { EventItem } from '../types/event';

export const getMainEvents = async (): Promise<BaseResponse<EventItem[]>> => {
  // 제네릭 <EventItem[]>을 통해 data가 행사 배열임을 확정
  const response = await axiosInstance.get('/api/v1/events');
  return response.data; 
};


// src/pages/MainPage.tsx
const loadEvents = async () => {
  const res = await getMainEvents();

  if (res.success) {
    // res.data가 바로 EventItem[] 타입으로 인식
    console.log("행사 목록:", res.data); 
    console.log("첫 번째 행사 제목:", res.data?.[0].title);
  } else {
    alert(res.message); // 서버에서 내려준 에러 메시지 출력
  }
};
이런 느낌으로 활용할 수 있음
*/