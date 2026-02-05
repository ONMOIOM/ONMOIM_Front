import { useEffect, useState } from "react";

import { profileAPI, type ProfileData } from "../api/profile";

const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await profileAPI.getProfile();
        if (!isMounted) return;
        if (res.success && res.data) {
          setProfile(res.data);
        } else {
          setProfile(null);
        }
      } catch {
        if (!isMounted) return;
        setError(true);
        setProfile(null);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return { profile, loading, error };
};

export default useProfile;
