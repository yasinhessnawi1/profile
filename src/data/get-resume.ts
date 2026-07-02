import type { ResumeData } from "./resume-types";
import { RESUME_EN } from "./resume.en";
import { RESUME_NO } from "./resume.no";

export function getResume(locale: string): ResumeData {
  return locale === "no" ? RESUME_NO : RESUME_EN;
}
