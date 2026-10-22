import { SocialLink } from "signal-ds";

export const Rows = () => (
  <div className="flex max-w-[420px] flex-col gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <SocialLink icon="mail" label="Email" value="yasinhessnawi1@gmail.com" href="mailto:yasinhessnawi1@gmail.com" />
    <SocialLink icon="github" label="GitHub" value="github.com/yasinhessnawi1" href="https://github.com/yasinhessnawi1" />
    <SocialLink icon="map-pin" label="Based in" value="Norway" href="#contact" />
  </div>
);

export const IconOnly = () => (
  <div className="flex max-w-[420px] flex-col gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <div className="flex gap-2.5">
      <SocialLink iconOnly icon="github" label="GitHub" href="https://github.com/yasinhessnawi1" />
      <SocialLink iconOnly icon="linkedin" label="LinkedIn" href="https://www.linkedin.com/in/yasin-hessnawi-102a02326" />
      <SocialLink iconOnly icon="globe" label="Website" href="https://yasinhessnawi.online" />
      <SocialLink iconOnly icon="phone" label="Phone" href="tel:+4794972907" />
    </div>
  </div>
);
