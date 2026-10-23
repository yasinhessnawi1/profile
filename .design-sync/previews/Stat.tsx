import { Stat } from "signal-ds";

export const HeroRow = () => (
  <div className="rounded-lg bg-bg p-6 font-sans text-fg">
    <div className="grid max-w-[760px] grid-cols-4 border-y border-line">
      <div className="px-5 py-6">
        <Stat value="4" suffix="+" label="Years building" accent />
      </div>
      <div className="border-l border-line px-5 py-6">
        <Stat value="20" suffix="+" label="University courses" />
      </div>
      <div className="border-l border-line px-5 py-6">
        <Stat value="12" suffix="+" label="Projects shipped" />
      </div>
      <div className="border-l border-line px-5 py-6">
        <Stat value="1" label="Company co-founded" />
      </div>
    </div>
  </div>
);

export const Single = () => (
  <div className="flex gap-10 rounded-lg bg-bg p-6 font-sans text-fg">
    <Stat value="59.8" suffix="%" label="F1-macro" />
    <Stat value="99" suffix="%" label="End-game accuracy" accent />
  </div>
);
