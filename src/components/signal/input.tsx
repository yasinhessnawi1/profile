import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

type SharedProps = {
  label?: string;
  hint?: string;
  icon?: IconName;
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  id?: string;
  className?: string;
};

type InputProps = SharedProps &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement> &
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "rows" | "id" | "className"
  >;

export function Input({
  label,
  hint,
  icon,
  multiline = false,
  rows = 4,
  error = false,
  id,
  className,
  ...rest
}: InputProps) {
  const fieldId =
    id ?? (label ? `in-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const fieldCls = cn(
    "peer w-full rounded-md border bg-surface-2 font-sans text-sm leading-normal text-fg outline-none",
    "transition-all duration-fast ease-out",
    "focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-quiet)]",
    error ? "border-danger" : "border-line-strong"
  );
  return (
    <div className={cn("flex flex-col gap-[7px]", className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className="font-mono text-2xs font-medium uppercase tracking-[0.1em] text-fg-subtle"
        >
          {label}
        </label>
      )}
      <div className={cn("relative flex", multiline ? "items-start" : "items-center")}>
        {multiline ? (
          <textarea
            id={fieldId}
            rows={rows}
            className={cn(fieldCls, "resize-y px-[14px] py-3")}
            {...rest}
          />
        ) : (
          <input
            id={fieldId}
            className={cn(fieldCls, "h-11", icon ? "pl-10 pr-[14px]" : "px-[14px]")}
            {...rest}
          />
        )}
        {icon && !multiline && (
          <span className="pointer-events-none absolute left-[14px] flex text-fg-faint peer-focus:text-accent">
            <Icon name={icon} size={17} />
          </span>
        )}
      </div>
      {hint && (
        <span className={cn("font-mono text-2xs", error ? "text-danger" : "text-fg-faint")}>
          {hint}
        </span>
      )}
    </div>
  );
}
