import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HiOutlineSearch } from "react-icons/hi";
import {
  deleteEvent,
  getEventList,
  getEventParticipation,
  getMyHostedEvents,
  getMyParticipatedEvents,
} from "../../api/eventInfo";
import { profileAPI } from "../../api/profile";
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

  // 프로필 조회 (캐싱)
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await profileAPI.getProfile();
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error("프로필 조회 실패");
    },
    staleTime: 1000 * 60 * 30, // 30분간 캐시 유지
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

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

  // 내가 만든 행사 목록 조회 (캐싱)
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

  // 내가 참여한 행사 목록 조회 (캐싱)
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

  // 내가 만든 행사 ID Set (메모이제이션)
  const myHostedEventIds = useMemo(() => {
    return new Set(hostedEvents.map((e) => e.eventId));
  }, [hostedEvents]);

  // 같은 행사 참여자 조회 (캐싱)
  const { data: coParticipants = [] } = useQuery({
    queryKey: ["coParticipants", profile?.id, participatedEvents.length, hostedEvents.length],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const allEventIds = new Set<number>();
      participatedEvents.forEach((e) => {
        if (e.eventId != null) allEventIds.add(e.eventId);
      });
      hostedEvents.forEach((e) => {
        if (e.eventId != null) allEventIds.add(e.eventId);
      });
      
      if (allEventIds.size === 0) return [];

      const myId = String(profile.id);
      const map = new Map<string, { userId: string; name: string; profileImageUrl?: string }>();
      
      for (const eventId of allEventIds) {
        try {
          const partRes = await getEventParticipation(eventId);
          if (!partRes.success || !partRes.data) continue;
          for (const p of partRes.data) {
            const uid = String(p.userId);
            if (uid === myId) continue;
            const name = p.nickname ?? "";
            const profileImageUrl = p.profileImageUrl;
            if (!map.has(uid)) {
              map.set(uid, { userId: uid, name, profileImageUrl });
            }
          }
        } catch (err) {
          console.warn(`[Home] 행사 ${eventId} 참여자 조회 실패:`, err);
        }
      }
      
      return Array.from(map.values());
    },
    enabled: !!profile?.id && (participatedEvents.length > 0 || hostedEvents.length > 0),
    staleTime: 1000 * 60 * 10, // 10분간 캐시 유지
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

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
                            // 내가 만든 행사인지 확인
                            // myHostedEventIds가 null이면 API 호출 실패 → 모든 행사 삭제 가능 (기본값 true)
                            // myHostedEventIds가 Set이면 해당 eventId가 있으면 내가 만든 행사
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
                              // 내가 만든 행사인지 확인
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
                  </>
                ) : item.key === "joined" ? (
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
