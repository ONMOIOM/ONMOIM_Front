type ToggleProps = {
  checked: boolean;
  onChange: (v: boolean) => void;
};

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative w-[92px] h-[50px] rounded-full transition-colors",
        checked ? "bg-[#F24148]" : "bg-[#D9D9D9]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-[4.5px] left-[5px]",
          "w-[41px] h-[41px] rounded-full bg-white",
          "transition-transform",
          checked ? "translate-x-[41px]" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
