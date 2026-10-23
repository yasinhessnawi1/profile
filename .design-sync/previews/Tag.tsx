import { Tag } from "signal-ds";

export const States = () => (
  <div className="flex max-w-[640px] flex-wrap items-center gap-2 rounded-lg bg-bg p-6 font-sans text-fg">
    <Tag>PyTorch</Tag>
    <Tag active>Tsetlin Machines</Tag>
    <Tag size="sm">Python</Tag>
    <Tag size="sm" active>
      CUDA
    </Tag>
  </div>
);

export const ToolkitRow = () => (
  <div className="max-w-[720px] rounded-lg bg-bg p-6 font-sans text-fg">
    <div className="grid grid-cols-[180px_1fr] items-baseline gap-[22px] border-b border-line pb-5">
      <div className="font-mono text-xs uppercase tracking-[0.08em] text-fg-subtle">AI / ML</div>
      <div className="flex flex-wrap gap-2">
        {["PyTorch", "Deep Learning", "Neural Networks", "NLP", "Computer Vision", "Tsetlin Machines", "Scikit-learn"].map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>
    </div>
  </div>
);
