import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  createEventDraft,
  patchEvent,
  publishEvent,
} from "../../../api/event_updated";

type SaveStatus = "idle" | "saving" | "error";

export type DraftData = {
  title: string;
  schedule: { startAt: Date | null; endAt: Date | null };
  location: { streetAddress: string; lotNumber: string | null };
  capacity: number | null;
  price: number | null;
  playlist: string;
  information: string;

  // UI-only
  fontType: "normal" | "library" | "thin";
  allowExternal: boolean;
  coverImageUrl: string | null;
};

const defaultDraft = (): DraftData => ({
  title: "같은 행사 참여자 보기",
  schedule: { startAt: null, endAt: null },
  location: { streetAddress: "", lotNumber: null },
  capacity: null,
  price: null,
  playlist: "",
  information: "",

  fontType: "normal",
  allowExternal: false,
  coverImageUrl: null,
});

// persist로 Date가 string이 될 수 있어서 복원
const reviveDates = (data: DraftData): DraftData => {
  const toDate = (v: any) => (typeof v === "string" ? new Date(v) : v);
  return {
    ...data,
    schedule: {
      startAt: data.schedule.startAt ? toDate(data.schedule.startAt) : null,
      endAt: data.schedule.endAt ? toDate(data.schedule.endAt) : null,
    },
  };
};

export type EventDraftStore = {
  // meta
  eventId: number | null;
  initStatus: "idle" | "loading" | "ready" | "error";
  initError: string | null;

  // data
  data: DraftData;

  // field status/error
  titleStatus: SaveStatus;
  titleError: string | null;

  scheduleStatus: SaveStatus;
  scheduleError: string | null;

  locationStatus: SaveStatus;
  locationError: string | null;

  capacityStatus: SaveStatus;
  capacityError: string | null;

  priceStatus: SaveStatus;
  priceError: string | null;

  playlistStatus: SaveStatus;
  playlistError: string | null;

  informationStatus: SaveStatus;
  informationError: string | null;

  // actions
  initDraft: () => Promise<void>;

  // setters
  setTitle: (v: string) => void;
  setSchedule: (v: DraftData["schedule"]) => void;
  setLocation: (v: DraftData["location"]) => void;
  setCapacity: (v: number | null) => void;
  setPrice: (v: number | null) => void;
  setPlaylist: (v: string) => void;
  setInformation: (v: string) => void;

  // UI-only setters
  setFontType: (v: DraftData["fontType"]) => void;
  setAllowExternal: (v: boolean) => void;
  setCoverImageUrl: (v: string | null) => void;

  // save actions (필드별 저장 유지!)
  saveTitle: () => Promise<void>;
  saveSchedule: () => Promise<void>;
  saveLocation: () => Promise<void>;
  saveCapacity: () => Promise<void>;
  savePrice: () => Promise<void>;
  savePlaylist: () => Promise<void>;
  saveInformation: () => Promise<void>;

  // publish
  publish: () => Promise<void>;
  publishStatus: SaveStatus;
  publishError: string | null;

  reset: () => void;
};

