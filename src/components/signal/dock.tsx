"use client";

import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

export type DockItem = {
  type?: "item" | "divider";
  icon?: IconName;
  label?: string;
  href?: string;
  onClick?: () => void;
};

export function Dock({ items, className }: { items: DockItem[]; className?: string }) {
  return (
    <nav
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-line-strong px-2.5 py-2 shadow-lg",
        "bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] backdrop-blur-[16px] backdrop-saturate-[1.4]",
        className
      )}
    >
      {items.map((it, i) => {
        if (it.type === "divider") {
          return (
            <span key={`d${i}`} className="mx-1 h-[22px] w-px bg-line-strong" />
          );
        }
        const cls = cn(
          "flex h-[42px] w-[42px] items-center justify-center rounded-full text-fg-muted no-underline",
          "transition-all duration-base ease-spring motion-reduce:transition-none motion-reduce:hover:transform-none",
          "hover:-translate-y-1 hover:scale-[1.12] hover:bg-accent-quiet hover:text-accent",
          "focus-visible:bg-accent-quiet focus-visible:text-accent"
        );
        if (it.onClick) {
          return (
            <button
              key={it.label ?? i}
              type="button"
              title={it.label}
              aria-label={it.label}
              onClick={it.onClick}
              className={cls}
            >
              {it.icon && <Icon name={it.icon} size={20} />}
            </button>
          );
        }
        return (
          <a
            key={it.label ?? i}
            href={it.href ?? "#"}
            title={it.label}
            aria-label={it.label}
            className={cls}
          >
            {it.icon && <Icon name={it.icon} size={20} />}
          </a>
        );
      })}
    </nav>
  );
}
