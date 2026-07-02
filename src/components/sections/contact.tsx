"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ResumeData } from "@/data/resume-types";
import { Button } from "@/components/signal/button";
import { Icon } from "@/components/signal/icon";
import { Input } from "@/components/signal/input";
import { SectionLabel } from "@/components/signal/section-label";
import { SocialLink } from "@/components/signal/social-link";

export function ContactSection({ data }: { data: ResumeData }) {
  const t = useTranslations("contact");
  return (
    <section id="contact" className="container section">
      <div className="relative overflow-hidden rounded-xl border border-line-strong bg-surface p-[clamp(28px,5vw,56px)]">
        <div className="glow-signal pointer-events-none absolute inset-0 opacity-80" />
        <div className="relative grid grid-cols-[1.1fr_1fr] items-center gap-[clamp(28px,5vw,56px)] max-[900px]:grid-cols-1">
          <div>
            <SectionLabel index={t("index")} rule={false} className="mb-4">
              {t("eyebrow")}
            </SectionLabel>
            <h2 className="display m-0 mb-4 text-3xl font-medium">
              {t("titleLine1")}
              <br />
              <span className="mark-signal">{t("titleAccent")}</span>
            </h2>
            <p className="m-0 mb-[26px] max-w-[42ch] text-md leading-relaxed text-fg-muted">
              {t("body")}
            </p>
            <div className="flex max-w-[380px] flex-col gap-2.5">
              <SocialLink
                icon="mail"
                label={t("email")}
                value={data.contact.email}
                href={`mailto:${data.contact.email}`}
              />
              <div className="flex gap-2.5">
                <SocialLink iconOnly icon="github" label={t("github")} href={data.contact.github} />
                <SocialLink iconOnly icon="linkedin" label={t("linkedin")} href={data.contact.linkedin} />
                <SocialLink iconOnly icon="globe" label={t("website")} href={data.contact.site} />
                <SocialLink
                  iconOnly
                  icon="phone"
                  label={t("phone")}
                  href={`tel:${data.contact.tel.replace(/\s/g, "")}`}
                />
              </div>
            </div>
          </div>
          <ContactForm toEmail={data.contact.email} />
        </div>
      </div>
    </section>
  );
}

type FormState = "idle" | "sending" | "sent" | "error";

function ContactForm({ toEmail }: { toEmail: string }) {
  const t = useTranslations("form");
  const [state, setState] = useState<FormState>("idle");
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
    };
    const mailto = `mailto:${toEmail}?subject=${encodeURIComponent(
      `Portfolio contact from ${payload.name}`
    )}&body=${encodeURIComponent(payload.message)}`;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; fallback?: string };
      if (json.ok) {
        setState("sent");
      } else if (json.fallback === "mailto") {
        setMailtoHref(mailto);
        setState("error");
      } else {
        setMailtoHref(mailto);
        setState("error");
      }
    } catch {
      setMailtoHref(mailto);
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-lg border border-line bg-bg p-[clamp(20px,3vw,28px)] text-center">
        <span className="mb-3.5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-quiet text-accent">
          <Icon name="check" size={24} />
        </span>
        <div className="mb-1.5 font-display text-[20px] text-fg-strong">{t("sentTitle")}</div>
        <div className="text-[13px] text-fg-muted">{t("sentBody")}</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3.5 rounded-lg border border-line bg-bg p-[clamp(20px,3vw,28px)]"
    >
      <Input label={t("name")} name="name" placeholder={t("namePlaceholder")} required />
      <Input
        label={t("email")}
        name="email"
        icon="mail"
        type="email"
        placeholder={t("emailPlaceholder")}
        required
      />
      <Input
        label={t("message")}
        name="message"
        multiline
        rows={3}
        placeholder={t("messagePlaceholder")}
        required
      />
      {/* honeypot — hidden from humans, bots fill it */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      {state === "error" && (
        <div className="rounded-md border border-[rgba(255,92,60,0.4)] bg-[rgba(255,92,60,0.08)] p-3 text-[13px] text-fg-muted">
          <div className="mb-1 font-semibold text-redact-500">{t("errorTitle")}</div>
          <div className="mb-2">{t("errorBody")}</div>
          {mailtoHref && (
            <a href={mailtoHref} className="font-mono text-xs uppercase tracking-wide text-accent">
              {t("mailtoFallback")} →
            </a>
          )}
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        full
        disabled={state === "sending"}
        iconRight={<Icon name="arrow-up-right" size={17} />}
      >
        {state === "sending" ? t("sending") : t("send")}
      </Button>
    </form>
  );
}
