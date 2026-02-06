import { useEffect, useMemo, useState } from "react";
import { formatKoreanDate } from "../utils/formatKoreanDate";
import { formatKoreanTime } from "../utils/formatKoreanTime";
// assets
import prev_icon from "../../../assets/icons/prev_icon.svg";
import next_icon from "../../../assets/icons/next_icon.svg";
import close from "../../../assets/icons/close.svg";

export type ScheduleValue = {
  startAt: Date | null;
  endAt: Date | null;
};

export type ScheduleModalProps = {
  open: boolean;
  onClose: () => void;
  value: ScheduleValue;
  /** 모달 닫힐 때(overlay 클릭 포함) 저장 */
  onSave: (next: ScheduleValue) => void | Promise<void>;
  saving?: boolean;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const buildTimes = () => {
  const list: { label: string; h: number; m: number }[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const isAM = h < 12;
      const hh12 = h % 12 === 0 ? 12 : h % 12;
      list.push({
        label: `${isAM ? "오전" : "오후"} ${hh12}:${pad2(m)}`,
        h,
        m,
      });
    }
  }
  return list;
};

const sameYMD = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const clampTo15 = (d: Date) => {
  const next = new Date(d);
  const mm = Math.floor(next.getMinutes() / 15) * 15;
  next.setMinutes(mm, 0, 0);
  return next;
};

const formatTimeBox = (d: Date | null) => (d ? formatKoreanTime(d) : "");

