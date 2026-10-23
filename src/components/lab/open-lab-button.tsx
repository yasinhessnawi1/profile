"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/signal/button";
import { Icon } from "@/components/signal/icon";

// From the blog into the 3D lab. Hidden where the lab can't run (no WebGL).
export function OpenLabButton({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))));
    } catch {}
  }, []);

  if (!webgl) return null;
  return (
    <Button
      variant="signal-outline"
      size="sm"
      href={`${locale === "en" ? "" : `/${locale}`}/?3d`}
      icon={<Icon name="sparkles" size={14} />}
      aria-label={t("openLab")}
      className={className}
    >
      <span className="max-[620px]:hidden">{t("openLab")}</span>
    </Button>
  );
}
