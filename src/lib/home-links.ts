// Section links from the blog back into the home page, which opens in its list view.
const SECTION = {
  work: "lv-about",
  projects: "lv-projects",
  toolkit: "lv-about",
  contact: "lv-contact",
} as const;

export function homeHref(base: string, id: keyof typeof SECTION | "blog") {
  return id === "blog" ? `${base}/blog` : `${base}/?list#${SECTION[id]}`;
}
