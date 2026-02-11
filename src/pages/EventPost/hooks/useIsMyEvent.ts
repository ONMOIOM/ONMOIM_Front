import { useState, useEffect } from "react";
import { getMyHostedEvents } from "../../../api/eventInfo";

export const useIsMyEvent = (eventId: number | null): boolean => {
  const [isMyEvent, setIsMyEvent] = useState(false);

  useEffect(() => {
    if (eventId == null) {
      setIsMyEvent(false);
      return;
    }
    const check = async () => {
      try {
        const res = await getMyHostedEvents();
        if (res.success && Array.isArray(res.data)) {
          setIsMyEvent(res.data.some((e) => e.eventId === eventId));
        } else {
          setIsMyEvent(false);
        }
      } catch {
        setIsMyEvent(false);
      }
    };
    check();
  }, [eventId]);

  return isMyEvent;
};
