"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  src,
  alt = "",
  initials = "",
  size = 72,
  ring = true,
  status,
  className,
}: {
  src?: string;
  alt?: string;
  initials?: string;
  size?: number;
  ring?: boolean;
  status?: "online" | "away";
  className?: string;
}) {
  const [err, setErr] = useState(false);
  const showImg = src && !err;
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <span
        className={cn(
          "flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-surface-2",
          ring
            ? "border-2 border-transparent shadow-[0_0_0_1.5px_var(--border-signal),0_8px_30px_rgba(0,0,0,0.4)]"
            : "border border-line"
        )}
      >
        {showImg ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote logos without known domains
          <img
            src={src}
            alt={alt}
            onError={() => setErr(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="font-display font-semibold tracking-tight text-fg-muted"
            style={{ fontSize: size * 0.36 }}
          >
            {initials}
          </span>
        )}
      </span>
      {status && (
        <span
          className={cn(
            "absolute rounded-full border-[2.5px] border-bg shadow-[0_0_10px_var(--signal-glow)]",
            status === "away" ? "bg-warning" : "bg-signal-500"
          )}
          style={{
            right: size * 0.03,
            bottom: size * 0.03,
            width: Math.max(10, size * 0.2),
            height: Math.max(10, size * 0.2),
          }}
        />
      )}
    </span>
  );
}
