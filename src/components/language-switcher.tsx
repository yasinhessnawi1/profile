"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname || "/"}${hash}`, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "flex items-center rounded-pill border border-line-strong bg-surface-2 p-[3px] font-mono text-2xs uppercase",
        className
      )}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={locale === l}
          onClick={() => switchTo(l)}
          className={cn(
            "rounded-pill px-2.5 py-1.5 tracking-[0.08em] transition-colors duration-fast ease-out",
            locale === l
              ? "bg-accent font-semibold text-accent-foreground"
              : "text-fg-muted hover:text-fg"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
