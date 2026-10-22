import { Avatar } from "signal-ds";

export const Portrait = () => (
  <div className="flex flex-wrap items-center gap-6 rounded-lg bg-bg p-6 font-sans text-fg">
    <Avatar src="https://yasinhessnawi.online/me.JPG" alt="Yasin Hessnawi" initials="YH" size={96} status="online" />
    <Avatar src="https://yasinhessnawi.online/me.JPG" alt="Yasin Hessnawi" initials="YH" size={72} />
    <Avatar src="https://yasinhessnawi.online/me.JPG" alt="Yasin Hessnawi" initials="YH" size={48} ring={false} />
  </div>
);

export const Initials = () => (
  <div className="flex flex-wrap items-center gap-6 rounded-lg bg-bg p-6 font-sans text-fg">
    <Avatar initials="YH" size={96} status="online" />
    <Avatar initials="YH" size={72} status="away" />
    <Avatar initials="YH" size={48} ring={false} />
  </div>
);