export function ScheduleModal({
  open,
  onClose,
  value,
  onSave,
  saving = false,
}: ScheduleModalProps) {
  /** ✅ 정석: “날짜 선택”은 날짜 전용 상태로 분리 */
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  /** ✅ 정석: 실제 저장될 값은 draft */
  const [draft, setDraft] = useState<ScheduleValue>(value);

  /** ✅ 어떤 박스를 수정중인지(빨간 테두리) */
  const [active, setActive] = useState<"start" | "end" | null>("start");

  /** 달력 월 이동용 */
  const [viewMonth, setViewMonth] = useState(() => new Date());

  const times = useMemo(() => buildTimes(), []);

  /** ✅ 모달 열릴 때 초기화 */
  useEffect(() => {
    if (!open) return;

    // 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 초기 draft 세팅
    const nextDraft: ScheduleValue = {
      startAt: value.startAt ? new Date(value.startAt) : null,
      endAt: value.endAt ? new Date(value.endAt) : null,
    };

    // selectedDate는 startAt 기준(없으면 endAt / 없으면 오늘)
    const baseDate = nextDraft.startAt ?? nextDraft.endAt ?? new Date();
    const baseDay = new Date(baseDate);
    baseDay.setHours(0, 0, 0, 0);

    // start/end가 없으면 기본값 부여(정석: 최소 1개는 만들어 둔다)
    if (!nextDraft.startAt) {
      const s = clampTo15(new Date(baseDate));
      // 기본 시작 6:00로 잡고 싶으면 아래 2줄로 교체 가능
      // const s = new Date(baseDay); s.setHours(6, 0, 0, 0);
      nextDraft.startAt = s;
    }
    if (!nextDraft.endAt) {
      const e = new Date(nextDraft.startAt);
      e.setHours(e.getHours() + 3);
      nextDraft.endAt = e;
    }

    // start/end 날짜를 selectedDate와 동기화(정석: 날짜는 하나로 고정)
    const s = new Date(baseDay);
    s.setHours(nextDraft.startAt.getHours(), nextDraft.startAt.getMinutes(), 0, 0);

    const e = new Date(baseDay);
    e.setHours(nextDraft.endAt.getHours(), nextDraft.endAt.getMinutes(), 0, 0);

    // end가 start보다 빠르면 보정(기본 3시간)
    if (e.getTime() < s.getTime()) {
      e.setTime(s.getTime());
      e.setHours(e.getHours() + 3);
    }

    setDraft({ startAt: s, endAt: e });
    setSelectedDate(baseDay);
    setViewMonth(new Date(baseDay));
    setActive("start");

    return () => {
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  /** 달력 라벨/데이터 */
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const first = new Date(year, month, 1);
  const firstDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    if (day < 1 || day > daysInMonth) return null;
    return new Date(year, month, day);
  });

  const monthLabel = `${year}년 ${month + 1}월`;
  const dateText = selectedDate ? formatKoreanDate(selectedDate) : "";

  const goPrevMonth = () => {
    const next = new Date(viewMonth);
    next.setMonth(next.getMonth() - 1);
    setViewMonth(next);
  };

  const goNextMonth = () => {
    const next = new Date(viewMonth);
    next.setMonth(next.getMonth() + 1);
    setViewMonth(next);
  };

  /** ✅ 날짜 선택: selectedDate는 유지되고, start/end는 “같은 날짜”로 붙여줌 */
  const applyDay = (d: Date) => {
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    setSelectedDate(day);

    setDraft((prev) => {
      const start = prev.startAt ? new Date(prev.startAt) : new Date(day);
      const end = prev.endAt ? new Date(prev.endAt) : new Date(day);

      const nextStart = new Date(day);
      nextStart.setHours(start.getHours(), start.getMinutes(), 0, 0);

      const nextEnd = new Date(day);
      nextEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);

      if (nextEnd.getTime() < nextStart.getTime()) {
        nextEnd.setTime(nextStart.getTime());
        nextEnd.setHours(nextEnd.getHours() + 3);
      }

      return { startAt: nextStart, endAt: nextEnd };
    });
  };

  /** ✅ 말 안되는 종료시간 막기(종료가 시작보다 빠른 경우 disable) */
  const isDisabledTime = (h: number, m: number) => {
    if (!selectedDate) return false;

    if (active === "end" && draft.startAt) {
      const candidate = new Date(selectedDate);
      candidate.setHours(h, m, 0, 0);
      return candidate.getTime() < draft.startAt.getTime();
    }
    // 요구사항이 “종료가 시작보다 빠르면”만이라 start는 제한 안 함
    return false;
  };

  /** ✅ 시간 선택: selectedDate 기준으로만 시간 변경 */
  const applyTime = (h: number, m: number) => {
    if (!active || !selectedDate) return;
    if (isDisabledTime(h, m)) return;

    setDraft((prev) => {
      const nextStart = prev.startAt ? new Date(prev.startAt) : new Date(selectedDate);
      const nextEnd = prev.endAt ? new Date(prev.endAt) : new Date(selectedDate);

      if (active === "start") {
        const s = new Date(selectedDate);
        s.setHours(h, m, 0, 0);

        // end 날짜도 같은 날짜 유지
        const e = new Date(selectedDate);
        e.setHours(nextEnd.getHours(), nextEnd.getMinutes(), 0, 0);

        // end가 start보다 빠르면 보정(3시간)
        if (e.getTime() < s.getTime()) {
          e.setTime(s.getTime());
          e.setHours(e.getHours() + 3);
        }

        return { startAt: s, endAt: e };
      } else {
        // end
        const e = new Date(selectedDate);
        e.setHours(h, m, 0, 0);

        // start는 유지(없으면 e로)
        const s = prev.startAt ? new Date(prev.startAt) : new Date(selectedDate);

        // 안전: e < s이면 변경 안 함(이미 disable로 막힘)
        if (e.getTime() < s.getTime()) return prev;

        return { startAt: s, endAt: e };
      }
    });

    // ✅ 너가 원한 UX: 시간 선택하면 빨간 테두리 해제
    setActive(null);
  };

  /** ✅ 시간 리스트에서 “현재 선택된 시간” 빨간 표시(= active 박스 기준) */
  const activeDateForList =
    active === "start" ? draft.startAt : active === "end" ? draft.endAt : null;

  /** ✅ 저장 버튼 없으니 overlay 클릭 시 저장+닫기 */
  const closeAndSave = async () => {
    if (saving) return;
    try {
      await onSave(draft);
    } finally {
      onClose();
    }
  };

  const timeBtnBase =
    "h-[69px] w-[180px] rounded-[10px] border text-[24px] font-semibold hover:bg-[#F7F7F8]";
  const timeBtnOn = "border-[#F24148] text-[#F24148]";
  const timeBtnOff = "border-[#BFBFBF] text-[#595959]";

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay: 바깥 클릭하면 저장+닫기 */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={closeAndSave}
        aria-label="close overlay"
      />

      <div className="absolute inset-0 flex mt-[110px] ml-[138px] pointer-events-none">
        <div className="pointer-events-auto w-[790px] h-[900px] rounded-[20px] bg-[#FFFFFF]">
          <div className="pt-[66px] pl-[48px]">
            <div className="flex items-center justify-between pr-[48px]">
                <div className="text-[32px] font-bold text-[#1A1A1A]">
                    날짜 시간
                </div>

                <button
                    type="button"
                    onClick={closeAndSave}
                    className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-[#F5F5F5]"
                    aria-label="close"
                >
                    <img
                    src={close}
                    alt="close"
                    className="w-[39px] h-[39px]"
                    />
                </button>
                </div>


            {/* 상단 */}
            <div className="mt-[20px] flex items-center gap-[22px]">
              {/* 날짜 */}
              <button
                type="button"
                className="h-[69px] w-[247px] rounded-[10px] border border-[#BFBFBF] pr-[38px] pl-[24px] text-[24px] font-semibold text-[#595959] hover:bg-[#F7F7F8]"
                onClick={() => setActive("start")}
              >
                {dateText || "날짜 선택"}
              </button>

              {/* 시작 */}
              <button
                type="button"
                onClick={() => setActive("start")}
                className={[timeBtnBase, active === "start" ? timeBtnOn : timeBtnOff].join(" ")}
              >
                {formatTimeBox(draft.startAt) || "시간"}
              </button>

              <div className="text-[#595959] text-[24px] font-semibold select-none">~</div>

              {/* 종료 */}
              <button
                type="button"
                onClick={() => setActive("end")}
                className={[timeBtnBase, active === "end" ? timeBtnOn : timeBtnOff].join(" ")}
              >
                {formatTimeBox(draft.endAt) || "시간"}
              </button>
            </div>

            {/* 본문 */}
            <div className="mt-6 grid grid-cols-[1fr_220px] gap-8">
              {/* Calendar */}
              <div>
                <div className="mb-[32px] flex items-center justify-between">
                  <div className="text-[32px] font-bold text-[#1A1A1A]">{monthLabel}</div>

                  <div className="flex items-center gap-[30px]">
                    <button
                      type="button"
                      onClick={goPrevMonth}
                      className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-[#F5F5F5]"
                      aria-label="previous month"
                    >
                      <img src={prev_icon} alt="prev" className="w-[10px] h-[20px]" />
                    </button>

                    <button
                      type="button"
                      onClick={goNextMonth}
                      className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-[#F5F5F5]"
                      aria-label="next month"
                    >
                      <img src={next_icon} alt="next" className="w-[10px] h-[20px]" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 text-[20px] text-[#919191] mb-[44px]">
                  {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
                    <div key={w} className="h-[24px] flex items-center justify-center">
                      {w}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-4">
                  {cells.map((d, idx) => {
                    if (!d) return <div key={idx} className="h-8" />;

                    const selected = selectedDate ? sameYMD(d, selectedDate) : false;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyDay(d)}
                        className={[
                          "h-[55px] w-[55px] mx-auto rounded-full text-[20px] font-semibold",
                          selected
                            ? "bg-[#F24148] text-[#FFFFFF]"
                            : "text-[#1A1A1A] hover:bg-[#BFBFBF]",
                        ].join(" ")}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>

                {/* 오늘로 설정: 오늘 날짜 + 기본 3시간, 그리고 저장+닫기 */}
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    if (saving) return;

                    const now = clampTo15(new Date());
                    const day = new Date(now);
                    day.setHours(0, 0, 0, 0);

                    const start = new Date(day);
                    start.setHours(now.getHours(), now.getMinutes(), 0, 0);

                    const end = new Date(start);
                    end.setHours(end.getHours() + 3);

                    setSelectedDate(day);
                    setViewMonth(new Date(day));
                    setDraft({ startAt: start, endAt: end });

                    // setState 직후라서, 저장은 다음 tick에 draft가 반영된 뒤 하는게 안전하지만
                    // 여기서는 즉시 저장 대신 overlay로 닫게 해도 됨.
                    // 요구가 "오늘로 설정"은 바로 저장이었으니, draft를 직접 전달해서 저장.
                    void (async () => {
                      await onSave({ startAt: start, endAt: end });
                      onClose();
                    })();
                  }}
                  className="mt-[24px] h-[63px] w-[468px] rounded-[10px] text-[20px] font-semibold bg-[#F24148] text-[#FFFFFF] px-[188px]"
                >
                  {saving ? "설정 중..." : "오늘로 설정"}
                </button>
              </div>

              {/* Time list */}
              <div className="pt-[52px] pr-[48px]">
                <div className="max-h-[460px] overflow-y-auto pr-1">
                  <div className="space-y-[7px]">
                    {times.map((t) => {
                      const disabled = isDisabledTime(t.h, t.m);

                      const isActiveTime =
                        !!activeDateForList &&
                        activeDateForList.getHours() === t.h &&
                        activeDateForList.getMinutes() === t.m;

                      return (
                        <button
                          key={t.label}
                          type="button"
                          disabled={disabled}
                          onClick={() => applyTime(t.h, t.m)}
                          className={[
                            "w-full h-[62px] rounded-[10px] border text-[20px] font-semibold",
                            disabled
                              ? "border-[#E5E5E5] text-[#C0C0C0] bg-[#FAFAFA] cursor-not-allowed"
                              : isActiveTime
                              ? "border-[#F24148] text-[#F24148] bg-[#FEF2F2]"
                              : "border-[#BFBFBF] text-[#595959] bg-[#FFFFFF]",
                          ].join(" ")}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 저장 버튼 없음 */}
          </div>
        </div>
      </div>
    </div>
  );
}