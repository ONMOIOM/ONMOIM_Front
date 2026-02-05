import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileSrc from "../../assets/icons/profile.svg";
import editProfileSrc from "../../assets/icons/edit.png";
import instagramSrc from "../../assets/icons/icons_instagram.svg";
import twitterSrc from "../../assets/icons/TwitterGroup.svg";
import linkedinSrc from "../../assets/icons/icons_linkedin.svg";
import editProfileIconSrc from "../../assets/icons/editprofile.png";
import { profileAPI } from "../../api/profile";
import useProfile from "../../hooks/useProfile";
import { formatDate } from "../../utils/formatDate";
import { compressImage } from "../../utils/imageCompression";

const Profile = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const profileImageUrl = localImageUrl || profile?.imageUrl || profileSrc;
  const displayName = profile?.nickname || "윤수호";
  const introduction = profile?.introduction || "사용자의 자기소개 부분";
  const joinedAtText = profile?.createdAt
    ? `${formatDate(profile.createdAt, "YYYY년 MM월 DD일")}부터 이용중입니다`
    : "2026년 10월 1일부터 이용중입니다";
  const profileSns = {
    instagramId: profile?.instagramId ?? null,
    twitterId: profile?.twitterId ?? null,
    linkedinId: profile?.linkedinId ?? null,
  };

  const handleSelectProfileImage = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    try {
      const compressed = await compressImage(file, 512, 0.85);
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to read image"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(compressed);
      });

      setLocalImageUrl(dataUrl);
      await profileAPI.updateProfile({
        memberId: profile?.memberId,
        imageUrl: dataUrl,
      });
    } catch (error) {
      console.warn("[Profile] 프로필 이미지 변경 실패:", error);
    } finally {
      event.target.value = "";
    }
  };

  const instagramLabel = profileSns.instagramId
    ? `@${profileSns.instagramId}`
    : "인스타 추가하기";
  const twitterLabel = profileSns.twitterId
    ? `@${profileSns.twitterId}`
    : "트위터 추가하기";
  const linkedinLabel = profileSns.linkedinId
    ? `@${profileSns.linkedinId}`
    : "링크드인 추가하기";

  const openSnsProfile = (platform: "instagram" | "twitter" | "linkedin") => {
    const rawId =
      platform === "instagram"
        ? profileSns.instagramId
        : platform === "twitter"
          ? profileSns.twitterId
          : profileSns.linkedinId;
    if (!rawId) return;
    const id = rawId.replace(/^@/, "");
    const url =
      platform === "instagram"
        ? `https://www.instagram.com/${id}`
        : platform === "twitter"
          ? `https://x.com/${id}`
          : `https://www.linkedin.com/in/${id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-screen">
      <div className="ml-[179px] mt-nav-bar-to-buttons flex items-center">
        <div className="relative h-[331px] w-[331px]">
          <img
            src={profileImageUrl}
            alt="프로필"
            className="h-full w-full rounded-full object-cover"
          />
          <button
            type="button"
            className="absolute bottom-[16px] right-[16px] z-10 h-[65px] w-[65px]"
            aria-label="프로필 이미지 변경"
            onClick={handleSelectProfileImage}
          >
            <img
              src={editProfileSrc}
              alt=""
              className="h-full w-full object-contain"
            />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageChange}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        <div className="ml-[54px] flex flex-col">
          <p className="text-h7 text-gray-900">{displayName}</p>
          <p className="mt-[10px] text-h5 text-[#A0A09E]">
            {joinedAtText}
          </p>
          <p className="mt-[38px] text-h6 text-gray-900">{introduction}</p>
        </div>
      </div>
      <div className="ml-[204.5px] mt-[60px] h-[232px] w-[280px] rounded-12 border border-[#BFBFBF]">
        <div className="flex h-full flex-col">
          <button
            type="button"
            className="flex flex-1 items-center gap-[19px] pl-[31px] text-left disabled:cursor-default disabled:opacity-50"
            onClick={() => openSnsProfile("instagram")}
            disabled={!profileSns.instagramId}
          >
            <img src={instagramSrc} alt="" className="h-6 w-6 shrink-0" />
            <span className="text-h4 text-gray-600">{instagramLabel}</span>
          </button>
          <div className="px-[16px]">
            <div className="h-px w-full bg-[#BFBFBF]" />
          </div>
          <button
            type="button"
            className="flex flex-1 items-center gap-[19px] pl-[31px] text-left disabled:cursor-default disabled:opacity-50"
            onClick={() => openSnsProfile("twitter")}
            disabled={!profileSns.twitterId}
          >
            <img src={twitterSrc} alt="" className="h-6 w-6 shrink-0" />
            <span className="text-h4 text-gray-600">{twitterLabel}</span>
          </button>
          <div className="px-[16px]">
            <div className="h-px w-full bg-[#BFBFBF]" />
          </div>
          <button
            type="button"
            className="flex flex-1 items-center gap-[19px] pl-[31px] text-left disabled:cursor-default disabled:opacity-50"
            onClick={() => openSnsProfile("linkedin")}
            disabled={!profileSns.linkedinId}
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
