import { useQuery } from "@tanstack/react-query";
import { profileAPI, type ProfileData } from "../api/profile";
import { MOCK_PROFILE } from "../openapi/mockProfile";

const useProfile = () => {
  // TanStack Query로 프로필 데이터 가져오기 (캐싱으로 깜빡임 방지)
  const { data: profile, isLoading: loading, error, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<ProfileData> => {
      const res = await profileAPI.getProfile();
      if (res.success && res.data) {
        return res.data;
      }
      // 실패 시 MOCK_PROFILE 반환
      return MOCK_PROFILE;
    },
    staleTime: 1000 * 60 * 30, // 30분간 캐시 유지 (더 길게 설정)
    gcTime: 1000 * 60 * 60, // 1시간간 메모리에 유지
    refetchOnMount: false, // 마운트 시 리패치 비활성화 (캐시 사용)
    refetchOnWindowFocus: false, // 창 포커스 시 리패치 비활성화
    refetchOnReconnect: false, // 재연결 시 리패치 비활성화
    refetchInterval: false, // 자동 리패치 비활성화
    // 캐시된 데이터를 placeholder로 사용하여 즉시 표시
    placeholderData: (previousData) => previousData,
    retry: 1,
  });

  return { 
    profile: profile || null, 
    loading: loading && !profile, // 캐시된 데이터가 있으면 로딩 상태가 아님
    error: !!error,
    isFetching, // 백그라운드 리패치 상태 (사용자에게는 보이지 않음)
  };
};

export default useProfile;
