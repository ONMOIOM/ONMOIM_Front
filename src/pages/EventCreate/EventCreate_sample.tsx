import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LeftFormPanel } from "./components/LeftFormPanel";
import { RightFormPanel } from "./components/RightFormPanel";
import { ActionPanel } from "./components/BottomActionBar";

import { useEventDraftStore } from "./store/useEventDraftStore";
import { type DraftEvent } from "./types/types";

export default function EventCreate() {
  const navigate = useNavigate();

  const initDraft = useEventDraftStore((s) => s.initDraft);
  const initStatus = useEventDraftStore((s) => s.initStatus);
  const initError = useEventDraftStore((s) => s.initError);

  const data = useEventDraftStore((s) => s.data);

  useEffect(() => {
    initDraft();
  }, [initDraft]);

  const buildDraft = (): DraftEvent => ({
    title: data.title,
    fontType: data.fontType,
    schedule: data.schedule,
    location: data.location,
    capacity: data.capacity,
    price: data.price,
    allowExternal: data.allowExternal,
    playlist: data.playlist,
    description: data.information, // LeftFormPanel props 이름 때문에 매핑
    coverImageUrl: data.coverImageUrl,
  });

  const onPreview = () => {
    navigate("/event-create/preview", { state: { draft: buildDraft() } });
  };

  // ✅ 여기서는 “전체 저장”을 하지 않음.
  // 저장은 각 모달/패널의 저장 버튼에서 saveTitle/saveSchedule... 호출하도록 설계 추천.
  const onSave = async () => {
    // 원하면 여기서 "임시저장 안내" 토스트만 띄워도 됨
    // 또는 나중에 "전체 저장" 기능을 넣고 싶으면 그때 추가
  };

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
    // 전체 화면(1920 기준) 중앙 정렬 + 세로 플렉스
    <main className="min-h-screen bg-white">
      <div className="w-full max-w-[1920px] flex flex-col">
        {/* ====== 상단/중앙: 왼쪽 패널 + 오른쪽 패널 ====== */}
        <section className="flex flex-1 pl-[137px] pr-[348px] gap-[102px] pt-10">
          {/* 왼쪽 패널: 793px */}
          <div className="w-[793px]">
            <LeftFormPanel/>
          </div>

          {/* 오른쪽 패널: 540px */}
          <div className="w-[540px]">
            <RightFormPanel/>
          </div>
        </section>

        {/* ====== 하단: BottomActionBar (사진처럼 맨 아래) ====== */}
        <ActionPanel onPreview={onPreview} />
      </div>
    </main>
  );
}
