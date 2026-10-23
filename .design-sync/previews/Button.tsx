import { Button, Icon } from "signal-ds";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <Button variant="primary">Get in touch</Button>
    <Button variant="secondary">Read the blog</Button>
    <Button variant="outline">View résumé</Button>
    <Button variant="ghost">Skip</Button>
    <Button variant="signal-outline">Open to opportunities</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const WithIcons = () => (
  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <Button icon={<Icon name="download" size={16} />} href="/resume/en">
      Download résumé
    </Button>
    <Button variant="outline" iconRight={<Icon name="arrow-right" size={16} />} href="#work">
      Selected work
    </Button>
    <Button variant="secondary" icon={<Icon name="github" size={16} />} href="https://github.com/yasinhessnawi1">
      GitHub
    </Button>
  </div>
);

export const Disabled = () => (
  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <Button disabled>Sending…</Button>
    <Button variant="outline" disabled>
      Unavailable
    </Button>
  </div>
);

export const LightTheme = () => (
  <div className="theme-light flex flex-wrap items-center gap-3 rounded-lg bg-bg p-6 font-sans text-fg">
    <Button>Get in touch</Button>
    <Button variant="secondary">Read the blog</Button>
    <Button variant="outline">View résumé</Button>
    <Button variant="signal-outline">Open to opportunities</Button>
  </div>
);
