
/* -------------------- formatting helpers -------------------- */


import { formatKoreanDate } from "./formatKoreanDate";
import { formatKoreanTime } from "./formatKoreanTime";

export function formatScheduleView(schedule: {
  startAt: Date | null;
  endAt: Date | null;
}): {
  dateText: string;
  startTimeText: string;
  endTimeText: string;
  isAllDay: boolean;
} {
  const { startAt, endAt } = schedule ?? {};

  if (!startAt || !endAt) {
    return {
      dateText: "",
      startTimeText: "",
      endTimeText: "",
      isAllDay: false,
    };
  }

  const isAllDay =
    startAt.getHours() === 0 &&
    startAt.getMinutes() === 0 &&
    endAt.getHours() === 23 &&
    endAt.getMinutes() === 59;

  return {
    dateText: formatKoreanDate(startAt),
    startTimeText: formatKoreanTime(startAt),
    endTimeText: formatKoreanTime(endAt),
    isAllDay,
  };
}


export function formatLocation(location: any): string {
  if (!location || typeof location !== "object") return "";
  const street = location.streetAddress ?? location.roadAddress ?? "";
  const lot = location.lotNumber ?? "";
  const streetStr = String(street || "").trim();
  const lotStr = String(lot ?? "").trim();
  return streetStr || lotStr || "";
}

export function formatCapacity(capacity: any): string {
  if (capacity === null || capacity === undefined || capacity === "") return "";
  if (typeof capacity === "number") return `${capacity} 명`;
  if (typeof capacity === "object" && capacity?.count != null) return `${capacity.count} 명`;
  return String(capacity);
}

export function formatPrice(price: any): string {
  if (price === null || price === undefined || price === "") return "";
  if (typeof price === "number") return `${price.toLocaleString()} ₩`;
  if (typeof price === "string") return price;
  if (typeof price === "object" && price?.amount != null) {
    const n = Number(price.amount);
    return Number.isFinite(n) ? `${n.toLocaleString()} ₩` : String(price.amount);
  }
  return String(price);
}
