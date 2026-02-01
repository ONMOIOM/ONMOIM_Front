import { useState} from 'react';
import { ScheduleModal } from '../modals/ScheduleModal_sample';
import { LocationModal } from '../modals/LocationModal';
import { SeatsModal } from '../modals/SeatsModal';
import { PriceModal } from '../modals/PriceModal';
import { PlaylistModal } from '../modals/PlaylistModal';

// 서체 변경
const FONTTYPE_ITEMS = [
  { key: "normal", label: "평범한" },
  { key: "library", label: "도서관" },
  { key: "thin", label: "얇은" },
] as const;

type FontTypeKey = typeof FONTTYPE_ITEMS[number]["key"];

const FONTTYPE_CLASS: Record<FontTypeKey, string> = {
  normal: "font-normal", // 나중에 실제 폰트 넣기
  library: "font-serif", 
  thin: "font-light",
};

// 행사 일정 타입(프론트 내부)
export type ScheduleType = {
    startAt: Date | null;
    endAt: Date | null;
}; 

// API 요청 바디(백엔드로 보낼 형태)
export type SaveEventScheduleRequest = {
  schedule: {
    startDate: string | null;
    endDate: string | null;
  } | null;
};

// API로 변환하는 함수 (요청 직전 사용)
export const toScheduleRequest = (v: ScheduleType): SaveEventScheduleRequest => {
  // 둘 다 없으면 schedule 자체를 null로 보내고 싶다면 이렇게
  if (!v.startAt && !v.endAt) return { schedule: null };

  return {
    schedule: {
      startDate: v.startAt ? v.startAt.toISOString() : null,
      endDate: v.endAt ? v.endAt.toISOString() : null,
    },
  };
};


// 행사 위치 타입
export type LocationType = {
    streetAddress: string;
    lotNumber: string;
};

type ModalKey = "schedule" | "location" | "seats" | "price" | "playlist" | null;

export const LeftFormPanel = () => {
    const [title, setTitle] = useState("같은 행사 참여자 보기");
    const [fontType, setFontType] = useState<FontTypeKey>("normal");
    const [openModal, setOpenModal] = useState<ModalKey>(null);
    const [allowExternal, setAllowExternal] = useState(false);
    const [description, setDescription] = useState("");

    // 행사 일정
    const [schedule, setSchedule] = useState<ScheduleType>({
        startAt: null,
        endAt: null,
    })

    // 행사 위치
    const [location, setLocation] = useState<LocationType>({
        streetAddress: "",
        lotNumber: "",
    })
    
    // 참여자 ( 여석? 아님 총 인원?)
    const [capacity, setCapacity] = useState<number | null>(null);

    // 참여 가격
    const [price, setPrice] = useState<number | null>(null);

    // 플레이리스트
    const [playlist, setPlaylist] = useState("");

    // 모달 닫기
    const close = () => setOpenModal(null);

    // 행사 일정 함수(아직 몰라...??)
    const handlePublishOrSave = async () => {
        // ✅ 요청 직전에만 string 변환
        const body = toScheduleRequest(schedule);
        console.log(body);
        // await saveEventSchedule(body) 같은 API 호출에 body 넣기
    };

    return (
        <div className="w-[520px] shrink-0">
            {/* 제목 */}
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
                <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={["w-full text-xl font-semibold outline-none", FONTTYPE_CLASS[fontType]].join("")}
                />
            </div>

            {/* 서체 */}
            <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">서체</div>
                <div className="flex gap-2">
                {FONTTYPE_ITEMS.map((t) => (
                    <button
                    key={t.key}
                    type="button"
                    onClick={() => setFontType(t.key)}
                    className={[
                        "px-5 py-2 rounded-full border text-sm",
                        fontType === t.key ? "border-gray-900 bg-gray-200" : "border-gray-200 text-gray-700",
                    ].join(" ")}
                    >
                    {t.label}
                    </button>
                ))}
                </div>
            </div>

            {/* 행사 일정 설정 (클릭 -> 모달) */}
            <div className="mt-4">
                <RowButton 
                title="행사 일정 설정"
                className={FONTTYPE_CLASS[fontType]} 
                onClick={() => setOpenModal("schedule")} />
            </div>

            {/* 리스트 박스 */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-white overflow-hidden">
                <ListRow label="행사 위치" onClick={() => setOpenModal("location")} />
                <Divider />
                <ListRow label="남은 자리" onClick={() => setOpenModal("seats")} />
                <Divider />
                <ListRow label="참여 가격" onClick={() => setOpenModal("price")} />
                <Divider />

                <div className="px-5 h-[56px] flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">외부 인원 참여 가능 여부</div>
                <Toggle value={allowExternal} onChange={setAllowExternal} />
                </div>
            </div>

            {/* 플레이리스트 */}
            <div className="mt-4">
                <button 
                type="button" 
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm"
                onClick={() => setOpenModal("playlist")}
                >
                    <span className="text-lg leading-none">+</span> 플레이리스트
                </button>
            </div>

            {/* 소개글 */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-[220px] resize-none outline-none text-sm"
                placeholder="행사 소개글을 적어주세요."
                />
            </div>

            {/* 모달 */}
            <ScheduleModal 
            open={openModal === "schedule"} 
            onClose={close}
            value={schedule}
            onSave={(next) => setSchedule(next)}
            />
            <LocationModal 
            open={openModal === "location"} 
            onClose={close}
            value={location}
            onSave={(next) => {
                setLocation(next);
            }}
            />
            <SeatsModal 
            open={openModal === "seats"} 
            onClose={close}
            value={capacity}
            onSave={(next) => {
                setCapacity(next);
            }}
            />
            <PriceModal 
            open={openModal === "price"} 
            onClose={close}
            value={price}
            onSave={(next) => setPrice(next)}
            />
            <PlaylistModal 
            open={openModal === "playlist"} 
            onClose={close}
            value={playlist}
            onSave={(next) => setPlaylist(next)}
            />
        </div>
    );
}

/* -------------------- 피그마 모양용 작은 컴포넌트 -------------------- */

function RowButton({ title, onClick, className }: { title: string; onClick: () => void, className: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-[56px] rounded-xl border border-gray-200 bg-white px-5 flex items-center justify-between"
    >
      <span className={["font-semibold text-gray-900", className].join("")}>{title}</span>
      <span className="text-gray-400">›</span>
    </button>
  );
}

function ListRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-5 h-[56px] flex items-center justify-between bg-white"
    >
      <span className="font-medium text-gray-900">{label}</span>
      <span className="text-gray-400">›</span>
    </button>
  );
}

function Divider() {
  return <div className="h-px w-full bg-gray-100" />;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full transition",
        value ? "bg-gray-900" : "bg-gray-200",
      ].join(" ")}
      aria-pressed={value}
    >
      <span
        className={[
          "inline-block h-5 w-5 transform rounded-full bg-white transition",
          value ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}