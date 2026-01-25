// 로그인 에러 처리 함수(임시)
// src/utils/authErrors.ts
export function parseFailure(err: unknown): { code?: string; message: string } {
  const anyErr = err as any;
  const data = anyErr?.response?.data ?? anyErr?.data;

  const code = data?.failure_reason_code ?? data?.code;
  const message =
    data?.message ??
    anyErr?.message ??
    "요청에 실패했어요. 잠시 후 다시 시도해 주세요.";

  return { code, message };
}

export function mapFailureToKorean(code?: string, fallback?: string) {
  switch (code) {
    case "BOT_DETECTED":
      return "보안 검증에 실패했어요. 새로고침 후 다시 시도해 주세요.";
    case "TOKEN_EXPIRED":
      return "인증번호가 만료됐어요. 재발급 받아주세요.";
    case "TOKEN_ALREADY_USED":
      return "이미 사용된 인증번호예요. 재발급 받아주세요.";
    case "ALREADY_VERIFIED":
      return "이미 인증된 이메일이에요. 인증번호 입력 단계로 이동할게요.";
    case "RATE_LIMITED":
      return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
    case "DUPLICATED_REQUEST":
      return "이미 인증 메일을 보냈어요. 메일함을 확인해 주세요.";
    default:
      return fallback ?? "요청에 실패했어요.";
  }
}