// 백엔드 없이 로직 검증 위해서 
import { useState } from "react";
import Turnstile from "react-turnstile";
// authFlow
import { sendEmailAndGetMode } from "./services/authFlow";

type Props = {
  email: string;
  onResult: (mode: "login" | "signup") => void;
  onClose: () => void;
};

export default function EmailSendPage({ email, onResult, onClose }: Props) {
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;


  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const canSend = !!email.trim() && !!sitekey && !!token && !loading;

  const sendMail = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    } 

    if (!sitekey) {
      alert("Turnstile site key가 설정되지 않았습니다. (.env 확인)");
      return;
    }

    if (!token) {
      alert("보안 확인을 먼저 완료해주세요.");
      return;
    }

    setLoading(true);
    try {
      // 실제 turnstileToken 필요
      const turnstileToken = sitekey ? token : "mock_token";
      
      const mode = await sendEmailAndGetMode(email, turnstileToken);

      onResult(mode);
    } catch (err) {
      console.log("[EmailSendPage] sendMail error", err);
      alert("인증 메일 발송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="absolute inset-0 bg-black/0"
        onClick={onClose}
        aria-label="close overlay"
      />

      {/* 카드 */}
      <div className="relative bg-[#F7F7F8] w-[372px] h-[511px] rounded-[40px] flex flex-col text-center">
        <div className="w-full max-w-[372px] flex flex-col items-center text-center">
          <h2 className="mt-[102.71px] text-[32px] font-bold text-[#1A1A1A]">
            인증 이메일 전송
          </h2>

          <p className="mt-[14px] text-[12px] font-medium text-[#595959]">
            원활한 환경을 제공하기 위해 인증을 진행해주세요.
          </p>

          {/* Turnstile 영역 (자리 고정) */}
          <div className="mt-[53.14px] w-full flex justify-center">
            <div className="w-full h-[64px] flex items-center justify-center">
              {/* Turnstile site key 받기 */}
              {sitekey ? (
                <Turnstile
                  sitekey={sitekey}
                  onSuccess={(t) => {
                    console.log("[EmailSendPage] turnstile success", t);
                    setToken(t);
                  }}
                  onError={() => {
                    setToken("");
                    alert("보안 인증에 실패했습니다.");
                  }}
                  onExpire={() => {
                    setToken("");
                    alert("보안 인증이 만료됐어요. 다시 진행해주세요.");
                  }}
                />
              ) : (
                // sitekey 없을 때도 동일한 높이로 "자리"만 유지 (스샷 느낌)
                <div className="w-full h-[69px] bg-[#111] px-[16px] flex items-center justify-between text-[#FFF]">
                  Turnstile site key 받고 나서...!
                </div>
              )}
            </div>
          </div>

          {/* 버튼 */}
          <button
            type="button"
            className="
              mt-[41px] mb-[115px]
              w-full h-[64px]
              rounded-[10px]
              bg-[#F24148]
              text-[#FFFFFF]
              text-[16px]
              font-semibold
            "
            onClick={sendMail}
            disabled={!canSend}
          >
            {loading ? "발송 중..." : "인증 이메일 받기"}
          </button>
        </div>
      </div>
    </div>
  );
}
