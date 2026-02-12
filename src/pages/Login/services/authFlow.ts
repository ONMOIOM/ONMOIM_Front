import {
  sendVerificationEmail,
  verifyEmailCode,
  signUp,
  login,
} from "../../../api/auth_updated";

const USE_MOCK = import.meta.env.VITE_USE_AUTH_MOCK === "true";

// ---- Mock 데이터 규칙 ----
// - 이메일에 "new"가 들어가면 신규회원(signup)
// - 아니면 기존회원(login)
// - authCode가 "000000"이면 만료로 처리(테스트용)
const mockDelay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export type AuthMode = "login" | "signup";

export async function sendEmailAndGetMode(email: string, turnstileToken: string): Promise<AuthMode> {
  if (USE_MOCK) {
    await mockDelay();
    const isRegistered = !email.includes("new");
    return isRegistered ? "login" : "signup";
  }

  const res = await sendVerificationEmail({ email, turnstileToken });
  if (!res.success || !res.data) throw new Error(res.message ?? "메일 발송 실패");

  const isRegistered = Boolean(res.data.isRegistered);
  return isRegistered ? "login" : "signup";
}

export async function completeAuth(email: string, authCode: string, mode: AuthMode): Promise<string> {
  if (USE_MOCK) {
    await mockDelay();

    if (authCode === "000000") {
      const err: any = new Error("만료된 코드");
      err.code = "EMAIL_AUTH_CODE_EXPIRED";
      throw err;
    }

    // mock token 반환
    return "mock_access_token_123";
  }

  const v = await verifyEmailCode({ email, code: authCode });
  if (!v.success) throw new Error(v.message ?? "코드 검증 실패");

  if (mode === "signup") {
    const s = await signUp({ email, authCode });
    if (!s.success) throw new Error(s.message ?? "회원가입 실패");
  }

  const l = await login({ email, authCode });
  if (!l.success || !l.data?.accessToken) throw new Error(l.message ?? "로그인 실패");

  return l.data.accessToken;
}
