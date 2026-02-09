import { EventEditorLayout } from "../EventCreate/layout/EventEditorLayout";
import { EventPostLeftPanel } from "./components/EventPostLeftPanel";
import { EventPostRightPanel } from "./components/EventPostRightPanel";
import { EventPostBottomBar } from "./components/EventPostBottomBar";

const EventPost = () => {
  return (
    <EventEditorLayout
      left={<EventPostLeftPanel />}
      right={<EventPostRightPanel />}
      bottom={<EventPostBottomBar />}
    />
  );
};

export default EventPost;
