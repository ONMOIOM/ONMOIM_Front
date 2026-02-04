import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { profileAPI } from "../../api/profile";
import EventCard from "./components/EventCard";

const TAB_ITEMS = [
  { key: "search", label: "검색하기", withIcon: true },
  { key: "week", label: "일주일 이내", withIcon: false },
  { key: "hosting", label: "내가 여는 행사", withIcon: false },
  { key: "joined", label: "참여한 행사", withIcon: false },
] as const;

const Home = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string | null>(null);
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
                  <div className="mt-6 flex flex-wrap gap-6">
                    <EventCard
                      title="오프라인 네트워킹 모임"
                      dateTime="2025.02.10 (월) 14:00"
                      hostName="김온모"
                      onMenuClick={() => window.alert("행사 메뉴")}
                    />
                  </div>
                ) : item.key === "week" ? (
                  <div className="mt-6 flex flex-wrap gap-6">
                    <EventCard
                      title="혼자 밥먹기 자랑 위원회"
                      dateTime="수요일 10:45 AM"
                      hostName="수호"
                      onMenuClick={() => window.alert("행사 메뉴")}
                    />
                  </div>
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
