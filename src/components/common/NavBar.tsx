import { useEffect, useRef, useState } from "react";

import logoSrc from "../../assets/icons/onmoim logo_big.svg";
import notificationsSrc from "../../assets/icons/notifications.svg";
import profileSrc from "../../assets/icons/profile.svg";
import ProfileMenu from "./ProfileMenu";

const NavBar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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
      className="w-full h-[133.5px] flex items-center justify-between bg-gradient-to-t from-[var(--color-red-50)] to-[var(--color-red-400)] pl-[46px] pr-[46px]"
      role="banner"
    >
      <img
        src={logoSrc}
        alt="ONMOIM"
        className="h-[45px] w-auto object-contain"
      />
      <div className="flex items-center gap-6">
        <span className="text-h6 font-normal text-gray-600">
          이벤트 생성하기
        </span>
        <button
          type="button"
          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-red-800/20"
          aria-label="알림"
        >
          <img src={notificationsSrc} alt="" className="h-[28px] w-auto" />
        </button>
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            className="h-10 w-10 shrink-0 overflow-hidden rounded-full"
            aria-label="프로필"
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
            aria-controls="profile-menu"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
          >
            <img src={profileSrc} alt="" className="h-full w-full object-cover" />
          </button>
          <ProfileMenu
            isOpen={isProfileMenuOpen}
            profileImageSrc={profileSrc}
            profileName="윤수호"
          />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
