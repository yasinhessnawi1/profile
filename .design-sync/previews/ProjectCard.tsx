import { ProjectCard } from "signal-ds";

export const Featured = () => (
  <div className="rounded-lg bg-bg p-6 font-sans text-fg">
    <div className="max-w-[460px]">
      <ProjectCard
        featured
        title="Declassifai"
        dates="2025 – Now"
        image="https://yasinhessnawi.online/dashboard_en.png"
        description="A web app that detects and redacts sensitive information in PDFs: AI-powered automatic detection, customizable redaction modes, and manual highlighting across document formats."
        tags={["AI/ML", "React", "Python", "PDF"]}
        links={[{ type: "Website", href: "https://declassifai.com", icon: "globe" }]}
        href="https://declassifai.com"
      />
    </div>
  </div>
);

export const NoImage = () => (
  <div className="rounded-lg bg-bg p-6 font-sans text-fg">
    <div className="max-w-[460px]">
      <ProjectCard
        title="Graph Tsetlin Machine · Hex"
        dates="2025 – Now"
        description="Modular, high-performance Graph Tsetlin Machines for Hex winner prediction with interpretable, clause-based logical learning. 99–100% accuracy on 10×10 end-games; CUDA-accelerated."
        tags={["Python", "CUDA", "GNN", "Tsetlin Machines"]}
        links={[{ type: "Repo", href: "https://github.com/yasinhessnawi1/tsetlin-hex", icon: "github" }]}
        href="https://github.com/yasinhessnawi1/tsetlin-hex"
      />
    </div>
  </div>
);

export const ProjectGrid = () => (
  <div className="rounded-lg bg-bg p-6 font-sans text-fg">
    <div className="grid gap-5 md:grid-cols-2">
      <ProjectCard
        title="GLive · GitHub to Live"
        dates="2025 – Now"
        image="https://yasinhessnawi.online/glive-og.png"
        description="Clone and run any GitHub project with one command: AI-powered setup, dependency management, security scanning, and a PWA dashboard."
        tags={["Go", "Next.js", "AI/ML", "Docker"]}
        links={[{ type: "Repo", href: "https://github.com/yasinhessnawi1/glive", icon: "github" }]}
        href="https://github.com/yasinhessnawi1/glive"
      />
      <ProjectCard
        title="STrack · Subscription Tracker"
        dates="2025 – Now"
        image="https://yasinhessnawi.online/strack-og.png"
        description="A SaaS that tames recurring expenses. Paste a link or type a service, and AI parses pricing and billing from 100+ services."
        tags={["Next.js", "TypeScript", "Gemini", "Firebase"]}
        links={[{ type: "Repo", href: "https://github.com/yasinhessnawi1/strack", icon: "github" }]}
        href="https://github.com/yasinhessnawi1/strack"
      />
    </div>
  </div>
);
