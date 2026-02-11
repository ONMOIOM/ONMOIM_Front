import { useNavigate } from "react-router-dom";
import { useEventDraftStore } from "./store/useEventDraftStore";
import { RightFormPanel } from "./components/RightFormPanel";
import { BottomActionBar } from "./components/BottomActionBar";
import { EventEditorLayout } from "./layout/EventEditorLayout";
import { formatLocation } from "./utils/formatters";
// 에셋
import location_icon from "../../assets/icons/location_icon.svg";
import price_icon from "../../assets/icons/price_icon.svg";
import participant_icon from "../../assets/icons/participant_icon.svg";
import Music from "../../assets/icons/Music.svg";
import { FONTTYPE_CLASS } from "./types/types";

function formatDateTime(startAt: Date | null, endAt: Date | null): string {
  if (!startAt || !endAt) return "일시 미정";
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = d.getHours();
    const min = String(d.getMinutes()).padStart(2, "0");
    const ampm = h < 12 ? "오전" : "오후";
    const hh12 = h % 12 === 0 ? 12 : h % 12;
    return `${y}.${m}.${day} ${ampm} ${String(hh12).padStart(2, "0")}:${min}`;
  };
  return `${fmt(startAt)} ~ ${fmt(endAt)}`;
}

export default function EventPreview() {
  const navigate = useNavigate();

  const data = useEventDraftStore((s) => s.data);
  const fontType = useEventDraftStore((s) => s.data.fontType);
  const publish = useEventDraftStore((s) => s.publish);
  const publishStatus = useEventDraftStore((s) => s.publishStatus);
  const initStatus = useEventDraftStore((s) => s.initStatus);
  const eventId = useEventDraftStore((s) => s.eventId);

  const isReady = initStatus === "ready" && eventId != null;

  if (initStatus !== "ready" || !eventId) {
    return (
      <div className="min-h-screen bg-white p-10">
        <div className="max-w-[720px]">
          <div className="text-lg font-semibold mb-2">
            미리보기 정보가 없어요.
          </div>
          <button
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            onClick={() => navigate("/event-create")}
          >
            이벤트 생성으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const locationText = formatLocation(data.location) || "장소 미정";
  const priceText =
    data.price != null ? `${data.price.toLocaleString()} ₩` : "가격 미정";
  const capacity = data.capacity ?? 0;
  const capacityText =
    capacity > 0
      ? `0/${capacity}, 현재 ${capacity}자리가 남았습니다.`
      : "인원 미정";
  const dateTimeText = formatDateTime(
    data.schedule?.startAt ?? null,
    data.schedule?.endAt ?? null,
  );

  return (
    <EventEditorLayout
      left={
        <section className="w-full mt-[192px] ml-[161px]">
          <div
            className={[
              "text-[42px] font-bold text-[#1A1A1A] font-sans", // 기본 스타일
              FONTTYPE_CLASS[fontType], // 선택된 폰트 스타일
            ].join(" ")}
          >
            {data.title || "행사 제목"}
          </div>

          <div className="mt-[10px] text-h5 text-[#1A1A1A]">{dateTimeText}</div>

          <div className="mt-[52px] space-y-[17px] text-[14px] font-medium text-[#1A1A1A]">
            <div className="flex items-start gap-[8px]">
              <img
                src={location_icon}
                alt="location"
                className="w-[24px] h-[24px] shrink-0"
              />
              <span>{locationText}</span>
            </div>
            <div className="flex items-start gap-[8px]">
              <img
                src={price_icon}
                alt="price"
                className="w-[24px] h-[24px] shrink-0"
              />
              <span>{priceText}</span>
            </div>
            <div className="flex items-start gap-[8px]">
              <img
                src={participant_icon}
                alt="participants"
                className="w-[24px] h-[24px] shrink-0"
              />
              <span>{capacityText}</span>
            </div>
            {(data.playlist?.trim() ?? "") && (
              <div className="flex items-start gap-[8px]">
                <img
                  src={Music}
                  alt="playlist"
                  className="w-[24px] h-[24px] shrink-0"
                />
                <span>{data.playlist}</span>
              </div>
            )}
          </div>

          <div className="mt-[48px] w-[645px]">
            <p className="text-[16px] font-medium text-[#1A1A1A] leading-[19px] break-words whitespace-pre-line">
              {data.information || ""}
            </p>
          </div>

          <div className="mt-[70px] text-h6 text-[#1A1A1A] font-semibold">
            참여자
          </div>
          <div className="mt-[12px] flex items-center">
            <div className="overflow-x-auto custom-scrollbar w-[232px]">
              <div className="text-gray-400 text-sm">참여자가 없습니다.</div>
            </div>
          </div>

          <div className="mt-[70px] text-h6 text-[#1A1A1A] font-semibold">
            댓글
          </div>
          <div className="mt-[12px] w-[644px]">
            <div className="h-[2px] w-full bg-[#F24148]" />
            <div className="mt-[12px] h-[2px] w-full bg-[#F24148]" />
            <div className="mt-[32px] h-[200px] overflow-y-auto">
              <div className="text-gray-400 text-center py-8">
                댓글이 없습니다.
              </div>
            </div>
            <div className="mt-[32px] h-[2px] w-full bg-[#F24148]" />
            <div className="mt-[12px] h-[2px] w-full bg-[#F24148]" />
            <div className="mt-[32px] flex items-start gap-[12px]">
              <div className="h-[52px] w-[52px] shrink-0 rounded-full bg-[#D9D9D9]" />
              <div className="flex-1">
                <textarea
                  placeholder="댓글을 작성해주세요."
                  disabled
                  className="w-full h-[120px] rounded-[10px] border border-[#BFBFBF] bg-[#F7F7F8] px-[18px] py-[14px] text-[16px] font-medium text-[#1A1A1A] placeholder:text-[#919191] outline-none resize-none cursor-not-allowed"
                />
                <div className="mt-[12px] flex justify-end">
                  <button
                    type="button"
                    disabled
                    className="h-[44px] w-[118px] rounded-[20px] bg-[#F24148] text-white text-[16px] font-semibold opacity-50 cursor-not-allowed"
                  >
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      }
      right={<RightFormPanel mode="preview" />}
      bottom={
        <BottomActionBar
          left={{
            label: "수정",
            onClick: () => navigate("/event-create"),
          }}
          right={{
            label: publishStatus === "saving" ? "저장 중..." : "저장",
            onClick: async () => {
              try {
                await publish();
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
