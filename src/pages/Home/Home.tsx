import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { deleteEvent, getEventList, getMyHostedEvents, getMyParticipatedEvents } from "../../api/eventInfo";
import type { EventInfoData, EventInfoDetailData } from "../../api/eventInfo";
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
  const [nickname, setNickname] = useState<string | null>(null);
  const [events, setEvents] = useState<EventInfoData[]>([]);
  const [hostedEvents, setHostedEvents] = useState<EventInfoDetailData[]>([]);
  const [participatedEvents, setParticipatedEvents] = useState<EventInfoDetailData[]>([]);
  const [myHostedEventIds, setMyHostedEventIds] = useState<Set<number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        if (res.success && res.data?.nickname) {
          setNickname(res.data.nickname);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEventList();
      if (res.success && Array.isArray(res.data)) {
        setEvents(res.data);
      }
    } catch (err) {
      console.warn("[Home] 행사 목록 조회 실패:", err);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 내가 만든 행사 목록 조회 (내가 여는 행사 탭 + 삭제 버튼 활성화 여부)
  useEffect(() => {
    const fetchMyHostedEvents = async () => {
      try {
        const res = await getMyHostedEvents();
        if (res.success && Array.isArray(res.data)) {
          setHostedEvents(res.data);
          setMyHostedEventIds(new Set(res.data.map((e) => e.eventId)));
        } else {
          setHostedEvents([]);
          setMyHostedEventIds(new Set());
        }
      } catch (err: any) {
        console.warn("[Home] 내가 만든 행사 조회 실패:", err);
        setHostedEvents([]);
        setMyHostedEventIds(null);
      }
    };
    fetchMyHostedEvents();
  }, []);

  // 내가 참여한 행사 목록 조회
  useEffect(() => {
    const fetchMyParticipatedEvents = async () => {
      try {
        const res = await getMyParticipatedEvents();
        if (res.success && Array.isArray(res.data)) {
          setParticipatedEvents(res.data);
        } else {
          setParticipatedEvents([]);
        }
      } catch (err) {
        console.warn("[Home] 내가 참여한 행사 조회 실패:", err);
        setParticipatedEvents([]);
      }
    };
    fetchMyParticipatedEvents();
  }, []);

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const res = await deleteEvent(eventId);
      if (res.success) {
        setEvents((prev) => prev.filter((e) => e.eventId !== eventId));
        setHostedEvents((prev) => prev.filter((e) => e.eventId !== eventId));
        if (myHostedEventIds !== null) {
          setMyHostedEventIds((prev) => {
            if (prev === null) return null;
            const next = new Set(prev);
            next.delete(eventId);
            return next;
          });
        }
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

  if (loading) {
    return (
      <div className="mt-[107.5px] pl-[107px]">
        <p className="text-h4 text-gray-600">로딩 중...</p>
      </div>
    );
  }

  const displayName = error || !nickname ? "회원" : nickname;

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
                    <div className="mt-[42px] mb-[100px]">
                      <JoinUserCard name={displayName} />
                    </div>
                  </>
                ) : item.key === "week" ? (
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
                    <div className="mt-[134px] flex items-center">
                      <h2 className="text-h6 text-gray-900">
                        같은 행사에 참여한 분들
                      </h2>
                      <ParticipantSectionArrows />
                    </div>
                    <div className="mt-[42px]">
                      <JoinUserCard name={displayName} />
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
                  <p className="mt-6 text-gray-600">{item.label} 콘텐츠 영역</p>
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
