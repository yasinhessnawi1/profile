"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ResumeData } from "@/data/resume-types";
import { Badge } from "@/components/signal/badge";
import { BlurFade } from "@/components/signal/blur-fade";
import { Button } from "@/components/signal/button";
import { Icon, type IconName } from "@/components/signal/icon";
import { Stat } from "@/components/signal/stat";
import { cn } from "@/lib/utils";

export function Hero({ data, locale }: { data: ResumeData; locale: string }) {
  const t = useTranslations("hero");
  const socials: [IconName, string][] = [
    ["github", data.contact.github],
    ["linkedin", data.contact.linkedin],
    ["globe", data.contact.site],
    ["mail", `mailto:${data.contact.email}`],
  ];
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="glow-signal pointer-events-none absolute inset-0" />
      <div
        className="bg-grid pointer-events-none absolute inset-0 opacity-50"
        style={{
          maskImage: "linear-gradient(180deg, black, transparent 78%)",
          WebkitMaskImage: "linear-gradient(180deg, black, transparent 78%)",
        }}
      />
      <div className="container relative pb-[clamp(40px,7vw,80px)] pt-[clamp(48px,9vw,110px)]">
        <div className="grid grid-cols-[1.35fr_0.9fr] items-center gap-[clamp(32px,6vw,72px)] max-[900px]:grid-cols-1">
          <BlurFade>
            <Badge tone="signal" dot className="mb-[26px]">
              {t("availability")}
            </Badge>
            <h1 className="display m-0 mb-[22px] text-4xl font-medium">
              {t("headline1")}
              <br />
              <span className="mark-signal">{t("headlineAccent")}</span>{" "}
              {t("headline2")}
            </h1>
            <p className="m-0 mb-[30px] max-w-[48ch] text-md leading-relaxed text-fg-muted [text-wrap:pretty]">
              {data.intro}
            </p>
            <div className="mb-[26px] flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                href="#projects"
                iconRight={<Icon name="arrow-down" size={18} />}
              >
                {t("viewWork")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                href={`/api/resume?lang=${locale}`}
                download
                icon={<Icon name="download" size={18} />}
                aria-label={t("downloadResume")}
              >
                {t("resume")}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xs uppercase tracking-[0.12em] text-fg-faint">
                {t("findMe")}
              </span>
              <span className="h-px w-5 bg-line-strong" />
              {socials.map(([ic, href]) => (
                <a
                  key={ic}
                  href={href}
                  aria-label={ic}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex p-1.5 text-fg-muted transition-colors duration-fast ease-out hover:text-accent"
                >
                  <Icon name={ic} size={20} />
                </a>
              ))}
            </div>
          </BlurFade>

          <BlurFade delay={0.12} className="relative justify-self-center max-[900px]:hidden">
            <div className="relative aspect-square w-[min(340px,74vw)]">
              <div className="absolute -inset-[8%] rounded-full bg-[radial-gradient(circle_at_60%_30%,var(--signal-glow),transparent_62%)] blur-[6px]" />
              <div className="absolute inset-0 overflow-hidden rounded-full border-[1.5px] border-line-signal shadow-lg">
                <Image
                  src={data.avatar}
                  alt={data.name}
                  fill
                  priority
                  sizes="340px"
                  className="object-cover"
                />
              </div>
              <MetaChip className="left-[-12%] top-[6%]" icon="sparkles">
                {t("chipStatus")}
              </MetaChip>
              <MetaChip className="bottom-[8%] right-[-10%]" icon="cpu">
                {t("chipStudy")}
              </MetaChip>
            </div>
          </BlurFade>
        </div>

        <div className="mt-[clamp(40px,6vw,72px)] grid grid-cols-4 border-y border-line max-[900px]:grid-cols-2">
          {data.stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "px-[clamp(12px,3vw,28px)] py-6",
                i !== 0 && "border-l border-line max-[900px]:[&:nth-child(3)]:border-l-0"
              )}
            >
              <Stat value={s.value} suffix={s.suffix} label={s.label} accent={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetaChip({
  icon,
  className,
  children,
}: {
  icon: IconName;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute flex items-center gap-[7px] rounded-pill border border-line-strong px-[13px] py-2 font-mono text-2xs text-fg shadow-md",
        "bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] backdrop-blur-[10px]",
        className
      )}
    >
      <Icon name={icon} size={14} className="text-accent" />
      {children}
    </span>
  );
}
