"use client";

// The Gate: the home page. A 3D lab (three.js, ./scene, loaded lazily and driven
// through `bridge`) with a list view for phones, reduced motion and no WebGL.
import "./lab.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONTENT, type Lang, type ProjectId } from "./content";
import { REPLAY } from "./replay-r4g2";
import { createSound } from "./sound";
import {
  AboutView, ContactView, FanView, IndexView, NotesView, ProjectView,
  type Cat, type Filter, type NotesFilter, type Sort,
} from "./views";
import { ListView, NetworkBackground } from "./list-view";

type View =
  | { view: "index" | "about" | "notes" | "contact" }
  | { view: "project"; arg: ProjectId | ProjectId[] }
  | { view: "fan"; arg: Cat };
type NavView = "index" | "about" | "notes" | "contact";
type Gate = {
  highlight(key: string | null): void;
  onPanel(open: boolean, info?: unknown): void;
  step(dir: number): void;
  skipIntro(): void;
  setLang(): void;
  paperPlane(): void;
  pause(v: boolean): void;
  dispose(): void;
};

const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch {} },
};

// station id -> panel
const STATION_VIEW: Record<string, View> = {
  gate: { view: "project", arg: "physgate" }, dome: { view: "project", arg: "physgate" }, agent: { view: "project", arg: "physgate" },
  redaction: { view: "project", arg: ["declassifai", "safemedia"] }, persona: { view: "project", arg: "openpersona" },
  game: { view: "project", arg: "rlcc" }, hex: { view: "project", arg: "tsetlin" },
  shelf_safe: { view: "fan", arg: "safe" }, shelf_ventures: { view: "fan", arg: "ventures" }, shelf_research: { view: "fan", arg: "research" },
  whiteboard: { view: "about" }, logbook: { view: "notes" }, mailbox: { view: "contact" }, status: { view: "index" },
};

const localePath = (l: Lang) => (l === "no" ? "/no" : "/");
const baseHL = (top?: View) =>
  !top ? null : top.view === "project" ? (Array.isArray(top.arg) ? top.arg[0] : top.arg) : top.view === "fan" ? `cat:${top.arg}` : null;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}
// next/font registers hashed family names; the scene draws canvas text with them
function readFonts() {
  const cs = getComputedStyle(document.body);
  const d = cs.getPropertyValue("--font-display").trim(), m = cs.getPropertyValue("--font-mono").trim();
  return {
    display: `${d ? `${d}, ` : ""}"Space Grotesk", system-ui, sans-serif`,
    mono: `${m ? `${m}, ` : ""}"JetBrains Mono", ui-monospace, monospace`,
  };
}

