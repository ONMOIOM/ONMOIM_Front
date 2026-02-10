import { EventPostLeftPanel } from "./components/EventPostLeftPanel";
import { EventPostRightPanel } from "./components/EventPostRightPanel";
import { EventPostBottomBar } from "./components/EventPostBottomBar";

const EventPost = () => {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full max-w-[1920px] flex flex-col">
        <section className="flex flex-1 ml-[137px] mr-[100px] gap-[102px]">
          <div className="w-[793px]">
            <EventPostLeftPanel />
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
