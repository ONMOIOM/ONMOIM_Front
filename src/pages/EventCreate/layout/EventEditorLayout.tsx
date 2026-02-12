type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
  bottom: React.ReactNode;
};

export function EventEditorLayout({ left, right, bottom }: Props) {
  return (
    // 전체 화면(1920 기준) 중앙 정렬 + 세로 플렉스
    <main className="min-h-screen bg-white">
      <div className="w-full max-w-[1920px] flex flex-col">
        {/* 상단/중앙: 왼쪽 + 오른쪽 */}
        <section className="flex flex-1 ml-[137px] mr-[348px] gap-[102px]">
          {/* 왼쪽 패널: 793px */}
          <div className="w-[793px]">{left}</div>
          {/* 오른쪽 패널: 540px */}
          <div className="w-[540px]">{right}</div>
        </section>

        {/* 하단: BottomActionBar (EventPost와 유사하게 상하 마진 적용) */}
        <div className="mt-[92px] mb-[48px] flex justify-end pr-[348px]">{bottom}</div>
      </div>
    </main>
  );
}
