import { Badge } from "signal-ds";

export const Tones = () => (
  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <Badge tone="signal">Signal</Badge>
    <Badge tone="neutral">Neutral</Badge>
    <Badge tone="outline">Outline</Badge>
    <Badge tone="redact">Redact</Badge>
    <Badge tone="azure">Azure</Badge>
    <Badge tone="amber">Amber</Badge>
  </div>
);

export const WithDot = () => (
  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <Badge tone="signal" dot>
      Open to opportunities
    </Badge>
    <Badge tone="amber" dot>
      In progress
    </Badge>
    <Badge tone="redact" dot>
      Redacted
    </Badge>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <Badge tone="signal" size="sm" dot>
      Master's programme
    </Badge>
    <Badge tone="neutral" size="sm">
      Bachelor's programme
    </Badge>
    <Badge tone="signal" size="md">
      Featured
    </Badge>
  </div>
);

export const SansLabel = () => (
  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <Badge tone="neutral" mono={false}>
      Gjøvik, Norway
    </Badge>
    <Badge tone="outline" mono={false}>
      English · Norsk
    </Badge>
  </div>
);