export function LabApp({ locale }: { locale: Lang }) {
  const [lang, setLangState] = useState<Lang>(locale);
  const L = CONTENT[lang];
  const [mode, setModeState] = useState<"3d" | "list">("3d");
  const [stack, setStack] = useState<View[]>([]);
  const [closing, setClosing] = useState<View | null>(null);
  const [showFor, setShowFor] = useState<"panel" | "fan" | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [notesF, setNotesF] = useState<NotesFilter>("all");
  const [toast, setToast] = useState<{ node: React.ReactNode; show: boolean }>({ node: null, show: false });
  const [inIntro, setInIntro] = useState(false);
  const [introShow, setIntroShow] = useState(false);
  const [skip, setSkip] = useState(false);
  const [loader, setLoader] = useState({ hidden: false, done: false, slow: false, i: 0 });
  const [soundOn, setSoundOn] = useState(false);
  const [webgl, setWebgl] = useState(true);

  const langRef = useRef(lang), modeRef = useRef(mode), stackRef = useRef(stack), inIntroRef = useRef(false);
  const gateRef = useRef<Gate | null>(null);
  const loading = useRef<{ abort: AbortController } | null>(null);
  const started = useRef(false), attempts = useRef(0), lastFocus = useRef<HTMLElement | null>(null);
  const timers = useRef<{ toast?: number; close?: number; intro?: number; loader?: number; slow?: number }>({});
  const pBody = useRef<HTMLDivElement>(null);
  const sound = useMemo(() => createSound(store), []);

  const top = stack[stack.length - 1];
  const shown = top ?? closing;

  /* ---------------- Toast ---------------- */
  const showToast = useCallback((node: React.ReactNode, ms = 2800) => {
    setToast({ node, show: true });
    clearTimeout(timers.current.toast);
    timers.current.toast = window.setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  }, []);

  /* ---------------- Panel stack ---------------- */
  const open = useCallback((v: View, push = false) => {
    const cur = stackRef.current, was = cur.length > 0;
    if (!was) lastFocus.current = document.activeElement as HTMLElement | null;
    const next = push ? [...cur, v] : [v];
    stackRef.current = next;
    setStack(next);
    setClosing(null);
    if (!was) gateRef.current?.onPanel(true, v);
  }, []);
  const close = useCallback(() => {
    const cur = stackRef.current;
    if (!cur.length) return;
    setClosing(cur[cur.length - 1]);
    stackRef.current = [];
    setStack([]);
    setShowFor(null);
    clearTimeout(timers.current.close);
    timers.current.close = window.setTimeout(() => { if (!stackRef.current.length) setClosing(null); }, 260);
    gateRef.current?.highlight(null);
    gateRef.current?.onPanel(false);
    const lf = lastFocus.current;
    if (lf && document.contains(lf)) lf.focus({ preventScroll: true });
  }, []);
  const back = useCallback(() => {
    const cur = stackRef.current;
    if (cur.length > 1) { const next = cur.slice(0, -1); stackRef.current = next; setStack(next); } else close();
  }, [close]);

  // show transition, focus and network highlight whenever the top view changes
  useEffect(() => {
    if (!top) return;
    const kind = top.view === "fan" ? "fan" : "panel";
    const raf = requestAnimationFrame(() => setShowFor(kind));
    const t = window.setTimeout(() => setShowFor(kind), 40);
    document.getElementById(kind === "fan" ? "fanTitle" : "panelTitle")?.focus({ preventScroll: true });
    if (pBody.current) pBody.current.scrollTop = 0;
    gateRef.current?.highlight(baseHL(top));
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [top]);

  /* ---------------- Scene bridge ---------------- */
  const bridge = useMemo(() => ({
    L: () => CONTENT[langRef.current],
    Sound: sound,
    store,
    get mode() { return modeRef.current; },
    isOpen: () => stackRef.current.length > 0,
    stationLabel: (id: string) => (CONTENT[langRef.current].stations as Record<string, string>)[id] || id,
    openStation(id: string, extra?: ProjectId) {
      if (id === "project" || id === "card") { if (extra) open({ view: "project", arg: extra }); return; }
      const v = STATION_VIEW[id];
      if (v) open(v);
    },
    blocked() {
      const n = ++attempts.current, u = CONTENT[langRef.current].ui;
      showToast(<><i className="dot ok" /><span>{u.toast}</span><span className="mono dim">{u.yours}: {n}</span></>);
    },
    intro(state: "start" | "title" | "end") {
      if (state === "start") { setSkip(true); setInIntro(true); inIntroRef.current = true; }
      if (state === "title") setIntroShow(true);
      if (state === "end") {
        setSkip(false); setInIntro(false); inIntroRef.current = false; setIntroShow(true);
        clearTimeout(timers.current.intro);
        timers.current.intro = window.setTimeout(() => setIntroShow(false), 3800);
      }
    },
    ready() {
      started.current = true;
      clearInterval(timers.current.loader);
      setLoader((l) => ({ ...l, done: true }));
      window.setTimeout(() => setLoader((l) => ({ ...l, hidden: true })), 600);
    },
  }), [open, showToast, sound]);

  /* ---------------- Modes ---------------- */
  const setModeRef = useRef<(m: "3d" | "list") => void>(() => {});
  const loadScene = useCallback(() => {
    if (loading.current) return;
    const abort = new AbortController();
    loading.current = { abort };
    setLoader({ hidden: false, done: false, slow: false, i: 0 });
    clearInterval(timers.current.loader);
    timers.current.loader = window.setInterval(() => setLoader((l) => ({ ...l, i: l.i + 1 })), 1100);
    timers.current.slow = window.setTimeout(() => { if (!started.current) setLoader((l) => ({ ...l, slow: true })); }, 15000);
    import("./scene/scene")
      .then((m) => m.start({ ui: bridge, content: CONTENT, replay: REPLAY, fonts: readFonts(), signal: abort.signal }))
      .then((g: Gate | null) => {
        if (abort.signal.aborted) { g?.dispose(); return; }
        gateRef.current = g;
        if (modeRef.current !== "3d") g?.pause(true);
      })
      .catch((e) => {
        console.error(e);
        clearInterval(timers.current.loader);
        setLoader((l) => ({ ...l, hidden: true }));
        setWebgl(false);
        setModeRef.current("list");
      });
  }, [bridge]);

  const setMode = useCallback((m: "3d" | "list") => {
    modeRef.current = m;
    setModeState(m);
    document.documentElement.classList.toggle("gate-list", m === "list");
    if (m === "list") {
      close();
      gateRef.current?.pause(true);
      setLoader((l) => ({ ...l, hidden: true }));
      if (!window.location.hash) window.scrollTo(0, 0);
      requestAnimationFrame(() => document.getElementById("list")?.focus({ preventScroll: true }));
    } else {
      window.scrollTo(0, 0);
      gateRef.current?.pause(false);
      loadScene();
    }
  }, [close, loadScene]);
  setModeRef.current = setMode;

  /* ---------------- i18n (in place, like the design; URL + cookie follow) ---------------- */
  const setLang = useCallback((l: Lang) => {
    if (l === langRef.current) return;
    langRef.current = l;
    setLangState(l);
    document.documentElement.lang = l === "no" ? "nb" : "en";
    document.title = CONTENT[l].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", CONTENT[l].meta.description);
    window.history.replaceState(window.history.state, "", localePath(l) + window.location.search + window.location.hash);
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
    gateRef.current?.setLang();
  }, []);

  /* ---------------- Boot ---------------- */
  useEffect(() => {
    const q = window.location.search;
    const wantList = !/[?&]3d\b/.test(q) && (/[?&]list\b/.test(q)
      || matchMedia("(prefers-reduced-motion: reduce)").matches
      || matchMedia("(max-width: 760px) and (orientation: portrait)").matches);
    if (!hasWebGL()) {
      setWebgl(false);
      setMode("list");
      showToast(CONTENT[langRef.current].ui.noWebgl, 3200);
    } else setMode(wantList ? "list" : "3d");
    const t = timers.current;
    return () => {
      loading.current?.abort.abort();
      loading.current = null;
      gateRef.current?.dispose();
      gateRef.current = null;
      Object.values(t).forEach((id) => { clearTimeout(id); clearInterval(id); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "");
      if (e.key === "Escape") {
        if (stackRef.current.length) { e.preventDefault(); close(); } else if (inIntroRef.current) gateRef.current?.skipIntro();
        return;
      }
      if (typing || stackRef.current.length || modeRef.current !== "3d") return;
      if (["ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); gateRef.current?.step(1); }
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); gateRef.current?.step(-1); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  /* ---------------- Render ---------------- */
  const hl = {
    onMouseOver: (e: React.MouseEvent) => {
      const el = (e.target as Element).closest("[data-hl]");
      if (el) gateRef.current?.highlight(el.getAttribute("data-hl"));
    },
    onMouseOut: (e: React.MouseEvent) => {
      const el = (e.target as Element).closest("[data-hl]");
      if (el && !el.contains(e.relatedTarget as Node | null)) gateRef.current?.highlight(baseHL(stackRef.current[stackRef.current.length - 1]));
    },
    onFocus: (e: React.FocusEvent) => {
      const el = (e.target as Element).closest("[data-hl]");
      if (el) gateRef.current?.highlight(el.getAttribute("data-hl"));
    },
  };
  const openProject = (id: ProjectId) => open({ view: "project", arg: id }, true);
  const panelView = shown && shown.view !== "fan" ? shown : null;
  const fanView = shown && shown.view === "fan" ? shown : null;
  const navCurrent = top?.view;
  const cls = ["gate", mode === "3d" ? "mode-3d" : "mode-list", stack.length ? "panel-open" : "", inIntro ? "in-intro" : ""].filter(Boolean).join(" ");

  const langToggle = (
    <div className="lang" role="group" aria-label={L.ui.langLabel}>
      {(["en", "no"] as Lang[]).map((l) => (
        <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
      ))}
    </div>
  );

  return (
    <div className={cls}>
      <canvas id="c" aria-hidden="true" />
      <NetworkBackground active={mode === "list"} />
      <div id="vignette" />
      <div id="dim" />
      <header className="chrome top">
        <div className="brandwrap">
          <span className="brand">{L.ui.brand}</span>
          <span className="pill"><i /><span>{L.ui.open}</span></span>
        </div>
        <nav className="nav" aria-label="Main">
          {(["index", "about", "notes", "contact"] as NavView[]).map((v) => (
            <button key={v} aria-current={navCurrent === v} onClick={() => open({ view: v })}>
              {L.ui.nav[v === "index" ? "projects" : v === "about" ? "me" : v]}
            </button>
          ))}
          {langToggle}
        </nav>
      </header>
      <div className="chrome bl">
        <p className="hint">{L.ui.hint}</p>
        <button className="linkish" id="toList" onClick={() => setMode("list")}>{L.ui.viewList}</button>
      </div>
      <div className="chrome br">
        <button id="sound" aria-pressed={soundOn} onClick={() => { sound.set(!soundOn); setSoundOn(!soundOn); }}>
          <span className="bars" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>{soundOn ? L.ui.soundOn : L.ui.soundOff}</span>
        </button>
      </div>
      <div id="hotspots" role="group" aria-label="Lab stations" />
      <div id="label" aria-hidden="true" />
      <div id="toast" role="status" aria-live="polite" className={toast.show ? "show" : ""}>{toast.node}</div>
      <div id="intro" className={introShow ? "show" : ""}>
        <h1>{L.ui.title}</h1>
        <p>{L.ui.subtitle}</p>
      </div>
      <button id="skip" hidden={!skip} onClick={() => gateRef.current?.skipIntro()}>{L.ui.skip}</button>
      <div id="loader" hidden={loader.hidden} className={loader.done ? "done" : ""}>
        <div className="ld">
          <div className="ld-net" aria-hidden="true">
            {[3, 4, 5, 4, 2].map((n, col) => (
              <span key={col}>
                {Array.from({ length: n }, (_, i) => <i key={i} style={col ? { animationDelay: `${col * 0.15}s` } : undefined} />)}
              </span>
            ))}
          </div>
          <p id="ldText" aria-live="polite">{L.ui.loader[loader.i % 3]}</p>
          <p id="ldSlow" hidden={!loader.slow}>
            <span>{L.ui.tooLong}</span> · <button className="linkish" id="ldList" onClick={() => setMode("list")}>{L.ui.viewList}</button>
          </p>
        </div>
      </div>
      <aside
        id="panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="panelTitle"
        hidden={!panelView}
        className={showFor === "panel" ? "show" : ""}
      >
        <div className="ph">
          <button id="pBack" hidden={stack.length < 2} onClick={back}>← {L.ui.back}</button>
          <span className="grow" />
          <button id="pClose" aria-label={L.ui.close} onClick={close}>✕</button>
        </div>
        <div id="pBody" ref={pBody} {...hl}>
          {panelView?.view === "index" && (
            <IndexView L={L} lang={lang} filter={filter} sort={sort} onFilter={setFilter} onSort={setSort} onProject={openProject} />
          )}
          {panelView?.view === "project" && <ProjectView L={L} ids={Array.isArray(panelView.arg) ? panelView.arg : [panelView.arg]} />}
          {panelView?.view === "about" && <AboutView L={L} lang={lang} />}
          {panelView?.view === "notes" && <NotesView L={L} filter={notesF} onFilter={setNotesF} />}
          {panelView?.view === "contact" && <ContactView L={L} onSent={() => { sound.plane(); gateRef.current?.paperPlane(); }} />}
        </div>
      </aside>
      <div
        id="fan"
        role="dialog"
        aria-modal="false"
        aria-labelledby="fanTitle"
        hidden={!fanView}
        className={showFor === "fan" ? "show" : ""}
        onClick={(e) => { if ((e.target as HTMLElement).id === "fan") close(); }}
      >
        <div id="fanBody" {...hl}>
          {fanView && <FanView L={L} lang={lang} cat={fanView.arg} onClose={close} onProject={openProject} />}
        </div>
      </div>
      <ListView
        L={L}
        lang={lang}
        active={mode === "list"}
        webgl={webgl}
        langToggle={langToggle}
        notesFilter={notesF}
        onNotesFilter={setNotesF}
        onOpen3d={() => setMode("3d")}
        onSent={() => sound.plane()}
      />
    </div>
  );
}
