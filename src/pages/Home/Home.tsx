import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useMemo } from "react";
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { HiOutlineSearch } from "react-icons/hi";
import {
  deleteEvent,
  getEventList,
  getEventParticipation,
  getMyHostedEvents,
  getMyParticipatedEvents,
} from "../../api/eventInfo";
import { profileAPI } from "../../api/profile";
import useProfile from "../../hooks/useProfile";
import { formatEventDateTime } from "../../utils/formatDate";
import AddEventCard from "./components/AddEventCard";
import EventCard from "./components/EventCard";
import EventCardRoller from "./components/EventCardCarousel.tsx";
import JoinUserCard from "./components/JoinUserCard";
import ParticipantSectionArrows from "./components/ParticipantSectionArrows";

const TAB_ITEMS = [
  { key: "search", label: "행사 목록", withIcon: true },
  { key: "week", label: "일주일 이내", withIcon: false },
  { key: "hosting", label: "내가 여는 행사", withIcon: false },
  { key: "joined", label: "참여한 행사", withIcon: false },
] as const;

const Home = () => {
  const queryClient = useQueryClient();

  const { profile } = useProfile();

  // 행사 목록 조회 (캐싱)
  const { data: events = [] } = useQuery({
    queryKey: ["eventList"],
    queryFn: async () => {
      const res = await getEventList();
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: hostedEvents = [] } = useQuery({
    queryKey: ["myHostedEvents"],
    queryFn: async () => {
      const res = await getMyHostedEvents();
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: participatedEvents = [] } = useQuery({
    queryKey: ["myParticipatedEvents"],
    queryFn: async () => {
      const res = await getMyParticipatedEvents();
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const myHostedEventIds = useMemo(() => {
    return new Set(hostedEvents.map((e) => e.eventId));
  }, [hostedEvents]);

  const allEventIds = useMemo(() => {
    const ids = new Set<number>();
    participatedEvents.forEach((e) => {
      if (e.eventId != null) ids.add(e.eventId);
    });
    hostedEvents.forEach((e) => {
      if (e.eventId != null) ids.add(e.eventId);
    });
    return Array.from(ids);
  }, [participatedEvents, hostedEvents]);

  const eventParticipationQueries = useQueries({
    queries: allEventIds.map((eventId) => ({
      queryKey: ["eventParticipation", eventId],
      queryFn: async () => {
        const res = await getEventParticipation(eventId);
        if (!res.success || !res.data) return [];
        return res.data;
      },
      enabled: !!profile?.id && allEventIds.length > 0,
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  });

  const uniqueUserIds = useMemo(() => {
    if (!profile?.id || allEventIds.length === 0) return [];
    const myId = profile.id;
    const userIdSet = new Set<number>();

    eventParticipationQueries.forEach((query) => {
      if (!query.data) return;
      for (const p of query.data) {
        const uid = p.userId;
        if (uid !== myId) {
          userIdSet.add(uid);
        }
      }
    });

    return Array.from(userIdSet);
  }, [profile?.id, eventParticipationQueries, allEventIds]);

  const userProfileQueries = useQueries({
    queries: uniqueUserIds.map((userId) => ({
      queryKey: ["userProfile", userId],
      queryFn: async () => {
        const res = await profileAPI.getUserProfile(userId);
        if (res.success && res.data) {
          return res.data;
        }
        return null;
      },
      enabled: uniqueUserIds.length > 0,
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  });

  const coParticipants = useMemo(() => {
    if (!profile?.id || allEventIds.length === 0) return [];

    const myId = profile.id;
    const map = new Map<number, { userId: string; name: string; profileImageUrl?: string }>();

    eventParticipationQueries.forEach((query) => {
      if (!query.data) return;
      for (const p of query.data) {
        const uid = p.userId;
        if (uid === myId) continue;
        const name = p.nickname ?? "";
        if (!map.has(uid)) {
          map.set(uid, { userId: String(uid), name });
        }
      }
    });

    userProfileQueries.forEach((query) => {
      if (!query.data) return;
      const uid = query.data.id;
      const existing = map.get(uid);
      if (existing) {
        map.set(uid, { ...existing, profileImageUrl: query.data.profileImageUrl });
      }
    });

    return Array.from(map.values());
  }, [profile?.id, eventParticipationQueries, userProfileQueries, allEventIds]);

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const res = await deleteEvent(eventId);
      if (res.success) {
        // 캐시 무효화하여 최신 데이터로 갱신
        queryClient.invalidateQueries({ queryKey: ["eventList"] });
        queryClient.invalidateQueries({ queryKey: ["myHostedEvents"] });
        queryClient.invalidateQueries({ queryKey: ["myParticipatedEvents"] });
        queryClient.invalidateQueries({ queryKey: ["coParticipants"] });
      } else {
        // 백엔드에서 success: false 반환 시
        const errorMsg = (res as any).data || res.message || "행사 삭제에 실패했습니다.";
        alert(`행사 삭제 실패: ${errorMsg}`);
      }
    } catch (err: any) {
      console.warn("[Home] 행사 삭제 실패:", err);
      // 에러 응답에서 메시지 추출
      const errorMessage = err?.response?.data?.data || err?.response?.data?.message || err?.message || "행사 삭제 중 오류가 발생했습니다.";
      
      // 외래 키 제약 조건 위반 에러인 경우 명확한 메시지 표시
      if (errorMessage.includes("constraint") || errorMessage.includes("foreign key")) {
        alert("이 행사는 참여자나 댓글이 있어서 삭제할 수 없습니다.\n백엔드에서 관련 데이터를 먼저 삭제해야 합니다.");
      } else {
        alert(`행사 삭제 실패: ${errorMessage}`);
      }
    }
  };

  const displayName = profile?.nickname || "회원";

  return (
    <div className="min-h-screen pl-[107px]">
      <h1 className="mt-[107.5px] text-h7 font-light text-gray-900 font-esamanru">
        {displayName}님 ONMOIM에 오신 것을 환영합니다!
      </h1>

      {/* 탭 메뉴 바 - Figma: X 97, Y 338, 874×100, 배경 흰색 */}
      <div className="-ml-[10px] mt-8 w-[874px]">
        <TabGroup>
          <TabList
            className="flex h-[100px] w-full items-center gap-0 bg-white"
            aria-label="이벤트 탭 메뉴"
          >
            {TAB_ITEMS.map((item) => (
              <Tab
                key={item.key}
                className="relative flex flex-1 items-center justify-center gap-2 border-0 bg-transparent px-4 py-3 text-h4 font-medium text-gray-600 outline-none ring-0 data-selected:text-red-500 data-[hover]:opacity-80 data-[focus]:outline-none data-[focus]:ring-2 data-[focus]:ring-red-500/20 data-[focus]:ring-offset-2 data-[focus]:ring-offset-white"
              >
                {({ selected }) => (
                  <>
                    {item.withIcon && (
                      <HiOutlineSearch
                        className="size-5 shrink-0"
                        aria-hidden
                      />
                    )}
                    <span>{item.label}</span>
                    {selected && (
                      <span
                        className="absolute bottom-0 left-1/2 h-0.5 w-full -translate-x-1/2 bg-red-500"
                        aria-hidden
                      />
                    )}
                  </>
                )}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-0">
            {TAB_ITEMS.map((item) => (
              <TabPanel key={item.key} className="outline-none">
                {item.key === "search" ? (
                  <>
                    <EventCardRoller>
                      {events.length > 0
                        ? events.map((event) => {
                            const isMyEvent =
                              myHostedEventIds === null || myHostedEventIds.has(event.eventId);
                            return (
                              <EventCard
                                key={event.eventId}
                                eventId={event.eventId}
                                title={event.title ?? "제목 없음"}
                                dateTime={
                                  event.schedule?.startDate
                                    ? formatEventDateTime(
                                        event.schedule.startDate,
                                      )
                                    : "일시 미정"
                                }
                                hostName={event.hostName ?? "호스트"}
                                imageUrl={event.imageUrl ?? undefined}
                                onDelete={handleDeleteEvent}
                                isMyEvent={isMyEvent}
                              />
                            );
                          })
                        : null}
                      <AddEventCard />
                    </EventCardRoller>
                    <div className="mt-[130px] flex items-center">
                      <h2 className="text-h6 text-gray-900">
                        같은 행사에 참여한 분들
                      </h2>
                      <ParticipantSectionArrows />
                    </div>
                    <div className="mt-[42px] mb-[100px] flex flex-wrap gap-x-[54px] gap-y-[36px]">
                      {coParticipants.length > 0
                        ? coParticipants.map((p) => (
                            <JoinUserCard
                              key={p.userId}
                              name={p.name}
                              imageUrl={p.profileImageUrl}
                            />
                          ))
                        : null}
                    </div>
                  </>
                ) : item.key === "week" ? (
                  <>
                    <EventCardRoller>
                      {events.length > 0
                        ? events
                            .filter((event) => {
                              const start = event.schedule?.startDate;
                              if (!start) return false;
                              const startDate = new Date(start);
                              const now = new Date();
                              const weekLater = new Date(now);
                              weekLater.setDate(weekLater.getDate() + 7);
                              return startDate >= now && startDate <= weekLater;
                            })
                            .map((event) => {
                              const isMyEvent =
                                myHostedEventIds === null || myHostedEventIds.has(event.eventId);
                              return (
                                <EventCard
                                  key={event.eventId}
                                  eventId={event.eventId}
                                  title={event.title ?? "제목 없음"}
                                  dateTime={
                                    event.schedule?.startDate
                                      ? formatEventDateTime(
                                          event.schedule.startDate,
                                        )
                                      : "일시 미정"
                                  }
                                  hostName={event.hostName ?? "호스트"}
                                  imageUrl={event.imageUrl ?? undefined}
                                  onDelete={handleDeleteEvent}
                                  isMyEvent={isMyEvent}
                                />
                              );
                            })
                        : null}
                      <AddEventCard />
                    </EventCardRoller>
                    <div className="mt-[134px] flex items-center">
                      <h2 className="text-h6 text-gray-900">
                        같은 행사에 참여한 분들
                      </h2>
                      <ParticipantSectionArrows />
                    </div>
                    <div className="mt-[42px] flex flex-wrap gap-x-[54px] gap-y-[36px]">
                      {coParticipants.length > 0
                        ? coParticipants.map((p) => (
                            <JoinUserCard
                              key={p.userId}
                              name={p.name}
                              imageUrl={p.profileImageUrl}
                            />
                          ))
                        : null}
                    </div>
                  </>
                ) : item.key === "hosting" ? (
                  <>
                    <EventCardRoller>
                      {hostedEvents.length > 0
                        ? hostedEvents.map((event) => (
                            <EventCard
                              key={event.eventId}
                              eventId={event.eventId}
                              title={event.title ?? "제목 없음"}
                              dateTime={
                                event.startTime
                                  ? formatEventDateTime(event.startTime)
                                  : "일시 미정"
                              }
                              hostName={displayName}
                              imageUrl={undefined}
                              onDelete={handleDeleteEvent}
                              isMyEvent={true}
                            />
                          ))
                        : null}
                      <AddEventCard />
                    </EventCardRoller>
                    <div className="mt-[130px] flex items-center">
                      <h2 className="text-h6 text-gray-900">
                        같은 행사에 참여한 분들
                      </h2>
                      <ParticipantSectionArrows />
                    </div>
                    <div className="mt-[42px] mb-[100px] flex flex-wrap gap-x-[54px] gap-y-[36px]">
                      {coParticipants.length > 0
                        ? coParticipants.map((p) => (
                            <JoinUserCard
                              key={p.userId}
                              name={p.name}
                              imageUrl={p.profileImageUrl}
                            />
                          ))
                        : null}
                    </div>
                  </>
                ) : item.key === "joined" ? (
                  <>
                    <EventCardRoller>
                      {participatedEvents.length > 0
                        ? participatedEvents.map((event) => (
                            <EventCard
                              key={event.eventId}
                              eventId={event.eventId}
                              title={event.title ?? "제목 없음"}
                              dateTime={
                                event.startTime
                                  ? formatEventDateTime(event.startTime)
                                  : "일시 미정"
                              }
                              hostName="호스트"
                              imageUrl={undefined}
                              onDelete={handleDeleteEvent}
                              isMyEvent={false}
                            />
                          ))
                        : null}
                      <AddEventCard />
                    </EventCardRoller>
                    <div className="mt-[130px] flex items-center">
                      <h2 className="text-h6 text-gray-900">
                        같은 행사에 참여한 분들
                      </h2>
                      <ParticipantSectionArrows />
                    </div>
                    <div className="mt-[42px] mb-[100px] flex flex-wrap gap-x-[54px] gap-y-[36px]">
                      {coParticipants.length > 0
                        ? coParticipants.map((p) => (
                            <JoinUserCard
                              key={p.userId}
                              name={p.name}
                              imageUrl={p.profileImageUrl}
                            />
                          ))
                        : null}
                    </div>
                  </>
                ) : (
                  <p className="mt-6 text-gray-600">
                    {(item as (typeof TAB_ITEMS)[number]).label} 콘텐츠 영역
                  </p>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default Home;
