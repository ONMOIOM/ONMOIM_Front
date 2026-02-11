import { useQuery } from "@tanstack/react-query";
import { profileAPI, type ProfileData } from "../api/profile";
import { MOCK_PROFILE } from "../openapi/mockProfile";
import { getUserIdFromToken } from "../utils/jwtDecoder";

const useProfile = () => {
  const userId = getUserIdFromToken();
  
  const { data: profile, isLoading: loading, error, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async (): Promise<ProfileData> => {
      if (!userId) {
        return MOCK_PROFILE;
      }
      const res = await profileAPI.getUserProfile(userId);
      if (res.success && res.data) {
        return res.data;
      }
      return MOCK_PROFILE;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });

  return { 
    profile: profile || null, 
    loading: loading && !profile,
    error: !!error,
    isFetching,
  };
};

export default useProfile;
