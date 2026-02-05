/**
 * 가로 스크롤 컨테이너.
 */

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const WHEEL_SPEED = 2.2;

export interface EventCardRollerProps {
  children: ReactNode;
}

const EventCardRoller = ({ children }: EventCardRollerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      el.scrollLeft += e.deltaY * WHEEL_SPEED;
      e.preventDefault();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="mx-[0px] mt-4 w-[1800px] max-w-[calc(100vw-200px)] shrink-0 overflow-x-auto overflow-y-visible px-0"
      role="region"
      aria-label="이벤트 카드 목록"
    >
      <div className="flex flex-nowrap items-stretch gap-5 py-1">
        {children}
      </div>
    </div>
  );
};

export default EventCardRoller;
