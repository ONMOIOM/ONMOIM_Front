// 이벤트 관련 API
import axiosInstance from './axiosInstance';
import { AxiosResponse } from 'axios';

export const eventAPI = {
  // 이벤트 API 명세서가 완성되면 그에 맞춰서 수정하기
  // 이벤트 생성, 참여자 조회 등 이벤트 관련 API들
  createEvent: (): Promise<AxiosResponse> => {
    // TODO: API 명세서 완성 후 구현
    return Promise.reject(new Error('Not implemented'));
  },
  
  getEventParticipants: (): Promise<AxiosResponse> => {
    // TODO: API 명세서 완성 후 구현
    return Promise.reject(new Error('Not implemented'));
  },
};
