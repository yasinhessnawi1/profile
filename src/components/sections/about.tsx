"use client";

import { useTranslations } from "next-intl";
import type { ResumeData } from "@/data/resume-types";
import { BlurFade } from "@/components/signal/blur-fade";
import { Icon } from "@/components/signal/icon";
import { SectionLabel } from "@/components/signal/section-label";

export function About({ data }: { data: ResumeData }) {
  const t = useTranslations("about");
  return (
    <section id="about" className="container section">
      <SectionLabel index={t("index")} className="mb-9">
        {t("eyebrow")}
      </SectionLabel>
      <div className="grid grid-cols-[1.5fr_1fr] items-start gap-[clamp(32px,6vw,72px)] max-[900px]:grid-cols-1">
        <BlurFade>
          <p className="m-0 font-display text-[clamp(1.4rem,2.6vw,2rem)] font-normal leading-[1.4] tracking-tight text-fg-strong [text-wrap:pretty]">
            {data.about}
          </p>
        </BlurFade>
        <BlurFade delay={0.08} className="flex flex-col gap-3.5">
          {data.aboutCards.map((c) => (
            <div
              key={c.label}
              className="flex gap-3.5 rounded-md border border-line bg-surface px-[18px] py-4"
            >
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-sm bg-accent-quiet text-accent">
                <Icon name={c.icon} size={17} />
              </span>
              <div>
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                  {c.label}
                </div>
                <div className="text-sm leading-[1.45] text-fg">{c.value}</div>
              </div>
            </div>
          ))}
        </BlurFade>
      </div>
    </section>
  );
}
