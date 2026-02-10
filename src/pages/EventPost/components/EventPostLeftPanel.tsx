import { useState } from "react";
import location_icon from "../../../assets/icons/location_icon.svg";
import price_icon from "../../../assets/icons/price_icon.svg";
import participant_icon from "../../../assets/icons/User.png";
import playlist_icon from "../../../assets/icons/Music.png";
import add_icon from "../../../assets/icons/add.svg";

export const EventPostLeftPanel = () => {
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const participants = Array.from({ length: 18 }, (_, index) => ({
    id: `participant-${index + 1}`,
  }));
  const visibleParticipants = showAllParticipants
    ? participants
    : participants.slice(0, 4);
  const comments = Array.from({ length: 6 }, (_, index) => ({
    id: `comment-${index + 1}`,
    author: "윤수호",
    date: "2026.01.18",
    content: "Ready for this 🥳🥳🥳",
  }));

  return (
    <div className="w-full mt-[192px] pl-[161px]">
      <h1 className="text-[32px] font-medium text-[#1A1A1A] font-esamanru">
        오늘의 하루 소개하기
      </h1>
      <div className="mt-[10px] text-h5 text-[#1A1A1A]">
        2026.01.15 오전 06:00 ~ 2026.01.18 오후 08:00
      </div>

      <div className="mt-[52px] space-y-[17px] text-[14px] font-medium text-[#1A1A1A]">
        <div className="flex items-start gap-[8px]">
          <img src={location_icon} alt="location" className="w-[24px] h-[24px]" />
          <span>제주 서귀포시 칠십리로 123</span>
        </div>
        <div className="flex items-start gap-[8px]">
          <img src={price_icon} alt="price" className="w-[24px] h-[24px]" />
          <span>5,900 ₩</span>
        </div>
        <div className="flex items-start gap-[8px]">
          <img
            src={participant_icon}
            alt="participants"
            className="w-[24px] h-[24px]"
          />
          <span>10/200, 현재 190자리가 남았습니다.</span>
        </div>
        <div className="flex items-start gap-[8px]">
          <img src={playlist_icon} alt="playlist" className="w-[24px] h-[24px]" />
          <span>http://open.spotify.com/playlist/yourplaylist</span>
        </div>
      </div>

      <div className="mt-[48px] w-[645px]">
        <p className="text-[16px] font-medium text-[#1A1A1A] leading-[19px] max-h-[228px] overflow-y-auto break-words custom-scrollbar">
          여기에 행사 소개글이 들어갑니다. 여기에 행사 소개글이 들어갑니다. 여기에 행사 소개글이
          들어갑니다. 여기에 행사 소개글이 들어갑니다. 여기에 행사 소개글이 들어갑니다.
          여기에 행사 소개글이 들어갑니다. 여기에 행사 소개글이 들어갑니다. 여기에 행사 소개글이
          들어갑니다. 여기에 행사 소개글이 들어갑니다. 여기에 행사 소개글이 들어갑니다.
        </p>
      </div>

      <div className="mt-[70px] text-h6 text-[#1A1A1A] font-semibold">
        참여자
      </div>

      <div className="mt-[12px] flex items-center">
        <div
          className={[
            "overflow-x-auto custom-scrollbar",
            showAllParticipants ? "w-[592px]" : "w-[232px]",
          ].join(" ")}
        >
          <div className="flex items-center gap-[8px]">
            {visibleParticipants.map((participant) => (
              <div
                key={participant.id}
                className="h-[52px] w-[52px] flex items-center justify-center"
              >
                <div className="h-[44px] w-[44px] rounded-full bg-[#D9D9D9]" />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAllParticipants((prev) => !prev)}
          className="ml-[12px] h-[44px] w-[118px] rounded-[20px] border border-[#919191] bg-[#F7F7F8] flex items-center justify-center"
        >
          <img src={add_icon} alt="add" className="h-[24px] w-[24px]" />
          <span className="text-[14px] font-medium text-[#1A1A1A]">
            모두보기
          </span>
        </button>
      </div>

      <div className="mt-[70px] text-h6 text-[#1A1A1A] font-semibold">
        댓글
      </div>

      <div className="mt-[12px] w-[644px]">
        <div className="h-[2px] w-full bg-[#F24148]" />
        <div className="mt-[12px] h-[2px] w-full bg-[#F24148]" />

        <div className="mt-[32px] h-[800px] overflow-y-auto custom-scrollbar">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="min-h-[145px] w-[644px] border-b border-[#BFBFBF]"
            >
              <div className="pl-[44px] pt-[32px]">
                <div className="flex items-center">
                  <div className="h-[52px] w-[52px] flex items-center justify-center">
                    <div className="h-[44px] w-[44px] rounded-full bg-[#D9D9D9]" />
                  </div>
                  <div className="ml-[8px]">
                    <div className="text-h4 font-semibold text-[#1A1A1A]">
                      {comment.author}
                    </div>
                    <div className="text-[10px] font-medium text-[#1A1A1A]">
                      {comment.date}
                    </div>
                  </div>
                </div>

                <div className="mt-[10px] text-h3 text-[#1A1A1A]">
                  {comment.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[32px] h-[2px] w-full bg-[#F24148]" />
        <div className="mt-[12px] h-[2px] w-full bg-[#F24148]" />
      </div>

      <div className="mt-[32px] w-[644px]">
        <div className="flex items-start gap-[12px]">
          <div className="h-[52px] w-[52px] flex items-center justify-center">
            <div className="h-[44px] w-[44px] rounded-full bg-[#D9D9D9]" />
          </div>
          <div className="flex-1">
            <textarea
              placeholder="댓글을 작성해주세요."
              className="w-full h-[120px] rounded-[10px] border border-[#BFBFBF] bg-[#F7F7F8] px-[18px] py-[14px] text-[16px] font-medium text-[#1A1A1A] placeholder:text-[#919191] outline-none resize-none"
            />
            <div className="mt-[12px] flex justify-end">
              <button
                type="button"
                className="h-[44px] w-[118px] rounded-[20px] bg-[#F24148] text-white text-[16px] font-semibold"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
