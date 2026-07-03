import { cn } from "@/lib/utils";

const TONES = {
  signal: "border-line-signal bg-accent-quiet text-accent",
  neutral: "border-line bg-surface-2 text-fg-muted",
  outline: "border-line-strong bg-transparent text-fg-muted",
  redact: "border-[rgba(255,92,60,0.4)] bg-[rgba(255,92,60,0.12)] text-redact-500",
  azure: "border-[rgba(88,183,255,0.4)] bg-[rgba(88,183,255,0.12)] text-info",
  amber: "border-[rgba(245,185,59,0.4)] bg-[rgba(245,185,59,0.12)] text-warning",
} as const;

const DOTS = {
  signal: "bg-signal-500 shadow-[0_0_8px_var(--signal-glow)]",
  neutral: "bg-fg-subtle",
  outline: "bg-fg-subtle",
  redact: "bg-redact-500",
  azure: "bg-info",
  amber: "bg-warning",
} as const;

export function Badge({
  tone = "signal",
  dot = false,
  mono = true,
  size = "md",
  className,
  children,
}: {
  tone?: keyof typeof TONES;
  dot?: boolean;
  mono?: boolean;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border font-medium leading-none",
        size === "sm" ? "h-[22px] px-[9px] text-2xs" : "h-[26px] px-[11px] text-xs",
        mono && "font-mono uppercase tracking-[0.04em]",
        TONES[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", DOTS[tone])} />}
      {children}
    </span>
  );
}
