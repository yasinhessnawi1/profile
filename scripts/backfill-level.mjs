import { readFileSync, readdirSync, writeFileSync } from "fs";
import path from "path";

const dir = "content";
for (const f of readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
  const p = path.join(dir, f);
  let src = readFileSync(p, "utf-8");
  const fm = src.split("---")[1] ?? "";
  if (/^level:/m.test(fm)) continue;
  const isMasters = /Master's Programme/.test(fm);
  src = src.replace("\n---", `\nlevel: "${isMasters ? "Master's" : "Bachelor"}"\n---`);
  writeFileSync(p, src);
  console.log(`${f}: ${isMasters ? "Master's" : "Bachelor"}`);
}