export const useEventDraftStore = create<EventDraftStore>()(
  persist(
    (set, get) => ({
      eventId: null,
      initStatus: "idle",
      initError: null,

      data: defaultDraft(),

      titleStatus: "idle",
      titleError: null,

      scheduleStatus: "idle",
      scheduleError: null,

      locationStatus: "idle",
      locationError: null,

      capacityStatus: "idle",
      capacityError: null,

      priceStatus: "idle",
      priceError: null,

      playlistStatus: "idle",
      playlistError: null,

      informationStatus: "idle",
      informationError: null,

      publishStatus: "idle",
      publishError: null,

      // 1) 초안 생성
      initDraft: async () => {
        const { initStatus } = get();
        if (initStatus === "loading" || initStatus === "ready") return;

        set({ initStatus: "loading", initError: null });

        try {
          const res = await createEventDraft();
          if (!res.success || !res.data) throw new Error(res.message ?? "초안 생성 실패");

          set({
            eventId: res.data.eventId,
            initStatus: "ready",
          });
        } catch (e: any) {
          set({
            initStatus: "error",
            initError: e?.message ?? "초안 생성 오류",
          });
          throw e;
        }
      },

      // setters (입력 바뀌면 해당 필드 에러는 지우는 정도만)
      setTitle: (v) =>
        set((s) => ({ data: { ...s.data, title: v }, titleError: null })),

      setSchedule: (v) =>
        set((s) => ({ data: { ...s.data, schedule: v }, scheduleError: null })),

      setLocation: (v) =>
        set((s) => ({ data: { ...s.data, location: v }, locationError: null })),

      setCapacity: (v) =>
        set((s) => ({ data: { ...s.data, capacity: v }, capacityError: null })),

      setPrice: (v) =>
        set((s) => ({ data: { ...s.data, price: v }, priceError: null })),

      setPlaylist: (v) =>
        set((s) => ({ data: { ...s.data, playlist: v }, playlistError: null })),

      setInformation: (v) =>
        set((s) => ({ data: { ...s.data, information: v }, informationError: null })),

      setFontType: (v) =>
        set((s) => ({ data: { ...s.data, fontType: v } })),

      setAllowExternal: (v) =>
        set((s) => ({ data: { ...s.data, allowExternal: v } })),

      setCoverImageUrl: (v) =>
        set((s) => ({ data: { ...s.data, coverImageUrl: v } })),

      // ---- save: title ----
      saveTitle: async () => {
        const { eventId, data } = get();
        if (eventId == null) throw new Error("eventId 없음: initDraft 먼저");

        set({ titleStatus: "saving", titleError: null });
        try {
          const title = data.title.trim();
          if (!title) throw new Error("제목을 입력해줘.");

          const res = await patchEvent(eventId, { title });
          if (!res.success) throw new Error(res.message ?? "제목 저장 실패");

          set({ titleStatus: "idle" });
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? e?.message ?? "제목 저장 실패";
          set({ titleStatus: "error", titleError: msg });
          throw e;
        }
      },

      // ---- save: schedule ----
      saveSchedule: async () => {
        const { eventId, data } = get();
        if (eventId == null) throw new Error("eventId 없음: initDraft 먼저");

        set({ scheduleStatus: "saving", scheduleError: null });
        try {
          const { startAt, endAt } = data.schedule;
          if (!startAt || !endAt) throw new Error("일자를 입력해줘.");

          const res = await patchEvent(eventId, {
            startTime: startAt.toISOString(),
            endTime: endAt.toISOString(),
          } as any);
          if (!res.success) throw new Error(res.message ?? "일정 저장 실패");

          set({ scheduleStatus: "idle" });
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? e?.message ?? "일정 저장 실패";
          set({ scheduleStatus: "error", scheduleError: msg });
          throw e;
        }
      },

      // ---- save: location ----
      saveLocation: async () => {
        const { eventId, data } = get();
        if (eventId == null) throw new Error("eventId 없음: initDraft 먼저");

        set({ locationStatus: "saving", locationError: null });
        try {
          const streetAddress = data.location.streetAddress.trim();
          if (!streetAddress) throw new Error("장소를 입력해줘.");

          const lotNumberAddress = data.location.lotNumber?.trim() || null;

          const res = await patchEvent(eventId, {
            streetAddress,
            lotNumberAddress: lotNumberAddress ?? undefined,
          } as any);
          if (!res.success) throw new Error(res.message ?? "장소 저장 실패");

          set({ locationStatus: "idle" });
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? e?.message ?? "장소 저장 실패";
          set({ locationStatus: "error", locationError: msg });
          throw e;
        }
      },

      // ---- save: capacity ----
      saveCapacity: async () => {
        const { eventId, data } = get();
        if (eventId == null) throw new Error("eventId 없음: initDraft 먼저");

        set({ capacityStatus: "saving", capacityError: null });
        try {
          const res = await patchEvent(eventId, { capacity: data.capacity });
          if (!res.success) throw new Error(res.message ?? "정원 저장 실패");

          set({ capacityStatus: "idle" });
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? e?.message ?? "정원 저장 실패";
          set({ capacityStatus: "error", capacityError: msg });
          throw e;
        }
      },

      // ---- save: price ----
      savePrice: async () => {
        const { eventId, data } = get();
        if (eventId == null) throw new Error("eventId 없음: initDraft 먼저");

        set({ priceStatus: "saving", priceError: null });
        try {
          const res = await patchEvent(eventId, { price: data.price });
          if (!res.success) throw new Error(res.message ?? "가격 저장 실패");

          set({ priceStatus: "idle" });
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? e?.message ?? "가격 저장 실패";
          set({ priceStatus: "error", priceError: msg });
          throw e;
        }
      },

      // ---- save: playlist ----
      savePlaylist: async () => {
        const { eventId, data } = get();
        if (eventId == null) throw new Error("eventId 없음: initDraft 먼저");

        set({ playlistStatus: "saving", playlistError: null });
        try {
          const res = await patchEvent(eventId, {
            playlist: data.playlist.trim() || undefined,
          });
          if (!res.success) throw new Error(res.message ?? "플레이리스트 저장 실패");

          set({ playlistStatus: "idle" });
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? e?.message ?? "플레이리스트 저장 실패";
          set({ playlistStatus: "error", playlistError: msg });
          throw e;
        }
      },

      // ---- save: information ----
      saveInformation: async () => {
        const { eventId, data } = get();
        if (eventId == null) throw new Error("eventId 없음: initDraft 먼저");

        set({ informationStatus: "saving", informationError: null });
        try {
          const res = await patchEvent(eventId, {
            information: data.information.trim() || undefined,
          });
          if (!res.success) throw new Error(res.message ?? "소개글 저장 실패");

          set({ informationStatus: "idle" });
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? e?.message ?? "소개글 저장 실패";
          set({ informationStatus: "error", informationError: msg });
          throw e;
        }
      },

      // ---- publish (저장 클릭 시: eventId만으로 발행, PATCH는 옵션 선택 시 각각 호출됨) ----
      publish: async () => {
        const { eventId } = get();

        set({ publishStatus: "saving", publishError: null });
        try {
          if (eventId == null) throw new Error("초안이 없습니다. 페이지를 새로고침해주세요.");

          const res = await publishEvent(eventId);
          if (!res.success) throw new Error(res.message ?? "발행 실패");

          set({ publishStatus: "idle" });
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? e?.message ?? "저장 실패";
          set({ publishStatus: "error", publishError: msg });
          throw e;
        }
      },

      reset: () => {
        set({
          eventId: null,
          initStatus: "idle",
          initError: null,
          data: defaultDraft(),

          titleStatus: "idle",
          titleError: null,

          scheduleStatus: "idle",
          scheduleError: null,

          locationStatus: "idle",
          locationError: null,

          capacityStatus: "idle",
          capacityError: null,

          priceStatus: "idle",
          priceError: null,

          playlistStatus: "idle",
          playlistError: null,

          informationStatus: "idle",
          informationError: null,

          publishStatus: "idle",
          publishError: null,
        });
      },
    }),
    {
      name: "onmoim-event-create-draft-simple-full",
      partialize: (s) => ({
        eventId: s.eventId,
        data: {
          ...s.data,
          coverImageUrl: null,
        },
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // @ts-ignore
        state.data = reviveDates(state.data);
      },
    }
  )
);
