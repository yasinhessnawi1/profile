"use client";

import { useTranslations } from "next-intl";
import type { ResumeData } from "@/data/resume-types";
import { BlurFade } from "@/components/signal/blur-fade";
import { Icon } from "@/components/signal/icon";
import { ResumeCard } from "@/components/signal/resume-card";
import { SectionLabel } from "@/components/signal/section-label";

export function Experience({ data }: { data: ResumeData }) {
  const t = useTranslations("experience");
  return (
    <section id="work" className="container section">
      <SectionLabel index={t("index")} className="mb-9">
        {t("eyebrow")}
      </SectionLabel>
      <div className="grid grid-cols-2 items-start gap-[clamp(28px,5vw,56px)] max-[900px]:grid-cols-1">
        <BlurFade>
          <h3 className="heading mb-4 flex items-center gap-[9px] text-[18px]">
            <Icon name="briefcase" size={17} className="text-accent" /> {t("work")}
          </h3>
          <div className="flex flex-col gap-2.5">
            {data.work.map((w) => (
              <ResumeCard
                key={w.company + w.title}
                logoUrl={w.logo}
                title={w.company}
                subtitle={w.title}
                period={w.period}
                description={w.description}
              />
            ))}
          </div>
        </BlurFade>
        <BlurFade delay={0.08}>
          <h3 className="heading mb-4 flex items-center gap-[9px] text-[18px]">
            <Icon name="graduation-cap" size={18} className="text-accent" /> {t("education")}
          </h3>
          <div className="flex flex-col gap-2.5">
            {data.education.map((e) => (
              <ResumeCard
                key={e.school + e.degree}
                logoUrl={e.logo}
                title={e.school}
                subtitle={e.degree}
                period={e.period}
              />
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
