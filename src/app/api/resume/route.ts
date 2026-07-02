import { promises as fs } from "fs";
import path from "path";
import { type NextRequest } from "next/server";
import {
  fallbackOrder,
  resolveResumeLang,
  RESUME_FILES,
} from "@/lib/resume-file";

export async function GET(req: NextRequest) {
  const lang = resolveResumeLang(req.nextUrl.searchParams.get("lang"));
  for (const l of fallbackOrder(lang)) {
    const file = RESUME_FILES[l];
    const filePath = path.join(process.cwd(), "public", "resume", file);
    try {
      const buf = await fs.readFile(filePath);
      return new Response(new Uint8Array(buf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${file}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      // try next fallback
    }
  }
  return new Response("Résumé not found", { status: 404 });
}
