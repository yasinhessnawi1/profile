import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

export function SocialLink({
  icon,
  label,
  value,
  href,
  iconOnly = false,
  className,
}: {
  icon: IconName;
  label: string;
  value?: string;
  href: string;
  iconOnly?: boolean;
  className?: string;
}) {
  const external = href.startsWith("http");
  const extra = external ? { target: "_blank", rel: "noreferrer" } : {};
  if (iconOnly) {
    return (
      <a
        href={href}
        aria-label={label}
        title={label}
        {...extra}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-2 text-fg-muted no-underline",
          "transition-all duration-fast ease-out hover:border-line-signal hover:bg-accent-quiet hover:text-accent",
          className
        )}
      >
        <Icon name={icon} size={19} />
      </a>
    );
  }
  return (
    <a
      href={href}
      {...extra}
      className={cn(
        "group flex items-center gap-3.5 rounded-md border border-line bg-transparent px-3.5 py-3 no-underline",
        "transition-all duration-fast ease-out hover:border-line-strong hover:bg-surface-2",
        className
      )}
    >
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-sm bg-accent-quiet text-accent">
        <Icon name={icon} size={18} />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-mono text-2xs uppercase tracking-[0.1em] text-fg-faint">
          {label}
        </span>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-fg">
          {value}
        </span>
      </span>
      <Icon
        name="arrow-up-right"
        size={16}
        className="ml-auto text-fg-faint transition-colors duration-fast ease-out group-hover:text-accent"
      />
    </a>
  );
}
