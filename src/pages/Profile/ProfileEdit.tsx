import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import profileSrc from "../../assets/icons/profile.svg";
import editProfileSrc from "../../assets/icons/edit.png";
import instagramSrc from "../../assets/icons/icons_instagram.svg";
import twitterSrc from "../../assets/icons/TwitterGroup.svg";
import linkedinSrc from "../../assets/icons/icons_linkedin.svg";
import editProfileIconSrc from "../../assets/icons/editprofile.png";
import EmailFlowModal from "../../components/profile/EmailFlowModal";
import InstagramAddModal from "../../components/profile/InstagramAddModal";
import TwitterAddModal from "../../components/profile/TwitterAddModal";
import LinkedinAddModal from "../../components/profile/LinkedinAddModal";

const ProfileEdit = () => {
  const navigate = useNavigate();
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
    firstName: "수호",
    lastName: "윤",
  });
  const [introductionText, setIntroductionText] = useState(
    "일일일일일일일일일일일일일",
  );
  const [profileEmail, setProfileEmail] = useState("lixx7273@gmail.com");
  const joinedAtText = "2026년 10월 1일부터 이용중입니다";
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(false);
  const [isLinkedinModalOpen, setIsLinkedinModalOpen] = useState(false);
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
                className="min-h-[24px] w-full resize-none bg-transparent text-h4 text-gray-900 outline-none"
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
              className="flex h-[64px] w-[234px] items-center justify-center rounded-[10px] bg-[#F24148] text-h4 text-white"
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
        onConfirm={(instagramId) =>
          setProfileSns((prev) => ({
            ...prev,
            instagramId,
          }))
        }
      />
      <TwitterAddModal
        isOpen={isTwitterModalOpen}
        onClose={() => setIsTwitterModalOpen(false)}
        initialTwitterId={profileSns.twitterId}
        onConfirm={(twitterId) =>
          setProfileSns((prev) => ({
            ...prev,
            twitterId,
          }))
        }
      />
      <LinkedinAddModal
        isOpen={isLinkedinModalOpen}
        onClose={() => setIsLinkedinModalOpen(false)}
        initialLinkedinId={profileSns.linkedinId}
        onConfirm={(linkedinId) =>
          setProfileSns((prev) => ({
            ...prev,
            linkedinId,
          }))
        }
      />
    </div>
  );
};

export default ProfileEdit;
