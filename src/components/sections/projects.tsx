"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ResumeData } from "@/data/resume-types";
import { BlurFade } from "@/components/signal/blur-fade";
import { ProjectCard } from "@/components/signal/project-card";
import { SectionLabel } from "@/components/signal/section-label";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "ventures", "research", "personal"] as const;
type Filter = (typeof FILTERS)[number];

export function Projects({ data }: { data: ResumeData }) {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<Filter>("all");

  const labels: Record<Filter, string> = {
    all: t("filterAll"),
    ventures: t("filterVentures"),
    research: t("filterResearch"),
    personal: t("filterPersonal"),
  };

  const grid =
    filter === "all"
      ? [...data.research, ...data.personal]
      : filter === "research"
        ? data.research
        : filter === "personal"
          ? data.personal
          : [];
  const showFeatured = filter === "all" || filter === "ventures";

  return (
    <section id="projects" className="container section">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-[260px] flex-1">
          <SectionLabel index={t("index")} rule={false} className="mb-3.5">
            {t("eyebrow")}
          </SectionLabel>
          <h2 className="display m-0 text-2xl font-medium">{t("title")}</h2>
        </div>
        <div
          role="tablist"
          aria-label={t("eyebrow")}
          className="flex gap-1.5 rounded-pill border border-line bg-surface p-[5px]"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-pill border-none px-3.5 py-[7px] font-mono text-2xs font-semibold uppercase tracking-wide",
                "cursor-pointer transition-all duration-fast ease-out",
                filter === f
                  ? "bg-accent text-accent-foreground"
                  : "bg-transparent text-fg-muted hover:text-fg"
              )}
            >
              {labels[f]}
            </button>
          ))}
        </div>
      </div>

      {showFeatured && (
        <div className="mb-5 grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
          {data.featured.map((p, i) => (
            <BlurFade key={p.title} delay={i * 0.06}>
              <ProjectCard
                title={p.title}
                dates={p.dates}
                image={p.image}
                tags={p.tags}
                links={p.links}
                description={p.description}
                featured
                featuredLabel={t("featured")}
                href={p.links[0].href}
              />
            </BlurFade>
          ))}
        </div>
      )}
      {grid.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          {grid.map((p, i) => (
            <BlurFade key={p.title} delay={i * 0.04}>
              <ProjectCard
                title={p.title}
                dates={p.dates}
                image={p.image}
                tags={p.tags}
                links={p.links}
                description={p.description}
                href={p.links[0].href}
              />
            </BlurFade>
          ))}
        </div>
      )}
    </section>
  );
}
