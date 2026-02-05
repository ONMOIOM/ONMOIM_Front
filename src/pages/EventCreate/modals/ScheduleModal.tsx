import { useEffect, useMemo, useState } from "react";
import { formatKoreanDate } from "../utils/formatKoreanDate";
import { formatKoreanTime } from "../utils/formatKoreanTime"; // 경로 맞게 수정

export type ScheduleValue = {
  startAt: Date | null;
  endAt: Date | null;
};

export type ScheduleModalProps = {
  open: boolean;
  onClose: () => void;
  value: ScheduleValue;
  onSave: (next: ScheduleValue) => void;
  saving?: boolean;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const formatTimeBox = (d: Date | null) => {
  if (!d) return "";
  return formatKoreanTime(d); // "오전/오후 h:mm"
};

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

export function ScheduleModal({
  open,
  onClose,
  value,
  onSave,
  saving = false,
}: ScheduleModalProps) {
  const [draft, setDraft] = useState<ScheduleValue>(value);
  const [active, setActive] = useState<"start" | "end">("start");
  const [viewMonth, setViewMonth] = useState(() => new Date());

  const times = useMemo(() => buildTimes(), []);

  useEffect(() => {
    if (!open) return;
    setDraft(value);
    setActive("start");
    if (value.startAt) setViewMonth(new Date(value.startAt));
    else setViewMonth(new Date());
  }, [open, value]);

  if (!open) return null;

  const activeDate = active === "start" ? draft.startAt : draft.endAt;

  const setActiveDate = (next: Date | null) => {
    setDraft((prev) =>
      active === "start" ? { ...prev, startAt: next } : { ...prev, endAt: next }
    );
  };

  // 캘린더 데이터
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

  const applyDay = (d: Date) => {
    const next = new Date(d);
    if (activeDate) next.setHours(activeDate.getHours(), activeDate.getMinutes(), 0, 0);
    else next.setHours(6, 0, 0, 0);

    setActiveDate(next);

    if (active === "start" && !draft.endAt) {
      setDraft((prev) => ({ ...prev, endAt: new Date(next) }));
    }
  };

  const applyTime = (h: number, m: number) => {
    if (!activeDate) return;
    const next = new Date(activeDate);
    next.setHours(h, m, 0, 0);
    setActiveDate(next);

    if (active === "start" && !draft.endAt) {
      setDraft((prev) => ({ ...prev, endAt: new Date(next) }));
    }
  };

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

  // 사진처럼: 오늘로 설정 = 저장 트리거
  const handleTodaySave = () => {
    if (saving) return;

    const now = new Date();
    const rounded = new Date(now);
    const mm = Math.floor(rounded.getMinutes() / 15) * 15;
    rounded.setMinutes(mm, 0, 0);

    const end = new Date(rounded);
    end.setHours(end.getHours() + 3); // 기본 3시간(원하면 1로)

    onSave({ startAt: rounded, endAt: end });
    onClose();
  };

  const monthLabel = `${year}년 ${month + 1}월`;
  const dateText = draft.startAt ? formatKoreanDate(draft.startAt) : "";

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay: saving이면 닫기 막기 */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="close overlay"
      />

      <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
        <div className="pointer-events-auto w-[760px] rounded-2xl bg-white shadow-lg">
          <div className="p-8">
            <div className="text-[18px] font-semibold text-gray-900">날짜 시간</div>

            {/* 상단: 날짜 1칸 + 시간 2칸 */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                className="h-11 w-[180px] rounded-lg border border-gray-200 px-4 text-sm text-gray-900 text-left"
                onClick={() => setActive("start")}
              >
                {dateText || "날짜 선택"}
              </button>

              <button
                type="button"
                onClick={() => setActive("start")}
                className={[
                  "h-11 w-[160px] rounded-lg border px-4 text-sm text-gray-900 text-left",
                  active === "start" ? "border-gray-900" : "border-gray-200",
                ].join(" ")}
              >
                {formatTimeBox(draft.startAt) || "시간"}
              </button>

              <div className="text-gray-500 font-medium select-none">~</div>

              <button
                type="button"
                onClick={() => setActive("end")}
                className={[
                  "h-11 w-[160px] rounded-lg border px-4 text-sm text-gray-900 text-left",
                  active === "end" ? "border-gray-900" : "border-gray-200",
                ].join(" ")}
              >
                {formatTimeBox(draft.endAt) || "시간"}
              </button>
            </div>

            {/* 본문 */}
            <div className="mt-6 grid grid-cols-[1fr_200px] gap-8">
              {/* Calendar */}
              <div>
                <div className="text-[20px] font-bold text-gray-900 mb-4">{monthLabel}</div>

                <div className="grid grid-cols-7 text-[12px] text-gray-400 mb-2">
                  {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
                    <div key={w} className="h-7 flex items-center justify-center">
                      {w}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-3">
                  {cells.map((d, idx) => {
                    if (!d) return <div key={idx} className="h-9" />;

                    const selected = activeDate ? sameYMD(d, activeDate) : false;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyDay(d)}
                        className={[
                          "h-9 w-9 mx-auto rounded-full text-[13px] font-medium",
                          selected
                            ? "bg-red-500 text-white"
                            : "text-gray-900 hover:bg-gray-100",
                        ].join(" ")}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>

                {/* 오늘로 설정 (사진처럼 크게) */}
                <button
                  type="button"
                  onClick={handleTodaySave}
                  disabled={saving}
                  className={[
                    "mt-8 h-12 w-full rounded-lg text-sm font-semibold",
                    saving
                      ? "bg-red-400 text-white opacity-70 cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600",
                  ].join(" ")}
                >
                  {saving ? "설정 중..." : "오늘로 설정"}
                </button>
              </div>

              {/* Time list */}
              <div className="pt-[52px]">
                <div className="max-h-[420px] overflow-y-auto pr-1">
                  <div className="space-y-2">
                    {times.map((t) => {
                      const isActiveTime =
                        activeDate &&
                        activeDate.getHours() === t.h &&
                        activeDate.getMinutes() === t.m;

                      return (
                        <button
                          key={t.label}
                          type="button"
                          onClick={() => applyTime(t.h, t.m)}
                          className={[
                            "w-full h-10 rounded-lg border text-[12px] font-medium",
                            isActiveTime
                              ? "border-red-400 text-red-500"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50",
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

            {/* 사진에는 저장 버튼 없으니 유지 안 함 */}
          </div>
        </div>
      </div>
    </div>
  );
}
