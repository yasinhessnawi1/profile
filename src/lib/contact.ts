import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
  company: z.string().max(200).optional(), // honeypot — checked in the route, not rejected here
});

export type ContactInput = z.infer<typeof contactSchema>;

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** Sliding-window in-memory rate limiter (per serverless instance — best effort). */
export function rateLimit(key: string, now: number = Date.now()): boolean {
  const windowHits = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (windowHits.length >= MAX_PER_WINDOW) {
    hits.set(key, windowHits);
    return false;
  }
  windowHits.push(now);
  hits.set(key, windowHits);
  return true;
}
