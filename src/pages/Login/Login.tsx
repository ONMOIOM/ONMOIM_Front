import { useState, useMemo } from 'react';
import EmailSendPage from './EmailSendPage_sample';
import CodeExpiredPage from './CodeExpiredPage';
import { type Step } from './types/types';
import { verifyEmailCode, signUp, login } from '../../api/auth_updated';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // 백엔드 없이 임시
  const USE_MOCK = import.meta.env.VITE_USE_AUTH_MOCK === "true";


  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [step, setStep] = useState<Step>("email");

  // 인증 메일 전송 후 -> 로그인 / 회원가입
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const emailStatus = useMemo<"idle" | "invalid" | "valid">(() => {
    if (email.length === 0) return "idle";
    return isValidEmail(email) ? "valid" : "invalid";
  }, [email]);

  const canGoNext = emailStatus === "valid";

  const title = useMemo(() => {
    if (step === "email") return "로그인 혹은 회원가입";
    if (step === "signup") return "회원가입";
    return "로그인";
  }, [step]);


  // === 로그인/회원 가입 완료 버튼 클릭 === //
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  // 만료 판별 함수
  const isExpiredError = (e: any) => {
    const code = e?.response?.data?.code;
    const msg = e?.response?.data?.message ?? "";
    // ✅ 나중에 백엔드 code 확정되면 code 하나만 남기기
    return (
      code === "EMAIL_AUTH_CODE_EXPIRED" ||
      code === "AUTH_CODE_EXPIRED" ||
      msg.includes("만료") ||
      msg.toLowerCase().includes("expired")
    );
  };

  // 완료 버튼 핸들러 함수
  const handleComplete = async () => {
    const code = authCode.trim();
    if (!code) return;

    // ✅ MOCK 모드: 백엔드 없이도 로직 끝까지 테스트
    if (USE_MOCK) {
      setSubmitting(true);
      setErrorMsg(null);

      // 가짜 지연(UX/로딩 테스트용)
      await new Promise((r) => setTimeout(r, 400));

      // 만료 테스트
      if (code === "000000") {
        setSubmitting(false);
        setStep("expired");
        return;
      }

      // 실패 테스트
      if (code === "111111") {
        setSubmitting(false);
        setErrorMsg("인증 코드가 올바르지 않습니다. (MOCK)");
        return;
      }

      // 성공 테스트
      localStorage.setItem("accessToken", "mock_access_token_123");
      setSubmitting(false);
      navigate("/", { replace: true });
      return;
    }


    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1) 코드 검증
      const v = await verifyEmailCode({ email, authcode: code });
      if (!v.success) throw new Error(v.message ?? "인증 코드 검증 실패");

      // 2) 회원가입이면 회원가입 먼저
      if (step === "signup") {
        const s = await signUp({ email, authcode: code });
        if (!s.success) throw new Error(s.message ?? "회원가입 실패");
      }

      // 3) 로그인(토큰 받기)
      const l = await login({ email, authcode: code });
      if (!l.success || !l.data?.accessToken) {
        throw new Error(l.message ?? "로그인 실패(토큰 없음)");
      }

      // 4) 토큰 저장
      localStorage.setItem("accessToken", l.data.accessToken);

      // 5) 메인 화면 이동
      navigate("/", { replace: true });
    } catch (e: any) {
      if (isExpiredError(e)) {
        setStep("expired");
        return;
      }
      setErrorMsg(e?.response?.data?.message ?? e?.message ?? "처리에 실패했어.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="min-h-screen bg-gray-50 px-4">
      <div className="mx-auto flex min-h-screen max-w-[990px] items-center justify-center">
        <section className="w-full rounded-[28px] bg-white px-6 py-14 shadow-sm sm:px-10">
          <div className="mx-auto w-full max-w-[420px] text-center">
            <h1 className="mb-10 text-[34px] font-bold tracking-tight text-gray-900">
              {title}
            </h1>

            {/* ===== 이메일 입력 ===== */}
            {step === "email" && (
              <div>
                <div className="flex h-11 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4">
                <span className="text-base text-gray-500">✉️</span>
                  <input
                  className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="이메일을 입력해 주세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* 유효한 이메일 상태 문구 */}
                <div
                  className={[
                    "mt-2 flex h-5 items-center justify-center gap-2 text-xs",
                    emailStatus === "idle" ? "opacity-0" : "opacity-100",
                  ].join(" ")}
                >
                  <span className="text-[12px]">
                    {emailStatus === "valid" ? "🛡️" : "⚠️"}
                  </span>
                  <p className={emailStatus === "valid" ? "text-emerald-600" : "text-red-600"}>
                    올바른 이메일 양식
                  </p>
                </div>

                <button
                type="button"
                className={[
                  "h-11 w-full rounded-xl bg-white font-semibold",
                  canGoNext
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed",
                ].join(" ")}
                disabled={!canGoNext}
                onClick={() => setStep("sending")}
                >
                  로그인
                </button>
              </div>
            )}

            {/* 인증 메일 발송 모달 */}
            {step === "sending" && (
              <EmailSendPage
                email={email}
                onClose={() => setStep("email")}
                onResult={(registered) => {
                  setIsRegistered(registered);
                  setStep(registered ? "login" : "signup");
                }} 
              />
            )}

            {/* 오래된 코드 페이지 */}
            {step === "expired" && (
              <CodeExpiredPage
                onConfirm={() => {
                  // 1번 페이지로 이동 (초기화 포함)
                  setEmail("");
                  setAuthCode("");
                  setIsRegistered(null);
                  setStep("email");
                }}
              />
            )}


            {/* 인증 코드 입력 (회원가입 / 로그인) */}
            {(step === "signup" || step === "login") && (
              <div className="space-y-3">
                <div className="flex h-11 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4">
                  <span className="text-base text-gray-500">✉️</span>
                  <input
                    className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
                    value={email}
                    disabled
                  />
                </div>
                
                <div className="flex h-5 items-center justify-center gap-2 text-xs">
                  <span className="text-[12px]">✅</span>
                  <p className="text-emerald-600">올바른 이메일 양식</p>
                </div>

                {/* 인증코드 입력 */}
                <input
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-center text-sm tracking-[0.35em] text-gray-900 outline-none placeholder:text-gray-300"
                placeholder="000000"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                />

                {/* 재발송 링크 */}
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>인증번호를 받지 못하셨나요?</span>
                  <button 
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    setAuthCode("");
                    setErrorMsg(null);
                    setStep("sending");
                  }}
                  >
                    재발송
                  </button>
                </div>

                {/* 에러 메시지(임시) */}
                {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

                <button
                type="button" 
                className="h-11 w-full rounded-xl bg-white font-semibold"
                onClick={handleComplete}
                disabled={submitting}
                >
                  {submitting ? "처리 중..." : step === "signup" ? "동의합니다" : "로그인하기"}
                </button>

                {/* 회원가입의 경우, 약관 문구 보여주기 */}
                {step === "signup" && (
                  <p className="mt-4 text-[11px] leading-5 text-gray-400 break-keep">
                    '동의합니다'를 클릭하면 약관 및 개인정보 보호정책에 동의하고
                    <br/>
                    <span className="font-semibold text-blue-500">ONMOIM</span>
                    으로부터 이벤트 알람 이메일을 수신하는 데 동의합니다.
                    <br />
                    이메일 빈도는 일정하지 않으며 데이터 전송 속도가 적용될 수 있습니다.
                    <br />
                    도움이 필요하실 경우 lixx17@naver.com으로 연락주시면 빠르게 도움 드리겠습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}