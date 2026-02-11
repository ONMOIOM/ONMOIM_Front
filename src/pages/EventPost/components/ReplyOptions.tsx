import { useState, useEffect } from "react";
import yes_icon from "../../../assets/icons/yes_icon.svg";
import no_icon from "../../../assets/icons/no_icon.svg";
import maybe_icon from "../../../assets/icons/maybe_icon.svg";
import {
  voteParticipation,
  getEventParticipation,
  type ParticipationStatus,
} from "../../../api/eventInfo";
import { profileAPI } from "../../../api/profile";

export type ReplyOptionType = "yes" | "maybe" | "no";

const STATUS_MAP: Record<ReplyOptionType, ParticipationStatus> = {
  yes: "ATTEND",
  maybe: "PENDING",
  no: "ABSENT",
};

const STATUS_TO_OPTION: Record<string, ReplyOptionType> = {
  ATTEND: "yes",
  PENDING: "maybe",
  ABSENT: "no",
};

type Props = {
  eventId: number;
  initialStatus?: ReplyOptionType | null;
  onStatusChange?: (status: ReplyOptionType) => void;
};

export default function ReplyOptions({ eventId, initialStatus = null, onStatusChange }: Props) {
  const [selected, setSelected] = useState<ReplyOptionType | null>(initialStatus ?? null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (initialStatus != null || fetched) return;
    const load = async () => {
      try {
        const [profileRes, participantsRes] = await Promise.all([
          profileAPI.getProfile(),
          getEventParticipation(eventId),
        ]);
        if (!profileRes.success || !participantsRes.success) return;
        const myId = String(profileRes.data?.id ?? "");
        const me = (participantsRes.data ?? []).find(
          (p) => String((p as { userId?: string | number }).userId) === myId
        );
        if (me && me.status) {
          const opt = STATUS_TO_OPTION[me.status];
          if (opt) setSelected(opt);
        }
      } catch {
        // ignore
      } finally {
        setFetched(true);
      }
    };
    load();
  }, [eventId, initialStatus, fetched]);

  const handleSelect = async (type: ReplyOptionType) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await voteParticipation(eventId, STATUS_MAP[type]);
      if (res.success) {
        setSelected(type);
        onStatusChange?.(type);
      } else {
        alert("참여 상태 변경에 실패했습니다.");
      }
    } catch (e) {
      console.warn("[ReplyOptions] 참여 투표 실패:", e);
      alert("참여 상태 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={[
        "w-[540px] h-[200px] rounded-[10px] border px-[48px] py-[37px] transition-colors",
        selected === "yes" && "border-[#47B781] bg-[#47B78114]",
        selected === "maybe" && "border-[#6F9FFE] bg-[#6F9FFE14]",
        selected === "no" && "border-[#F24148] bg-[#F2414814]",
        !selected && "border-[#BFBFBF] bg-white",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex h-full items-center justify-between">
        <Circle
          label="못가요"
          type="no"
          selected={selected === "no"}
          disabled={loading}
          onClick={() => handleSelect("no")}
        />
        <Divider />
        <Circle
          label="고민중"
          type="maybe"
          selected={selected === "maybe"}
          disabled={loading}
          onClick={() => handleSelect("maybe")}
        />
        <Divider />
        <Circle
          label="참여!"
          type="yes"
          selected={selected === "yes"}
          disabled={loading}
          onClick={() => handleSelect("yes")}
        />
      </div>
    </section>
  );
}

type CircleType = "yes" | "maybe" | "no";

function Circle({
  label,
  type,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  type: CircleType;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const style =
    type === "yes"
      ? {
          bg: "bg-[#47B78133]",
          bgSelected: "bg-[#47B78180]",
          text: "text-[#47B781]",
          ring: "ring-2 ring-[#47B781] ring-offset-2",
          icon: <img src={yes_icon} alt="yes_icon" />,
        }
      : type === "maybe"
        ? {
            bg: "bg-[#6F9FFE33]",
            bgSelected: "bg-[#6F9FFE80]",
            text: "text-[#6F9FFE]",
            ring: "ring-2 ring-[#6F9FFE] ring-offset-2",
            icon: <img src={maybe_icon} alt="maybe_icon" />,
          }
        : {
            bg: "bg-[#F2414833]",
            bgSelected: "bg-[#F2414880]",
            text: "text-[#F24148]",
            ring: "ring-2 ring-[#F24148] ring-offset-2",
            icon: <img src={no_icon} alt="no_icon" />,
          };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex h-full w-[98px] flex-col items-center justify-center gap-[9px] rounded-[10px]",
        "cursor-pointer transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-[98px] w-[98px] items-center justify-center rounded-full",
          selected ? style.bgSelected : style.bg,
          selected && style.ring,
        ].join(" ")}
      >
        <span className={["h-[65px] w-[65px]", style.text].join(" ")}>
          {style.icon}
        </span>
      </div>

      <span className={["font-medium text-[16px]", style.text].join(" ")}>
        {label}
      </span>
    </button>
  );
}

function Divider() {
  return <div className="h-[146px] w-px bg-[#BFBFBF]" />;
}
