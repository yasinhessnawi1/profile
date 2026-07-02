import { cn } from "@/lib/utils";

export function Stat({
  value,
  suffix,
  label,
  accent = false,
  className,
}: {
  value: string;
  suffix?: string;
  label: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        className={cn(
          "flex items-baseline gap-[3px] font-display text-2xl font-medium leading-none tracking-tight",
          accent ? "text-accent" : "text-fg-strong"
        )}
      >
        {value}
        {suffix && <span className="text-lg text-fg-subtle">{suffix}</span>}
      </div>
      <div className="font-mono text-2xs uppercase tracking-label text-fg-subtle">
        {label}
      </div>
    </div>
  );
}
