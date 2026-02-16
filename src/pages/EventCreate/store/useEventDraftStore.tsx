import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  createEventDraft,
  patchEvent,
  publishEvent,
} from "../../../api/event_updated";

type SaveStatus = "idle" | "saving" | "error";

export type DraftData = {
  //title: string;
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
  //title: "같은 행사 참여자 보기",
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
  saveSchedule: (override?: DraftData["schedule"]) => Promise<void>;
  saveLocation: () => Promise<void>;
  saveCapacity: () => Promise<void>;
  savePrice: () => Promise<void>;
  savePlaylist: () => Promise<void>;
  saveInformation: () => Promise<void>;

  // publish
  publish: () => Promise<void>;
  publishStatus: SaveStatus;
  publishError: string | null;

  _ensureEventId: () => Promise<number>;

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
        const { initStatus, eventId } = get();
        // 이미 ID가 있거나 준비된 상태면 패스
        if (eventId || initStatus === "ready") return;

        // 백엔드 호출 없이 로컬 상태만 준비 완료로 변경
        set({ initStatus: "ready", initError: null });
      },

      // (추가됨) 실제 저장 시점에 호출할 ID 보장 함수
      _ensureEventId: async () => {
        const { eventId } = get();
        // 이미 ID가 있으면 그대로 반환
        if (eventId !== null) return eventId;

        // ID가 없을 때(첫 저장 시) 비로소 백엔드에 생성 요청
        try {
          const res = await createEventDraft();
          if (!res.success || !res.data) {
            throw new Error(res.message ?? "초안 생성 실패");
          }

          set({ eventId: res.data.eventId });
          return res.data.eventId;
        } catch (e: any) {
          // 생성 실패 시 에러 처리 (필요시 상태 업데이트)
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
        set((s) => ({
          data: { ...s.data, information: v },
          informationError: null,
        })),

      setFontType: (v) => set((s) => ({ data: { ...s.data, fontType: v } })),

      setAllowExternal: (v) =>
        set((s) => ({ data: { ...s.data, allowExternal: v } })),

      setCoverImageUrl: (v) =>
        set((s) => ({ data: { ...s.data, coverImageUrl: v } })),

      // ---- save: title ----
      saveTitle: async () => {
        const { data } = get(); // eventId는 여기서 안 가져옵니다.

        set({ titleStatus: "saving", titleError: null });
        try {
          const title = data.title.trim();
          if (!title) throw new Error("제목을 입력해줘.");

          // [핵심] 저장하려고 할 때 ID가 없으면 비로소 만듭니다!
          const eventId = await get()._ensureEventId();

          const res = await patchEvent(eventId, { title });
          if (!res.success) throw new Error(res.message ?? "제목 저장 실패");

          set({ titleStatus: "idle" });
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ?? e?.message ?? "제목 저장 실패";
          set({ titleStatus: "error", titleError: msg });
          throw e;
        }
      },

      // ---- save: schedule (수정됨) ----
      saveSchedule: async (override) => {
        const { data } = get();
        // eventId 체크 로직 제거 -> _ensureEventId로 대체

        const scheduleToSave = override ?? data.schedule;
        set({ scheduleStatus: "saving", scheduleError: null });
        try {
          const { startAt, endAt } = scheduleToSave;
          if (!startAt || !endAt) throw new Error("일자를 입력해줘.");

          // [핵심] ID 확보
          const eventId = await get()._ensureEventId();

          const res = await patchEvent(eventId, {
            startTime: startAt.toISOString(),
            endTime: endAt.toISOString(),
          } as any);
          if (!res.success) throw new Error(res.message ?? "일정 저장 실패");

          set({ scheduleStatus: "idle" });
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ?? e?.message ?? "일정 저장 실패";
          set({ scheduleStatus: "error", scheduleError: msg });
          throw e;
        }
      },

      // ---- save: location (수정됨) ----
      saveLocation: async () => {
        const { data } = get();

        set({ locationStatus: "saving", locationError: null });
        try {
          const streetAddress = data.location.streetAddress.trim();
          if (!streetAddress) throw new Error("장소를 입력해줘.");

          const lotNumberAddress = data.location.lotNumber?.trim() || null;

          // [핵심] ID 확보
          const eventId = await get()._ensureEventId();

          const res = await patchEvent(eventId, {
            streetAddress,
            lotNumberAddress: lotNumberAddress ?? undefined,
          } as any);
          if (!res.success) throw new Error(res.message ?? "장소 저장 실패");

          set({ locationStatus: "idle" });
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ?? e?.message ?? "장소 저장 실패";
          set({ locationStatus: "error", locationError: msg });
          throw e;
        }
      },

      // ---- save: capacity (수정됨) ----
      saveCapacity: async () => {
        const { data } = get();

        set({ capacityStatus: "saving", capacityError: null });
        try {
          // [핵심] ID 확보
          const eventId = await get()._ensureEventId();

          const res = await patchEvent(eventId, { capacity: data.capacity });
          if (!res.success) throw new Error(res.message ?? "정원 저장 실패");

          set({ capacityStatus: "idle" });
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ?? e?.message ?? "정원 저장 실패";
          set({ capacityStatus: "error", capacityError: msg });
          throw e;
        }
      },

      // ---- save: price (수정됨) ----
      savePrice: async () => {
        const { data } = get();

        set({ priceStatus: "saving", priceError: null });
        try {
          // [핵심] ID 확보
          const eventId = await get()._ensureEventId();

          const res = await patchEvent(eventId, { price: data.price });
          if (!res.success) throw new Error(res.message ?? "가격 저장 실패");

          set({ priceStatus: "idle" });
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ?? e?.message ?? "가격 저장 실패";
          set({ priceStatus: "error", priceError: msg });
          throw e;
        }
      },

      // ---- save: playlist (수정됨) ----
      savePlaylist: async () => {
        const { data } = get();

        set({ playlistStatus: "saving", playlistError: null });
        try {
          // [핵심] ID 확보
          const eventId = await get()._ensureEventId();

          const res = await patchEvent(eventId, {
            playlist: data.playlist.trim() || undefined,
          });
          if (!res.success)
            throw new Error(res.message ?? "플레이리스트 저장 실패");

          set({ playlistStatus: "idle" });
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ??
            e?.message ??
            "플레이리스트 저장 실패";
          set({ playlistStatus: "error", playlistError: msg });
          throw e;
        }
      },

      // ---- save: information (수정됨) ----
      saveInformation: async () => {
        const { data } = get();

        set({ informationStatus: "saving", informationError: null });
        try {
          // [핵심] ID 확보
          const eventId = await get()._ensureEventId();

          const res = await patchEvent(eventId, {
            introduction: data.information.trim() || undefined,
          } as any);
          if (!res.success) throw new Error(res.message ?? "소개글 저장 실패");

          set({ informationStatus: "idle" });
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ?? e?.message ?? "소개글 저장 실패";
          set({ informationStatus: "error", informationError: msg });
          throw e;
        }
      },

      // ---- publish (수정됨) ----
      publish: async () => {
        // publish는 보통 다 작성 후 누르지만, 혹시 모르니 여기서도 ID 체크
        set({ publishStatus: "saving", publishError: null });
        try {
          // [핵심] ID 확보 (만약 저장을 한 번도 안 하고 바로 발행 누를 경우 대비)
          const eventId = await get()._ensureEventId();

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
    },
  ),
);
