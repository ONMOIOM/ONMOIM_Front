import { useState } from "react";
import { ScheduleModal } from "../modals/ScheduleModal";
import { LocationModal } from "../modals/LocationModal";
import { SeatsModal } from "../modals/CapacityModal";
import { PriceModal } from "../modals/PriceModal";
import { PlaylistModal } from "../modals/PlaylistModal";
import { type ModalKey } from "../types/types";
import { FONTTYPE_CLASS, FONTTYPE_ITEMS } from "../types/types";
import { useEventDraftStore } from "../store/useEventDraftStore";
import { formatScheduleView, formatLocation, formatCapacity, formatPrice } from "../utils/formatters";
import { Toggle } from './Toggle';
// 에셋
import check from '../../../assets/icons/check.svg';
import arrow_down from '../../../assets/icons/arrow_down.svg';
import play_circle from '../../../assets/icons/play_circle.svg';

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
  const scheduleView = formatScheduleView(schedule);
  const locationView = formatLocation(location);
  const capacityView = formatCapacity(capacity);
  const priceView = formatPrice(price);

  return (
    <div className="w-full mt-[138px]">
      {/* 제목 */}
      <div className="mb-[16px] h-[38px] w-[56px] text-[32px] font-bold text-[#1A1A1A]">제목</div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="행사 제목을 입력하세요"
        className={[
          "w-full h-[67px] text-[24px] text-[#595959] rounded-[10px] border border-[#BFBFBF] focus:border-[#595959] bg-[#FFFFFF] px-[24px] py-[18px] outline-none",
          FONTTYPE_CLASS[fontType],
        ].join(" ")}
      />

      {/* 서체 */}
      <div className="mt-[70px]">
        <div className="mb-[16px] w-full h-[38px] items-center font-semibold text-[32px] text-[#1A1A1A]">서체</div>
        <div className="flex gap-[20px]">
          {FONTTYPE_ITEMS.map((t) => {
            const selected = fontType === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setFontType(t.key)}
                className={[
                  "h-[62px] px-[34px] rounded-[10px] border text-[20px] font-semibold",
                  "flex items-center justify-center gap-[10px]",
                  selected
                    ? "border-[#F241481A] bg-[#F241481A] text-[#F24148]"
                    : "border-[#EEEEEE] bg-[#EEEEEE] text-[#595959]",
                ].join(" ")}
              >
                {selected && (
                  <img src={check} alt='check_icon' className="w-[29px] h-[29px]"/>
                )}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 날짜/시간 */}
      <div className="mt-[75px]">
        <div className="mb-[16px] h-[38px] font-bold text-[32px] text-[#1A1A1A]">날짜 시간</div>

        <div className="flex items-center gap-[20px]">
          {/* 날짜 */}
          <button
            type="button"
            onClick={() => setOpenModal("schedule")}
            className={[
              "w-[348px] h-[89px] rounded-[10px] border border-[#BFBFBF] bg-[#FFFFFF] pl-[38px] pr-[24px]",
              "flex items-center justify-between text-[24px] font-semibold text-[#595959]",
            ].join(" ")}
          >
            <span>
              {scheduleView.dateText?.trim() ? scheduleView.dateText : "날짜 선택"}
            </span>
            <img src={arrow_down} alt="arrow_down_icon" className="h-[46px] w-[46px]"/>
          </button>

          {/* 시작 시간 */}
          <button
            type="button"
            className={[
              "w-[179px] h-[89px] rounded-[10px] border border-[#BFBFBF] bg-[#FFFFFF] px-[38px]",
              "flex items-center justify-center text-[24px] font-semibold text-[#595959]",
            ].join(" ")}
          >
            <span className="whitespace-nowrap">
              {scheduleView.startTimeText?.trim() ? scheduleView.startTimeText : "시작"}
            </span>
          </button>

          <span className="py-[21px] text-[40px] font-bold text-[#000000]">~</span>

          {/* 종료 시간 */}
          <button
            type="button"
            className={[
              "w-[179px] h-[89px] rounded-[10px] border border-[#BFBFBF] bg-[#FFFFFF] px-[38px]",
              "flex items-center justify-center text-[24px] font-semibold text-[#595959]",
            ].join(" ")}
          >
            <span className="whitespace-nowrap">
              {scheduleView.endTimeText?.trim() ? scheduleView.endTimeText : "종료"}
            </span>
          </button>
        </div>

        {/* 종일 체크박스 */}
        <div className="mt-3 flex items-center gap-[16px]">
          <input
            type="checkbox"
            checked={!!scheduleView.isAllDay}
            onPointerDown={(e) => {
              e.preventDefault(); // 기본 체크 토글 막고
              const nextChecked = !scheduleView.isAllDay;

              const start = schedule.startAt ? new Date(schedule.startAt) : new Date();
              const end = schedule.endAt ? new Date(schedule.endAt) : new Date(start);

              if (nextChecked) {
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 0, 0);
              } else {
                start.setHours(6, 0, 0, 0);
                end.setHours(9, 0, 0, 0);
              }

              setSchedule({ startAt: start, endAt: end });
            }}
            onChange={() => { /* preventDefault 때문에 비워둬도 됨 */ }}
            className="w-[38px] h-[38px] appearance-none rounded-[13.1px]
              border-[3px] border-[#D9D9D9] bg-white cursor-pointer
              checked:bg-[#F24148] checked:border-[#F24148]"
          />

          <span className="py-[7px] text-[20px] font-semibold text-[#000000]">종일</span>
        </div>
      </div>

      {/* 행사 위치 */}
      <div className="mt-[70px]">
        <div className="h-[38px] mb-[16px] font-bold text-[32px] text-[#1A1A1A]">행사 위치</div>
        <button
          type="button"
          onClick={() => setOpenModal("location")}
          className="w-[793px] h-[67px] rounded-[10px] border border-[#BFBFBF] bg-[#FFFFFF] px-[24px] py-[18px] flex items-center justify-between"
        >
          <span className={[
            locationView ? "text-[#595959]" : "text-[#BFBFBF]",
            "text-[24px] font-semibold"
          ].join(" ")}>
            {locationView && locationView.trim() !== "" ? locationView : "주소를 입력하세요"}
          </span>
        </button>
      </div>

      {/* 남은 자리 */}
      <div className="mt-[28px]">
        <div className="h-[38px] mb-[16px] font-bold text-[32px] text-[#1A1A1A]">남은 자리</div>
        <button
          type="button"
          onClick={() => setOpenModal("seats")}
          className="w-[793px] h-[67px] rounded-[10px] border border-[#BFBFBF] bg-[#FFFFFF] px-[24px] flex items-center justify-between"
        >
          <span className={[
            capacityView ? "text-[#595959]" : "text-[#BFBFBF]",
            "text-[24px] font-semibold"
          ].join(" ")}>
            {capacityView && capacityView.trim() !== "" ? capacityView : "인원 수를 입력하세요"}
          </span>
        </button>
      </div>

      {/* 참여 가격 */}
      <div className="mt-[28px]">
        <div className="h-[38px] mb-2 font-bold text-[32px] text-[#1A1A1A]">참여 가격</div>
        <button
          type="button"
          onClick={() => setOpenModal("price")}
          className="w-[793px] h-[67px] rounded-[10px] border border-[#BFBFBF] bg-[#FFFFFF] px-[24px] flex items-center justify-between"
        >
          <span className={[
             priceView ? "text-[#595959]" : "text-[#BFBFBF]",
            "text-[24px] font-semibold"
          ].join(" ")}>
            {priceView && priceView.trim() !== "" ? priceView : "가격을 입력하세요"}
          </span>
        </button>
      </div>

      {/* 외부인원 참여가능 */}
      <div className="mt-[70px] flex items-center justify-between">
        <div className="h-[38px] font-bold text-[32px] text-[#1A1A1A] flex items-center">
          외부인원 참여가능
        </div>

        <Toggle
          checked={allowExternal}
          onChange={setAllowExternal}
        />

      </div>

      {/* 플레이리스트 */}
      <div className="mt-[70px]">
        <button
          type="button"
          className="w-[252px] h-[62px] px-[34px] rounded-[10px] bg-[#6F9FFE1A] text-[#6F9FFE] inline-flex items-center justify-center gap-[12px]"
          onClick={() => setOpenModal("playlist")}
        >
          <img src={play_circle} alt='play_circle_icon' className="w-[20px] h-[20px]"/>
          <span className="text-[20px] font-semibold">플레이리스트 추가</span>
        </button>
      </div>

      {/* 소개글 */}
      <div className="mt-[28px]">
        <textarea
          value={information}
          onChange={(e) => setInformation(e.target.value)}
          className="w-full h-[321px] text-[24px] text-[#595959] font-semibold rounded-[10px] border border-[#BFBFBF] bg-[#FFFFFF] placeholder:text-[#BFBFBF] px-[24px] pt-[24px] pb-[18px] outline-none resize-none"
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
