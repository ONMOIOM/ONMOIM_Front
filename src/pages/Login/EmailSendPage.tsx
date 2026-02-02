import Turnstile from "react-turnstile";
import { sendVerificationEmail } from "../../api/auth_updated";

type Props = {
  email: string;
  onResult: (isRegistered: boolean) => void;
  onClose: () => void;
};

export default function EmailSendPage({ email, onResult, onClose }: Props) {
  const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  // 인증 메일 발송 API 
  const sendMail = async (token: string) => {
    console.log("[EmailSendPage] sendMail called", { email, token });

    const res = await sendVerificationEmail({ email, turnstileToken: token });

    console.log("[EmailSendPage] sendVerificationEmail res", res);

    if (!res.success || !res.data) {
      console.log("[EmailSendPage] res not success", res);
      throw new Error(res.message ?? "인증 메일 발송 실패");
    }

    console.log("[EmailSendPage] calling onResult", res.data.isRegistered);
    onResult(res.data.isRegistered);
  };


  return (
    <div className="fixed inset-0 z-50">
      {/* ✅ 오버레이: 클릭하면 닫히게 */}
      <button
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="close overlay"
      />

      {/* ✅ 중앙 모달 */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="w-full max-w-[420px] rounded-2xl bg-white px-8 py-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900">인증 이메일 전송</h2>
          <p className="mt-2 text-sm text-gray-500 break-keep">
            보안을 위해 이메일 보내기 버튼을 눌러 인증메일을 발송해주세요.
          </p>

          {/* Turnstile 영역 */}
          <div className="mt-6 flex justify-center">
            {sitekey ? (
              <Turnstile
                sitekey={sitekey}
                onSuccess={(token) => {
                  console.log("[EmailSendPage] turnstile success", token);
                  sendMail(token).catch((err) => {
                    console.log("[EmailSendPage] sendMail error", err);
                    alert("인증 메일 발송에 실패했습니다.");
                  });
                }}
                onError={() => alert("보안 인증에 실패했습니다.")}
              />
            ) : (
              // ✅ sitekey 없을 때도 UI는 그대로
              <div className="flex h-12 w-full items-center justify-between rounded-md bg-gray-900 px-4 text-sm text-white">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  성공함
                </span>
                <span className="text-xs opacity-70">CLOUDFLARE</span>
              </div>
            )}
          </div>

          {/* 버튼 */}
          <button
            type="button"
            className="mt-6 h-11 w-full rounded-xl bg-gray-100 text-sm font-semibold text-gray-900 hover:bg-gray-200"
            onClick={async () => {
              try {
                // sitekey 없으면 mock token으로라도 진행 가능
                const token = sitekey ? "" : "mock_token";

                if (!token && sitekey) {
                  // Turnstile 위젯에서 토큰을 버튼 클릭으로 보내고 싶으면
                  // 별도로 token을 state로 저장하는 방식으로 바꿔야 함.
                  alert("보안 확인을 먼저 완료해주세요.");
                  return;
                }

                if (!sitekey) {
                  await sendMail(token);
                }
              } catch {
                alert("인증 메일 발송에 실패했습니다.");
              }
            }}
          >
            인증 이메일 받기
          </button>
        </div>
      </div>
    </div>
  );
}