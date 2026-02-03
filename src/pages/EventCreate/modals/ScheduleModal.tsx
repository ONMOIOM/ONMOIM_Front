import { useEffect, useMemo, useState } from "react";

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

const formatKDateTime = (d: Date | null) => {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());

  const h = d.getHours();
  const m = d.getMinutes();
  const isAM = h < 12;
  const hh12 = h % 12 === 0 ? 12 : h % 12;

  return `${yyyy}.${mm}.${dd}   ${isAM ? "오전" : "오후"} ${pad2(hh12)}:${pad2(m)}`;
};

const buildTimes = () => {
  const list: { label: string; h: number; m: number }[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const isAM = h < 12;
      const hh12 = h % 12 === 0 ? 12 : h % 12;
      list.push({
        label: `${isAM ? "오전" : "오후"} ${pad2(hh12)}:${pad2(m)}`,
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

export function ScheduleModal({ open, onClose, value, onSave, saving }: ScheduleModalProps) {
  const [draft, setDraft] = useState<ScheduleValue>(value);
  const [active, setActive] = useState<"start" | "end">("start");
  const [viewMonth, setViewMonth] = useState(() => new Date());

  const times = useMemo(() => buildTimes(), []);

  useEffect(() => {
    if (!open) return;
    setDraft(value);
    setActive("start");
    // 달력은 시작일 기준으로 보여주고 싶으면:
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
  const month = viewMonth.getMonth(); // 0~11
  const first = new Date(year, month, 1);
  const firstDay = first.getDay(); // 0(일)~6(토)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 6주(42칸) 그리드
  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    if (day < 1 || day > daysInMonth) return null;
    return new Date(year, month, day);
  });

  const applyDay = (d: Date) => {
    // 기존 시간 유지 (없으면 06:00으로 맞춤 — 피그마 느낌에 가깝게)
    const base = activeDate ?? new Date();
    const next = new Date(d);
    if (activeDate) next.setHours(activeDate.getHours(), activeDate.getMinutes(), 0, 0);
    else next.setHours(6, 0, 0, 0);
    setActiveDate(next);

    // 시작일 바꾸면 종료일이 비어있을 때 자동 세팅(원하면 유지)
    if (active === "start" && !draft.endAt) {
      const end = new Date(next);
      setDraft((prev) => ({ ...prev, endAt: end }));
    }
  };

  const applyTime = (h: number, m: number) => {
    if (!activeDate) return; // 날짜 먼저 선택하게
    const next = new Date(activeDate);
    next.setHours(h, m, 0, 0);
    setActiveDate(next);

    // 시작 시간 바꿀 때 종료가 없으면 같이 맞추기(피그마 UX에 자주 있음)
    if (active === "start" && !draft.endAt) {
      const end = new Date(next);
      setDraft((prev) => ({ ...prev, endAt: end }));
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

  const setToday = () => {
    const now = new Date();
    const rounded = new Date(now);
    // 15분 단위로 내림(원하면 반올림으로 바꿔도 됨)
    const m = Math.floor(rounded.getMinutes() / 15) * 15;
    rounded.setMinutes(m, 0, 0);

    setDraft((prev) => ({
      startAt: rounded,
      endAt: prev.endAt ?? new Date(rounded),
    }));
    setActive("start");
    setViewMonth(new Date(now));
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const monthLabel = `${year}년 ${month + 1}월`;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
        aria-label="close overlay"
      />

      {/* center */}
      <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
        <div className="pointer-events-auto w-[760px] rounded-2xl bg-white border border-gray-200 shadow-sm">
          {/* content padding */}
          <div className="p-6">
            {/* Top row: 시작일/종료일 */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-2">시작일</div>
                <button
                  type="button"
                  onClick={() => setActive("start")}
                  className={[
                    "w-full h-11 rounded-lg border px-4 text-left text-sm",
                    active === "start" ? "border-gray-900" : "border-gray-200",
                  ].join(" ")}
                >
                  <span className="text-gray-900">{formatKDateTime(draft.startAt) || "날짜/시간 선택"}</span>
                </button>
              </div>

              <div className="pt-6 text-gray-400 select-none">»</div>

              <div>
                <div className="text-sm font-semibold text-gray-900 mb-2 text-right">종료일</div>
                <button
                  type="button"
                  onClick={() => setActive("end")}
                  className={[
                    "w-full h-11 rounded-lg border px-4 text-left text-sm",
                    active === "end" ? "border-gray-900" : "border-gray-200",
                  ].join(" ")}
                >
                  <span className="text-gray-900">{formatKDateTime(draft.endAt) || "날짜/시간 선택"}</span>
                </button>
              </div>
            </div>

            {/* Middle: calendar + time list */}
            <div className="mt-6 grid grid-cols-[1fr_220px] gap-6">
              {/* Calendar */}
              <div className="rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-gray-900">{monthLabel}</div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goPrevMonth}
                      className="h-8 w-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                      aria-label="prev month"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={goNextMonth}
                      className="h-8 w-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                      aria-label="next month"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Weekday header */}
                <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
                  {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
                    <div key={w} className="h-8 flex items-center justify-center">
                      {w}
                    </div>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-y-2">
                  {cells.map((d, idx) => {
                    const isEmpty = !d;
                    if (isEmpty) {
                      return <div key={idx} className="h-10" />;
                    }

                    const isSelected = activeDate ? sameYMD(d!, activeDate) : false;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyDay(d!)}
                        className={[
                          "h-10 w-10 mx-auto rounded-full text-sm",
                          isSelected ? "bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-100",
                        ].join(" ")}
                      >
                        {d!.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time list */}
              <div className="rounded-xl">
                <div className="max-h-[360px] overflow-y-auto">
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
                            "w-full h-9 rounded-lg border text-xs",
                            isActiveTime
                              ? "border-gray-900 bg-gray-50 text-gray-900"
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

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={setToday}
                className="h-11 w-[220px] rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                오늘로 설정
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="h-11 w-[220px] rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
