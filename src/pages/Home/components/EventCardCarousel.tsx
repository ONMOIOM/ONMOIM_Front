/**
 * 가로 스크롤 컨테이너.
 * 휠 스크롤 시 좌우로 스크롤되도록 함 (WHEEL_SPEED 동일).
 */

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const WHEEL_SPEED = 2.2;

export interface EventCardRollerProps {
  children: ReactNode;
}

export interface HorizontalWheelScrollProps {
  children: ReactNode;
  className?: string;
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

/** 마우스 휠 시 좌우 스크롤 (EventCardRoller와 동일 속도). className으로 레이아웃 지정. */
export const HorizontalWheelScroll = ({
  children,
  className = "",
}: HorizontalWheelScrollProps) => {
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
      className={className}
      role="region"
      aria-label="가로 스크롤 목록"
    >
      {children}
    </div>
  );
};

export default EventCardRoller;
