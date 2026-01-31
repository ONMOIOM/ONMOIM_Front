import { useMemo, useState } from "react";
import axios from "axios";

// auth.ts
import {
  requestEmailVerification,
  verifyEmail,
  login,
} from "../api/auth";

// event.ts
import {
  createEventDraft,
  publishEvent,
  saveEventTitle,
  saveEventSchedule,
  saveEventLocation,
  saveEventCapacity,
  saveEventPrice,
  saveEventPlaylist,
  saveEventInformation,
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
  const [eventId, setEventId] = useState<number | null>(null); // eventId는 string으로 통일
  const [email, setEmail] = useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>("");

  // ✅ EVENT 새 함수 테스트용 더미 입력값 (사용자가 입력 안 해도 됨)
  const [dummyTitle] = useState("오늘의 하루 소개하기");
  const [dummyStartDate] = useState("2026-01-01T00:00:00Z");
  const [dummyEndDate] = useState("2026-02-03T00:00:00Z");
  const [dummyStreetAddress] = useState("서울특별시 강남구 테헤란로 123");
  const [dummyLotNumber] = useState<string | null>(null);
  const [dummyCapacity] = useState(8);
  const [dummyPrice] = useState(10000);
  const [dummyPlaylist] = useState("https://open.spotify.com/playlist/dummy");
  const [dummyInformation] = useState("이 행사는 테스트용 소개글입니다.");

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

  // 더미 값 생성 함수
  const getDummyEmail = () => email || "test@gmail.com";
  const getDummyTurnstileToken = () => turnstileToken || "dummy-turnstile-token-12345";
  const getDummyAuthCode = () => authCode || "123456";
  const getDummyEventId = () => eventId ?? 123;

  // --------------------
  // AUTH 테스트
  // --------------------
  const testRequestEmailVerification = () => {
    const dummyEmail = getDummyEmail();
    const dummyToken = getDummyTurnstileToken();
    if (!email) setEmail(dummyEmail);
    if (!turnstileToken) setTurnstileToken(dummyToken);
    return run("이메일 인증 메일 발송", () =>
      requestEmailVerification({ email: dummyEmail, turnstileToken: dummyToken })
    );
  };

  const testVerifyEmail = () => {
    const dummyEmail = getDummyEmail();
    const dummyCode = getDummyAuthCode();
    if (!email) setEmail(dummyEmail);
    if (!authCode) setAuthCode(dummyCode);
    return run("이메일 인증 코드 검증", () => verifyEmail({ email: dummyEmail, authcode: dummyCode }));
  };

  const testLogin = () => {
    const dummyEmail = getDummyEmail();
    const dummyCode = getDummyAuthCode();
    if (!email) setEmail(dummyEmail);
    if (!authCode) setAuthCode(dummyCode);
    return run("로그인", () =>
      login({
        email: dummyEmail,
        authcode: dummyCode,
      })
    );
  };

  // --------------------
  // EVENT 테스트
  // --------------------
  const testCreateEventDraft = async () => {
    const res = await run("행사 초안 생성", () => createEventDraft());
    // 성공이면 eventId 자동 채우기
    const base = res as any as BaseResponse<any>;
    if (base?.success && base.data?.eventId) setEventId(Number(base.data.eventId));
  };

  /*
  const testSaveEventFields = () => {
    return run("행사 정보 수정 (PATCH)", () =>
        saveEventFields({
        title: "테스트 행사",
        capacity: 8,
        // schedule/location 같은 건 백엔드 요구 형태 맞을 때만 추가
      })
    );
  };*/

  const testPublishEvent = () => {
    const id = getDummyEventId();
    if (eventId === null) setEventId(id);
    return run("행사 발행 (publish)", () => publishEvent(id));
  };
  
  // ✅ 추가된 event.ts 함수들 테스트 (버튼만 누르면 더미로 호출)

  // 1) 제목
  const testSaveEventTitleOnly = () => {
    return run("행사 제목 저장 (PATCH)", () =>
      saveEventTitle({ title: dummyTitle })
    );
  };

  // 2) 일정
  const testSaveEventScheduleOnly = () => {
    return run("행사 일자 저장 (PATCH)", () =>
      saveEventSchedule({
        schedule: { startDate: dummyStartDate, endDate: dummyEndDate },
      })
    );
  };

  // 3) 위치
  const testSaveEventLocationOnly = () => {
    return run("행사 위치 저장 (PATCH)", () =>
      saveEventLocation({
        location: { streetAddress: dummyStreetAddress, lotNumber: dummyLotNumber },
      })
    );
  };

  // 4) 참여자 수
  const testSaveEventCapacityOnly = () => {
    return run("행사 참여자(capacity) 저장 (PATCH)", () =>
      saveEventCapacity({ capacity: dummyCapacity })
    );
  };

  // 5) 가격
  const testSaveEventPriceOnly = () => {
    return run("행사 가격(price) 저장 (PATCH)", () =>
      saveEventPrice({ price: dummyPrice })
    );
  };

  // 6) 플레이리스트
  const testSaveEventPlaylistOnly = () => {
    return run("행사 플레이리스트 저장 (PATCH)", () =>
      // ⚠️ event.ts에서 body 타입이 잘못되어 있을 수 있어서(네가 SaveEventTitleRequest로 써둠)
      // 일단 테스트페이지에서는 any로 한번 호출 가능하게 해둠
      saveEventPlaylist({ playlist: dummyPlaylist } as any)
    );
  };

  // 7) 소개글
  const testSaveEventInformationOnly = () => {
    return run("행사 소개글 저장 (PATCH)", () =>
      saveEventInformation({ information: dummyInformation })
    );
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
            <span className="text-sm text-gray-600">eventId (비어있으면 event_123 자동 사용)</span>
            <input
              type="number"
              value={eventId ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setEventId(v === "" ? null : Number(v));
              }}
              className="border rounded px-3 py-2"
              placeholder="비워두면 event_123 자동 사용 (초안 생성 시 자동 입력됨)"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">email (비어있으면 test@gmail.com 자동 사용)</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="비워두면 test@gmail.com 자동 사용"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">turnstileToken (비어있으면 더미 토큰 자동 사용)</span>
            <input
              value={turnstileToken}
              onChange={(e) => setTurnstileToken(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="비워두면 더미 토큰 자동 사용"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">authCode (비어있으면 123456 자동 사용)</span>
            <input
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder="비워두면 123456 자동 사용"
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

            {/*
            <button
              onClick={testSaveEventFields}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              2) 행사 정보 수정 (PATCH)
            </button>
            */}

            <button
              onClick={testPublishEvent}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              3) 행사 발행 (publish)
            </button>

            {/* 추가 */}
            <button
              onClick={testSaveEventTitleOnly}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              4) 제목 저장 (추가 함수)
            </button>

            <button
              onClick={testSaveEventScheduleOnly}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              5) 일자 저장 (추가 함수)
            </button>

            <button
              onClick={testSaveEventLocationOnly}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              6) 위치 저장 (추가 함수)
            </button>

            <button
              onClick={testSaveEventCapacityOnly}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              7) 참여자 저장 (추가 함수)
            </button>

            <button
              onClick={testSaveEventPriceOnly}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              8) 가격 저장 (추가 함수)
            </button>

            <button
              onClick={testSaveEventPlaylistOnly}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              9) 플레이리스트 저장 (추가 함수)
            </button>

            <button
              onClick={testSaveEventInformationOnly}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              10) 소개글 저장 (추가 함수)
            </button>

            <p className="text-xs text-gray-500">
              ※ 값이 비어있으면 자동으로 더미 값 사용 (test@gmail.com, 123456 등)
            </p>
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