// 백엔드 없이 로직 검증 위해서 

import { useState } from "react";
import Turnstile from "react-turnstile";
import { sendVerificationEmail } from "../../api/auth_updated";

type Props = {
  email: string;
  onResult: (isRegistered: boolean) => void;
  onClose: () => void;
};

export default function EmailSendPage({ email, onResult, onClose }: Props) {
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

    // 1) sitekey가 있을 때는 Turnstile 인증이 먼저 필요
    if (sitekey && !token) {
      alert("보안 확인을 먼저 완료해주세요.");
      return;
    }

    setLoading(true);
    try {
      const turnstileToken = sitekey ? token : "mock_token";
      console.log("[EmailSendPage] sendMail called", { email, turnstileToken });

      const res = await sendVerificationEmail({ email, turnstileToken });
      console.log("[EmailSendPage] sendVerificationEmail res", res);

      if (!res.success || !res.data) {
        throw new Error(res.message ?? "인증 메일 발송 실패");
      }

      // ✅ isRegistered가 없으면 분기가 깨지니까 안전장치
      const registered = Boolean(res.data.isRegistered);
      console.log("[EmailSendPage] calling onResult", registered);

      onResult(registered);
    } catch (err) {
      console.log("[EmailSendPage] sendMail error", err);
      alert("인증 메일 발송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="close overlay" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="w-full max-w-[420px] rounded-2xl bg-white px-8 py-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900">인증 이메일 전송</h2>
          <p className="mt-2 text-sm text-gray-500 break-keep">
            보안을 위해 인증 후 버튼을 눌러 인증메일을 발송해주세요.
          </p>

          <div className="mt-6 flex justify-center">
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
              <div className="flex h-12 w-full items-center justify-between rounded-md bg-gray-900 px-4 text-sm text-white">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {USE_MOCK ? "(MOCK) 진행 가능" : "sitekey 없음"}
                </span>
                <span className="text-xs opacity-70">CLOUDFLARE</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="mt-6 h-11 w-full rounded-xl bg-gray-100 text-sm font-semibold text-gray-900 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
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
