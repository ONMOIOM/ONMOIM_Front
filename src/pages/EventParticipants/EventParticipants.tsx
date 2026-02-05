import { useState } from "react";

import emptyParticipantsIcon from "../../assets/images/supervised_user_circle_off.png";
import JoinUserCard from "../Home/components/JoinUserCard";

type Participant = {
  id: number;
  name: string;
  imageUrl?: string;
};

const MOCK_PARTICIPANTS: Participant[] = [
  { id: 1, name: "윤수호" },
  { id: 2, name: "김하늘" },
  { id: 3, name: "박지우" },
  { id: 4, name: "이서연" },
  { id: 5, name: "정민수" },
  { id: 6, name: "최유나" },
  { id: 7, name: "한지민" },
  { id: 8, name: "오준호" },
  { id: 9, name: "임다은" },
  { id: 10, name: "강태현" },
  { id: 11, name: "서지우" },
  { id: 12, name: "송민재" },
  { id: 13, name: "백수진" },
];

const EventParticipants = () => {
  const [showEmptyState, setShowEmptyState] = useState(false);
  // TODO: API 연동 시 실제 참여자 목록으로 교체
  const participants = showEmptyState ? [] : MOCK_PARTICIPANTS;
  const isEmpty = participants.length === 0;

  return (
    <div className="min-h-screen pl-[107px]">
      <div className="flex flex-col items-center">
        <h1 className="mt-[107.5px] text-[40px] font-bold leading-normal text-gray-900">
          같은 행사 참여자 보기
        </h1>
        <p className="mt-2 text-[20px] font-semibold leading-normal text-gray-300">
          같은 행사에 참여한 분들을 확인해볼 수 있어요.
        </p>
        {/* 개발 확인용: 빈 상태 토글 */}
        <div className="mt-4 w-full max-w-[1210px]">
          <button
            type="button"
            onClick={() => setShowEmptyState((prev) => !prev)}
            className="ml-auto block text-h2 text-gray-400 underline"
          >
            빈 상태 토글
          </button>
        </div>
      </div>

      <div
        className={`flex justify-center ${isEmpty ? "mt-[174px]" : "mt-[60px]"}`}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center">
            <img
              src={emptyParticipantsIcon}
              alt=""
              aria-hidden
              className="h-[200px] w-[200px]"
            />
            <p className="mt-[67px] w-[569px] text-center text-[24px] font-semibold leading-normal text-gray-600">
              아직 같은 행사에 참여하신 분이 없습니다.
              <br />
              행사에 참여한 후 다시 확인해보세요!
            </p>
          </div>
        ) : (
          <div className="grid w-full max-w-[1210px] grid-cols-4 gap-x-[54px] gap-y-[36px]">
            {participants.map((participant) => (
              <JoinUserCard
                key={participant.id}
                name={participant.name}
                imageUrl={participant.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventParticipants;
