import { NextResponse, type NextRequest } from "next/server";
import { contactSchema, rateLimit } from "@/lib/contact";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  // Honeypot filled → pretend success, send nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "yasinhessnawi1@gmail.com";
  if (!key) {
    // No sender configured — tell the client to fall back to mailto.
    return NextResponse.json({ ok: false, fallback: "mailto", to });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const { name, email, message } = parsed.data;
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
  if (error) {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
