import { useNavigate } from "react-router-dom";
import profileSrc from "../../assets/icons/profile.svg";
import editProfileSrc from "../../assets/icons/edit.png";
import instagramSrc from "../../assets/icons/icons_instagram.svg";
import twitterSrc from "../../assets/icons/TwitterGroup.svg";
import linkedinSrc from "../../assets/icons/icons_linkedin.svg";
import editProfileIconSrc from "../../assets/icons/editprofile.png";

const Profile = () => {
  const navigate = useNavigate();
  const profileSns = {
    instagramId: null,
    twitterId: null,
    linkedinId: null,
  };

  const instagramLabel = profileSns.instagramId
    ? profileSns.instagramId
    : "인스타 추가하기";
  const twitterLabel = profileSns.twitterId
    ? profileSns.twitterId
    : "트위터 추가하기";
  const linkedinLabel = profileSns.linkedinId
    ? profileSns.linkedinId
    : "링크드인 추가하기";

  return (
    <div className="relative min-h-screen">
      <div className="ml-[179px] mt-nav-bar-to-buttons flex items-center">
        <div className="relative h-[331px] w-[331px]">
          <img
            src={profileSrc}
            alt="프로필"
            className="h-full w-full rounded-full object-cover"
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 z-10 h-[65px] w-[65px] -translate-x-1/2 -translate-y-1/2"
            aria-label="프로필 이미지 변경"
          >
            <img
              src={editProfileSrc}
              alt=""
              className="h-full w-full object-contain"
            />
          </button>
        </div>
        <div className="ml-[54px] flex flex-col">
          <p className="text-h7 text-gray-900">윤수호</p>
          <p className="mt-[10px] text-h5 text-[#A0A09E]">
            2026년 10월 1일부터 이용중입니다
          </p>
          <p className="mt-[38px] text-h6 text-gray-900">
            사용자의 자기소개 부분
          </p>
        </div>
      </div>
      <div className="ml-[204.5px] mt-[60px] h-[232px] w-[280px] rounded-12 border border-[#BFBFBF]">
        <div className="flex h-full flex-col">
          <button
            type="button"
            className="flex flex-1 items-center gap-[19px] pl-[31px] text-left"
          >
            <img src={instagramSrc} alt="" className="h-6 w-6 shrink-0" />
            <span className="text-h4 text-gray-600">{instagramLabel}</span>
          </button>
          <div className="px-[16px]">
            <div className="h-px w-full bg-[#BFBFBF]" />
          </div>
          <button
            type="button"
            className="flex flex-1 items-center gap-[19px] pl-[31px] text-left"
          >
            <img src={twitterSrc} alt="" className="h-6 w-6 shrink-0" />
            <span className="text-h4 text-gray-600">{twitterLabel}</span>
          </button>
          <div className="px-[16px]">
            <div className="h-px w-full bg-[#BFBFBF]" />
          </div>
          <button
            type="button"
            className="flex flex-1 items-center gap-[19px] pl-[31px] text-left"
          >
            <img src={linkedinSrc} alt="" className="h-6 w-6 shrink-0" />
            <span className="text-h4 text-gray-600">{linkedinLabel}</span>
          </button>
        </div>
      </div>
      <button
        type="button"
        className="ml-[204.5px] mt-[40px] flex h-[53px] w-[280px] items-center justify-center gap-[10px] rounded-[10px] border border-[#BFBFBF] bg-white"
        onClick={() => navigate("/profile/edit")}
      >
        <img
          src={editProfileIconSrc}
          alt=""
          className="h-[26px] w-[26px] shrink-0"
          aria-hidden="true"
        />
        <span className="text-h5 font-semibold text-[#525252]">프로필 수정</span>
      </button>
    </div>
  );
};

export default Profile;
