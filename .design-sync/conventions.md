# Signal: building with it

Signal is the dark-first design system of Yasin Hessnawi's portfolio site: cool night-blue ink neutrals, one cyan accent, Space Grotesk / Instrument Sans / JetBrains Mono. Components are on `window.SignalDS`. Styling is Tailwind utility classes mapped onto Signal CSS tokens.

## Setup

- No provider is needed. The tokens sit on `:root`, which is the dark theme. Every screen needs a dark surface: put `bg-bg font-sans text-fg` on your root element. Without it, light text such as `text-fg` and Stat values disappears on a white page.
- For the light theme, add the `theme-light` class to `<html>` or to any wrapper. Everything inside re-tokens (paper background, deeper cyan). Never hard-code hex colours.
- The fonts come with the stylesheet (Google Fonts): `font-display` (Space Grotesk), `font-sans` (Instrument Sans, the body default) and `font-mono` (JetBrains Mono).
- Utilities are compiled ahead of time; there is no JIT. Use the families below. Before using any other class, check that it exists in `_ds_bundle.css`. Otherwise use `style={{ color: "var(--text-muted)" }}`.

## Class vocabulary

| Family | Classes |
|---|---|
| Surfaces | `bg-bg` `bg-bg-tint` `bg-surface` `bg-surface-2` `bg-elevated` |
| Text | `text-fg` `text-fg-strong` `text-fg-muted` `text-fg-subtle` `text-fg-faint` `text-fg-inverse` |
| Borders | `border` + `border-line` / `border-line-strong` / `border-line-signal` (1px hairlines) |
| Accent | `bg-accent` `hover:bg-accent-hover` `text-accent` `bg-accent-quiet` `text-accent-foreground` `text-signal-500` |
| Status | `text-danger` `text-warning` `text-info` `text-redact-500` |
| Type | `text-2xs` `text-xs` `text-sm` `text-base` `text-md` `text-lg` `text-xl` `text-2xl` `text-3xl` `text-4xl` `text-5xl` (3xl and up are fluid); `tracking-tight` `tracking-tighter` `tracking-label` |
| Shape | `rounded-xs` `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-pill`; `shadow-sm` `shadow-md` `shadow-lg` `shadow-signal` |
| Motion | `duration-fast` `duration-base` `duration-slow` `ease-out` `ease-spring` |
| Layout | `max-w-container` `max-w-narrow` `max-w-wide`, and Tailwind spacing, flex and grid |

Signal's own classes (plain CSS):

- `display`: hero and section headings, paired with `text-3xl` or `text-4xl`.
- `heading`: smaller display headings.
- `kicker`: a mono uppercase eyebrow.
- `mark-signal`: turns one word of a headline cyan.
- `mark-underline`: a cyan underline.
- `container`, `container-narrow`, `container-wide`: a centred column with the page gutter.
- `section`: vertical section rhythm.
- `bg-dots`, `bg-grid`, `glow-signal`: background textures.
- `prose-signal`: long-form text.

Rules:

- Use one cyan accent per view.
- Cards are `bg-surface border border-line rounded-lg` (or simply `<Card>`).
- Mono uppercase is only for labels, eyebrows and tags. Everything else is sentence case.
- Copy is in the first person, plain and confident, with no emoji.

## Component notes

- `Button`: `href` makes it render an `<a>`. Icons go in `icon` and `iconRight` as `<Icon name="…" size={16} />`.
- Icon names (Icon, Input, SocialLink, Dock, ProjectCard `links`) come from a fixed set of 29, listed in `Icon.d.ts`. They are not arbitrary Lucide names.
- `ResumeCard`: `description` is a single string with items separated by "•". When it is set, the card becomes a button that expands those items as bullets.
- `ProjectCard`: `tags` and `links` are required (pass `[]`). `image` is a 16:9 URL; leave it out to get the placeholder.
- `BlurFade`: its content starts invisible and blur-fades in when scrolled into view. Use `delay` (in seconds) to stagger items.
- `Dock`: a floating nav pill; position it yourself (for example fixed and centred at the bottom of the screen).

## Where the truth lives

- `styles.css` imports `_ds_bundle.css`. That file holds, in order: the `:root` tokens and the `.theme-light` overrides, Signal's own classes, then the compiled utilities. Read it before you style anything.
- Each component's props are in `components/<group>/<Name>/<Name>.d.ts`, with verified examples in `<Name>.prompt.md`.

## Example

```jsx
const { SectionLabel, ProjectCard, Button, Icon } = window.SignalDS;

<section className="container section bg-bg font-sans text-fg">
  <SectionLabel index="03" rule={false} className="mb-3.5">Selected work</SectionLabel>
  <h2 className="display m-0 mb-8 text-3xl font-medium">
    Things I've <span className="mark-signal">built</span>
  </h2>
  <div className="grid gap-5 md:grid-cols-2">
    <ProjectCard
      title="Declassifai"
      dates="2025 – Now"
      image="https://yasinhessnawi.online/dashboard_en.png"
      description="Detects and redacts sensitive information in PDFs."
      tags={["AI/ML", "React", "Python"]}
      links={[{ type: "Website", href: "https://declassifai.com", icon: "globe" }]}
      href="https://declassifai.com"
    />
  </div>
  <div className="mt-8 flex gap-3">
    <Button iconRight={<Icon name="arrow-right" size={16} />} href="#contact">Get in touch</Button>
    <Button variant="outline">View résumé</Button>
  </div>
</section>
```
