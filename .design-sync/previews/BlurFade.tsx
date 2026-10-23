import { BlurFade, Card } from "signal-ds";

export const Paragraph = () => (
  <div className="rounded-lg bg-bg p-6 font-sans text-fg">
    <BlurFade>
      <p className="m-0 max-w-[52ch] font-display text-xl font-normal leading-[1.4] tracking-tight text-fg-strong">
        I'm passionate about programming and building digital solutions that hold up in the real world.
      </p>
    </BlurFade>
  </div>
);

export const Staggered = () => (
  <div className="rounded-lg bg-bg p-6 font-sans text-fg">
    <div className="flex max-w-[420px] flex-col gap-3">
      {["Master's in AI + building Safe Media AI", "Interpretable ML · document security", "Fullstack · Cloud · DevOps · IaC"].map(
        (line, i) => (
          <BlurFade key={line} delay={i * 0.08}>
            <Card pad="sm">
              <span className="text-sm text-fg-muted">{line}</span>
            </Card>
          </BlurFade>
        )
      )}
    </div>
  </div>
);
