import { ResumeCard } from "signal-ds";

export const Work = () => (
  <div className="flex max-w-[620px] flex-col gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <ResumeCard
      logoUrl="https://safemediai.com/favicon.ico"
      title="Safe Media AI AS"
      subtitle="Co-Founder"
      period="Aug 2025 – Now"
      description="• Co-founded an AI company specializing in document-security solutions • Leading development & deployment of Declassifai • Own strategic direction and product development"
    />
  </div>
);

export const Education = () => (
  <div className="flex max-w-[620px] flex-col gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <ResumeCard
      logoUrl="https://yasinhessnawi.online/ntnu.svg"
      title="NTNU"
      subtitle="B.Sc. Computer Science · Grade A thesis · Eureka Prize"
      period="2022 – 2025"
    />
  </div>
);

export const NoLogo = () => (
  <div className="flex max-w-[620px] flex-col gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <ResumeCard
      title="NTNU · LAOS"
      subtitle="Teaching Assistant Certificate"
      period="2024"
      description="• Trained to create safe, communicative learning environments • Conflict-resolution principles"
    />
  </div>
);

export const ExperienceList = () => (
  <div className="flex max-w-[620px] flex-col gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <ResumeCard
      logoUrl="https://safemediai.com/favicon.ico"
      title="Safe Media AI AS"
      subtitle="Co-Founder"
      period="Aug 2025 – Now"
      description="• Co-founded an AI company specializing in document-security solutions • Leading development & deployment of Declassifai"
    />
    <ResumeCard
      logoUrl="https://yasinhessnawi.online/ntnu.svg"
      title="NTNU"
      subtitle="University Teaching Assistant"
      period="Aug – Dec 2024"
      description="• Prepared and ran student labs • Corrected and graded academic work"
    />
    <ResumeCard
      logoUrl="https://yasinhessnawi.online/ntnu.svg"
      title="NTNU"
      subtitle="Student Assistant"
      period="Jan – Jun 2024"
      description="• Supported class projects • Supplied exam practice"
    />
  </div>
);
