import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import profileSrc from "../../assets/icons/profile.svg";
import editProfileSrc from "../../assets/icons/edit.png";
import instagramSrc from "../../assets/icons/icons_instagram.svg";
import twitterSrc from "../../assets/icons/TwitterGroup.svg";
import linkedinSrc from "../../assets/icons/icons_linkedin.svg";
import editProfileIconSrc from "../../assets/icons/editprofile.png";
import { profileAPI } from "../../api/profile";
import EmailFlowModal from "../../components/profile/EmailFlowModal";
import InstagramAddModal from "../../components/profile/InstagramAddModal";
import TwitterAddModal from "../../components/profile/TwitterAddModal";
import LinkedinAddModal from "../../components/profile/LinkedinAddModal";
import useProfile from "../../hooks/useProfile";
import { compressImage } from "../../utils/imageCompression";
import { convertImageUrl } from "../../utils/imageUrlConverter";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const profileImageUrl = convertImageUrl(localImageUrl || profile?.profileImageUrl);
  const hasInitializedProfile = useRef(false);
  const [profileSns, setProfileSns] = useState<{
    instagramId: string | null;
    twitterId: string | null;
    linkedinId: string | null;
  }>({
    instagramId: null,
    twitterId: null,
    linkedinId: null,
  });

  const instagramLabel = profileSns.instagramId
    ? profileSns.instagramId
    : "인스타 추가하기";
  const twitterLabel = profileSns.twitterId
    ? profileSns.twitterId
    : "트위터 추가하기";
  const linkedinLabel = profileSns.linkedinId
    ? profileSns.linkedinId
    : "링크드인 추가하기";

  const [profileName, setProfileName] = useState({
    firstName: "",
    lastName: "",
  });
  const [introductionText, setIntroductionText] = useState("");
  const [profileEmail, setProfileEmail] = useState(profile?.email ?? "");
  const joinedAtText = "현재 활동중인 유저 사용자입니다.";
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(false);
  const [isLinkedinModalOpen, setIsLinkedinModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const emailStepParam = searchParams.get("emailStep");
  const emailModalStep =
    emailStepParam === "change" ||
    emailStepParam === "verify" ||
    emailStepParam === "result" ||
    emailStepParam === "code" ||
    emailStepParam === "success"
      ? emailStepParam
      : null;

  const setEmailStep = (
    step: "change" | "verify" | "result" | "code" | "success" | null,
    options?: { replace?: boolean },
  ) => {
    const nextParams = new URLSearchParams(searchParams);
    if (step) {
      nextParams.set("emailStep", step);
    } else {
      nextParams.delete("emailStep");
    }
    setSearchParams(nextParams, options);
  };

  const handleUpdateSns = async (
    key: "instagramId" | "twitterId" | "linkedinId",
    value: string,
  ) => {
    const normalized = value.trim() || null;
    setProfileSns((prev) => ({
      ...prev,
      [key]: normalized,
    }));

    try {
      await profileAPI.updateProfile({ [key]: normalized });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (error) {
      console.warn("[ProfileEdit] SNS 저장 실패:", error);
    }
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
      const blob = compressed as Blob;
      const imageFile = new File([blob], file.name || "image.jpg", {
        type: blob.type || "image/jpeg",
      });

      const res = await profileAPI.uploadProfileImage(imageFile);
      console.log("[ProfileEdit] 프로필 이미지 업로드 응답:", res);
      console.log("[ProfileEdit] res.success:", res.success);
      console.log("[ProfileEdit] res.data:", res.data);
      
      if (res.success && res.data) {
        // 백엔드에서 반환된 URL을 변환하여 저장
        const convertedUrl = convertImageUrl(res.data);
        console.log("[ProfileEdit] 변환된 URL:", convertedUrl);
        setLocalImageUrl(convertedUrl);
      } else {
        console.error("[ProfileEdit] 프로필 이미지 업로드 실패 - 응답 형식 오류:", res);
      }
    } catch (error) {
      console.error("[ProfileEdit] 프로필 이미지 변경 실패:", error);
    } finally {
      event.target.value = "";
    }
  };

  const handleSaveProfile = async () => {
    if (isSaving) return;
    const firstName = profileName.firstName.trim();
    const lastName = profileName.lastName.trim();
    const combinedName = `${lastName}${firstName}`.trim() || firstName || lastName;

    setIsSaving(true);
    try {
      await profileAPI.updateProfile({
        nickname: combinedName,
        introduction: introductionText,
        instagramId: profileSns.instagramId,
        twitterId: profileSns.twitterId,
        linkedinId: profileSns.linkedinId,
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      navigate("/profile");
    } catch (error) {
      console.warn("[ProfileEdit] 회원 정보 수정 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!profile || hasInitializedProfile.current) return;

    const baseName = profile.nickname?.trim();
    if (baseName) {
      const parts = baseName.split(/\s+/);
      if (parts.length >= 2) {
        setProfileName({
          lastName: parts[0],
          firstName: parts.slice(1).join(" "),
        });
      } else {
        setProfileName({
          lastName: "",
          firstName: parts[0],
        });
      }
    }

    if (profile.introduction) {
      setIntroductionText(profile.introduction);
    }

    if (profile.email) {
      setProfileEmail(profile.email);
    }

    setProfileSns({
      instagramId: profile.instagramId ?? null,
      twitterId: profile.twitterId ?? null,
      linkedinId: profile.linkedinId ?? null,
    });

    hasInitializedProfile.current = true;
  }, [profile]);

  return (
    <div className="relative min-h-screen">
      <div className="relative ml-[179px] mt-nav-bar-to-buttons h-[331px]">
        <p className="absolute left-[385px] top-1/2 -translate-y-full text-h5 font-semibold text-[#525252]">
          이름
        </p>
        <p className="absolute left-[667px] top-1/2 -translate-y-full text-h5 font-semibold text-[#525252]">
          성
        </p>
        <div className="absolute left-[385px] top-[calc(50%+8px)] h-[58px] w-[258px] rounded-[10px] border border-[#BFBFBF] bg-white">
          <input
            type="text"
            value={profileName.firstName}
            onChange={(event) =>
              setProfileName((prev) => ({
                ...prev,
                firstName: event.target.value,
              }))
            }
            className="h-full w-full bg-transparent pl-[24px] text-h5 font-semibold text-[#525252] outline-none"
            aria-label="이름"
          />
        </div>
        <div className="absolute left-[667px] top-[calc(50%+8px)] h-[58px] w-[203px] rounded-[10px] border border-[#BFBFBF] bg-white">
          <input
            type="text"
            value={profileName.lastName}
            onChange={(event) =>
              setProfileName((prev) => ({
                ...prev,
                lastName: event.target.value,
              }))
            }
            className="h-full w-full bg-transparent pl-[24px] text-h5 font-semibold text-[#525252] outline-none"
            aria-label="성"
          />
        </div>
        <div className="absolute left-[385px] top-[calc(50%+93px)] flex flex-col">
          <div className="flex flex-col gap-[8px]">
            <p className="text-h5 font-semibold text-[#525252]">자기소개</p>
            <div className="w-[485px] rounded-[10px] border border-[#BFBFBF] bg-white px-[21px] py-[20px]">
              <textarea
                value={introductionText}
                onChange={(event) => setIntroductionText(event.target.value)}
                placeholder="자기소개를 입력하세요."
                className="min-h-[24px] w-full resize-none bg-transparent text-h4 text-gray-900 outline-none placeholder:text-gray-400"
                aria-label="자기소개"
              />
            </div>
          </div>
          <div className="mt-[18px] flex flex-col gap-[8px]">
            <p className="text-h5 font-semibold text-[#525252]">이메일</p>
            <div className="relative h-[58px] w-[485px] rounded-[10px] border border-[#BFBFBF] bg-white">
              <input
                type="email"
                value={profileEmail}
                onChange={() => {}}
                className="h-full w-full bg-transparent pl-[24px] pr-[56px] text-h5 font-semibold text-[#525252] outline-none"
                aria-label="이메일"
                readOnly
              />
              <button
                type="button"
                className="absolute right-[22px] top-1/2 -translate-y-1/2"
                aria-label="이메일 수정"
                onClick={() => setEmailStep("change")}
              >
                <img
                  src={editProfileIconSrc}
                  alt=""
                  className="h-[26px] w-[26px]"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
          <div className="mt-[25px] flex items-center gap-[17px]">
            <button
              type="button"
              className="flex h-[64px] w-[234px] items-center justify-center rounded-[10px] border border-[#BFBFBF] bg-white text-h4 text-gray-600"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
            <button
              type="button"
            className="flex h-[64px] w-[234px] items-center justify-center rounded-[10px] bg-[#F24148] text-h4 text-white disabled:opacity-60"
            onClick={handleSaveProfile}
            disabled={isSaving}
            >
              저장
            </button>
          </div>
          <p className="mt-[100px] w-[485px] text-center text-h3 text-[#A0A09E]">
            {joinedAtText}
          </p>
          <button
            type="button"
            className="mt-[13px] w-[485px] text-center text-h3 text-[#FB2C36]"
            onClick={() => navigate("/profile/withdraw")}
          >
            탈퇴하기
          </button>
        </div>
        <div className="relative h-[331px] w-[331px]">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="프로필"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-[#D9D9D9]" />
          )}
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
      </div>
      <div className="ml-[204.5px] mt-[60px] h-[232px] w-[280px] rounded-12 border border-[#BFBFBF]">
        <div className="flex h-full flex-col">
          <button
            type="button"
            className="flex flex-1 items-center gap-[19px] pl-[31px] text-left"
            onClick={() => setIsInstagramModalOpen(true)}
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
            onClick={() => setIsTwitterModalOpen(true)}
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
            onClick={() => setIsLinkedinModalOpen(true)}
          >
            <img src={linkedinSrc} alt="" className="h-6 w-6 shrink-0" />
            <span className="text-h4 text-gray-600">{linkedinLabel}</span>
          </button>
        </div>
      </div>
      <EmailFlowModal
        step={emailModalStep}
        email={profileEmail}
        onClose={() => setEmailStep(null, { replace: true })}
        onRequestVerification={() => setEmailStep("verify")}
        onConfirmVerification={() => setEmailStep("result")}
        onConfirmEmail={() => setEmailStep("code")}
        onConfirmCode={() => setEmailStep("success")}
        onCompleteEmailChange={(nextEmail) => setProfileEmail(nextEmail)}
      />
      <InstagramAddModal
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
        initialInstagramId={profileSns.instagramId}
        onConfirm={(instagramId) => handleUpdateSns("instagramId", instagramId)}
      />
      <TwitterAddModal
        isOpen={isTwitterModalOpen}
        onClose={() => setIsTwitterModalOpen(false)}
        initialTwitterId={profileSns.twitterId}
        onConfirm={(twitterId) => handleUpdateSns("twitterId", twitterId)}
      />
      <LinkedinAddModal
        isOpen={isLinkedinModalOpen}
        onClose={() => setIsLinkedinModalOpen(false)}
        initialLinkedinId={profileSns.linkedinId}
        onConfirm={(linkedinId) => handleUpdateSns("linkedinId", linkedinId)}
      />
    </div>
  );
};

export default ProfileEdit;
