import { useQuery } from "@tanstack/react-query";
import { profileAPI, type ProfileData } from "../api/profile";
import { MOCK_PROFILE } from "../openapi/mockProfile";

const useProfile = () => {
  const { data: profile, isLoading: loading, error, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<ProfileData> => {
      const res = await profileAPI.getProfile();
      if (res.success && res.data) {
        return res.data;
      }
      return MOCK_PROFILE;
    },
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
