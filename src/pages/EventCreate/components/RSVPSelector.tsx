export default function RSVPCard() {
  return (
    <section className="w-full rounded-xl border border-gray-200 bg-white px-8 py-6">
      <h2 className="font-semibold text-gray-900">회신 선택지</h2>

      <div className="mt-4 grid grid-cols-3 place-items-center">
        <Circle label="참여!" icon="paper" />
        <Circle label="고민중.." icon="cloud" />
        <Circle label="못가요.." icon="x" />
      </div>
    </section>
  );
}

function Circle({ label, icon }: { label: string; icon: "paper" | "cloud" | "x" }) {
  return (
    <button type="button" className="flex flex-col items-center">
      <div className="w-[78px] h-[78px] rounded-full border border-gray-300 flex flex-col items-center justify-center gap-1">
        <div className="h-5 flex items-center justify-center text-gray-700">
          {icon === "paper" ? "✈︎" : icon === "cloud" ? "☁︎" : "✕"}
        </div>
        <div className="text-[11px] text-gray-900">{label}</div>
      </div>
    </button>
  );
}
