// design-sync Tailwind config: the site's config, plus the authored previews
// as content and a safelist of the token utilities, so designs built with the
// synced bundle can use the Signal vocabulary even where the site doesn't yet.
import type { Config } from "tailwindcss";
import site from "../tailwind.config";

const COLORS =
  "bg|bg-tint|surface|surface-2|elevated|fg|fg-strong|fg-muted|fg-subtle|fg-faint|fg-inverse|" +
  "line|line-strong|line-signal|accent|accent-hover|accent-press|accent-foreground|accent-quiet|" +
  "signal-(?:300|400|500|600|700)|redact-(?:400|500|600)|ink-(?:990|900|500|050)|paper|danger|warning|info";
const SPACE = "0|px|0\\.5|1|1\\.5|2|2\\.5|3|3\\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32";

const config = {
  ...site,
  content: [...site.content, "./.design-sync/previews/**/*.tsx"],
  safelist: [
    { pattern: new RegExp(`^(?:bg|text|border)-(?:${COLORS})$`), variants: ["hover"] },
    { pattern: /^text-(?:2xs|xs|sm|base|md|lg|xl|2xl|3xl|4xl|5xl)$/ },
    { pattern: /^font-(?:display|sans|mono|normal|medium|semibold|bold)$/ },
    { pattern: /^rounded-(?:xs|sm|md|lg|xl|2xl|pill|full)$/ },
    { pattern: /^shadow-(?:xs|sm|md|lg|signal|inset|none)$/ },
    { pattern: /^tracking-(?:tighter|tight|label|wide|normal)$/ },
    { pattern: /^(?:duration-(?:fast|base|slow)|ease-(?:out|in-out|spring))$/ },
    { pattern: /^max-w-(?:container|narrow|wide)$/ },
    { pattern: new RegExp(`^(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y)-(?:${SPACE})$`) },
    { pattern: /^grid-cols-(?:1|2|3|4|5|6|12)$/, variants: ["sm", "md", "lg"] },
    { pattern: /^col-span-(?:1|2|3|4|5|6)$/, variants: ["md", "lg"] },
    { pattern: /^(?:flex-row|flex-col)$/, variants: ["sm", "md", "lg"] },
    { pattern: /^(?:items|justify)-(?:start|center|end|between|baseline|stretch)$/ },
  ],
} satisfies Config;

export default config;
