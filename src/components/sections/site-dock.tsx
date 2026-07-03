"use client";

import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Dock, type DockItem } from "@/components/signal/dock";

export function SiteDock() {
  const t = useTranslations("dock");
  const locale = useLocale();
  const base = locale === "en" ? "" : `/${locale}`;
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items: DockItem[] = [
    { icon: "arrow-up-right", label: t("top"), href: `${base}/#top` },
    { icon: "briefcase", label: t("work"), href: `${base}/#work` },
    { icon: "folder", label: t("projects"), href: `${base}/#projects` },
    { icon: "notebook", label: t("blog"), href: `${base}/#blog` },
    { icon: "mail", label: t("contact"), href: `${base}/#contact` },
    { type: "divider" },
    {
      icon: mounted && resolvedTheme === "light" ? "moon" : "sun",
      label: t("theme"),
      onClick: () =>
        setTheme(mounted && resolvedTheme === "light" ? "dark" : "light"),
    },
    {
      icon: "languages",
      label: t("language"),
      onClick: () => {
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        router.replace(`${pathname || "/"}${hash}`, {
          locale: locale === "en" ? "no" : "en",
        });
      },
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 max-[620px]:hidden">
      <Dock items={items} />
    </div>
  );
}
