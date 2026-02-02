import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import RSVPCard from "../EventCreate/components/RSVPSelector"; // ✅ 너 경로에 맞게 수정!
import { type ScheduleType, LocationType, DraftEvent } from "./types/types";



function formatDateRange(draft: DraftEvent) {
  // 1) schedule 객체로 오는 경우
  const s1 = draft.schedule?.startAt ?? draft.schedule.startAt ?? null;
  const e1 = draft.schedule?.endAt ?? draft.schedule.endAt ?? null;

  const fmt = (d: Date) => {
    // “2026.01.15 오전 06:00” 느낌으로 간단히
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    let hh = d.getHours();
    const min = String(d.getMinutes()).padStart(2, "0");
    const ampm = hh < 12 ? "오전" : "오후";
    hh = hh % 12;
    if (hh === 0) hh = 12;
    const hh2 = String(hh).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${ampm} ${hh2}:${min}`;
  };

  if (!s1 && !e1) return "";
  if (s1 && e1) return `${fmt(s1)} ~ ${fmt(e1)}`;
  if (s1) return `${fmt(s1)} ~`;
  return `~ ${fmt(e1 as Date)}`;
}

export default function EventPreview() {
  const navigate = useNavigate();
  const location = useLocation();

  const draft = (location.state as { draft: DraftEvent } | null)?.draft;

  // state 없으면 생성 페이지로
  if (!draft) {
    return (
      <div className="min-h-screen bg-white p-10">
        <div className="max-w-[720px]">
          <div className="text-lg font-semibold mb-2">미리보기 정보가 없어요.</div>
          <button
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            onClick={() => navigate("/events/create")}
          >
            이벤트 생성으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 더미 댓글 (UI만 맞추기용)
  const [comment, setComment] = useState("");
  const comments = useMemo(
    () => [
      { id: 1, name: "문수윤", text: "Ready for this 😂😂😂", date: "2026.01.16" },
      { id: 2, name: "문수윤", text: "Ready for this 😂😂😂", date: "2026.01.16" },
      { id: 3, name: "문수윤", text: "Ready for this 😂😂😂\nToo long to me\nToo long to me", date: "2026.01.16" },
      { id: 4, name: "문수윤", text: "Ready for this 😂😂😂", date: "2026.01.16" },
    ],
    []
  );

  const dateRange = formatDateRange(draft);

  return (
    <div className="min-h-screen bg-white">
      {/* Main */}
      <main className="mx-auto max-w-[1280px] px-8 pt-10 pb-16">
        <div className="flex gap-16">
          {/* Left content */}
          <section className="w-[560px]">
            <h1 className="text-2xl font-bold">{draft.title || "행사 제목"}</h1>
            <div className="mt-2 text-sm text-gray-600">{dateRange}</div>

            {/* Info rows (아이콘 대신 간단한 마커 사용) */}
            <div className="mt-6 space-y-2 text-sm text-gray-800">
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 text-gray-500">📍</span>
                <span>{draft.location.streetAddress ?? draft.location?.streetAddress ?? "제주 서귀포시 신화월드 123"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 text-gray-500">💰</span>
                <span>
                  {draft.price != null ? `${draft.price.toLocaleString()}원` : "5,900원"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 text-gray-500">👥</span>
                <span>
                  {draft.capacity != null ? `${draft.capacity}명, 현재 19명` : "10/20, 현재 19명 자리가 남았습니다."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 text-gray-500">🔗</span>
                <span className="text-gray-700">
                  {draft.playlist || "http://open.spotify.com/playlist/yourplaylist"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 text-sm text-gray-700 leading-6 whitespace-pre-line">
              {draft.description ||
                "여기에 소개글입니다. 여기에 소개글입니다. 여기에 소개글입니다. 여기에 소개글입니다.\n".repeat(6)}
            </div>

            {/* Participants */}
            <div className="mt-10">
              <div className="text-sm font-semibold text-gray-900 mb-3">참여자</div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-b from-red-300 to-red-500"
                    />
                  ))}
                </div>
                <button className="h-8 rounded-full border border-gray-200 px-3 text-sm">
                  + 멤버
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-10">
              <div className="text-sm font-semibold text-gray-900 mb-3">댓글</div>

              {/* comment input */}
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-b from-red-300 to-red-500" />
                <div className="flex-1">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 추가해주세요."
                    className="w-full h-10 rounded-lg border border-gray-200 px-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* comment list */}
              <div className="mt-6 space-y-5">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-b from-red-300 to-red-500" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-400">{c.date}</div>
                      </div>
                      <div className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                        {c.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right content */}
          <aside className="flex-1 min-w-0">
            <div className="mx-auto w-[520px] max-w-full">
              {/* cover */}
              <div className="w-full h-[300px] border border-gray-200 bg-gray-200 overflow-hidden">
                {draft.coverImageUrl ? (
                  <img
                    src={draft.coverImageUrl}
                    alt="cover"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              {/* RSVP buttons (스크린샷처럼 아래에 3개 동그라미) */}
              <div className="mt-14 flex justify-center">
                <RSVPCard />
              </div>
            </div>
          </aside>

          {/* Right floating buttons */}
          <div className="w-[140px] shrink-0 flex flex-col gap-3 pt-[240px]">
            <button
              type="button"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
              onClick={() => navigate("/event-create", { state: { draft } })}
            >
              돌아가기
            </button>
            <button
              type="button"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
              onClick={() => {
                // 여기서는 UI만 맞추는 단계라 일단 콘솔
                console.log("저장하기(미리보기 화면)");
              }}
            >
              저장하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
