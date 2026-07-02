"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/signal/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

const SECTION_IDS = ["work", "projects", "toolkit", "blog", "contact"] as const;

export function TopBar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const base = locale === "en" ? "" : `/${locale}`;
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: highlight the section currently in view
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const nav = SECTION_IDS.map((id) => ({ id, label: t(id) }));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex items-center justify-between px-[var(--gutter)] py-3.5",
        "transition-all duration-base ease-out",
        scrolled
          ? "border-b border-line bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-[14px] backdrop-saturate-[1.3]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <a href={`${base}/#top`} className="flex items-center gap-3 no-underline">
        <span className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-signal-500 font-display text-[17px] font-bold tracking-tighter text-ink-990 shadow-[0_0_22px_var(--signal-glow)]">
          YH
        </span>
        <span className="font-display text-base font-semibold tracking-tight text-fg-strong max-[620px]:hidden">
          Yasin Hessnawi
        </span>
      </a>
      <nav className="hidden items-center gap-1 min-[900px]:flex">
        {nav.map(({ id, label }) => (
          <a
            key={id}
            href={`${base}/#${id}`}
            className={cn(
              "rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-wide no-underline transition-colors duration-fast ease-out",
              active === id ? "text-accent" : "text-fg-muted hover:text-fg"
            )}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2.5">
        <LanguageSwitcher />
        <ThemeToggle />
        <Button
          variant="primary"
          size="sm"
          href={`${base}/#contact`}
          className="max-[620px]:hidden"
        >
          {t("getInTouch")}
        </Button>
      </div>
    </header>
  );
}
