import { useMemo, useState } from "react";
import axios from "axios";

// auth.ts
import {
  requestEmailVerification,
  verifyEmail,
  login,
  getMe,
} from "../api/auth";

// event.ts
import {
  createEventDraft,
  saveEventFields,
  publishEvent,
} from "../api/event";

// types
import type { BaseResponse } from "../constants/types";

type LogState = {
  label: string;
  ok: boolean;
  at: string;
  status?: number;
  payload: unknown;
};

const TestPage = () => {
  // 입력값 (하드코딩 말고 직접 넣게)
  const [eventId, setEventId] = useState<string>(""); // eventId는 string으로 통일
  const [email, setEmail] = useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>("");

  // 결과 로그
  const [log, setLog] = useState<LogState | null>(null);

  const nowText = useMemo(() => new Date().toLocaleString(), []);

  const run = async <T,>(label: string, fn: () => Promise<T>) => {
    console.group(`🧪 ${label}`);
    try {
      const res = await fn();
      console.log("✅ success:", res);

      // BaseResponse 형태면 success로 ok 판단 가능
      const maybeBase = res as any as BaseResponse<any>;
      const ok = typeof maybeBase?.success === "boolean" ? maybeBase.success : true;

      setLog({
        label,
        ok,
        at: new Date().toLocaleString(),
        payload: res,
      });

      return res;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("❌ axios error:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
          method: err.config?.method,
        });

        setLog({
          label,
          ok: false,
          at: new Date().toLocaleString(),
          status: err.response?.status,
          payload: err.response?.data ?? { message: err.message },
        });
      } else {
        console.error("❌ unknown error:", err);
        setLog({
          label,
          ok: false,
          at: new Date().toLocaleString(),
          payload: err,
        });
      }
    } finally {
      console.groupEnd();
    }
  };

  // --------------------
  // AUTH 테스트
  // --------------------
  const testRequestEmailVerification = () =>
    run("이메일 인증 메일 발송", () =>
      requestEmailVerification({ email, turnstileToken })
    );

  const testVerifyEmail = () => run("이메일 인증 코드 검증", () => verifyEmail(authCode));

  const testLogin = () =>
    run("로그인", () =>
      login({
        email,
        authcode: authCode, // 네 타입에 맞춤 (authcode)
      })
    );

  const testGetMe = () => run("회원 조회 (GET /users)", () => getMe());

  // --------------------
  // EVENT 테스트
  // --------------------
  const testCreateEventDraft = async () => {
    const res = await run("행사 초안 생성", () => createEventDraft());
    // 성공이면 eventId 자동 채우기
    const base = res as any as BaseResponse<any>;
    if (base?.success && base.data?.eventId) setEventId(String(base.data.eventId));
  };

  const testSaveEventFields = () => {
    if (!eventId) {
      setLog({
        label: "행사 정보 수정",
        ok: false,
        at: new Date().toLocaleString(),
        payload: { message: "eventId가 비어있음. 먼저 초안 생성하거나 eventId 입력해줘." },
      });
      return;
    }
    return run("행사 정보 수정 (PATCH)", () =>
      saveEventFields(eventId, {
        title: "테스트 행사",
        capacity: 8,
        // schedule/location 같은 건 백엔드 요구 형태 맞을 때만 추가
      })
    );
  };

  const testPublishEvent = () => {
    if (!eventId) {
      setLog({
        label: "행사 발행",
        ok: false,
        at: new Date().toLocaleString(),
        payload: { message: "eventId가 비어있음. 먼저 초안 생성하거나 eventId 입력해줘." },
      });
      return;
    }
    return run("행사 발행 (publish)", () => publishEvent(eventId));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">API 테스트 페이지</h1>
      <p className="text-gray-600 mb-6">
        버튼 클릭 → API 호출 → 콘솔 & 화면 로그 확인
        <br />
        <span className="text-sm">(F12 개발자도구 → Console 탭에서도 확인 가능)</span>
      </p>

      {/* 입력 섹션 */}
      <section className="border p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3">🧩 입력값</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">eventId</span>
            <input
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="예: 123 또는 draft 생성 후 자동 입력"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="test@example.com"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">turnstileToken</span>
            <input
              value={turnstileToken}
              onChange={(e) => setTurnstileToken(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="클라우드플레어 Turnstile 토큰"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">authCode</span>
            <input
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="이메일로 받은 인증코드"
            />
          </label>
        </div>
      </section>

      {/* 버튼 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AUTH */}
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔐 auth.ts</h2>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={testRequestEmailVerification}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              1) 이메일 인증 메일 발송
            </button>

            <button
              onClick={testVerifyEmail}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              2) 이메일 인증 코드 검증
            </button>

            <button
              onClick={testLogin}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              3) 로그인
            </button>

            <button
              onClick={testGetMe}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              4) 회원 조회 (토큰 필요할 수도)
            </button>
          </div>
        </section>

        {/* EVENT */}
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🎉 event.ts</h2>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={testCreateEventDraft}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              1) 행사 초안 생성 (POST)
            </button>

            <button
              onClick={testSaveEventFields}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              disabled={!eventId}
            >
              2) 행사 정보 수정 (PATCH)
            </button>

            <button
              onClick={testPublishEvent}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
              disabled={!eventId}
            >
              3) 행사 발행 (publish)
            </button>

            {!eventId && (
              <p className="text-xs text-gray-500">
                ※ 수정/발행은 eventId가 필요함 (초안 생성하면 자동으로 들어감)
              </p>
            )}
          </div>
        </section>
      </div>

      {/* 로그 출력 */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">🧾 마지막 응답</h2>
        {!log ? (
          <div className="border rounded p-4 text-gray-500">
            아직 호출 기록이 없어. 버튼을 눌러봐!
          </div>
        ) : (
          <div
            className={`border rounded p-4 ${
              log.ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-semibold">
                {log.ok ? "✅ SUCCESS" : "❌ FAIL"} - {log.label}
              </span>
              <span className="text-xs text-gray-600">({log.at})</span>
              {log.status && (
                <span className="text-xs bg-white border rounded px-2 py-1">
                  HTTP {log.status}
                </span>
              )}
            </div>

            <pre className="text-xs overflow-auto mt-3 bg-white/70 p-3 rounded">
              {JSON.stringify(log.payload, null, 2)}
            </pre>
          </div>
        )}
      </section>

      <p className="text-xs text-gray-400 mt-4">
        loaded: {nowText}
      </p>
    </div>
  );
};

export default TestPage;