"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";
import { Tag } from "./tag";

export type ProjectCardProps = {
  title: string;
  description: string;
  dates: string;
  image?: string;
  tags: string[];
  links: { type: string; href: string; icon: IconName }[];
  href: string;
  featured?: boolean;
  featuredLabel?: string;
};

export function ProjectCard({
  title,
  description,
  dates,
  image,
  tags,
  links,
  href,
  featured = false,
  featuredLabel = "Featured",
}: ProjectCardProps) {
  const [imgErr, setImgErr] = useState(false);
  const showImg = image && !imgErr;
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-sm",
        "transition-all duration-base ease-out hover:-translate-y-1 hover:border-line-signal hover:shadow-lg"
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-video overflow-hidden bg-surface-2"
      >
        {showImg ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            onError={() => setImgErr(true)}
            className="object-cover saturate-[1.02] transition-transform duration-slow ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(120%_120%_at_20%_0%,rgba(199,242,63,0.18),transparent_55%)]">
            <Icon name="folder" size={34} className="text-fg-faint" />
          </div>
        )}
        {featured && (
          <span className="absolute left-3 top-3 rounded-pill bg-accent px-[9px] py-1 font-mono text-2xs font-semibold uppercase tracking-[0.12em] text-accent-foreground">
            {featuredLabel}
          </span>
        )}
      </a>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-display text-md font-semibold tracking-[-0.01em] text-fg-strong no-underline hover:text-accent"
          >
            {title}
          </a>
          <span className="whitespace-nowrap font-mono text-2xs tracking-wide text-fg-faint">
            {dates}
          </span>
        </div>
        <p className="m-0 text-sm leading-relaxed text-fg-muted [text-wrap:pretty]">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="mt-0.5 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Tag key={t} size="sm">
                {t}
              </Tag>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-1.5">
            {links.map((l) => (
              <a
                key={l.type + l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface-2 px-2.5 py-[5px] font-mono text-2xs font-medium uppercase tracking-[0.04em] text-fg no-underline transition-colors duration-fast ease-out hover:border-line-signal hover:text-accent"
              >
                <Icon name={l.icon ?? "arrow-up-right"} size={13} />
                {l.type}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
