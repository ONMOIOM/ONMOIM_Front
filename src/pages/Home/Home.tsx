import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { getEventList } from "../../api/eventInfo";
import type { EventInfoData } from "../../api/eventInfo";
import { profileAPI } from "../../api/profile";
import { formatEventDateTime } from "../../utils/formatDate";
import AddEventCard from "./components/AddEventCard";
import ParticipantSectionArrows from "./components/ParticipantSectionArrows";
import EventCard from "./components/EventCard";
import JoinUserCard from "./components/JoinUserCard";

const TAB_ITEMS = [
  { key: "search", label: "검색하기", withIcon: true },
  { key: "week", label: "일주일 이내", withIcon: false },
  { key: "hosting", label: "내가 여는 행사", withIcon: false },
  { key: "joined", label: "참여한 행사", withIcon: false },
] as const;

const Home = () => {
  const [nickname, setNickname] = useState<string | null>(null);
  const [events, setEvents] = useState<EventInfoData[]>([]);
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

  useEffect(() => {
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
    fetchEvents();
  }, []);

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
                    <div className="mt-6 flex flex-nowrap items-stretch gap-[52px]">
                      {events.length > 0
                        ? events.map((event) => (
                            <EventCard
                              key={event.eventId}
                              title={event.title ?? "제목 없음"}
                              dateTime={
                                event.schedule?.startDate
                                  ? formatEventDateTime(
                                      event.schedule.startDate
                                    )
                                  : "일시 미정"
                              }
                              hostName={event.hostName ?? "호스트"}
                              imageUrl={event.imageUrl ?? undefined}
                            />
                          ))
                        : null}
                      <AddEventCard />
                    </div>
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
                ) : item.key === "week" ? (
                  <>
                    <div className="mt-6 flex flex-nowrap items-stretch gap-[52px]">
                      {events.length > 0
                        ? events.map((event) => (
                            <EventCard
                              key={event.eventId}
                              title={event.title ?? "제목 없음"}
                              dateTime={
                                event.schedule?.startDate
                                  ? formatEventDateTime(
                                      event.schedule.startDate
                                    )
                                  : "일시 미정"
                              }
                              hostName={event.hostName ?? "호스트"}
                              imageUrl={event.imageUrl ?? undefined}
                            />
                          ))
                        : null}
                      <AddEventCard />
                    </div>
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
