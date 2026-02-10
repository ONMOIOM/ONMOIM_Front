import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventPostLeftPanel } from "./components/EventPostLeftPanel";
import type { EventPostLeftPanelRef } from "./components/EventPostLeftPanel";
import { EventPostRightPanel } from "./components/EventPostRightPanel";
import { EventPostBottomBar } from "./components/EventPostBottomBar";
import { useIsMyEvent } from "./hooks/useIsMyEvent";

const EventPost = () => {
  const { eventId: eventIdParam } = useParams<{ eventId: string }>();
  const eventId = eventIdParam ? Number(eventIdParam) : null;
  const isMyEvent = useIsMyEvent(eventId);
  const leftPanelRef = useRef<EventPostLeftPanelRef>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!leftPanelRef.current || saving) return;
    setSaving(true);
    try {
      await leftPanelRef.current.save();
      navigate("/");
    } finally {
      setSaving(false);
    }
  };

  if (!eventIdParam) {
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
            <EventPostLeftPanel ref={leftPanelRef} eventId={eventId} isMyEvent={isMyEvent} />
          </div>
          <div className="w-[540px]">
            <EventPostRightPanel eventId={eventId} isMyEvent={isMyEvent} />
          </div>
        </section>
        <div className="mt-[48px] mb-[48px] flex justify-end pr-[100px]">
          <EventPostBottomBar
            label={isMyEvent ? "수정" : "확인"}
            onClick={isMyEvent ? handleSave : () => navigate("/")}
            saving={isMyEvent && saving}
          />
        </div>
      </div>
    </main>
  );
};

export default EventPost;
