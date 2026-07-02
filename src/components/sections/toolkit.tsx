"use client";

import { useTranslations } from "next-intl";
import type { ResumeData } from "@/data/resume-types";
import { BlurFade } from "@/components/signal/blur-fade";
import { SectionLabel } from "@/components/signal/section-label";
import { Tag } from "@/components/signal/tag";

export function Toolkit({ data }: { data: ResumeData }) {
  const t = useTranslations("toolkit");
  return (
    <section id="toolkit" className="container section">
      <SectionLabel index={t("index")} className="mb-9">
        {t("eyebrow")}
      </SectionLabel>
      <div className="flex flex-col gap-[22px]">
        {Object.entries(data.skills).map(([group, items], i) => (
          <BlurFade key={group} delay={i * 0.04}>
            <div className="grid grid-cols-[180px_1fr] items-baseline gap-[22px] border-b border-line pb-5 max-[620px]:grid-cols-1 max-[620px]:gap-2.5">
              <div className="font-mono text-xs uppercase tracking-[0.08em] text-fg-subtle">
                {group}
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
