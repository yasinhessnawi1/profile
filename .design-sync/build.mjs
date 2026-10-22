// Builds what package-build.mjs reads from .design-sync/pkg/ (run from the repo root):
//   types/      declarations for the Signal components (tsc), with an index
//               mirroring pkg/index.ts so the converter sees the same exports it bundles
//   signal.css  the site's stylesheet compiled by Tailwind (tokens + utilities + fonts)
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";

const run = (bin, args) => execFileSync(`node_modules/.bin/${bin}`, args, { stdio: "inherit" });

// config.dtsPropsFor spells the icon-name union out (the converter can't flatten
// `keyof typeof ICONS`), so fail loudly when icon.tsx gains or loses a glyph.
const iconSrc = readFileSync("src/components/signal/icon.tsx", "utf8");
const iconBlock = iconSrc.slice(iconSrc.indexOf("const ICONS = {"), iconSrc.indexOf("} satisfies"));
const iconUnion = [...iconBlock.matchAll(/^\s*"?([a-z-]+)"?\s*:/gm)].map((m) => `"${m[1]}"`).join(" | ");
const { dtsPropsFor = {} } = JSON.parse(readFileSync(".design-sync/config.json", "utf8"));
const stale = Object.entries(dtsPropsFor)
  .filter(([, body]) => body.includes('"arrow-up-right"') && !body.includes(iconUnion))
  .map(([name]) => name);
if (stale.length) {
  console.error(`icon names in config.dtsPropsFor (${stale.join(", ")}) no longer match icon.tsx; replace the union with:\n${iconUnion}`);
  process.exit(1);
}

rmSync(".design-sync/pkg/types", { recursive: true, force: true });
run("tsc", ["-p", ".design-sync/tsconfig.dts.json"]);
const barrel = readFileSync(".design-sync/pkg/index.ts", "utf8").replaceAll('"../../src/', '"./');
writeFileSync(".design-sync/pkg/types/index.d.ts", barrel);

run("tailwindcss", [
  "-c", ".design-sync/tailwind.config.ts",
  "-i", ".design-sync/ds.css",
  "-o", ".design-sync/pkg/signal.css",
]);
