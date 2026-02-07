import { useState, useEffect, useMemo } from 'react';
import EmailSendPage from './EmailSendPage';
import CodeExpiredPage from './CodeExpiredPage';
import { type Step } from './types/types';
import { verifyEmailCode, signUp, login } from '../../api/auth_updated';
import { useNavigate } from 'react-router-dom';
// 에셋
import onmoim_logo from '../../assets/icons/onmoim_logo.png';
import Email from '../../assets/icons/Email.svg';
import Success from '../../assets/icons/Success.svg';
import Fail from '../../assets/icons/Fail.svg';


const SKIP_EMAIL_VERIFICATION =
  import.meta.env.VITE_SKIP_EMAIL_VERIFICATION === "true";

if (SKIP_EMAIL_VERIFICATION) {
  console.log(
    "[Login] VITE_SKIP_EMAIL_VERIFICATION=true → 이메일 인증 스킵, 회원가입/로그인 단계로 바로 진입"
  );
}

export default function Login() {
  const USE_MOCK = import.meta.env.VITE_USE_AUTH_MOCK === "true";

  const [email, setEmail] = useState(
    SKIP_EMAIL_VERIFICATION ? "test@test.com" : ""
  );
  const [authCode, setAuthCode] = useState("");
  const [step, setStep] = useState<Step>(
    SKIP_EMAIL_VERIFICATION ? "signup" : "email"
  );

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


  // === 재전송 쿨다운 === //
  const [resendCooldown, setResendCooldown] = useState(0); // 남은 초 (0이면 가능)

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const t = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);

    return () => window.clearInterval(t);
  }, [resendCooldown]);

  const handleResend = () => {
    if (resendCooldown > 0) return;

    console.log("[Login] 재발송 클릭");
    setResendCooldown(30);
    if (true) return; // TODO: 백엔드 연동 후 제거 - 실제 재발송 로직 실행

    // 실제 재발송 로직(= sending step 이동)
    setAuthCode("");
    setErrorMsg(null);
    setStep("sending");

    // ✅ 30초 쿨다운 시작
    setResendCooldown(30);
  };


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
      console.log("[Login] handleComplete 요청", { step, email, authcode: code });

      if (step === "signup") {
        // 회원가입: verify 스킵, signUp API 직접 호출
        const s = await signUp({ email, authcode: code });
        console.log("[Login] signUp 응답", {
          success: s.success,
          code: (s as any).code,
          message: s.message,
          data: s.data,
        });
        if (!s.success) throw new Error(s.message ?? "회원가입 실패");
      } else {
        // 로그인: 코드 검증 후 로그인
        const v = await verifyEmailCode({ email, authcode: code });
        console.log("[Login] verifyEmailCode 응답", {
          success: v.success,
          code: (v as any).code,
          message: v.message,
          data: v.data,
        });
        if (!v.success) throw new Error(v.message ?? "인증 코드 검증 실패");
      }

      // 로그인(토큰 받기)
      const l = await login({ email, authcode: code });
      console.log("[Login] login 응답", {
        success: l.success,
        code: (l as any).code,
        message: l.message,
        data: l.data,
      });
      if (!l.success || !l.data?.accessToken) {
        throw new Error(l.message ?? "로그인 실패(토큰 없음)");
      }

      // 4) 토큰 저장
      localStorage.setItem("accessToken", l.data.accessToken);

      // 5) 메인 화면 이동
      navigate("/", { replace: true });
    } catch (e: any) {
      console.log("[Login] handleComplete 에러", {
        message: e?.message,
        response: e?.response?.data,
        code: e?.response?.data?.code,
      });
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
    <main
      className="
        min-h-screen
        w-full
        flex
        items-center
        justify-center
        px-6 sm:px-10
        bg-[radial-gradient(circle_at_center,rgba(129,27,31,0.2),rgba(23,23,25,0.2)),linear-gradient(to_right,#FEF2F2,#F24148)]
      "
    >
      {/* 카드 */}
      <section
        className={[
          "w-[512px] min-h-[511px] rounded-[35.654px] shadow-[24px_24px_30px_0_rgba(0,0,0,0.25)] flex items-center justify-center"
        , (step === "expired" || step === "sending") ? "bg-[#F7F7F8]" : "bg-[#FFF]"
      ].join(" ")}
      >
        {/* 1. 로그인 페이지 */}
        <div className="w-full max-w-[372px]">

          {/* 이메일 입력 */}
          {step === "email" && (
            <div className="pt-[118px]">
              <div className="flex justify-center mb-[24px]">
                <img src={onmoim_logo} alt="ONMOIM" className="h-[69px] w-auto" />
              </div>
              <div className="text-[16px] font-medium text-[#1A1A1A] mb-[7px]">
                이메일
              </div>

              <div className="relative">
                <span className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#BFBFBF]">
                  <img src={Email} alt='email_icon' className="w-[18px] h-[18px]"/>
                </span>
                <input
                  className="w-full h-[54px] rounded-[10px] border border-[#BFBFBF] bg-[#FFF] pl-[41px] text-[16px] font-medium text-[#1A1A1A] outline-none placeholder:text-[#BFBFBF] focus:border-gray-400"
                  placeholder="이메일을 입력해 주세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* 유효한 이메일 상태 문구 */}
              <div
                className={[
                  "mt-[9px] flex items-center justify-start gap-[3px] text-[12px] font-medium mb-[22px]",
                  emailStatus === "idle" ? "opacity-0" : "opacity-100",
                ].join(" ")}
              >
                <span className="inline-flex w-[16px] h-[16px] items-center justify-center">
                  <img
                    src={emailStatus === "valid" ? Success : Fail} // ⬅️ invalid용 아이콘 추가
                    alt={emailStatus === "valid" ? "올바른 이메일 양식" : "올바르지 않은 이메일 양식"}
                    className="w-[16px] h-[16px]"
                  />
                </span>

                <p className={emailStatus === "valid" ? "text-[#47B781]" : "text-[#FF8173]"}>
                  {emailStatus === "valid" ? "올바른 이메일 양식" : "올바르지 않은 이메일 양식"}
                </p>
              </div>

              <button
                type="button"
                className={
                  "w-full h-[60px] mb-[115px] rounded-[10px] border border-[#BFBFBF] bg-[#F7F7F8] text-[#595959] text-[16px] font-medium"
                }
                disabled={!canGoNext}
                onClick={() => {
                  console.log("[Login] 로그인 클릭 → 이메일 전송 단계", {
                    email,
                  });
                  setStep("sending");
                }}
              >
                로그인
              </button>
            </div>
          )}

          {/* 1.1 이메일 전송 */}
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

          {/* 1.2.1 오래된 코드*/} 
          {step === "expired" && (
              <CodeExpiredPage
                onConfirm={() => {
                  setEmail("");
                  setAuthCode("");
                  setIsRegistered(null);
                  setStep("email");
                }}
            />
          )}


          {/* 1-2. 인증 코드 입력 (회원가입 / 로그인) */}
          {(step === "signup" || step === "login") && (
            <div className="pt-[103px]">
              <div className="text-center text-[40px] font-bold text-[#F24148] pb-[30px]">
                {title}
              </div>

              <div className="w-full h-[19px] text-[16px] font-medium text-[#1A1A1A] mb-[7px]">
                이메일
              </div>

              <div className="relative">
                <span className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#BFBFBF]">
                  <img src={Email} alt='email_icon' className="w-[18px] h-[18px]"/>
                </span>
                <input
                  className="w-full h-[54px] rounded-[10px] border border-[#BFBFBF] bg-[#FFF] pl-[41px] text-[16px] font-medium text-[#1A1A1A] outline-none placeholder:text-[#BFBFBF] focus:border-gray-400"
                  placeholder="이메일을 입력해 주세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!SKIP_EMAIL_VERIFICATION}
                />
              </div>

              {/* 유효한 이메일 상태 문구 */}
              <div
                className={[
                  "mt-[9px] flex items-center justify-start gap-[3px] text-[12px] font-medium",
                  emailStatus === "idle" ? "opacity-0" : "opacity-100",
                ].join(" ")}
              >
                <span className="inline-flex w-[16px] h-[16px] items-center justify-center">
                  <img
                    src={emailStatus === "valid" ? Success : Fail} 
                    alt={emailStatus === "valid" ? "올바른 이메일 양식" : "올바르지 않은 이메일 양식"}
                    className="w-[16px] h-[16px]"
                  />
                </span>

                <p className={emailStatus === "valid" ? "text-[#47B781]" : "text-[#FF8173]"}>
                  {emailStatus === "valid" ? "올바른 이메일 양식" : "올바르지 않은 이메일 양식"}
                </p>
              </div>

              <input
                className="w-full h-[54px] mt-[11px] mb-[8px] rounded-[10px] border border-[#BFBFBF] bg-[#FFFFFF] px-[16px] text-[12px] font-medium text-[#1A1A1A] outline-none placeholder:text-[#BFBFBF] placeholder:indent-[26px]"
                placeholder="인증번호를 입력해주세요."
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />

              {/* 재발송 링크 */}
              <div className="flex items-center pl-[16px] gap-[6px] text-[12px] font-medium">
                <span className="text-[#919191]">인증번호를 받지 못하셨나요?</span>
                {resendCooldown === 0 ? (
                  <button
                    type="button"
                    className="text-[#6F9FFE] hover:underline"
                    onClick={handleResend}
                  >
                    재발송
                  </button>
                ) : (
                  <span className="text-[#919191]">
                    {resendCooldown}초 후에 재전송이 가능합니다.
                  </span>
                )}
              </div>

              {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

              {/* 회원가입 ui */}
              {step === "signup" && (
                <div className="mt-[22px] pb-[93px]">
                  <p className="text-[10px] text-[#6F747C] font-medium break-keep text-center mb-[22px]">
                    '동의합니다'를 클릭하면 약관 및 개인정보 보호정책에 동의하고
                    <br />
                    <span className="font-medium text-[#5C92FF]">ONMOIM</span>
                    으로부터 이벤트 알람 이메일을 수신하는 데 동의합니다.
                    <br />
                    이메일 빈도는 일정하지 않으며 데이터 전송 속도가 적용될 수 있습니다.
                    <br />
                    도움이 필요하실 경우 lixx17@naver.com으로 연락주시면 빠르게 도움
                    드리겠습니다.
                  </p>
                  <button
                    type="button"
                    className="w-full h-[64px] px-[74px] rounded-[10px] bg-[#F24148] text-[#FFFFFF] text-[16px] font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={!authCode.trim() || submitting}
                    onClick={() => {
                      console.log("[Login] 동의합니다 클릭");
                      handleComplete();
                    }}
                  >
                    {submitting ? "처리 중..." : "동의합니다"}
                  </button>
                </div>
              )}

              {/* 로그인 ui */}
              { step === "login" &&
                <div className="mt-[22px] pb-[93px]">
                  <button
                    type="button"
                    className={
                      "w-full h-[64px] px-[74px] rounded-[10px] bg-[#F24148] text-[#FFFFFF] text-[16px] font-medium"
                    }
                    disabled={!authCode.trim() || submitting}
                    onClick={() => {
                      console.log("[Login] 로그인하기 클릭");
                      handleComplete();
                    }}
                  >
                    {submitting ? "처리 중..." : "로그인하기"}
                  </button>
                </div>
              }
            </div>
          )}
        </div>
      </section>
    </main>
  );
}