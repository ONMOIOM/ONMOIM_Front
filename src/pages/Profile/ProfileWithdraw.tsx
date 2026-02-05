import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileAPI } from "../../api/profile";
import useProfile from "../../hooks/useProfile";

const ProfileWithdraw = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const profileEmail = profile?.email || "lixx7273@gmail.com";
  const [isFirstChecked, setIsFirstChecked] = useState(false);
  const [isSecondChecked, setIsSecondChecked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isWithdrawEnabled = isFirstChecked && isSecondChecked;

  const handleWithdraw = async () => {
    if (!isWithdrawEnabled || isDeleting) return;
    setIsDeleting(true);
    try {
      await profileAPI.deleteProfile();
      navigate("/login", { replace: true });
    } catch (error) {
      console.warn("[ProfileWithdraw] 회원 탈퇴 실패:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <p className="mt-[200px] text-center text-h6 text-[#1A1A1A]">
        회원 탈퇴 전 아래 유의사항을 확인해주세요
      </p>
      <div className="mx-auto mt-[42px] h-[242px] w-[641px] rounded-12 bg-[#F3F3F3] pl-[35px] pt-[29px] pr-[23px]">
        <ul className="list-disc space-y-[10px] text-h2 text-[#000000]">
          <li>탈퇴 시 해당 계정으로 모든 서비스를 이용할 수 없습니다.</li>
          <li>계정이 삭제된 이후에는 복구할 수 없습니다.</li>
          <li>
            탈퇴 즉시, 같은 계정으로 7일 동안 다시 가입할 수 없습니다.
            <br />
            만약 이용 약관에 따라 회원 자격을 제한 또는 정지당한 회원이 그
            조치 기간에 탈퇴하는 경우에는 해당 조치 기간 동안은 다시 가입할 수
            없습니다.
          </li>
          <li>
            행사, 친구, 같은 행사 참여자 기록 등 활동한 내역이 모두
            삭제되며, 복구할 수 없습니다.
          </li>
          <li>보유하고 계신 멤버십이 모두 소멸되며, 복구할 수 없습니다.</li>
        </ul>
      </div>
      <div className="mx-auto mt-[28px] w-[641px]">
        <label className="flex items-start gap-[15px] text-h2 text-[#6F6F6F]">
          <input
            type="checkbox"
            className="mt-[2px] h-[20px] w-[20px] rounded-4 border border-[#D9D9D9] bg-white accent-[#F24148]"
            checked={isFirstChecked}
            onChange={(event) => setIsFirstChecked(event.target.checked)}
          />
          <span>
            유의 사항을 모두 확인하였으며, 회원 탈퇴시 보유한 멤버십이
            소멸되는 것에 동의합니다.
          </span>
        </label>
        <label className="mt-[26px] flex items-start gap-[15px] text-h2 text-[#6F6F6F]">
          <input
            type="checkbox"
            className="mt-[2px] h-[20px] w-[20px] rounded-4 border border-[#D9D9D9] bg-white accent-[#F24148]"
            checked={isSecondChecked}
            onChange={(event) => setIsSecondChecked(event.target.checked)}
          />
          <span>계정은 탈퇴 후 복구할 수 없으며, 이에 동의합니다.</span>
        </label>
      </div>
      <div className="mx-auto mt-[42px] flex h-[49px] w-[641px] items-center">
        <div className="flex h-full w-[161px] items-center justify-center text-h4 text-[#4D4D4D]">
          아이디
        </div>
        <div className="h-full w-[480px] rounded-12 border border-[#E5E8EB] bg-white">
          <input
            type="email"
            value={profileEmail}
            readOnly
            className="h-full w-full bg-transparent pl-[35px] text-h4 text-[#404040] outline-none"
            aria-label="아이디"
          />
        </div>
      </div>
      <div className="mx-auto mt-[170px] flex w-[641px] items-center gap-[19px]">
        <button
          type="button"
          className="flex h-[64px] w-[311px] items-center justify-center rounded-[10px] border border-[#BFBFBF] bg-[#F7F7F7] text-h4 text-[#525252]"
          onClick={() => navigate(-1)}
        >
          돌아가기
        </button>
        <button
          type="button"
          className="flex h-[64px] w-[311px] items-center justify-center rounded-[10px] bg-[#F24148] text-h4 text-white disabled:opacity-50"
          disabled={!isWithdrawEnabled || isDeleting}
          onClick={handleWithdraw}
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default ProfileWithdraw;
