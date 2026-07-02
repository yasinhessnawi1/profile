import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-pill",
    "font-sans font-semibold leading-none tracking-[-0.01em] no-underline",
    "transition-all duration-fast ease-out",
    "active:translate-y-px active:scale-[0.99]",
    "disabled:cursor-not-allowed disabled:opacity-45"
  ),
  {
    variants: {
      variant: {
        primary:
          "border border-transparent bg-accent text-accent-foreground hover:bg-accent-hover",
        secondary:
          "border border-line-strong bg-surface-2 text-fg hover:bg-elevated hover:border-line-signal",
        outline:
          "border border-line-strong bg-transparent text-fg hover:bg-elevated hover:border-line-signal",
        ghost:
          "border border-transparent bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg",
        "signal-outline":
          "border border-line-signal bg-accent-quiet text-accent hover:bg-elevated",
      },
      size: {
        sm: "h-[34px] gap-[7px] px-[14px] text-sm",
        md: "h-[42px] gap-2 px-5 text-sm",
        lg: "h-[52px] gap-[10px] px-7 text-md",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  href?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler;
  className?: string;
  children?: React.ReactNode;
  "aria-label"?: string;
};

export function Button({
  variant,
  size,
  full,
  icon,
  iconRight,
  href,
  download,
  target,
  rel,
  disabled,
  type = "button",
  onClick,
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cn(buttonVariants({ variant, size, full }), className);
  const content = (
    <>
      {icon}
      {children}
      {iconRight}
    </>
  );
  if (href && !disabled) {
    return (
      <a
        href={href}
        download={download}
        target={target}
        rel={rel}
        onClick={onClick}
        className={cls}
        {...rest}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cls}
      {...rest}
    >
      {content}
    </button>
  );
}
