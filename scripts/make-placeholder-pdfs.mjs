import { mkdirSync, writeFileSync } from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const texts = {
  en: [
    "Yasin Hessnawi — Résumé",
    "Placeholder PDF. The real résumé will replace this file at",
    "public/resume/yasin-hessnawi-cv-en.pdf",
  ],
  no: [
    "Yasin Hessnawi — CV",
    "Plassholder-PDF. Den ekte CV-en erstatter denne filen i",
    "public/resume/yasin-hessnawi-cv-no.pdf",
  ],
};

mkdirSync("public/resume", { recursive: true });
for (const [lang, [title, ...body]] of Object.entries(texts)) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.drawText(title, { x: 60, y: 760, size: 24, font, color: rgb(0.05, 0.05, 0.04) });
  body.forEach((line, i) => {
    page.drawText(line, { x: 60, y: 720 - i * 18, size: 11, font, color: rgb(0.3, 0.3, 0.28) });
  });
  writeFileSync(`public/resume/yasin-hessnawi-cv-${lang}.pdf`, await doc.save());
  console.log(`wrote public/resume/yasin-hessnawi-cv-${lang}.pdf`);
}
