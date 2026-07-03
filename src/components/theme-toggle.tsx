"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/signal/icon";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("nav");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLight = mounted && resolvedTheme === "light";
  return (
    <button
      type="button"
      aria-label={t("toggleTheme")}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-fg-muted",
        "transition-colors duration-fast ease-out hover:text-fg",
        className
      )}
    >
      <Icon name={isLight ? "moon" : "sun"} size={18} />
    </button>
  );
}
