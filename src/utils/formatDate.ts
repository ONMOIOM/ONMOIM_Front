// 날짜 포맷팅 유틸리티 함수
export const formatDate = (
  date: Date | string,
  format: string = "YYYY-MM-DD"
): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day);
};

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** 행사 카드용 일시 문자열: "2025.02.10 (월) 14:00" */
export const formatEventDateTime = (isoDate: string): string => {
  const d = new Date(isoDate);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const weekday = WEEKDAY_KO[d.getDay()];
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} (${weekday}) ${h}:${min}`;
};
