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
import type {
  EventInfoData,
  EventInfoDetailData,
} from "../../api/eventInfo";
import { profileAPI } from "../../api/profile";
import useProfile from "../../hooks/useProfile";
import { formatEventDateTime } from "../../utils/formatDate";
import AddEventCard from "./components/AddEventCard";
import EventCard from "./components/EventCard";
import EventCardRoller, { HorizontalWheelScroll } from "./components/EventCardCarousel.tsx";
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

  // 행사 목록 조회 (캐싱) - 마운트 시 stale이면 리패치(발행/수정 후 복귀 시 목록 갱신)
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
    refetchOnMount: true,
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
    staleTime: 1000 * 60 * 10,
    refetchOnMount: true,
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
    staleTime: 1000 * 60 * 10,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const myHostedEventIds = useMemo(() => {
    return new Set(hostedEvents.map((e) => e.eventId));
  }, [hostedEvents]);

  // 행사 목록을 createdAt 기준 최신순으로 정렬
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // 내림차순 (최신이 먼저)
    });
  }, [events]);

  // 행사 목록(events)의 순서와 동일하게: eventId → createdAt (행사 목록에 있으면 그 순서 사용)
  const eventIdToCreatedAt = useMemo(() => {
    const map = new Map<number, number>();
    events.forEach((e) => {
      if (e.eventId != null && e.createdAt) {
        map.set(e.eventId, new Date(e.createdAt).getTime());
      }
    });
    return map;
  }, [events]);

  // 행사 목록과 같은 순서: 목록에 있으면 그 createdAt 기준, 없으면 해당 이벤트의 createdAt/startTime
  const sortedHostedEvents = useMemo(() => {
    return [...hostedEvents].sort((a, b) => {
      const dateA = eventIdToCreatedAt.get(a.eventId) ?? (a.createdAt ? new Date(a.createdAt).getTime() : (a.startTime ? new Date(a.startTime).getTime() : 0));
      const dateB = eventIdToCreatedAt.get(b.eventId) ?? (b.createdAt ? new Date(b.createdAt).getTime() : (b.startTime ? new Date(b.startTime).getTime() : 0));
      return dateB - dateA; // 내림차순 (최신이 왼쪽)
    });
  }, [hostedEvents, eventIdToCreatedAt]);

  const sortedParticipatedEvents = useMemo(() => {
    return [...participatedEvents].sort((a, b) => {
      const dateA = eventIdToCreatedAt.get(a.eventId) ?? (a.createdAt ? new Date(a.createdAt).getTime() : (a.startTime ? new Date(a.startTime).getTime() : 0));
      const dateB = eventIdToCreatedAt.get(b.eventId) ?? (b.createdAt ? new Date(b.createdAt).getTime() : (b.startTime ? new Date(b.startTime).getTime() : 0));
      return dateB - dateA; // 내림차순 (최신이 왼쪽)
    });
  }, [participatedEvents, eventIdToCreatedAt]);

  // eventId → 행사 이미지 URL (모든 탭에서 카드 썸네일 공통 사용)
  const eventIdToImageUrl = useMemo(() => {
    const map = new Map<number, string>();
    events.forEach((e) => {
      if (e.eventId != null && e.imageUrl != null && e.imageUrl !== "") {
        map.set(e.eventId, e.imageUrl);
      }
    });
    return map;
  }, [events]);

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
        // 1) 로컬 캐시에서 우선 제거하여 모든 탭에서 즉시 사라지도록 처리
        queryClient.setQueryData<EventInfoData[] | undefined>(
          ["eventList"],
          (prev) => (prev ? prev.filter((e) => e.eventId !== eventId) : prev),
        );
        queryClient.setQueryData<EventInfoDetailData[] | undefined>(
          ["myHostedEvents"],
          (prev) => (prev ? prev.filter((e) => e.eventId !== eventId) : prev),
        );
        queryClient.setQueryData<EventInfoDetailData[] | undefined>(
          ["myParticipatedEvents"],
          (prev) => (prev ? prev.filter((e) => e.eventId !== eventId) : prev),
        );

        // 2) 캐시 무효화하여 백엔드와 동기화
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
                      {sortedEvents.length > 0
                        ? sortedEvents.map((event) => {
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
                    <HorizontalWheelScroll className="mt-[42px] mb-[100px] w-[1800px] max-w-[calc(100vw-200px)] flex flex-nowrap gap-x-[54px] overflow-x-auto">
                      {coParticipants.length > 0
                        ? coParticipants.map((p) => (
                            <JoinUserCard
                              key={p.userId}
                              name={p.name}
                              imageUrl={p.profileImageUrl}
                              userId={p.userId}
                            />
                          ))
                        : null}
                    </HorizontalWheelScroll>
                  </>
                ) : item.key === "week" ? (
                  <>
                    <EventCardRoller>
                      {sortedEvents.length > 0
                        ? sortedEvents
                            .filter((event) => {
                              const start =
                                event.schedule?.startDate ??
                                (event as { startTime?: string }).startTime;
                              if (!start) return false;
                              const startDate = new Date(start);
                              const now = new Date();
                              const rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                              const rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 59, 999);
                              return startDate >= rangeStart && startDate <= rangeEnd;
                            })
                            .map((event) => {
                              const isMyEvent =
                                myHostedEventIds === null || myHostedEventIds.has(event.eventId);
                              const startForDisplay =
                                event.schedule?.startDate ??
                                (event as { startTime?: string }).startTime;
                              return (
                                <EventCard
                                  key={event.eventId}
                                  eventId={event.eventId}
                                  title={event.title ?? "제목 없음"}
                                  dateTime={
                                    startForDisplay
                                      ? formatEventDateTime(startForDisplay)
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
                    <HorizontalWheelScroll className="mt-[42px] w-[1800px] max-w-[calc(100vw-200px)] flex flex-nowrap gap-x-[54px] overflow-x-auto">
                      {coParticipants.length > 0
                        ? coParticipants.map((p) => (
                            <JoinUserCard
                              key={p.userId}
                              name={p.name}
                              imageUrl={p.profileImageUrl}
                              userId={p.userId}
                            />
                          ))
                        : null}
                    </HorizontalWheelScroll>
                  </>
                ) : item.key === "hosting" ? (
                  <>
                    <EventCardRoller>
                      {sortedHostedEvents.length > 0
                        ? sortedHostedEvents.map((event) => (
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
                              imageUrl={eventIdToImageUrl.get(event.eventId) ?? undefined}
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
                    <HorizontalWheelScroll className="mt-[42px] mb-[100px] w-[1800px] max-w-[calc(100vw-200px)] flex flex-nowrap gap-x-[54px] overflow-x-auto">
                      {coParticipants.length > 0
                        ? coParticipants.map((p) => (
                            <JoinUserCard
                              key={p.userId}
                              name={p.name}
                              imageUrl={p.profileImageUrl}
                              userId={p.userId}
                            />
                          ))
                        : null}
                    </HorizontalWheelScroll>
                  </>
                ) : item.key === "joined" ? (
                  <>
                    <EventCardRoller>
                      {sortedParticipatedEvents.length > 0
                        ? sortedParticipatedEvents.map((event) => (
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
                              imageUrl={eventIdToImageUrl.get(event.eventId) ?? undefined}
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
                    <HorizontalWheelScroll className="mt-[42px] mb-[100px] w-[1800px] max-w-[calc(100vw-200px)] flex flex-nowrap gap-x-[54px] overflow-x-auto">
                      {coParticipants.length > 0
                        ? coParticipants.map((p) => (
                            <JoinUserCard
                              key={p.userId}
                              name={p.name}
                              imageUrl={p.profileImageUrl}
                              userId={p.userId}
                            />
                          ))
                        : null}
                    </HorizontalWheelScroll>
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
