export const RESUME_FILES = {
  en: "yasin-hessnawi-cv-en.pdf",
  no: "yasin-hessnawi-cv-no.pdf",
} as const;

export type ResumeLang = keyof typeof RESUME_FILES;

export function resolveResumeLang(lang: string | null): ResumeLang {
  return lang === "no" ? "no" : "en";
}

export function fallbackOrder(lang: ResumeLang): ResumeLang[] {
  return lang === "no" ? ["no", "en"] : ["en"];
}
