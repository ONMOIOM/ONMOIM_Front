import { useMemo, useState } from "react";
import closeIconSrc from "../../assets/icons/close.png";
import shieldIconSrc from "../../assets/icons/Shield_perspective_matte.png";
import envelopeIconSrc from "../../assets/icons/Envelope_perspective_matte.png";
import successIconSrc from "../../assets/icons/Success_perspective_matte.png";
import { requestEmailVerification, verifyEmail } from "../../api/auth";

type EmailModalStep = "change" | "verify" | "result" | "code" | "success";

type EmailFlowModalProps = {
  step: EmailModalStep | null;
  email: string;
  onClose: () => void;
  onRequestVerification: () => void;
  onConfirmVerification: () => void;
  onConfirmEmail: () => void;
  onConfirmCode: () => void;
  onCompleteEmailChange: (email: string) => void;
};

const EmailFlowModal = ({
  step,
  email,
  onClose,
  onRequestVerification,
  onConfirmVerification,
  onConfirmEmail,
  onConfirmCode,
  onCompleteEmailChange,
}: EmailFlowModalProps) => {
  if (!step) {
    return null;
  }

  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const emailStatus = useMemo(() => {
    if (!newEmail) {
      return "none";
    }
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    if (!isValidFormat) {
      return "invalid";
    }
    if (newEmail === email || newEmail.toLowerCase().includes("exists")) {
      return "exists";
    }
    return "valid";
  }, [newEmail, email]);

  const resultTone =
    emailStatus === "valid"
      ? { stroke: "#47B781", fill: "rgba(71, 183, 129, 0.12)" }
      : emailStatus === "invalid" || emailStatus === "exists"
        ? { stroke: "#FF8173", fill: "rgba(255, 129, 115, 0.12)" }
        : { stroke: "#BFBFBF", fill: "#F7F7F8" };

  const modalHeight =
    step === "change"
      ? 535
      : step === "verify"
        ? 643
        : step === "result"
          ? 599
          : step === "code"
            ? 599
            : 535;

  const handleRequestVerification = async () => {
    try {
      const res = await requestEmailVerification({
        email,
        turnstileToken: "dummy-token-for-dev",
      });
      if (res.success) {
        onRequestVerification();
      } else {
        console.warn("[EmailFlowModal] 인증 메일 발송 실패:", res.message);
      }
    } catch (error) {
      console.warn("[EmailFlowModal] 인증 메일 발송 실패:", error);
    }
  };

  const handleConfirmVerification = async () => {
    try {
      const res = await verifyEmail({
        email,
        authCode: verificationCode,
      });
      if (res.success) {
        onConfirmVerification();
      } else {
        console.warn("[EmailFlowModal] 인증번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.warn("[EmailFlowModal] 인증번호 확인 실패:", error);
    }
  };

  const handleResendVerification = async () => {
    try {
      const res = await requestEmailVerification({
        email,
        turnstileToken: "dummy-token-for-dev",
      });
      if (!res.success) {
        console.warn("[EmailFlowModal] 인증 메일 재발송 실패:", res.message);
      }
    } catch (error) {
      console.warn("[EmailFlowModal] 인증 메일 재발송 실패:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-1/2 w-[521px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-white"
        style={{ height: `${modalHeight}px` }}
        role="dialog"
        aria-modal="true"
        aria-label="이메일 변경"
      >
        <div className="absolute left-0 top-[40px] h-full w-full">
          <p className="absolute left-[43px] top-0 text-h7 text-[#1A1A1A]">
            이메일 변경
          </p>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-[43px] top-0 h-[39px] w-[39px]"
            aria-label="닫기"
          >
            <img src={closeIconSrc} alt="" className="h-full w-full" />
          </button>
          {step === "change" && (
            <>
              <img
                src={shieldIconSrc}
                alt=""
                className="absolute left-1/2 top-[87px] h-[119px] w-[119px] -translate-x-1/2"
                aria-hidden="true"
              />
              <div className="absolute left-1/2 top-[218px] -translate-x-1/2">
                <div className="flex flex-col items-center">
                  <p className="text-h6 text-[#1A1A1A]">{email}</p>
                  <div className="mt-[14px] flex items-center gap-2 text-h3 text-gray-600 whitespace-nowrap">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-600 text-[10px] leading-none">
                      i
                    </span>
                    <span>
                      새로운 이메일로 설정하기 전에 기존 이메일로 인증을
                      진행해주세요
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mt-[80px] h-[71px] w-[435px] rounded-[10px] bg-[#F24148] text-h5 font-semibold text-white"
                    onClick={handleRequestVerification}
                  >
                    인증 이메일 받기
                  </button>
                </div>
              </div>
            </>
          )}
          {step === "verify" && (
            <>
              <img
                src={envelopeIconSrc}
                alt=""
                className="absolute left-1/2 top-[87px] h-[119px] w-[119px] -translate-x-1/2"
                aria-hidden="true"
              />
              <div className="absolute left-1/2 top-[218px] -translate-x-1/2 text-center">
                <p className="text-h6 text-[#1A1A1A]">{email}</p>
                <p className="mt-[13px] text-h3 text-gray-600">
                  인증번호 6자 전송 완료했습니다.
                  <br />
                  연락이 닿기까지 시간이 걸릴 수 있습니다.
                </p>
                <div className="mt-[35px] h-[58px] w-[435px] rounded-[20px] border border-[#BFBFBF] bg-white">
                  <input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    className="h-full w-full bg-transparent pl-[24px] text-h5 text-[#1A1A1A] outline-none"
                    aria-label="인증번호 입력"
                  />
                </div>
                <div className="mt-[12px] w-[435px] text-left">
                  <div className="flex items-center gap-[6px]">
                    <span className="text-h2 text-gray-600">
                      인증 번호를 받지 못하셨나요?
                    </span>
                    <button
                      type="button"
                      className="text-h2 text-[#5C92FF]"
                      aria-label="인증번호 재발송"
                      onClick={handleResendVerification}
                    >
                      재발송
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-[53px] flex h-[71px] w-[435px] items-center justify-center rounded-[10px] border border-[#BFBFBF] bg-[#F7F7F8] text-h5 font-semibold text-gray-600"
                  onClick={handleConfirmVerification}
                >
                  확인
                </button>
              </div>
            </>
          )}
          {step === "result" && (
            <>
              <div className="absolute left-1/2 top-[150px] -translate-x-1/2">
                <div
                  className="flex h-[58px] w-[435px] items-center gap-[12px] rounded-[20px] border bg-white pl-[24px] pr-[24px]"
                  style={{
                    borderColor: resultTone.stroke,
                    backgroundColor: resultTone.fill,
                    color: resultTone.stroke,
                  }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    placeholder="올바른 이메일을 입력하세요"
                    className="h-full w-full bg-transparent text-h5 text-[#1A1A1A] outline-none"
                    aria-label="이메일 입력"
                  />
                </div>
                {emailStatus !== "none" && (
                  <div
                    className="mt-[10px] flex items-center gap-[8px] text-h2"
                    style={{ color: resultTone.stroke }}
                  >
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] leading-none">
                      {emailStatus === "valid" ? "✓" : "✕"}
                    </span>
                    <span>
                      {emailStatus === "valid"
                        ? "올바른 이메일 형식"
                        : emailStatus === "exists"
                          ? "해당 이메일을 가진 계정이 이미 존재합니다."
                          : "이메일 형식이 올바르지 않습니다."}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="absolute left-1/2 bottom-[170px] flex h-[71px] w-[435px] -translate-x-1/2 items-center justify-center rounded-[10px] border border-[#BFBFBF] bg-[#F7F7F8] text-h5 font-semibold text-gray-400 disabled:opacity-50"
                onClick={() => {
                  if (emailStatus === "valid") {
                    onConfirmEmail();
                  }
                }}
                disabled={emailStatus !== "valid"}
              >
                확인
              </button>
              <div className="absolute bottom-[80px] left-1/2 w-[435px] -translate-x-1/2 -translate-y-[14px] text-center text-h1 leading-[14px] text-[#6F747C]">
                <p className="m-0">
                  <span className="block whitespace-nowrap">
                    확인을 클릭하면 약관 및 개인정보 보호정책에 동의하고
                  </span>
                  <span className="block whitespace-nowrap">
                    <span className="text-[#5C92FF]">ONMOIM</span>로부터 이벤트
                    알림 이메일을 수신하는 데 동의합니다.
                  </span>
                  <span className="block whitespace-nowrap">
                    이메일 빈도는 일정하지 않으며 데이터 전송 속도가 적용될 수
                    있습니다.
                  </span>
                  <span className="block whitespace-nowrap">
                    도움이 필요하신 경우 lxx17@naver.com로 연락주시면 빠르게
                    도와 드리겠습니다.
                  </span>
                </p>
              </div>
            </>
          )}
          {step === "code" && (
            <>
              <div className="absolute left-1/2 top-[150px] -translate-x-1/2">
                <div className="flex h-[58px] w-[435px] items-center gap-[12px] rounded-[20px] border border-[#BFBFBF] bg-[#F7F7F8] pl-[24px] pr-[24px] text-[#BFBFBF]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    className="h-full w-full bg-transparent text-h5 text-[#1A1A1A] outline-none"
                    aria-label="이메일 입력"
                  />
                </div>
                <div className="mt-[18px] h-[58px] w-[435px] rounded-[20px] border border-[#BFBFBF] bg-white">
                  <input
                    type="text"
                    placeholder="000000"
                    className="h-full w-full bg-transparent pl-[24px] text-h5 text-[#1A1A1A] outline-none"
                    aria-label="인증번호 입력"
                  />
                </div>
                <div className="mt-[12px] w-[435px] text-left">
                  <div className="flex items-center gap-[6px]">
                    <span className="text-h2 text-gray-600">
                      인증 번호를 받지 못 하셨나요?
                    </span>
                    <button
                      type="button"
                      className="text-h2 text-[#5C92FF]"
                      aria-label="인증번호 재발송"
                      onClick={handleResendVerification}
                    >
                      재발송
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="absolute left-1/2 bottom-[170px] flex h-[71px] w-[435px] -translate-x-1/2 items-center justify-center rounded-[10px] border border-[#BFBFBF] bg-[#F7F7F8] text-h5 font-semibold text-gray-400"
                onClick={onConfirmCode}
              >
                확인
              </button>
              <div className="absolute bottom-[80px] left-1/2 w-[435px] -translate-x-1/2 -translate-y-[14px] text-center text-h1 leading-[14px] text-[#6F747C]">
                <p className="m-0">
                  <span className="block whitespace-nowrap">
                    확인을 클릭하면 약관 및 개인정보 보호정책에 동의하고
                  </span>
                  <span className="block whitespace-nowrap">
                    <span className="text-[#5C92FF]">ONMOIM</span>로부터 이벤트
                    알림 이메일을 수신하는 데 동의합니다.
                  </span>
                  <span className="block whitespace-nowrap">
                    이메일 빈도는 일정하지 않으며 데이터 전송 속도가 적용될 수
                    있습니다.
                  </span>
                  <span className="block whitespace-nowrap">
                    도움이 필요하신 경우 lxx17@naver.com로 연락주시면 빠르게
                    도와 드리겠습니다.
                  </span>
                </p>
              </div>
            </>
          )}
          {step === "success" && (
            <>
              <img
                src={successIconSrc}
                alt=""
                className="absolute left-1/2 top-[87px] h-[119px] w-[119px] -translate-x-1/2"
                aria-hidden="true"
              />
              <div className="absolute left-1/2 top-[218px] -translate-x-1/2">
                <div className="flex flex-col items-center">
                  <p className="text-h6 text-[#1A1A1A]">{newEmail || email}</p>
                  <div className="mt-[14px] flex items-center gap-2 text-h3 text-gray-600 whitespace-nowrap">
                    <span>
                      해당 이메일로 이메일이 성공적으로 변경되었습니다!
                    </span>
                  </div>
                  <button
                    type="button"
                    className="mt-[80px] h-[71px] w-[435px] rounded-[10px] bg-[#F24148] text-h5 font-semibold text-white"
                    onClick={() => {
                      const nextEmail = newEmail || email;
                      onCompleteEmailChange(nextEmail);
                      onClose();
                    }}
                  >
                    확인
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailFlowModal;
