import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  createEventDraft,
  saveEventTitle,
  saveEventSchedule,
  saveEventLocation,
  saveEventCapacity,
  saveEventPrice,
  saveEventPlaylist,
  saveEventInformation,
} from "../../../api/event_updated";

// ---- 타입(너 프로젝트 타입으로 바꿔도 됨) ----
export type FieldKey =
  | "title"
  | "schedule"
  | "location"
  | "capacity"
  | "price"
  | "playlist"
  | "information";

export type FieldStatus = "idle" | "dirty" | "saving" | "saved" | "error";

export type DraftData = {
  // 서버 저장 대상
  title: string;
  schedule: { startAt: Date | null; endAt: Date | null };
  location: { streetAddress: string; lotNumber: string | null };
  capacity: number | null;
  price: number | null;
  playlist: string;
  information: string;

  // UI 전용 (서버 명세 없으면 로컬만)
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

// ---- store ----
type DraftStore = {
  // meta
  eventId: number | null;
  initStatus: "idle" | "loading" | "ready" | "error";
  initError: string | null;

  // data
  data: DraftData;

  // field status
  status: Record<FieldKey, FieldStatus>;
  error: Record<FieldKey, string | null>;

  // actions
  initDraft: () => Promise<void>;
  update: <K extends keyof DraftData>(key: K, value: DraftData[K]) => void;

  saveField: (field: FieldKey) => Promise<void>;
  hasUnsaved: () => boolean;

  // (선택) 최종 버튼용: dirty만 저장
  saveAllDirty: () => Promise<void>;

  // 완료/취소 시 정리
  reset: () => void;
};

const initialStatus: Record<FieldKey, FieldStatus> = {
  title: "idle",
  schedule: "idle",
  location: "idle",
  capacity: "idle",
  price: "idle",
  playlist: "idle",
  information: "idle",
};

const initialError: Record<FieldKey, string | null> = {
  title: null,
  schedule: null,
  location: null,
  capacity: null,
  price: null,
  playlist: null,
  information: null,
};

// Date를 persist 할 때 string으로 바뀌니까 복원해주는 함수
const reviveDates = (data: DraftData): DraftData => {
  const s: any = data.schedule;
  const toDate = (v: any) => (typeof v === "string" ? new Date(v) : v);
  return {
    ...data,
    schedule: {
      startAt: s?.startAt ? toDate(s.startAt) : null,
      endAt: s?.endAt ? toDate(s.endAt) : null,
    },
  };
};

export const useEventDraftStore = create<DraftStore>()(
  persist(
    (set, get) => ({
      eventId: null,
      initStatus: "idle",
      initError: null,

      data: defaultDraft(),

      status: { ...initialStatus },
      error: { ...initialError },

      // ✅ 페이지 진입 시 초안 생성(1번)
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
        }
      },

      // ✅ 입력 변경: data 업데이트 + 해당 필드 dirty 처리
      update: (key, value) => {
        set((state) => {
          const next = { ...state.data, [key]: value };
          const mapping: Partial<Record<keyof DraftData, FieldKey>> = {
            title: "title",
            schedule: "schedule",
            location: "location",
            capacity: "capacity",
            price: "price",
            playlist: "playlist",
            information: "information",
          };

          const field = mapping[key];
          return {
            data: next,
            ...(field
              ? {
                  status: { ...state.status, [field]: state.status[field] === "saving" ? "saving" : "dirty" },
                  error: { ...state.error, [field]: null },
                }
              : {}),
          };
        });
      },

      // ✅ 필드별 저장(단계 저장)
      saveField: async (field) => {
        const { eventId, data } = get();
        if (!eventId) throw new Error("eventId가 없어. initDraft부터 해야 해.");

        // 필드 저장 시작
        set((s) => ({
          status: { ...s.status, [field]: "saving" },
          error: { ...s.error, [field]: null },
        }));

        try {
          let res: any;

          switch (field) {
            case "title":
              if (!data.title.trim()) throw new Error("제목을 입력해줘.");
              res = await saveEventTitle({ title: data.title.trim() });
              break;

            case "schedule":
              if (!data.schedule.startAt || !data.schedule.endAt) throw new Error("일자를 입력해줘.");
              res = await saveEventSchedule({
                schedule: {
                  startDate: data.schedule.startAt.toISOString(),
                  endDate: data.schedule.endAt.toISOString(),
                },
              });
              break;

            case "location":
              if (!data.location.streetAddress.trim()) throw new Error("장소를 입력해줘.");
              res = await saveEventLocation({
                location: {
                  streetAddress: data.location.streetAddress.trim(),
                  lotNumber: data.location.lotNumber?.trim() ? data.location.lotNumber.trim() : null,
                },
              });
              break;

            case "capacity":
              res = await saveEventCapacity({ capacity: data.capacity });
              break;

            case "price":
              res = await saveEventPrice({ price: data.price });
              break;

            case "playlist":
              res = await saveEventPlaylist({ playlist: data.playlist.trim() });
              break;

            case "information":
              res = await saveEventInformation({ information: data.information.trim() });
              break;

            default:
              throw new Error("알 수 없는 필드");
          }

          if (!res.success) throw new Error(res.message ?? "저장 실패");

          set((s) => ({
            status: { ...s.status, [field]: "saved" },
          }));
        } catch (e: any) {
          const msg = e?.response?.data?.message ?? e?.message ?? "저장 실패";
          set((s) => ({
            status: { ...s.status, [field]: "error" },
            error: { ...s.error, [field]: msg },
          }));
          throw e;
        }
      },

      hasUnsaved: () => {
        const s = get().status;
        return Object.values(s).some((v) => v === "dirty" || v === "error" || v === "saving");
      },

      saveAllDirty: async () => {
        const s = get().status;
        const fields: FieldKey[] = ["title", "schedule", "location", "capacity", "price", "playlist", "information"];
        for (const f of fields) {
          if (s[f] === "dirty" || s[f] === "error") {
            await get().saveField(f);
          }
        }
      },

      reset: () => {
        set({
          eventId: null,
          initStatus: "idle",
          initError: null,
          data: defaultDraft(),
          status: { ...initialStatus },
          error: { ...initialError },
        });
      },
    }),
    {
      name: "onmoim-event-create-draft",
      partialize: (state) => ({
        // ✅ 새로고침 대비: data만 저장해도 되지만,
        // status까지 저장하면 “저장됨/오류” 표시도 유지됨.
        data: state.data,
        status: state.status,
        error: state.error,
        eventId: state.eventId,
      }),
      // ✅ persist로 저장된 data.schedule이 string이면 Date로 복원
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // @ts-ignore
        state.data = reviveDates(state.data);
      },
    }
  )
);
