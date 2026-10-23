import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { CONTENT } from "@/components/lab/content";
import { REPLAY } from "@/components/lab/replay-r4g2";

describe("lab content", () => {
  it("links every note to a blog post that exists", () => {
    const posts = new Set(
      fs.readdirSync(path.join(process.cwd(), "content")).map((f) => f.replace(/\.mdx$/, ""))
    );
    for (const lang of ["en", "no"] as const) {
      for (const n of CONTENT[lang].notes) {
        expect(posts.has(n.slug), `${lang}: ${n.slug}`).toBe(true);
        expect(n.href).toBe(lang === "no" ? `/no/blog/${n.slug}` : `/blog/${n.slug}`);
      }
    }
  });

  it("has copy in both languages for every project", () => {
    for (const id of CONTENT.order) {
      expect(CONTENT.en.projects[id].title, id).toBeTruthy();
      expect(CONTENT.no.projects[id].title, id).toBeTruthy();
    }
  });

  it("replays only moves between real board cells", () => {
    expect(REPLAY.order).toHaveLength(REPLAY.players.length);
    for (const [turn, from, to] of REPLAY.moves) {
      expect(turn).toBeLessThan(REPLAY.order.length);
      expect(REPLAY.cells[from]).toBeDefined();
      expect(REPLAY.cells[to]).toBeDefined();
    }
  });
});
