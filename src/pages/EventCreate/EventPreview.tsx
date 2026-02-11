import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useEventDraftStore, type DraftData } from "./store/useEventDraftStore";
import { RightFormPanel } from "./components/RightFormPanel";
import { BottomActionBar } from "./components/BottomActionBar";
import { EventEditorLayout } from "./layout/EventEditorLayout"; 
// 에셋
import location_icon from "../../assets/icons/location_icon.svg";
import price_icon from "../../assets/icons/price_icon.svg";
import User from "../../assets/icons/User.svg";
import Music from "../../assets/icons/Music.svg";
import add from "../../assets/icons/add.svg";
import participant_icon from "../../assets/icons/participant_icon.svg";
import { ModalKey } from "./types/types";
import { ParticipantsModal } from './modals/ParticipantsModal';
import { FONTTYPE_CLASS } from "./types/types";

function formatDateRange(data: DraftData) {
  const s1 = data.schedule?.startAt ?? null;
  const e1 = data.schedule?.endAt ?? null;

  const fmt = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    let hh = d.getHours();
    const min = String(d.getMinutes()).padStart(2, "0");
    const ampm = hh < 12 ? "오전" : "오후";
    hh = hh % 12;
    if (hh === 0) hh = 12;
    const hh2 = String(hh).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${ampm} ${hh2}:${min}`;
  };

  if (!s1 && !e1) return "";
  if (s1 && e1) return `${fmt(s1)} ~ ${fmt(e1)}`;
  if (s1) return `${fmt(s1)} ~`;
  return `~ ${fmt(e1 as Date)}`;
}

export default function EventPreview() {
  const navigate = useNavigate();

  const data = useEventDraftStore((s) => s.data);
  const initStatus = useEventDraftStore((s) => s.initStatus);
  const eventId = useEventDraftStore((s) => s.eventId);

  if (initStatus !== "ready" || !eventId) {
    return (
      <div className="min-h-screen bg-white p-10">
        <div className="max-w-[720px]">
          <div className="text-lg font-semibold mb-2">미리보기 정보가 없어요.</div>
          <button
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            onClick={() => navigate("/event-create")}
          >
            이벤트 생성으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 댓글 위해서 임의로 설정
  const [comment, setComment] = useState("");
  const comments = useMemo(
    () => [
      { id: 1, name: "윤수호", date: "2026.01.18", text: "Ready for this 😤😤😤" },
      { id: 2, name: "윤수호", date: "2026.01.18", text: "Ready for this 😤😤😤" },
      { id: 3, name: "윤수호", date: "2026.01.18", text: "Ready for this 😤😤😤" },
      { id: 4, name: "윤수호", date: "2026.01.18", text: "Ready for this 😤😤😤" },
      {
        id: 5,
        name: "윤수호",
        date: "2026.01.18",
        text: "Ready for this 😤😤😤\nToo long to me\nToo long to me\nToo long to me\nToo long to me",
      },
    ],
    []
  );

  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const close = () => setOpenModal(null);

  const dateRange = formatDateRange(data);

  // 미리보기 제목 - 폰트 적용
  const fontType = useEventDraftStore((s) => s.data.fontType);


  return (
    <EventEditorLayout
      left={
        // ✅ Layout이 left 폭을 w-[793px]로 잡아주니까, 여기서는 w-full로 쓰면 됨
        <section className="w-full mt-[192px] ml-[161px]">
          <div className={[
            "text-[32px] font-bold text-[#1A1A1A] font-sans",
            FONTTYPE_CLASS[fontType],
          ].join(" ")}>
            {data.title || "행사 제목"}
          </div>

          <div 
            className="mt-[10px] text-[24px] text-[#1A1A1A] font-semibold"
            style={{ fontFamily: "Pretendard" }}
          >
            {dateRange}
          </div>

          <div className="mt-[51px] text-[16px] text-[#1A1A1A]">
            <div className="flex items-center gap-[10px]">
              <img src={location_icon} alt='location_icon' className="w-[24px] h-[24px]"/>
              <span>{data.location.streetAddress || "제주 서귀포시 신화월드 123"}</span>
            </div>
            <div className="mt-[31px] flex items-center gap-[10px]">
              <img src={price_icon} alt='price_icon' className="w-[24px] h-[24px]"/>
              <span>{data.price != null ? `${data.price.toLocaleString()}원` : "5,900원"}</span>
            </div>
            <div className="mt-[21px] flex items-center gap-[10px]">
              <img src={User} alt='User' className="w-[24px] h-[24px]"/>
              <span>
                {data.capacity != null ? `${data.capacity}명, 현재 19명` : "10/20, 현재 19명 자리가 남았습니다."}
              </span>
            </div>
            <div className="mt-[19.5px] flex items-center gap-[10px]">
              <img src={Music} alt='Music' className="w-[24px] h-[24px]"/>
              <span className="text-gray-700">
                {data.playlist || "http://open.spotify.com/playlist/yourplaylist"}
              </span>
            </div>
          </div>

          {/* 소개글 */}
          <div className="mt-[38.5px] text-[16px] text-[#1A1A1A] whitespace-pre-line">
            {data.information ||
              "여기에 소개글입니다. 여기에 소개글입니다. 여기에 소개글입니다. 여기에 소개글입니다.\n".repeat(6)}
          </div>

          {/* 참여자 */}
          <div className="mt-[70px]">
            <div className="text-[32px] font-bold text-[#1A1A1A] mb-[16px]">참여자</div>
            {/* 참여자 리스트 임의로 */}
            <div className="flex items-center">
              <div className="flex gap-[8px]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <img src={participant_icon} alt="participant_icon" className="w-[52px] h-[52px]"/>
                ))}
              </div>
              <button 
                className="
                ml-[12px]
                flex items-center w-[118px] h-[44px] rounded-[20px]
                bg-[#F7F7F8] border border-[#919191] px-[18px]"
                onClick={() => setOpenModal("participants")}
              >
                <img src={add} alt="add_icon" className="w-[24px] h-[24px]"/>
                <span className="text-[16px] text-[#919191]">모두보기</span>
              </button>
            </div>
          </div>

          {/* 댓글 */}
          <div className="mt-[70px]">
            <div className="text-[32px] font-bold text-[#1A1A1A] mb-[18px]">댓글</div>
            
            <div className="mb-[12px] w-[644px] h-[1px] bg-[#F24148]"/>
            <div className="mb-[12px] w-[644px] h-[1px] bg-[#F24148]"/>

            {/* 댓글 리스트 임의로 */}
            <div>
              {comments.map((c, idx) => (
                <div key={c.id} className="py-[18px]">
                  <div className="pl-[44px]">
                    <div className="flex items-center gap-[14px]">
                      <img
                        src={participant_icon}
                        alt={`${c.name} profile`}
                        className="w-[52px] h-[52px] rounded-full object-cover"
                      />

                      {/* 이름 + 날짜 세로 배치 */}
                      <div className="flex flex-col">
                        <div className="text-[20px] font-semibold text-[#1A1A1A] leading-none">
                          {c.name}
                        </div>
                        <div className="mt-[4px] text-[10px] text-[#919191] leading-none">
                          {c.date}
                        </div>
                      </div>
                    </div>

                    {/* 2) 아래 줄: 댓글(완전 아래로) */}
                    <div className="mt-[10px] text-[16px] text-[#1A1A1A] whitespace-pre-line">
                      {c.text}
                    </div>
                  </div>

                  {/* 구분선 */}
                  {idx !== comments.length - 1 && (
                    <div className="mt-[32px] h-[1px] w-[644px] bg-[#D9D9D9]" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-[16px] h-[1px] w-[644px] bg-[#F24148]" />
            <div className="mt-[12px] h-[1px] w-[644px] bg-[#F24148]" />
          </div>

          <ParticipantsModal
            open={openModal === "participants"}
            onClose={close}
            participants={[
              { id: "1", name: "윤수호", status: "going" },
              { id: "2", name: "YOUN SUHOOOOOOOOO", status: "going" },
              { id: "3", name: "TOO LONG NAME @@@@@@@@@@@@@", status: "going" },
              { id: "4", name: "누군가", status: "pending" },
              { id: "5", name: "못감", status: "declined" },
            ]}
          />
        </section>
      }
      right={<RightFormPanel mode="preview" />}
      bottom={
        <BottomActionBar
          left={{
            label: "수정",
            onClick: () => navigate("/event-create"),
          }}
        />
      }
    />
  );
}
