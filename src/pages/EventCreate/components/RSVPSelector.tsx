export default function RSVPCard() {
  return (
    <section className="w-full rounded-xl border border-gray-200 bg-white px-6 py-5">
      <h2 className="text-sm font-semibold text-gray-900">회신 선택지</h2>

      <div className="mt-4 flex justify-between">
        <Circle label="못가요" type="no" />
        <Circle label="고민중" type="maybe" />
        <Circle label="참여!" type="yes" />
      </div>
    </section>
  );
}

type CircleType = "yes" | "maybe" | "no";

function Circle({ label, type }: { label: string; type: CircleType }) {
  const style =
    type === "yes"
      ? {
          border: "border-green-200",
          bg: "bg-green-50",
          text: "text-green-600",
          icon: "😊",
        }
      : type === "maybe"
      ? {
          border: "border-blue-200",
          bg: "bg-blue-50",
          text: "text-blue-600",
          icon: "🤔",
        }
      : {
          border: "border-red-200",
          bg: "bg-red-50",
          text: "text-red-500",
          icon: "☹️",
        };

  return (
    <button type="button" className="flex flex-col items-center gap-2">
      <div
        className={[
          "w-[72px] h-[72px] rounded-full border flex flex-col items-center justify-center",
          style.border,
          style.bg,
        ].join(" ")}
      >
        <div className={["text-xl", style.text].join(" ")}>
          {style.icon}
        </div>
        <div className={["text-[11px] font-medium", style.text].join(" ")}>
          {label}
        </div>
      </div>
    </button>
  );
}
