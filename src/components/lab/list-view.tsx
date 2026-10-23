"use client";

// The lab's list view: the whole site as one page, phone-first (project rails you
// swipe, "Read more" folds, a section dock). Shown for phones, reduced motion,
// no WebGL, ?list, or "View as list"; always server-rendered so the content is in
// the HTML. Port of the design's renderList + 2D network background.
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CONTENT, type Copy, type Lang, type ProjectId } from "./content";
import {
  AboutView, CATS, ContactView, NotesView, ProjectCard, Replay, SmallerStrip, sortIds,
  type Cat, type NotesFilter,
} from "./views";

const C = CONTENT;
const SECTIONS = ["lv-projects", "lv-about", "lv-notes", "lv-contact"] as const;
const TICKS = CONTENT.en.ui.status.length;

export function ListView({ L, lang, active, webgl, langToggle, notesFilter, onNotesFilter, onOpen3d, onSent }: {
  L: Copy;
  lang: Lang;
  active: boolean;
  webgl: boolean;
  langToggle: React.ReactNode;
  notesFilter: NotesFilter;
  onNotesFilter(f: NotesFilter): void;
  onOpen3d(): void;
  onSent(): void;
}) {
  const u = L.ui;
  const [wide, setWide] = useState(true);
  const [tick, setTick] = useState({ k: 0, out: false });
  const [dock, setDock] = useState<string | null>(null);
  const rail = (cat: Cat): ProjectId[] => sortIds(C.order.filter((id) => C.P[id].cat === cat), "featured", L, lang);

  useEffect(() => { setWide(window.innerWidth > 640); }, []);

  // status ticker
  useEffect(() => {
    if (!active || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t2 = 0;
    const t = window.setInterval(() => {
      setTick((s) => ({ ...s, out: true }));
      t2 = window.setTimeout(() => setTick((s) => ({ k: (s.k + 1) % TICKS, out: false })), 260);
    }, 3200);
    return () => { clearInterval(t); clearTimeout(t2); };
  }, [active]);

  // dock follows the section in view
  useEffect(() => {
    if (!active || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (ents) => ents.forEach((en) => { if (en.isIntersecting) setDock(en.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [active]);

  return (
    <main id="list" tabIndex={-1} hidden={!active}>
      <div className="lv-bar">
        <span className="brand">{u.brand}</span>
        <span className="grow" />
        {langToggle}
      </div>
      <header className="lv-hero">
        <Image className="lv-portrait" src={C.portrait.src} alt={C.portrait.alt} width={204} height={204} sizes="(min-width: 1100px) 204px, 84px" priority />
        <span className="pill"><i />{u.open}</span>
        <p className="kicker">{u.title}</p>
        <h1>{L.hero}</h1>
        <p className="lead">{L.bio}</p>
        <p className="lv-ticker" aria-live="off">
          <i className="dot ok" />
          <span className={tick.out ? "out" : undefined}>{u.status[tick.k]}</span>
        </p>
        <div className="row-btns">
          <a className="btn primary" href="#lv-projects">{u.nav.projects}</a>
          <a className="btn ghost" href="#lv-contact">{u.nav.contact}</a>
          <a className="btn ghost" href={C.cv(lang)} download>{L.about.resume}</a>
        </div>
        {webgl && (
          <button className="lv-3d" id="to3d" onClick={onOpen3d}>
            <span className="lv-3d-hex" aria-hidden="true" />
            <span><strong>{u.view3d}</strong><span className="mono">{u.landscape}</span></span>
            <span className="arr" aria-hidden="true">→</span>
          </button>
        )}
      </header>
      <section id="lv-projects" aria-labelledby="lvp">
        <p className="kicker lv-idx">01</p>
        <h2 className="lv-h" id="lvp">{u.nav.projects}</h2>
        {CATS.map((cat) => (
          <div className="lv-shelf" key={cat}>
            <h3 className="lv-cat">
              <i className={`lv-dot ${cat}`} />{u.filters[cat]}
              <span className="mono dim">{rail(cat).length}</span>
              <span className="lv-swipe mono">{u.swipe} →</span>
            </h3>
            <div className="lv-grid">
              {rail(cat).map((id) => <ProjectCard key={id} L={L} id={id} heading="h4" fold={{ open: wide }} />)}
            </div>
            {cat === "research" && (
              <>
                <SmallerStrip L={L} />
                {active && <Replay L={L} />}
              </>
            )}
          </div>
        ))}
      </section>
      <section id="lv-about"><p className="kicker lv-idx">02</p><AboutView L={L} lang={lang} inList /></section>
      <section id="lv-notes"><p className="kicker lv-idx">03</p><NotesView L={L} filter={notesFilter} onFilter={onNotesFilter} inList /></section>
      <section id="lv-contact"><p className="kicker lv-idx">04</p><ContactView L={L} onSent={onSent} inList prefix="lv" /></section>
      <footer className="lv-foot mono">{u.footer} · © {new Date().getFullYear()}</footer>
      <nav className="lv-dock" aria-label="Sections">
        {SECTIONS.map((id, i) => (
          <a key={id} href={`#${id}`} aria-current={dock === id}>{u.sections[i]}</a>
        ))}
      </nav>
    </main>
  );
}

/* ---------------- 2D network background (list view) ---------------- */
export function NetworkBackground({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const cv = ref.current!, ctx = cv.getContext("2d")!, layers = [5, 8, 9, 8, 5];
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    type Node = { l: number; x: number; y: number; act: number };
    let W = 0, H = 0, nodes: Node[] = [], edges: [number, number][] = [], pulses: { e: number; t: number }[] = [], raf = 0;
    function layout() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
      cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
      const portrait = H > W; nodes = []; edges = [];
      layers.forEach((n, l) => { for (let i = 0; i < n; i++) { const a = (l + 0.5) / layers.length, b = (i + 0.5) / n; nodes.push({ l, x: portrait ? b * W : a * W, y: portrait ? a * H : (0.15 + b * 0.7) * H, act: 0 }); } });
      nodes.forEach((a, i) => nodes.forEach((b, j) => { if (b.l === a.l + 1) edges.push([i, j]); }));
    }
    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(91,200,255,0.06)"; ctx.beginPath();
      edges.forEach(([a, b]) => { ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); });
      ctx.stroke();
      pulses.forEach((p) => { const a = nodes[edges[p.e][0]], b = nodes[edges[p.e][1]]; ctx.fillStyle = "rgba(91,200,255,0.9)"; ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * p.t, a.y + (b.y - a.y) * p.t, 2.2, 0, 7); ctx.fill(); });
      nodes.forEach((n) => { ctx.fillStyle = `rgba(91,200,255,${0.22 + n.act * 0.7})`; ctx.beginPath(); ctx.arc(n.x, n.y, 3 + n.act * 2, 0, 7); ctx.fill(); n.act *= 0.95; });
    }
    function tick() {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      if (Math.random() < 0.06) pulses.push({ e: Math.floor(Math.random() * edges.length), t: 0 });
      pulses = pulses.filter((p) => {
        p.t += 0.012;
        if (p.t < 1) return true;
        const to = edges[p.e][1]; nodes[to].act = 1;
        const nx = edges.map((e, i) => (e[0] === to ? i : -1)).filter((i) => i >= 0);
        if (nx.length && Math.random() < 0.7) { p.e = nx[Math.floor(Math.random() * nx.length)]; p.t = 0; return true; }
        return false;
      });
      draw();
    }
    const onResize = () => { layout(); if (still) draw(); };
    layout();
    addEventListener("resize", onResize);
    if (still) draw(); else tick();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", onResize); };
  }, [active]);
  return <canvas id="bg2d" ref={ref} aria-hidden="true" />;
}
