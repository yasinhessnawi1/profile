export type IconKey =
  | "github"
  | "globe"
  | "mail"
  | "linkedin"
  | "sparkles"
  | "shield"
  | "code";

export type ProjectLink = { type: string; href: string; icon: IconKey };

export type Project = {
  title: string;
  dates: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  image?: string;
};

export type WorkItem = {
  company: string;
  logo?: string;
  title: string;
  period: string;
  description: string; // bullets separated by "•"
};

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
  logo?: string;
};

export type StatItem = { value: string; suffix?: string; label: string };

export type AboutCard = {
  icon: "sparkles" | "shield" | "code";
  label: string;
  value: string;
};

export type ResumeData = {
  name: string;
  initials: string;
  role: string;
  location: string;
  avatar: string;
  intro: string;
  about: string;
  aboutCards: AboutCard[];
  stats: StatItem[];
  contact: {
    email: string;
    tel: string;
    github: string;
    linkedin: string;
    site: string;
  };
  work: WorkItem[];
  education: EducationItem[];
  featured: Project[];
  research: Project[];
  personal: Project[];
  skills: Record<string, string[]>;
};
