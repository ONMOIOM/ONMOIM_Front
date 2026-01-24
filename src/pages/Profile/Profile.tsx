import { useEffect } from 'react';
import { profileAPI } from '../../api/profile';

const Profile = () => {
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await profileAPI.getProfile();
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h1>프로필 페이지</h1>
      {/* 프로필 페이지 구현 */}
    </div>
  );
};

export default Profile;
