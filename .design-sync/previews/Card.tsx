import { Card, Icon } from "signal-ds";

export const Surfaces = () => (
  <div className="grid max-w-[640px] grid-cols-2 gap-4 rounded-lg bg-bg p-6 font-sans text-fg">
    <Card>
      <div className="mb-2 font-display text-md font-semibold tracking-tight text-fg-strong">Surface</div>
      <p className="m-0 text-sm leading-relaxed text-fg-muted">The default card: warm surface fill, hairline border, soft shadow.</p>
    </Card>
    <Card inset>
      <div className="mb-2 font-display text-md font-semibold tracking-tight text-fg-strong">Inset</div>
      <p className="m-0 text-sm leading-relaxed text-fg-muted">One step up the surface ramp, for nesting inside other surfaces.</p>
    </Card>
  </div>
);

export const Interactive = () => (
  <div className="grid max-w-[640px] grid-cols-2 gap-4 rounded-lg bg-bg p-6 font-sans text-fg">
    <Card interactive href="#blog">
      <div className="mb-3 flex h-[34px] w-[34px] items-center justify-center rounded-sm bg-accent-quiet text-accent">
        <Icon name="notebook" size={18} />
      </div>
      <div className="mb-2 font-display text-md font-semibold tracking-tight text-fg-strong">Tsetlin machines</div>
      <p className="m-0 text-sm leading-relaxed text-fg-muted">Course notes on interpretable, clause-based learning.</p>
    </Card>
    <Card interactive href="#projects">
      <div className="mb-3 flex h-[34px] w-[34px] items-center justify-center rounded-sm bg-accent-quiet text-accent">
        <Icon name="code" size={18} />
      </div>
      <div className="mb-2 font-display text-md font-semibold tracking-tight text-fg-strong">Infrastructure as code</div>
      <p className="m-0 text-sm leading-relaxed text-fg-muted">Terraform, pipelines and the habits that keep them sane.</p>
    </Card>
  </div>
);

export const Padding = () => (
  <div className="grid max-w-[640px] grid-cols-2 gap-4 rounded-lg bg-bg p-6 font-sans text-fg">
    <Card pad="sm">
      <div className="mb-2 font-display text-md font-semibold tracking-tight text-fg-strong">pad sm</div>
      <p className="m-0 text-sm leading-relaxed text-fg-muted">16px</p>
    </Card>
    <Card pad="lg">
      <div className="mb-2 font-display text-md font-semibold tracking-tight text-fg-strong">pad lg</div>
      <p className="m-0 text-sm leading-relaxed text-fg-muted">32px</p>
    </Card>
  </div>
);
