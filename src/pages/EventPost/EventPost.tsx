import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventPostLeftPanel } from "./components/EventPostLeftPanel";
import type { EventPostLeftPanelRef } from "./components/EventPostLeftPanel";
import { EventPostRightPanel } from "./components/EventPostRightPanel";
import { EventPostBottomBar } from "./components/EventPostBottomBar";
import { useIsMyEvent } from "./hooks/useIsMyEvent";
import { startSession, endSession } from "../../api/analysis";

const EventPost = () => {
  const { eventId: eventIdParam } = useParams<{ eventId: string }>();
  const eventId = eventIdParam ? Number(eventIdParam) : null;
  const isMyEvent = useIsMyEvent(eventId);
  const leftPanelRef = useRef<EventPostLeftPanelRef>(null);
  const [saving, setSaving] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const navigate = useNavigate();

  // 세션 추적: 메인 페이지에서 시작된 세션 사용 (클릭 수는 메인 페이지에서 이미 증가됨)
  useEffect(() => {
    if (!eventId) return;

    // 메인 페이지에서 시작된 세션 ID 가져오기
    const storedSessionId = localStorage.getItem(`session_${eventId}`);
    if (storedSessionId) {
      sessionIdRef.current = storedSessionId;
      console.log("[Analytics] 기존 세션 사용:", storedSessionId);
    } else {
      // 직접 URL로 접근한 경우에만 세션 시작 (클릭 수 증가)
      const initSession = async () => {
        try {
          const result = await startSession(eventId);
          if (result.success && result.data?.sessionId) {
            sessionIdRef.current = result.data.sessionId;
            localStorage.setItem(`session_${eventId}`, result.data.sessionId);
            console.log("[Analytics] 세션 시작됨:", result.data.sessionId);
          }
        } catch (error) {
          console.error("[Analytics] 세션 시작 실패:", error);
        }
      };
      initSession();
    }

    // 페이지를 떠날 때 세션 종료
    return () => {
      if (sessionIdRef.current && eventId) {
        endSession(eventId, sessionIdRef.current)
          .then(() => {
            // 세션 종료 후 localStorage에서 제거
            localStorage.removeItem(`session_${eventId}`);
          })
          .catch((error) => {
            console.error("[Analytics] 세션 종료 실패:", error);
          });
      }
    };
  }, [eventId]);

  const handleSave = async () => {
    if (!leftPanelRef.current || saving) return;
    setSaving(true);
    try {
      await leftPanelRef.current.save();
      navigate("/");
    } finally {
      setSaving(false);
    }
  };

  if (!eventIdParam) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">행사 ID가 없습니다.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full max-w-[1920px] flex flex-col">
        <section className="flex flex-1 ml-[137px] mr-[100px] gap-[102px]">
          <div className="w-[793px]">
            <EventPostLeftPanel ref={leftPanelRef} eventId={eventId} isMyEvent={isMyEvent} />
          </div>
          <div className="w-[540px]">
            <EventPostRightPanel eventId={eventId} isMyEvent={isMyEvent} />
          </div>
        </section>
        <div className="mt-[48px] mb-[48px] flex justify-end pr-[100px]">
          <EventPostBottomBar
            label={isMyEvent ? "수정" : "확인"}
            onClick={isMyEvent ? handleSave : () => navigate("/")}
            saving={isMyEvent && saving}
          />
        </div>
      </div>
    </main>
  );
};

export default EventPost;
