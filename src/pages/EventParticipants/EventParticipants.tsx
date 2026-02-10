import { useEffect, useState } from "react";

import emptyParticipantsIcon from "../../assets/images/supervised_user_circle_off.png";
import JoinUserCard from "../Home/components/JoinUserCard";
import {
  getMyParticipatedEvents,
  getEventParticipation,
} from "../../api/eventInfo";
import { profileAPI } from "../../api/profile";

type Participant = {
  userId: string;
  name: string;
  profileImageUrl?: string;
};

const EventParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profileRes, eventsRes] = await Promise.all([
          profileAPI.getProfile(),
          getMyParticipatedEvents(),
        ]);
        if (!profileRes.success || !eventsRes.success) {
          setParticipants([]);
          return;
        }
        const myId = String(profileRes.data?.id ?? "");
        const events = eventsRes.data ?? [];
        if (events.length === 0) {
          setParticipants([]);
          return;
        }

        const allParticipants: Map<string, Participant> = new Map();
        for (const ev of events) {
          const eventId = ev.eventId;
          if (eventId == null) continue;
          const partRes = await getEventParticipation(eventId);
          if (!partRes.success || !partRes.data) continue;
          for (const p of partRes.data) {
            const uid = String(p.userId);
            if (uid === myId) continue;
            const name = (p as { nickname?: string }).nickname ?? p.name ?? "";
            const profileImageUrl = (p as { profileImageUrl?: string }).profileImageUrl;
            if (!allParticipants.has(uid)) {
              allParticipants.set(uid, {
                userId: uid,
                name,
                profileImageUrl,
              });
            }
          }
        }
        setParticipants(Array.from(allParticipants.values()));
      } catch {
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
      </div>

      <div
        className={`flex justify-center ${isEmpty && !loading ? "mt-[174px]" : "mt-[60px]"}`}
      >
        {loading ? (
          <p className="text-h2 text-gray-500">불러오는 중...</p>
        ) : isEmpty ? (
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
                key={participant.userId}
                name={participant.name}
                imageUrl={participant.profileImageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventParticipants;
