import { cn } from "@/lib/utils";

export function SectionLabel({
  index,
  rule = true,
  className,
  children,
}: {
  index?: string;
  rule?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {index != null && (
        <span className="font-mono text-xs font-semibold tracking-[0.08em] text-accent">
          {index}
        </span>
      )}
      <span className="whitespace-nowrap font-mono text-2xs font-medium uppercase tracking-label text-fg-subtle">
        {children}
      </span>
      {rule && <span className="h-px flex-1 bg-line-strong" />}
    </div>
  );
}
