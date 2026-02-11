import { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import profileSrc from "../../assets/icons/profile.svg";
import editProfileSrc from "../../assets/icons/edit.png";
import instagramSrc from "../../assets/icons/icons_instagram.svg";
import twitterSrc from "../../assets/icons/TwitterGroup.svg";
import linkedinSrc from "../../assets/icons/icons_linkedin.svg";
import editProfileIconSrc from "../../assets/icons/editprofile.png";
import { profileAPI } from "../../api/profile";
import useProfile from "../../hooks/useProfile";
import { compressImage } from "../../utils/imageCompression";
import { convertImageUrl } from "../../utils/imageUrlConverter";

const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // useProfile 훅 사용 (TanStack Query로 캐싱되어 깜빡임 방지)
  const { profile, loading } = useProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  const profileImageUrl = useMemo(() => {
    const url = convertImageUrl(localImageUrl || profile?.profileImageUrl);
    return url || profileSrc; // 기본 이미지로 fallback
  }, [localImageUrl, profile?.profileImageUrl]);
  
  const displayName = useMemo(() => profile?.nickname ?? "", [profile?.nickname]);
  const introduction = useMemo(() => profile?.introduction ?? "", [profile?.introduction]);
  const joinedAtText = "이용중입니다";
  
  const profileSns = useMemo(() => ({
    instagramId: profile?.instagramId ?? null,
    twitterId: profile?.twitterId ?? null,
    linkedinId: profile?.linkedinId ?? null,
  }), [profile?.instagramId, profile?.twitterId, profile?.linkedinId]);

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
      const blob = compressed as Blob;
      const imageFile = new File([blob], file.name || "image.jpg", {
        type: blob.type || "image/jpeg",
      });

      const res = await profileAPI.uploadProfileImage(imageFile);
      console.log("[Profile] 프로필 이미지 업로드 응답:", res);
      console.log("[Profile] res.success:", res.success);
      console.log("[Profile] res.data:", res.data);
      
      if (res.success && res.data) {
        // 백엔드에서 반환된 URL을 변환하여 저장
        const convertedUrl = convertImageUrl(res.data);
        console.log("[Profile] 변환된 URL:", convertedUrl);
        setLocalImageUrl(convertedUrl);
        
        // 프로필 쿼리 캐시 무효화하여 최신 데이터로 갱신
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      } else {
        console.error("[Profile] 프로필 이미지 업로드 실패 - 응답 형식 오류:", res);
      }
    } catch (error) {
      console.error("[Profile] 프로필 이미지 변경 실패:", error);
    } finally {
      event.target.value = "";
    }
  };

  // 메모이제이션으로 레이블 계산 최적화
  const instagramLabel = useMemo(
    () => profileSns.instagramId ? `@${profileSns.instagramId}` : "인스타 추가하기",
    [profileSns.instagramId]
  );
  const twitterLabel = useMemo(
    () => profileSns.twitterId ? `@${profileSns.twitterId}` : "트위터 추가하기",
    [profileSns.twitterId]
  );
  const linkedinLabel = useMemo(
    () => profileSns.linkedinId ? `@${profileSns.linkedinId}` : "링크드인 추가하기",
    [profileSns.linkedinId]
  );

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

  if (loading && !profile) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#F24148]"
          aria-label="로딩 중"
        />
      </div>
    );
  }

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
