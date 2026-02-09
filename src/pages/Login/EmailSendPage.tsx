// 백엔드 없이 로직 검증 위해서 

import { useState } from "react";
import Turnstile from "react-turnstile";
import { sendVerificationEmail } from "../../api/auth_updated";

type Props = {
  email: string;
  onResult: (isRegistered: boolean) => void;
  onClose: () => void;
  isResend?: boolean; // 재전송 여부
};

export default function EmailSendPage({ email, onResult, onClose, isResend = false }: Props) {
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  // ✅ 백엔드 없이 로직 테스트하려면 .env에 VITE_USE_AUTH_MOCK=true
  const USE_MOCK = import.meta.env.VITE_USE_AUTH_MOCK === "true";

  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // ✅ Mock 규칙(테스트용): 이메일에 "new" 포함이면 신규회원(signup), 아니면 기존회원(login)
  const mockIsRegistered = (emailAddr: string) => !emailAddr.includes("new");

  const sendMail = async () => {
    // 0) Mock 모드면 서버 없이도 바로 분기 가능
    if (USE_MOCK) {
      const registered = mockIsRegistered(email);
      console.log("[EmailSendPage][MOCK] isRegistered =", registered);
      onResult(registered);
      return;
    }

    // 1) sitekey가 있을 때는 Turnstile 인증이 먼저 필요 (재전송도 포함)
    if (sitekey && !token) {
      alert("보안 확인을 먼저 완료해주세요.");
      return;
    }

    setLoading(true);
    try {
      const turnstileToken = sitekey ? token : "onmoim";
      console.log("[EmailSendPage] 인증 이메일 받기 요청", {
        email,
        turnstileToken: turnstileToken ? "(있음)" : "(없음)",
      });

      const res = await sendVerificationEmail({ email, turnstileToken });
      console.log("[EmailSendPage] sendVerificationEmail 응답", {
        success: res.success,
        code: (res as any).code,
        message: res.message,
        data: res.data,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message ?? "인증 메일 발송 실패");
      }

      const registered = Boolean(res.data.isRegistered);
      onResult(registered);
    } catch (err: any) {
      console.log("[EmailSendPage] 인증 이메일 발송 에러", {
        message: err?.message,
        response: err?.response?.data,
        code: err?.response?.data?.code,
      });
      alert("인증 메일 발송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <button
        className="absolute inset-0 bg-black/0"
        onClick={onClose}
        aria-label="close overlay"
      />

      {/* 카드 */}
      <div className="relative bg-[#F7F7F8] w-[372px] h-[511px] rounded-[40px] flex flex-col text-center">
        {/* 내부 컨텐츠 폭 */}
        <div className="w-full max-w-[372px] flex flex-col items-center text-center">
          {/* 타이틀 */}
          <h2 className="mt-[102.71px] text-[32px] font-bold text-[#1A1A1A]">
            인증 이메일 전송
          </h2>

          {/* 설명 */}
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
                  onError={() => alert("보안 인증에 실패했습니다.")}
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
            disabled={loading}
          >
            {loading ? "발송 중..." : "인증 이메일 받기"}
          </button>
        </div>
      </div>
    </div>
  );
}
