import { Input } from "signal-ds";

export const ContactForm = () => (
  <div className="flex max-w-[420px] flex-col gap-4 rounded-lg bg-bg p-6 font-sans text-fg">
    <Input label="Name" name="name" placeholder="Your name" required />
    <Input label="Email" name="email" icon="mail" type="email" placeholder="you@example.com" required />
    <Input label="Message" name="message" multiline rows={3} placeholder="What would you like to talk about?" required />
  </div>
);

export const WithHint = () => (
  <div className="flex max-w-[420px] flex-col gap-4 rounded-lg bg-bg p-6 font-sans text-fg">
    <Input label="Website" icon="globe" placeholder="https://" hint="Optional, shown on the reply" />
  </div>
);

export const ErrorState = () => (
  <div className="flex max-w-[420px] flex-col gap-4 rounded-lg bg-bg p-6 font-sans text-fg">
    <Input label="Email" icon="mail" type="email" defaultValue="yasin@" error hint="Enter a valid email address" />
  </div>
);
