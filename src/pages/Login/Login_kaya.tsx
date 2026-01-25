import { Turnstile } from "@marsidev/react-turnstile";
import { useEmailAuthLogin } from "../../hooks/useEmailAuthLogin_kaya";

export default function Login() {
  const {
    email,
    setEmail,
    code,
    setCode,
    step,
    setTurnstileToken,
    loading,
    errorMsg,
    emailStatus,
    canSend,
    canVerify,
    handleSend,
    handleResend,
    handleVerify,
  } = useEmailAuthLogin();

  return (
    <main className="grid min-h-screen place-items-center bg-gray-50 px-4">
      <section className="w-full max-w-[720px] rounded-[28px] bg-gray-100 p-10">
        <div className="mx-auto max-w-[420px] text-center">
          <h1 className="mb-6 text-4xl font-bold">로그인 혹은 회원가입</h1>

          {step === "email" ? (
            <div className="space-y-3">
              <div
                className="flex h-11 items-center gap-3 rounded-xl bg-white px-4
                           focus-within:ring-1 focus-within:ring-gray-300"
              >
                <span className="text-lg">✉️</span>
                <input
                  className="flex-1 bg-transparent text-sm outline-none focus:outline-none"
                  placeholder="이메일을 입력해 주세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div
                className={[
                  "mt-2 flex items-center gap-2 text-sm h-5",
                  emailStatus === "idle" ? "opacity-0 select-none" : "opacity-100",
                ].join(" ")}
              >
                <span>{emailStatus === "valid" ? "🛡️" : "⚠️"}</span>
                <p className={emailStatus === "valid" ? "text-emerald-600" : "text-red-600"}>
                  올바른 이메일 양식
                </p>
              </div>

              {/* Turnstile */}
              <div className="mt-4 flex justify-center">
                <Turnstile
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onSuccess={(t) => setTurnstileToken(t)}
                  onExpire={() => setTurnstileToken("")}
                  onError={() => setTurnstileToken("")}
                />
              </div>

              {errorMsg ? (
                <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
              ) : (
                <div className="h-5" />
              )}

              <button
                className={[
                  "h-11 w-full rounded-xl bg-white font-semibold",
                  canSend ? "" : "opacity-50 cursor-not-allowed",
                ].join(" ")}
                disabled={!canSend}
                onClick={handleSend}
              >
                {loading === "send" ? "보내는 중..." : "인증 메일 보내기"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div
                className="flex h-11 items-center gap-3 rounded-xl bg-white px-4
                           focus-within:ring-1 focus-within:ring-gray-300"
              >
                <span className="text-lg">✉️</span>
                <input
                  className="flex-1 bg-transparent text-sm outline-none focus:outline-none"
                  value={email}
                  disabled
                />
              </div>

              <input
                className="mb-4 h-11 w-full rounded-lg bg-white px-3 text-sm tracking-widest"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              {errorMsg ? (
                <p className="text-sm text-red-600">{errorMsg}</p>
              ) : (
                <div className="h-5" />
              )}

              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>인증번호를 받지 못하셨나요?</span>
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={handleResend}
                  disabled={loading !== null}
                >
                  재발송
                </button>
              </div>

              <button
                className={[
                  "h-11 w-full rounded-xl bg-white font-semibold",
                  canVerify ? "" : "opacity-50 cursor-not-allowed",
                ].join(" ")}
                disabled={!canVerify}
                onClick={handleVerify}
              >
                {loading === "verify" ? "확인 중..." : "동의합니다"}
              </button>

              <p className="mt-4 text-[11px] leading-5 text-gray-400 break-keep">
                '동의합니다'를 클릭하면 약관 및 개인정보 보호정책에 동의하고
                <br />
                <span className="font-semibold text-blue-500">ONMOIM</span>
                으로부터 이벤트 알람 이메일을 수신하는 데 동의합니다.
                <br />
                이메일 빈도는 일정하지 않으며 데이터 전송 속도가 적용될 수 있습니다.
                <br />
                도움이 필요하실 경우 lixx17@naver.com으로 연락주시면 빠르게 도움 드리겠습니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}