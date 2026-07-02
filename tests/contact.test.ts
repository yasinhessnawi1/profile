import { describe, expect, it } from "vitest";
import { contactSchema, rateLimit } from "@/lib/contact";

describe("contactSchema", () => {
  const valid = { name: "Ada", email: "ada@example.com", message: "Hei!" };
  it("accepts a valid payload", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  it("accepts the empty honeypot and preserves a filled one", () => {
    expect(contactSchema.safeParse({ ...valid, company: "" }).success).toBe(true);
    const filled = contactSchema.safeParse({ ...valid, company: "SpamCo" });
    expect(filled.success).toBe(true);
    expect(filled.success && filled.data.company).toBe("SpamCo");
  });
  it("rejects bad email / empty fields / oversized message", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, name: "  " }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(5001) }).success).toBe(false);
  });
});

describe("rateLimit", () => {
  it("allows 5 within the window and blocks the 6th", () => {
    const key = "ip-test-1";
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) expect(rateLimit(key, t0 + i)).toBe(true);
    expect(rateLimit(key, t0 + 5)).toBe(false);
  });
  it("frees up after the window passes", () => {
    const key = "ip-test-2";
    const t0 = 2_000_000;
    for (let i = 0; i < 5; i++) rateLimit(key, t0 + i);
    expect(rateLimit(key, t0 + 10 * 60_000 + 1)).toBe(true);
  });
});
