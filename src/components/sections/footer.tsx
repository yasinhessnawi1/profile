"use client";

import { useTranslations } from "next-intl";

export function Footer({ locale }: { locale: string }) {
  const tNav = useTranslations("nav");
  const t = useTranslations("footer");
  const base = locale === "en" ? "" : `/${locale}`;
  const links = ["work", "projects", "toolkit", "blog", "contact"] as const;
  return (
    <footer className="container mt-[clamp(40px,6vw,80px)] border-t border-line pb-12 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-signal-500 font-display text-sm font-bold text-ink-990">
            YH
          </span>
          <span className="font-mono text-xs text-fg-subtle">
            {t("built", { year: new Date().getFullYear() })}
          </span>
        </div>
        <div className="flex gap-1">
          {links.map((id) => (
            <a
              key={id}
              href={`${base}/#${id}`}
              className="px-2.5 py-1.5 font-mono text-xs uppercase tracking-wide text-fg-muted no-underline hover:text-fg"
            >
              {tNav(id)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
