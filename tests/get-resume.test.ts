import { describe, expect, it } from "vitest";
import { getResume } from "@/data/get-resume";

describe("getResume", () => {
  it("returns English data by default and for unknown locales", () => {
    expect(getResume("en").about).toMatch(/passionate about programming/i);
    expect(getResume("de").name).toBe("Yasin Hessnawi");
  });

  it("returns Norwegian data for 'no'", () => {
    const no = getResume("no");
    expect(no.location).toBe("Norge");
    expect(no.skills["Språk"]).toContain("Python");
  });

  it("both locales have the same structure", () => {
    const en = getResume("en");
    const no = getResume("no");
    expect(no.work).toHaveLength(en.work.length);
    expect(no.education).toHaveLength(en.education.length);
    expect(no.featured).toHaveLength(2);
    expect(no.research).toHaveLength(en.research.length);
    expect(no.personal).toHaveLength(en.personal.length);
    expect(Object.keys(no.skills)).toHaveLength(Object.keys(en.skills).length);
    expect(no.stats).toHaveLength(4);
  });
});
