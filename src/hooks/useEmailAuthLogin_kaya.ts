// 로그인 훅(임시)
import { useMemo, useState } from "react";
import { requestEmailVerification, verifyEmail } from "../api/auth_kaya"; // 경로 맞게
import { parseFailure, mapFailureToKorean } from "../utils/authError_kaya";
import { saveTokens } from "../utils/authStorage_kaya";

export type Step = "email" | "code";

export function useEmailAuthLogin() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("email");

  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [loading, setLoading] = useState<"send" | "verify" | "resend" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const emailStatus: "idle" | "invalid" | "valid" =
    email.length === 0 ? "idle" : isValidEmail(email) ? "valid" : "invalid";

  const canSend = useMemo(() => {
    return emailStatus === "valid" && !!turnstileToken && loading === null;
  }, [emailStatus, turnstileToken, loading]);

  const canVerify = useMemo(() => {
    return code.trim().length >= 4 && loading === null;
  }, [code, loading]);

  const handleSend = async () => {
    setErrorMsg("");
    if (emailStatus !== "valid") {
      setErrorMsg("이메일 형식을 확인해 주세요.");
      return;
    }
    if (!turnstileToken) {
      setErrorMsg("보안 확인을 완료해 주세요.");
      return;
    }

    try {
      setLoading("send");
      await requestEmailVerification({ email, turnstileToken });

      setTurnstileToken("");
      setStep("code");
    } catch (e) {
      const { code, message } = parseFailure(e);
      const korean = mapFailureToKorean(code, message);

      if (code === "ALREADY_VERIFIED") {
        setStep("code");
      }
      setErrorMsg(korean);
    } finally {
      setLoading(null);
    }
  };

  const handleResend = async () => {
    setErrorMsg("");
    setStep("email");
    setErrorMsg("재발송을 위해 보안 확인을 다시 진행해 주세요.");
  };

  const handleVerify = async () => {
    setErrorMsg("");
    if (code.trim().length < 4) {
      setErrorMsg("인증번호를 입력해 주세요.");
      return;
    }

    try {
      setLoading("verify");
      const res = await verifyEmail(code.trim());

      const anyRes = res as any;
      const accessToken = anyRes?.data?.accessToken;
      const refreshToken = anyRes?.data?.refreshToken;

      if (accessToken && refreshToken) {
        saveTokens(accessToken, refreshToken);
        // TODO: navigate("/")는 Login.tsx에서 처리하거나,
        // 여기서 useNavigate를 써서 처리해도 됨.
      }
    } catch (e) {
      const { code, message } = parseFailure(e);
      setErrorMsg(mapFailureToKorean(code, message));
    } finally {
      setLoading(null);
    }
  };

  return {
    // state
    email,
    setEmail,
    code,
    setCode,
    step,
    setStep,
    turnstileToken,
    setTurnstileToken,
    loading,
    errorMsg,

    // derived
    emailStatus,
    canSend,
    canVerify,

    // actions
    handleSend,
    handleResend,
    handleVerify,
  };
}