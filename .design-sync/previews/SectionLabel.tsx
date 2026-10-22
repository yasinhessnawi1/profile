import { SectionLabel } from "signal-ds";

export const WithRule = () => (
  <div className="flex max-w-[640px] flex-col gap-6 rounded-lg bg-bg p-6 font-sans text-fg">
    <SectionLabel index="01">About</SectionLabel>
    <SectionLabel index="02">Experience & Education</SectionLabel>
  </div>
);

export const OverHeading = () => (
  <div className="flex max-w-[640px] flex-col gap-6 rounded-lg bg-bg p-6 font-sans text-fg">
    <div>
      <SectionLabel index="03" rule={false} className="mb-3.5">
        Selected work
      </SectionLabel>
      <h2 className="display m-0 text-2xl font-medium">Things I've built</h2>
    </div>
  </div>
);

export const NoIndex = () => (
  <div className="flex max-w-[640px] flex-col gap-6 rounded-lg bg-bg p-6 font-sans text-fg">
    <SectionLabel>Toolkit</SectionLabel>
  </div>
);
