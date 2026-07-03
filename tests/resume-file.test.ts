import { describe, expect, it } from "vitest";
import { fallbackOrder, resolveResumeLang, RESUME_FILES } from "@/lib/resume-file";

describe("resume file resolution", () => {
  it("normalizes lang", () => {
    expect(resolveResumeLang("no")).toBe("no");
    expect(resolveResumeLang("en")).toBe("en");
    expect(resolveResumeLang("de")).toBe("en");
    expect(resolveResumeLang(null)).toBe("en");
  });
  it("Norwegian falls back to English; English does not fall back", () => {
    expect(fallbackOrder("no")).toEqual(["no", "en"]);
    expect(fallbackOrder("en")).toEqual(["en"]);
  });
  it("file names match the public/resume convention", () => {
    expect(RESUME_FILES.en).toBe("yasin-hessnawi-cv-en.pdf");
    expect(RESUME_FILES.no).toBe("yasin-hessnawi-cv-no.pdf");
  });
});
