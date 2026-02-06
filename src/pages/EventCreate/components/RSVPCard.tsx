// 에셋
import yes_icon from '../../../assets/icons/yes_icon.svg';
import no_icon from '../../../assets/icons/no_icon.svg';
import maybe_icon from '../../../assets/icons/maybe_icon.svg';

export default function RSVPCard() {
  return (
    <section className="w-[540px] h-[200px] rounded-[10px] border border-[#BFBFBF] bg-white px-[48px] py-[37px]">
      <div className="flex h-full items-center justify-between">
        <Circle label="못가요" type="no" />
        <Divider />
        <Circle label="고민중" type="maybe" />
        <Divider />
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
          bg: "bg-[#47B78133]",
          text: "text-[#47B781]",
          icon: <img src={yes_icon}/>,
        }
      : type === "maybe"
      ? {
          bg: "bg-[#6F9FFE33]",
          text: "text-[#6F9FFE]",
          icon: <img src={maybe_icon}/>,
        }
      : {
          bg: "bg-[#F2414833]",
          text: "text-[#F24148]",
          icon: <img src={no_icon}/>,
        };

  return (
    <button 
      type="button" 
      className="flex h-full w-[98px] flex-col items-center justify-center gap-[9px]"
    >
      <div
        className={[
          "flex h-[98px] w-[98px] items-center justify-center rounded-full",
          style.bg,
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
  return <div className="h-[146px] w-px bg-[#BFBFBF]"/>
}
