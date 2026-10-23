import { Icon } from "signal-ds";

export const AllGlyphs = () => (
  <div className="grid max-w-[720px] grid-cols-6 gap-2 rounded-lg bg-bg p-6 font-sans text-fg">
    {[
      "arrow-up-right", "arrow-right", "arrow-down", "chevron-right", "external-link", "globe",
      "mail", "phone", "map-pin", "github", "linkedin", "sparkles", "cpu", "shield", "graduation-cap",
      "briefcase", "star", "code", "download", "folder", "sun", "moon", "menu", "x", "check", "plus",
      "circle-dot", "notebook", "languages",
    ].map((n) => (
      <div key={n} className="flex flex-col items-center gap-2 rounded-md border border-line bg-surface px-2 py-3 text-fg-muted">
        <Icon name={n} size={20} />
        <span className="font-mono text-2xs text-fg-faint">{n}</span>
      </div>
    ))}
  </div>
);

export const SizesAndColor = () => (
  <div className="flex items-center gap-5 rounded-lg bg-bg p-6 font-sans text-fg">
    <Icon name="sparkles" size={14} className="text-fg-muted" />
    <Icon name="sparkles" size={20} className="text-fg" />
    <Icon name="sparkles" size={28} className="text-accent" />
    <Icon name="shield" size={28} strokeWidth={1.5} className="text-redact-500" />
    <span className="flex h-[38px] w-[38px] items-center justify-center rounded-sm bg-accent-quiet text-accent">
      <Icon name="mail" size={18} />
    </span>
  </div>
);
