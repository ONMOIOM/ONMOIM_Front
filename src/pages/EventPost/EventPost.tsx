import { useParams } from "react-router-dom";
import { EventPostLeftPanel } from "./components/EventPostLeftPanel";
import { EventPostRightPanel } from "./components/EventPostRightPanel";
import { EventPostBottomBar } from "./components/EventPostBottomBar";

const EventPost = () => {
  const { eventId } = useParams<{ eventId: string }>();

  if (!eventId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">행사 ID가 없습니다.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full max-w-[1920px] flex flex-col">
        <section className="flex flex-1 ml-[137px] mr-[100px] gap-[102px]">
          <div className="w-[793px]">
            <EventPostLeftPanel eventId={Number(eventId)} />
          </div>
          <div className="w-[540px]">
            <EventPostRightPanel />
          </div>
        </section>
        <div className="mt-[92px] flex justify-end pr-[100px]">
          <EventPostBottomBar />
        </div>
      </div>
    </main>
  );
};

export default EventPost;
