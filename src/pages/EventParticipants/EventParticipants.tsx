import { useEffect, useState, useMemo, memo } from "react";

import emptyParticipantsIcon from "../../assets/images/supervised_user_circle_off.png";
import JoinUserCard from "../Home/components/JoinUserCard";
import {
  getMyParticipatedEvents,
  getMyHostedEvents,
  getEventParticipation,
} from "../../api/eventInfo";
import { profileAPI } from "../../api/profile";
import { getUserIdFromToken } from "../../utils/jwtDecoder";

type Participant = {
  userId: string;
  name: string;
  /** 참여자 API imageUrl */
  imageUrl?: string;
  /** 프로필 API로 보강한 이미지 (메인 하단과 동일) */
  profileImageUrl?: string;
};

/** 이전 목록과 동일하면 true (참조 갱신 방지로 불필요한 리렌더 방지) */
function isSameParticipants(a: Participant[], b: Participant[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (p, i) =>
      p.userId === b[i].userId &&
      p.name === b[i].name &&
      (p.profileImageUrl ?? p.imageUrl) === (b[i].profileImageUrl ?? b[i].imageUrl),
  );
}

const EventParticipantsInner = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          setParticipants([]);
          return;
        }
        
        const [profileRes, participatedRes, hostedRes] = await Promise.all([
          profileAPI.getUserProfile(userId),
          getMyParticipatedEvents(),
          getMyHostedEvents(),
        ]);
        if (!profileRes.success) {
          setParticipants([]);
          return;
        }
        const myId = String(profileRes.data?.id ?? "");
        const participated = participatedRes.success ? participatedRes.data ?? [] : [];
        const hosted = hostedRes.success ? hostedRes.data ?? [] : [];
        const allEventIds = new Set<number>();
        participated.forEach((e) => {
          if (e.eventId != null) allEventIds.add(e.eventId);
        });
        hosted.forEach((e) => {
          if (e.eventId != null) allEventIds.add(e.eventId);
        });
        if (allEventIds.size === 0) {
          setParticipants([]);
          return;
        }

        const map = new Map<string, Participant>();
        for (const eventId of allEventIds) {
          const partRes = await getEventParticipation(eventId);
          if (!partRes.success || !partRes.data) continue;
          for (const p of partRes.data) {
            const uid = String(p.userId);
            if (uid === myId) continue;
            const name = p.nickname ?? "";
            const imageUrl = (p as { imageUrl?: string }).imageUrl;
            if (!map.has(uid)) {
              map.set(uid, {
                userId: uid,
                name,
                imageUrl,
              });
            }
          }
        }
        // 메인 하단과 동일: 프로필 API로 이미지 보강
        for (const uid of map.keys()) {
          try {
            const res = await profileAPI.getUserProfile(Number(uid));
            if (res.success && res.data?.profileImageUrl) {
              const existing = map.get(uid)!;
              map.set(uid, { ...existing, profileImageUrl: res.data.profileImageUrl });
            }
          } catch {
            // 무시
          }
        }
        const next = Array.from(map.values());
        setParticipants((prev) =>
          isSameParticipants(prev, next) ? prev : next,
        );
      } catch {
        setParticipants((prev) => (prev.length === 0 ? prev : []));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isEmpty = useMemo(
    () => participants.length === 0,
    [participants.length],
  );

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
        className={`flex justify-center w-full ${isEmpty && !loading ? "mt-[174px]" : "mt-[60px]"}`}
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
          <div className="w-full max-w-[1476px] grid grid-cols-3 gap-x-[54px] gap-y-[48px]">
            {participants.map((participant) => (
              <JoinUserCard
                key={participant.userId}
                name={participant.name}
                imageUrl={participant.profileImageUrl ?? participant.imageUrl}
                userId={participant.userId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EventParticipants = memo(EventParticipantsInner);
export default EventParticipants;
