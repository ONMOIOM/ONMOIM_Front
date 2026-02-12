import { useNavigate } from "react-router-dom";

import arrowForwardSrc from "../../assets/icons/arrow_forward_ios.png";
import plusSrc from "../../assets/icons/Plus.png";
import supervisorAccountSrc from "../../assets/icons/supervisor_account.png";
import logOutSrc from "../../assets/icons/Log out.png";

type ProfileMenuProps = {
  isOpen: boolean;
  profileImageSrc: string;
  profileName: string;
};

const ProfileMenu = ({
  isOpen,
  profileImageSrc,
  profileName,
}: ProfileMenuProps) => {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="profile-menu"
      role="menu"
      className="absolute right-0 z-50 mt-4 flex h-[355px] w-[410.61px] flex-col rounded-[15.92px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
    >
      <button
        type="button"
        className="relative flex w-full items-start gap-[17.23px] pl-[36.16px] pr-[31.83px] pt-[48.27px] pb-4 text-left"
        onClick={() => navigate("/profile")}
      >
        <div className="h-[48.47px] w-[48.47px] overflow-hidden rounded-full bg-gray-100">
          <img
            src={profileImageSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 pt-[1.86px]">
          <p className="text-h5 font-semibold leading-[24px] text-[var(--color-gray-900)]">
            {profileName}
          </p>
          <p className="mt-[5.45px] text-h2 text-[var(--color-gray-600)]">
            프로필 바로가기
          </p>
        </div>
        <img
          src={arrowForwardSrc}
          alt=""
          className="absolute right-[31.83px] top-[62.07px] h-[21.49px] w-[21.49px]"
          aria-hidden="true"
        />
      </button>
      <div className="px-6 pb-5">
        <button
          type="button"
          className="flex h-[74.01px] w-[346.95px] items-center gap-2 rounded-[15.92px] bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          onClick={() => navigate("/event-create")}
        >
          <img
            src={plusSrc}
            alt=""
            className="h-[37.4px] w-[37.4px]"
            aria-hidden="true"
          />
          <span className="text-h5 font-semibold text-[var(--color-gray-900)]">
            새로운 이벤트 만들기
          </span>
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-6 border-t border-gray-200 px-[31.83px] py-6">
        <button
          type="button"
          className="flex w-full items-center justify-start gap-3 text-left"
          onClick={() => navigate("/event-participants")}
        >
          <img
            src={supervisorAccountSrc}
            alt=""
            className="h-[19px] w-[19px]"
            aria-hidden="true"
          />
          <span className="text-h4 text-[#525252]">같은 행사 참여자 보기</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-start gap-3 text-left"
          onClick={() => {
            localStorage.removeItem("accessToken");
            navigate("/login", { replace: true });
          }}
        >
          <img
            src={logOutSrc}
            alt=""
            className="h-[19.1px] w-[19.1px]"
            aria-hidden="true"
          />
          <span className="text-h4 text-[#525252]">로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
