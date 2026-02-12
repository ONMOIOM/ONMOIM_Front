export function formatKoreanTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h < 12 ? "오전" : "오후";
  const hh = ((h + 11) % 12) + 1;
  const mm = String(m).padStart(2, "0");
  return `${ampm} ${hh}:${mm}`;
}
