import { describe, expect, it } from "vitest";
import { getBlogPosts, resolveLevel } from "@/data/blog";

describe("resolveLevel", () => {
  it("prefers the explicit frontmatter level", () => {
    expect(resolveLevel({ level: "Master's", summary: "whatever" })).toBe("Master's");
    expect(resolveLevel({ level: "Bachelor", summary: "x (Foo - Master's Programme)" })).toBe("Bachelor");
  });
  it("falls back to the summary marker", () => {
    expect(resolveLevel({ summary: "Topics (AI - Master's Programme)" })).toBe("Master's");
    expect(resolveLevel({ summary: "Topics (Web course)" })).toBe("Bachelor");
  });
});

describe("getBlogPosts", () => {
  it("every post has a valid level and rendered html", async () => {
    const posts = await getBlogPosts();
    expect(posts.length).toBeGreaterThanOrEqual(17);
    for (const p of posts) {
      expect(["Master's", "Bachelor"]).toContain(p.metadata.level);
      expect(p.source).toContain("<");
      expect(p.metadata.title).toBeTruthy();
      expect(p.metadata.publishedAt).toBeTruthy();
    }
  });
});
