import { Dock } from "signal-ds";

export const SiteDock = () => (
  <div className="flex justify-center rounded-lg bg-bg bg-dots p-10 font-sans text-fg">
    <Dock
      items={[
        { icon: "arrow-up-right", label: "Top", href: "#top" },
        { icon: "briefcase", label: "Work", href: "#work" },
        { icon: "folder", label: "Projects", href: "#projects" },
        { icon: "notebook", label: "Blog", href: "#blog" },
        { icon: "mail", label: "Contact", href: "#contact" },
        { type: "divider" },
        { icon: "sun", label: "Theme", onClick: () => {} },
        { icon: "languages", label: "Language", onClick: () => {} },
      ]}
    />
  </div>
);

export const Social = () => (
  <div className="flex justify-center rounded-lg bg-bg bg-dots p-10 font-sans text-fg">
    <Dock
      items={[
        { icon: "github", label: "GitHub", href: "https://github.com/yasinhessnawi1" },
        { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/yasin-hessnawi-102a02326" },
        { icon: "globe", label: "Website", href: "https://yasinhessnawi.online" },
        { type: "divider" },
        { icon: "download", label: "Résumé", href: "/resume/en" },
      ]}
    />
  </div>
);
