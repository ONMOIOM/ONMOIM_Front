import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logoSrc from "../../assets/icons/onmoim logo_big.svg";
import notificationsSrc from "../../assets/icons/notifications.svg";
import profileSrc from "../../assets/icons/profile.svg";
import useProfile from "../../hooks/useProfile";
import AlarmModal from "./AlarmModal";
import ProfileMenu from "./ProfileMenu";
import { convertImageUrl } from "../../utils/imageUrlConverter";

const NavBar = () => {
  const navigate = useNavigate();
  const alarmButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [alarmModalTop, setAlarmModalTop] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { profile } = useProfile();
  
  // 메모이제이션으로 프로필 이미지 URL 계산 최적화
  const profileImageUrl = useMemo(() => {
    const convertedUrl = convertImageUrl(profile?.profileImageUrl);
    return convertedUrl || profileSrc;
  }, [profile?.profileImageUrl]);
  
  const profileName = useMemo(() => profile?.nickname || "윤수호", [profile?.nickname]);
  
  // 프로필 이미지 URL이 변경되면 에러 상태 리셋
  useEffect(() => {
    setImageError(false);
  }, [profileImageUrl]);

  const openAlarmModal = () => {
    const rect = alarmButtonRef.current?.getBoundingClientRect();
    if (rect) setAlarmModalTop(rect.bottom + 20);
    setIsAlarmOpen(true);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header
      className="relative z-20 w-full h-[133.5px] flex items-center justify-between bg-gradient-to-t from-red-50 to-red-400 pl-[46px] pr-[46px]"
      role="banner"
    >
      <button
        type="button"
        onClick={() => navigate("/")}
        className="cursor-pointer"
        aria-label="메인으로"
      >
        <img
          src={logoSrc}
          alt="ONMOIM"
          className="h-[45px] w-auto object-contain"
        />
      </button>
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => navigate("/event-create")}
          className="text-h6 font-normal text-gray-600 hover:opacity-80 transition-opacity"
        >
          이벤트 생성하기
        </button>
        <button
          ref={alarmButtonRef}
          type="button"
          className="flex h-[50px] w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-red-800/20"
          aria-label="알림"
          onClick={openAlarmModal}
        >
          <img src={notificationsSrc} alt="" className="h-[28px] w-auto" />
        </button>
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200"
            aria-label="프로필"
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
            aria-controls="profile-menu"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
          >
            {/* 에러가 발생했거나 프로필 이미지가 없으면 기본 이미지, 그 외에는 프로필 이미지 */}
            {imageError || !profile?.profileImageUrl ? (
              <img
                src={profileSrc}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={profileImageUrl}
                alt=""
                className="h-full w-full object-cover"
                onError={() => {
                  // 프로필 이미지 로드 실패 시 기본 이미지로 fallback
                  setImageError(true);
                }}
              />
            )}
          </button>
          <ProfileMenu
            isOpen={isProfileMenuOpen}
            profileImageSrc={imageError || !profile?.profileImageUrl ? profileSrc : profileImageUrl}
            profileName={profileName}
          />
        </div>
      </div>
      <AlarmModal
        isOpen={isAlarmOpen}
        onClose={() => setIsAlarmOpen(false)}
        top={alarmModalTop}
      />
    </header>
  );
};

export default NavBar;
