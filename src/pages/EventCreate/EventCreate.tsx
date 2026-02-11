import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LeftFormPanel } from "./components/LeftFormPanel";
import { RightFormPanel } from "./components/RightFormPanel";
import { BottomActionBar } from "./components/BottomActionBar";
import { useEventDraftStore } from "./store/useEventDraftStore";
import { EventEditorLayout } from "./layout/EventEditorLayout";

export default function EventCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const reset = useEventDraftStore((s) => s.reset);
  const initDraft = useEventDraftStore((s) => s.initDraft);
  const publish = useEventDraftStore((s) => s.publish);
  const publishStatus = useEventDraftStore((s) => s.publishStatus);
  const initStatus = useEventDraftStore((s) => s.initStatus);
  const initError = useEventDraftStore((s) => s.initError);
  const eventId = useEventDraftStore((s) => s.eventId);

  const isReady = initStatus === "ready" && eventId != null;
  const schedule = useEventDraftStore((s) => s.data.schedule);
  const setSchedule = useEventDraftStore((s) => s.setSchedule);

  // 다른 페이지 갔다가 다시 들어오면 폼 기본값으로 초기화 후 새 초안 생성
  useEffect(() => {
    reset();
  }, [reset]);

  // 행사 생성하기 클릭 시: 초안 생성 API 호출
  useEffect(() => {
    initDraft();
  }, [initDraft]);

  useEffect(() => {
        // 이미 startAt이 있으면 초기화 안 함
        if (schedule?.startAt && schedule?.endAt) return;

        const now = new Date();

        const startAt = new Date(now);
        startAt.setHours(15, 0, 0, 0);

        const endAt = new Date(now);
        endAt.setHours(18, 0, 0, 0);

        setSchedule({
            startAt,
            endAt,
        });
    }, [schedule?.startAt, schedule?.endAt, setSchedule]);

  if (initStatus === "loading") {
    return (
      <div className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-8 pt-6">초안 생성 중...</div>
      </div>
    );
  }

  if (initStatus === "error") {
    return (
      <div className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-8 pt-6">
          초안 생성 실패: {initError ?? "알 수 없는 오류"}
        </div>
      </div>
    );
  }

  return (
        <EventEditorLayout
            left={<LeftFormPanel />}
            right={<RightFormPanel mode="edit" />}
            bottom={
            <BottomActionBar
                left={{
                label: "미리보기",
                onClick: () => navigate("/event-create/preview"),
                disabled: !isReady,
                }}
                right={{
                label: publishStatus === "saving" ? "저장 중..." : "저장",
                onClick: async () => {
                  try {
                    await publish();
                    queryClient.invalidateQueries({ queryKey: ["eventList"] });
                    queryClient.invalidateQueries({ queryKey: ["myHostedEvents"] });
                    queryClient.invalidateQueries({ queryKey: ["myParticipatedEvents"] });
                    await queryClient.refetchQueries({ queryKey: ["eventList"] });
                    await queryClient.refetchQueries({ queryKey: ["myHostedEvents"] });
                    await queryClient.refetchQueries({ queryKey: ["myParticipatedEvents"] });
                    navigate("/");
                  } catch {
                    // publish에서 에러 상태 설정됨
                  }
                },
                disabled: !isReady || publishStatus === "saving",
                }}
            />
            }
        />
    );
}
