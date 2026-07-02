import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class", ".theme-dark"],
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.mdx"],
  corePlugins: { container: false },
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-tint": "var(--bg-tint)",
        surface: { DEFAULT: "var(--surface)", 2: "var(--surface-2)" },
        elevated: "var(--elevated)",
        fg: {
          DEFAULT: "var(--text)",
          strong: "var(--text-strong)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
          faint: "var(--text-faint)",
          inverse: "var(--text-inverse)",
        },
        line: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
          signal: "var(--border-signal)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          press: "var(--accent-press)",
          foreground: "var(--accent-foreground)",
          quiet: "var(--accent-quiet)",
        },
        signal: {
          300: "var(--signal-300)",
          400: "var(--signal-400)",
          500: "var(--signal-500)",
          600: "var(--signal-600)",
          700: "var(--signal-700)",
        },
        redact: {
          400: "var(--redact-400)",
          500: "var(--redact-500)",
          600: "var(--redact-600)",
        },
        ink: {
          990: "var(--ink-990)",
          900: "var(--ink-900)",
          500: "var(--ink-500)",
          "050": "var(--ink-050)",
        },
        paper: "var(--paper)",
        danger: "var(--danger)",
        warning: "var(--warning)",
        info: "var(--info)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "2xs": "var(--text-2xs)",
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        md: "var(--text-md)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        signal: "var(--shadow-signal)",
        inset: "var(--shadow-inset)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "140ms",
        base: "240ms",
        slow: "480ms",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        label: "0.16em",
      },
      maxWidth: {
        container: "1200px",
        narrow: "720px",
        wide: "1360px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
