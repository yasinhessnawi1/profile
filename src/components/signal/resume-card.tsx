"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export function ResumeCard({
  logoUrl,
  title,
  subtitle,
  period,
  description,
}: {
  logoUrl?: string;
  title: string;
  subtitle?: string;
  period: string;
  description?: string;
}) {
  const hasDesc = Boolean(description);
  const [open, setOpen] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const bullets = description
    ? description.split("•").map((s) => s.trim()).filter(Boolean)
    : [];

  const inner = (
    <>
      <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line bg-paper">
        {logoUrl && !imgErr ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote logos (safemediai.com, uia.no) without configured domains
          <img
            src={logoUrl}
            alt=""
            onError={() => setImgErr(true)}
            className="h-[72%] w-[72%] object-contain"
          />
        ) : (
          <Icon name="briefcase" size={20} className="text-ink-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold tracking-[-0.01em] text-fg-strong">
                {title}
              </span>
              {hasDesc && (
                <Icon
                  name="chevron-right"
                  size={14}
                  className={cn(
                    "text-fg-faint transition-transform duration-fast ease-out",
                    open && "rotate-90"
                  )}
                />
              )}
            </div>
            {subtitle && (
              <div className="mt-[3px] text-xs text-fg-muted">{subtitle}</div>
            )}
          </div>
          <span className="shrink-0 whitespace-nowrap font-mono text-2xs tracking-wide text-fg-faint">
            {period}
          </span>
        </div>
        {open && bullets.length > 0 && (
          <ul className="mb-0.5 mt-3 flex list-none flex-col gap-1.5 pl-0">
            {bullets.map((b, i) => (
              <li
                key={i}
                className="relative pl-4 text-left text-xs leading-relaxed text-fg-muted before:absolute before:left-0 before:top-2 before:h-[5px] before:w-[5px] before:rounded-full before:bg-accent"
              >
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );

  const shared = cn(
    "flex w-full gap-4 rounded-md border border-line bg-surface p-4 text-left",
    "transition-colors duration-fast ease-out hover:border-line-strong"
  );

  if (!hasDesc) {
    return <div className={shared}>{inner}</div>;
  }
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
      className={cn(shared, "cursor-pointer")}
    >
      {inner}
    </button>
  );
}
