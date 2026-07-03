import { cn } from "@/lib/utils";

export function Tag({
  active = false,
  size = "md",
  className,
  children,
}: {
  active?: boolean;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex cursor-default items-center gap-[5px] whitespace-nowrap rounded-sm border font-mono font-medium leading-none tracking-[0.01em] transition-colors duration-fast ease-out",
        size === "sm" ? "h-6 px-[9px] text-2xs" : "h-7 px-[11px] text-xs",
        active
          ? "border-line-signal bg-accent-quiet text-accent"
          : "border-line bg-surface text-fg-muted hover:bg-surface-2",
        className
      )}
    >
      {children}
    </span>
  );
}
