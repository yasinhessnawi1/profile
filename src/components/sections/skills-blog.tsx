"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { PostLevel } from "@/data/blog";
import { Badge } from "@/components/signal/badge";
import { Icon } from "@/components/signal/icon";
import { SectionLabel } from "@/components/signal/section-label";
import { cn } from "@/lib/utils";

export type BlogPostView = {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  level: PostLevel;
  html: string;
};

const FILTERS = ["all", "masters", "bachelor"] as const;
type Filter = (typeof FILTERS)[number];

function fmtDate(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleDateString(locale === "no" ? "nb-NO" : "en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function SkillsBlog({ posts, locale }: { posts: BlogPostView[]; locale: string }) {
  const t = useTranslations("blog");
  const [filter, setFilter] = useState<Filter>("all");
  const [slug, setSlug] = useState(posts[0]?.slug);

  const labels: Record<Filter, string> = {
    all: t("filterAll"),
    masters: t("filterMasters"),
    bachelor: t("filterBachelor"),
  };
  const list = useMemo(
    () =>
      filter === "all"
        ? posts
        : posts.filter((p) =>
            filter === "masters" ? p.level === "Master's" : p.level === "Bachelor"
          ),
    [posts, filter]
  );
  const active = posts.find((p) => p.slug === slug) ?? list[0];

  return (
    <section id="blog" className="container section">
      <div className="mb-[30px] flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-[260px] flex-1">
          <SectionLabel index={t("index")} rule={false} className="mb-3.5">
            {t("eyebrow")}
          </SectionLabel>
          <h2 className="display m-0 text-2xl font-medium">{t("title")}</h2>
          <p className="mb-0 mt-2.5 max-w-[52ch] text-[15px] text-fg-muted">
            {t("subtitle", { count: posts.length })}
            {locale === "no" && (
              <span className="ml-1 font-mono text-2xs uppercase tracking-wide text-fg-faint">
                · {t("englishOnly")}
              </span>
            )}
          </p>
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
                "cursor-pointer rounded-pill border-none px-3.5 py-[7px] font-mono text-2xs font-semibold uppercase tracking-wide transition-all duration-fast ease-out",
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

      <div className="grid grid-cols-[minmax(280px,380px)_1fr] items-start gap-6 max-[900px]:grid-cols-1">
        {/* timeline list */}
        <div className="relative max-h-[560px] overflow-y-auto pr-1.5">
          <div className="absolute bottom-2 left-1.5 top-2 w-[1.5px] bg-line" />
          <div className="flex flex-col gap-1">
            {list.map((p) => {
              const on = active?.slug === p.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSlug(p.slug)}
                  aria-current={on}
                  className={cn(
                    "relative cursor-pointer rounded-md border py-3 pl-[26px] pr-3.5 text-left",
                    "transition-colors duration-fast ease-out",
                    on
                      ? "border-line-strong bg-surface"
                      : "border-transparent bg-transparent hover:bg-surface-2"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-[1px] top-[17px] h-2.5 w-2.5 rounded-full border-2",
                      on
                        ? "border-accent bg-accent shadow-[0_0_10px_var(--signal-glow)]"
                        : "border-line-strong bg-surface-2"
                    )}
                  />
                  <div className="mb-1 flex items-center gap-2">
                    <span className="whitespace-nowrap font-mono text-[10px] tracking-wide text-fg-faint">
                      {fmtDate(p.publishedAt, locale)}
                    </span>
                    <span
                      className={cn(
                        "whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.08em]",
                        p.level === "Master's" ? "text-accent" : "text-fg-faint"
                      )}
                    >
                      · {p.level}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "text-sm leading-[1.3]",
                      on ? "font-semibold text-fg-strong" : "font-medium text-fg"
                    )}
                  >
                    {p.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* reader — real rendered MDX */}
        {active && (
          <article
            key={active.slug}
            className="rounded-lg border border-line bg-surface p-[clamp(22px,3vw,34px)]"
          >
            <div className="mb-3.5 flex items-center gap-2.5">
              <Badge
                tone={active.level === "Master's" ? "signal" : "neutral"}
                size="sm"
                dot={active.level === "Master's"}
              >
                {active.level === "Master's" ? t("mastersProgramme") : t("bachelorProgramme")}
              </Badge>
              <span className="font-mono text-2xs text-fg-faint">
                {fmtDate(active.publishedAt, locale)}
              </span>
            </div>
            <h3 className="display m-0 mb-3.5 text-[clamp(1.5rem,3vw,2rem)] font-medium tracking-tight">
              {active.title}
            </h3>
            <p className="m-0 mb-2 border-b border-line pb-[18px] text-base leading-[1.6] text-fg [text-wrap:pretty]">
              {active.summary.replace(/\s*\([^)]*\)\s*$/, "")}
            </p>
            <div
              className="prose-signal mt-4"
              dangerouslySetInnerHTML={{ __html: active.html }}
            />
            <div className="mt-[22px] flex items-center gap-2 border-t border-line pt-4 font-mono text-2xs text-fg-faint">
              <Icon name="notebook" size={13} /> content/{active.slug}.mdx
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
