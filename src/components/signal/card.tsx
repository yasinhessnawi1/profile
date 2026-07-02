import { cn } from "@/lib/utils";

const PADS = { none: "p-0", sm: "p-4", md: "p-6", lg: "p-8" } as const;

export function Card({
  interactive = false,
  inset = false,
  pad = "md",
  href,
  className,
  children,
}: {
  interactive?: boolean;
  inset?: boolean;
  pad?: keyof typeof PADS;
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const cls = cn(
    "relative block rounded-lg border border-line text-inherit no-underline shadow-sm",
    inset ? "bg-surface-2" : "bg-surface",
    PADS[pad],
    interactive &&
      "transition-all duration-base ease-out hover:-translate-y-[3px] hover:border-line-signal hover:shadow-lg",
    className
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return <div className={cls}>{children}</div>;
}
