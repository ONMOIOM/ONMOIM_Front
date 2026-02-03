import { useState } from "react";
import { ScheduleModal } from "../modals/ScheduleModal";
import { LocationModal } from "../modals/LocationModal";
import { SeatsModal } from "../modals/CapacityModal";
import { PriceModal } from "../modals/PriceModal";
import { PlaylistModal } from "../modals/PlaylistModal";
import { type ModalKey } from "../types/types";
import { FONTTYPE_CLASS, FONTTYPE_ITEMS } from "../types/types";
import { useEventDraftStore } from "../store/useEventDraftStore";

export const LeftFormPanel = () => {
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const close = () => setOpenModal(null);

  // ----- store: data -----
  const title = useEventDraftStore((s) => s.data.title);
  const fontType = useEventDraftStore((s) => s.data.fontType);
  const allowExternal = useEventDraftStore((s) => s.data.allowExternal);
  const information = useEventDraftStore((s) => s.data.information);

  const schedule = useEventDraftStore((s) => s.data.schedule);
  const location = useEventDraftStore((s) => s.data.location);
  const capacity = useEventDraftStore((s) => s.data.capacity);
  const price = useEventDraftStore((s) => s.data.price);
  const playlist = useEventDraftStore((s) => s.data.playlist);

  // ----- store: setters -----
  const setTitle = useEventDraftStore((s) => s.setTitle);
  const setFontType = useEventDraftStore((s) => s.setFontType);
  const setAllowExternal = useEventDraftStore((s) => s.setAllowExternal);
  const setInformation = useEventDraftStore((s) => s.setInformation);

  const setSchedule = useEventDraftStore((s) => s.setSchedule);
  const setLocation = useEventDraftStore((s) => s.setLocation);
  const setCapacity = useEventDraftStore((s) => s.setCapacity);
  const setPrice = useEventDraftStore((s) => s.setPrice);
  const setPlaylist = useEventDraftStore((s) => s.setPlaylist);

  // ----- store: save actions -----
  const saveSchedule = useEventDraftStore((s) => s.saveSchedule);
  const saveLocation = useEventDraftStore((s) => s.saveLocation);
  const saveCapacity = useEventDraftStore((s) => s.saveCapacity);
  const savePrice = useEventDraftStore((s) => s.savePrice);
  const savePlaylist = useEventDraftStore((s) => s.savePlaylist);

  // ----- status (optional) -----
  const scheduleSaving = useEventDraftStore((s) => s.scheduleStatus === "saving");
  const locationSaving = useEventDraftStore((s) => s.locationStatus === "saving");
  const capacitySaving = useEventDraftStore((s) => s.capacityStatus === "saving");
  const priceSaving = useEventDraftStore((s) => s.priceStatus === "saving");
  const playlistSaving = useEventDraftStore((s) => s.playlistStatus === "saving");

  // ---------- 화면 표시용 포맷 ----------
  const scheduleView = formatSchedule(schedule);
  const locationView = formatLocation(location);
  const capacityView = formatCapacity(capacity);
  const priceView = formatPrice(price);

  return (
    <div className="w-full">
      {/* 제목 */}
      <div className="h-[38px] mb-2 text-sm font-semibold text-gray-900">제목</div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="행사 제목을 입력하세요"
        className={[
          "w-full h-10 rounded-md border border-gray-200 bg-white px-4 text-sm outline-none",
          FONTTYPE_CLASS[fontType],
        ].join(" ")}
      />

      {/* 서체 */}
      <div className="mt-7">
        <div className="h-[38px] mb-2 text-sm font-semibold text-gray-900">서체</div>
        <div className="flex gap-2">
          {FONTTYPE_ITEMS.map((t) => {
            const selected = fontType === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setFontType(t.key)}
                className={[
                  "h-9 px-4 rounded-md border text-sm",
                  selected
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-gray-200 bg-gray-50 text-gray-700",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 날짜/시간 */}
      <div className="mt-7">
        <div className="h-[38px] mb-2 text-sm font-semibold text-gray-900">날짜 시간</div>

        <div className="flex items-center gap-2">
          {/* 날짜 */}
          <button
            type="button"
            onClick={() => setOpenModal("schedule")}
            className={[
              "h-10 rounded-md border border-gray-200 bg-white px-4",
              "flex items-center justify-between text-sm",
              "w-[190px]",
            ].join(" ")}
          >
            <span className={scheduleView.dateText ? "text-gray-900" : "text-gray-400"}>
              {scheduleView.dateText && scheduleView.dateText.trim() !== ""
                ? scheduleView.dateText
                : "날짜 선택"}
            </span>
            <span className="text-gray-400">▾</span>
          </button>

          {/* 시작 시간 */}
          <button
            type="button"
            onClick={() => setOpenModal("schedule")}
            className={[
              "h-10 rounded-md border border-gray-200 bg-white px-4",
              "flex items-center justify-between text-sm",
              "w-[120px]",
            ].join(" ")}
          >
            <span className={scheduleView.startTimeText ? "text-gray-900" : "text-gray-400"}>
              {scheduleView.startTimeText && scheduleView.startTimeText.trim() !== ""
                ? scheduleView.startTimeText
                : "시작"}
            </span>
          </button>

          <span className="px-1 text-gray-400">~</span>

          {/* 종료 시간 */}
          <button
            type="button"
            onClick={() => setOpenModal("schedule")}
            className={[
              "h-10 rounded-md border border-gray-200 bg-white px-4",
              "flex items-center justify-between text-sm",
              "w-[120px]",
            ].join(" ")}
          >
            <span className={scheduleView.endTimeText ? "text-gray-900" : "text-gray-400"}>
              {scheduleView.endTimeText && scheduleView.endTimeText.trim() !== ""
                ? scheduleView.endTimeText
                : "종료"}
            </span>
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={!!scheduleView.isAllDay}
            onChange={() => setOpenModal("schedule")}
            className="h-4 w-4"
          />
          <span>종일</span>
        </div>
      </div>

      {/* 행사 위치 */}
      <div className="mt-7">
        <div className="h-[38px] mb-2 text-sm font-semibold text-gray-900">행사 위치</div>
        <button
          type="button"
          onClick={() => setOpenModal("location")}
          className="h-10 w-full rounded-md border border-gray-200 bg-white px-4 flex items-center justify-between text-sm"
        >
          <span className={locationView ? "text-gray-900" : "text-gray-400"}>
            {locationView && locationView.trim() !== "" ? locationView : "주소를 입력하세요"}
          </span>
        </button>
      </div>

      {/* 남은 자리 */}
      <div className="mt-7">
        <div className="h-[38px] mb-2 text-sm font-semibold text-gray-900">남은 자리</div>
        <button
          type="button"
          onClick={() => setOpenModal("seats")}
          className="h-10 w-full rounded-md border border-gray-200 bg-white px-4 flex items-center justify-between text-sm"
        >
          <span className={capacityView ? "text-gray-900" : "text-gray-400"}>
            {capacityView && capacityView.trim() !== "" ? capacityView : "인원 수를 입력하세요"}
          </span>
        </button>
      </div>

      {/* 참여 가격 */}
      <div className="mt-7">
        <div className="h-[38px] mb-2 text-sm font-semibold text-gray-900">참여 가격</div>
        <button
          type="button"
          onClick={() => setOpenModal("price")}
          className="h-10 w-full rounded-md border border-gray-200 bg-white px-4 flex items-center justify-between text-sm"
        >
          <span className={priceView ? "text-gray-900" : "text-gray-400"}>
            {priceView && priceView.trim() !== "" ? priceView : "가격을 입력하세요"}
          </span>
        </button>
      </div>

      {/* 외부인원 참여가능 */}
      <div className="mt-7 flex items-center justify-between">
        <div className="h-[38px] text-sm font-semibold text-gray-900 flex items-center">
          외부인원 참여가능
        </div>

        <button
          type="button"
          onClick={() => setAllowExternal(!allowExternal)}
          className={[
            "relative inline-flex h-6 w-11 items-center rounded-full transition",
            allowExternal ? "bg-gray-900" : "bg-gray-200",
          ].join(" ")}
          aria-pressed={allowExternal}
        >
          <span
            className={[
              "inline-block h-5 w-5 transform rounded-full bg-white transition",
              allowExternal ? "translate-x-5" : "translate-x-1",
            ].join(" ")}
          />
        </button>
      </div>

      {/* 플레이리스트 */}
      <div className="mt-6">
        <button
          type="button"
          className="h-9 px-4 rounded-md bg-blue-50 text-blue-600 text-sm inline-flex items-center gap-2"
          onClick={() => setOpenModal("playlist")}
        >
          <span className="text-base leading-none">+</span>
          플레이리스트 추가
        </button>
      </div>

      {/* 소개글 */}
      <div className="mt-4">
        <textarea
          value={information}
          onChange={(e) => setInformation(e.target.value)}
          className="w-full h-[220px] rounded-md border border-gray-200 bg-white p-4 text-sm outline-none resize-none"
          placeholder="행사 소개글을 적어주세요."
        />
      </div>

      {/* 모달들 */}
      <ScheduleModal
        open={openModal === "schedule"}
        onClose={close}
        value={schedule}
        onSave={async (next) => {
          setSchedule(next);
          try {
            await saveSchedule();
            close();
          } catch {}
        }}
        saving={scheduleSaving}
      />

      <LocationModal
        open={openModal === "location"}
        onClose={close}
        value={location}
        onSave={async (next) => {
          setLocation(next);
          try {
            await saveLocation();
            close();
          } catch {}
        }}
        saving={locationSaving}
      />

      <SeatsModal
        open={openModal === "seats"}
        onClose={close}
        value={capacity}
        onSave={async (next) => {
          setCapacity(next);
          try {
            await saveCapacity();
            close();
          } catch {}
        }}
        saving={capacitySaving}
      />

      <PriceModal
        open={openModal === "price"}
        onClose={close}
        value={price}
        onSave={async (next) => {
          setPrice(next);
          try {
            await savePrice();
            close();
          } catch {}
        }}
        saving={priceSaving}
      />

      <PlaylistModal
        open={openModal === "playlist"}
        onClose={close}
        value={playlist}
        onSave={async (next) => {
          setPlaylist(next);
          try {
            await savePlaylist();
            close();
          } catch {}
        }}
        saving={playlistSaving}
      />
    </div>
  );
};

/* -------------------- formatting helpers -------------------- */

function formatSchedule(schedule: any): {
  dateText: string;
  startTimeText: string;
  endTimeText: string;
  isAllDay: boolean;
} {
  const isAllDay = !!(schedule?.isAllDay ?? schedule?.allDay);

  const rawDate =
    schedule?.startDate ??
    schedule?.date ??
    schedule?.start?.date ??
    schedule?.start;

  const rawStartTime =
    schedule?.startTime ??
    schedule?.start?.time ??
    schedule?.startAt ??
    schedule?.start;

  const rawEndTime =
    schedule?.endTime ??
    schedule?.end?.time ??
    schedule?.endAt ??
    schedule?.end;

  const dateText = rawDate ? String(rawDate) : "";
  const startTimeText = rawStartTime ? String(rawStartTime) : "";
  const endTimeText = rawEndTime ? String(rawEndTime) : "";

  return { dateText, startTimeText, endTimeText, isAllDay };
}

function formatLocation(location: any): string {
  if (!location) return "";
  const street = location.streetAddress ?? location.roadAddress ?? "";
  const lot = location.lotNumber ?? "";
  return street || lot ? String(street || lot) : String(location);
}

function formatCapacity(capacity: any): string {
  if (capacity === null || capacity === undefined || capacity === "") return "";
  if (typeof capacity === "number") return `${capacity} 명`;
  if (typeof capacity === "object" && capacity?.count != null) return `${capacity.count} 명`;
  return String(capacity);
}

function formatPrice(price: any): string {
  if (price === null || price === undefined || price === "") return "";
  if (typeof price === "number") return `${price.toLocaleString()} ₩`;
  if (typeof price === "string") return price;
  if (typeof price === "object" && price?.amount != null) {
    const n = Number(price.amount);
    return Number.isFinite(n) ? `${n.toLocaleString()} ₩` : String(price.amount);
  }
  return String(price);
}
