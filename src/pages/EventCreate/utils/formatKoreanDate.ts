// 화면 표시용
const KOR_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const formatKoreanDate = (date: Date | string): string => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;      // 0패딩 없이
  const day = d.getDate();         // 0패딩 없이
  const dow = KOR_DAYS[d.getDay()];
  return `${y}. ${m}. ${day} (${dow})`;
};