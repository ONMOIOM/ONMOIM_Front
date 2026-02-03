// 서체 변경
export const FONTTYPE_ITEMS = [
  { key: "normal", label: "평범한" },
  { key: "library", label: "도서관" },
  { key: "thin", label: "얇은" },
] as const;

export type FontTypeKey = typeof FONTTYPE_ITEMS[number]["key"];

export const FONTTYPE_CLASS: Record<FontTypeKey, string> = {
  normal: "font-normal", // 나중에 실제 폰트 넣기
  library: "font-serif", 
  thin: "font-light",
};


// 행사 위치 타입
export type LocationType = {
    streetAddress: string;
    lotNumber: string | null;
};

// 행사 일정 타입(프론트 내부)
export type ScheduleType = {
    startAt: Date | null;
    endAt: Date | null;
}; 


// 행사 초안 타입
export type DraftEvent = {
  title: string;
  fontType: "normal" | "library" | "thin";
  schedule: ScheduleType;
  location: LocationType;
  capacity: number | null;
  price: number | null;
  playlist: string;
  description: string;
  allowExternal: boolean;
  coverImageUrl?: string | null;
};


// LeftFormPanel 인자 타입
export type LeftFormPanelProps = {
  title: string;
  setTitle: (v: string) => void;

  fontType: FontTypeKey;
  setFontType: (v: FontTypeKey) => void;

  allowExternal: boolean;
  setAllowExternal: (v: boolean) => void;

  description: string;
  setDescription: (v: string) => void;

  schedule: ScheduleType;
  setSchedule: (v: ScheduleType) => void;

  location: LocationType;
  setLocation: (v: LocationType) => void;

  capacity: number | null;
  setCapacity: (v: number | null) => void;

  price: number | null;
  setPrice: (v: number | null) => void;

  playlist: string;
  setPlaylist: (v: string) => void;
};

// LeftFormPanel에서 쓰는 모달 타입
export type ModalKey = "schedule" | "location" | "seats" | "price" | "playlist" | null;


// ActionPanel 인자 타입
export type ActionPanelProps = {
  onPreview: () => void;
};