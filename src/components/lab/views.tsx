"use client";

// Panel views for the lab: React ports of the design's renderers, same markup and
// class names (styled by lab.css). Interaction state lives in LabApp.
import { useEffect, useRef, useState } from "react";
import { CONTENT, type Copy, type Lang, type ProjectId } from "./content";
import { REPLAY } from "./replay-r4g2";

const C = CONTENT;
export const CATS = ["safe", "ventures", "research"] as const;
export type Cat = (typeof CATS)[number];
export type Filter = "all" | Cat;
export type Sort = "featured" | "newest" | "az";
export type NotesFilter = "all" | "m" | "b";
type ProjectCopy = { title: string; meta: string; hook: string; body: string; results?: string[]; highlights?: string[] };

const proj = (L: Copy, id: ProjectId) => L.projects[id] as ProjectCopy;
const yrs = (L: Copy, id: ProjectId) => [C.P[id].years, proj(L, id).meta].filter(Boolean).join(" · ");
const Arrow = ({ c = "↗" }: { c?: string }) => <span className="arr" aria-hidden="true">{c}</span>;

function Tags({ tags, big = false }: { tags: string[]; big?: boolean }) {
  return (
    <ul className={big ? "chips big" : "chips"} aria-label="Tags">
      {tags.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}

export function sortIds(ids: ProjectId[], sort: Sort, L: Copy, lang: Lang) {
  if (sort === "featured") return ids.sort((a, b) => C.P[a].featured - C.P[b].featured);
  if (sort === "newest") return ids.sort((a, b) => C.P[b].y - C.P[a].y);
  return ids.sort((a, b) => proj(L, a).title.localeCompare(proj(L, b).title, lang === "no" ? "nb" : "en"));
}

// `fold` (list view): long copy sits behind "Read more", open by default on wide screens
export function ProjectCard({ L, id, heading: H = "h3", fold }: { L: Copy; id: ProjectId; heading?: "h3" | "h4"; fold?: { open: boolean } }) {
  const p = C.P[id], t = proj(L, id), u = L.ui;
  const more = (
    <>
      {t.body && <p className="body">{t.body}</p>}
      {t.results && (
        <div className="results">
          <p className="kicker">{u.results}</p>
          <ul>{t.results.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}
      {t.highlights && (
        <div className="results hl">
          <p className="kicker">{u.ships}</p>
          <ul>{t.highlights.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}
    </>
  );
  return (
    <article className="card" data-hl={id}>
      <div className="card-top">
        <span className="mono yrs">{yrs(L, id)}</span>
        {p.featured <= 2 && <span className="badge">{u.featured}</span>}
      </div>
      <H className="card-title">{t.title}</H>
      <p className="hook">{t.hook}</p>
      {fold && (t.body || t.results || t.highlights) ? (
        <details className="more" open={fold.open}>
          <summary className="mono">{u.more}</summary>
          {more}
        </details>
      ) : more}
      <Tags tags={p.tags} />
      {p.links.length > 0 && (
        <div className="links">
          {p.links.map((l) => (
            <a key={l.href} className="btn ghost" href={l.href} target="_blank" rel="noopener">
              {u.links[l.k]}<span className="mono dim">{l.text}</span><Arrow />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export function SmallerStrip({ L }: { L: Copy }) {
  return (
    <div className="smaller">
      <p className="kicker">{L.ui.smaller}</p>
      <ul>
        {L.smaller.map(([n, d]) => (
          <li key={n}><strong>{n}</strong>{d && <span>{d}</span>}</li>
        ))}
      </ul>
    </div>
  );
}

export function IndexView({ L, lang, filter, sort, onFilter, onSort, onProject }: {
  L: Copy; lang: Lang; filter: Filter; sort: Sort;
  onFilter(f: Filter): void; onSort(s: Sort): void; onProject(id: ProjectId): void;
}) {
  const u = L.ui;
  const ids = sortIds(C.order.filter((id) => filter === "all" || C.P[id].cat === filter), sort, L, lang);
  return (
    <>
      <p className="kicker">{u.count(C.order.length)}</p>
      <h2 className="ptitle" id="panelTitle" tabIndex={-1}>{u.allProjects}</h2>
      <div className="controls">
        <div className="chiprow" role="group" aria-label="Filter">
          {(["all", ...CATS] as Filter[]).map((f) => (
            <button key={f} className="chip" aria-pressed={filter === f} onClick={() => onFilter(f)}>{u.filters[f]}</button>
          ))}
        </div>
        <div className="seg" role="group" aria-label={u.sort.label}>
          <span className="mono dim">{u.sort.label}</span>
          {(["featured", "newest", "az"] as Sort[]).map((s) => (
            <button key={s} aria-pressed={sort === s} onClick={() => onSort(s)}>{u.sort[s]}</button>
          ))}
        </div>
      </div>
      <ul className="rows">
        {ids.map((id) => (
          <li key={id}>
            <button className="row" data-hl={id} onClick={() => onProject(id)}>
              <span className="row-h"><span className="row-t">{proj(L, id).title}</span><span className="mono yrs">{C.P[id].years}</span></span>
              <span className="row-k">{proj(L, id).hook}</span>
              <Tags tags={C.P[id].tags.slice(0, 3)} />
            </button>
          </li>
        ))}
      </ul>
      {(filter === "all" || filter === "research") && <SmallerStrip L={L} />}
    </>
  );
}

export function ProjectView({ L, ids }: { L: Copy; ids: ProjectId[] }) {
  return (
    <>
      <p className="kicker">{L.ui.filters[C.P[ids[0]].cat]}</p>
      <h2 className="sr-only" id="panelTitle" tabIndex={-1}>{ids.map((i) => proj(L, i).title).join(", ")}</h2>
      <div className="stack">{ids.map((id) => <ProjectCard key={id} L={L} id={id} />)}</div>
      {ids.includes("physgate") && (
        <div className="checks">
          <p className="kicker">physgate · 7</p>
          <ol>
            {L.ui.checks.map((c, i) => (
              <li key={c}><span className="mono">{String(i + 1).padStart(2, "0")}</span>{c}</li>
            ))}
          </ol>
        </div>
      )}
      {ids.includes("rlcc") && <Replay L={L} />}
    </>
  );
}

/* ---------------- Tournament replay (real game log) ---------------- */
const GC: Record<string, string> = { red: "#FF5A5F", "lawn green": "#3DDC97", yellow: "#FFC94A", blue: "#4C8DFF", gray0: "#C9CED8", purple: "#A98BFF" };
const hexA = (h: string, a: number) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

export function Replay({ L }: { L: Copy }) {
  const R = REPLAY, u = L.ui.replay, n = R.moves.length;
  const cvRef = useRef<HTMLCanvasElement>(null), seekRef = useRef<HTMLInputElement>(null), lblRef = useRef<HTMLSpanElement>(null);
  const ctl = useRef({ playing: true, speed: 3, seek: (_k: number) => {}, restartIfDone: () => {} });
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(3);
  const uRef = useRef(u); uRef.current = u;
  const rows = R.order.map((c, i) => ({ c, p: R.players[i], f: R.final[i] })).sort((a, b) => b.f.final - a.f.final);

  useEffect(() => {
    const cv = cvRef.current!, g = cv.getContext("2d")!, W = cv.width, H = cv.height, s = W / 17.5;
    const pos = R.cells.map(([q, r]) => [W / 2 + s * (q + r / 2), H / 2 + s * r * 0.866]);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let k = 0, occ = new Map<number, number>(), acc = 0, last = performance.now(), raf = 0;
    ctl.current.playing = !still; setPlaying(!still);
    const build = (m: number) => {
      occ = new Map();
      R.order.forEach((c, ti) => R.cells.forEach((cell, i) => { if (cell[2] === c) occ.set(i, ti); }));
      for (let j = 0; j < m; j++) { const [ti, a, b] = R.moves[j]; occ.delete(a); occ.set(b, ti); }
      k = m;
    };
    function draw() {
      g.clearRect(0, 0, W, H);
      R.cells.forEach((c, i) => { g.fillStyle = c[2] === "board" ? "rgba(233,230,223,0.09)" : hexA(GC[c[2]], 0.2); g.beginPath(); g.arc(pos[i][0], pos[i][1], s * 0.2, 0, 7); g.fill(); });
      if (k > 0) { const [ti, a, b] = R.moves[k - 1]; g.strokeStyle = hexA(GC[R.order[ti]], 0.85); g.lineWidth = 3; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(pos[a][0], pos[a][1]); g.lineTo(pos[b][0], pos[b][1]); g.stroke(); g.setLineDash([]); }
      occ.forEach((ti, i) => { const col = GC[R.order[ti]], mine = R.order[ti] === "yellow"; if (mine) { g.shadowColor = col; g.shadowBlur = 16; } g.fillStyle = col; g.beginPath(); g.arc(pos[i][0], pos[i][1], s * 0.34, 0, 7); g.fill(); g.shadowBlur = 0; });
      if (k > 0) { const b = R.moves[k - 1][2]; g.strokeStyle = "#E9E6DF"; g.lineWidth = 2; g.beginPath(); g.arc(pos[b][0], pos[b][1], s * 0.47, 0, 7); g.stroke(); }
      lblRef.current!.textContent = `${uRef.current.move} ${k} / ${R.moves.length}`;
      seekRef.current!.value = String(k);
    }
    function tick(now: number) {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const c = ctl.current;
      if (c.playing && k < R.moves.length) {
        acc += dt * c.speed * 2.2; let ch = false;
        while (acc >= 1 && k < R.moves.length) { acc--; const [ti, a, b] = R.moves[k++]; occ.delete(a); occ.set(b, ti); ch = true; }
        if (ch) draw();
      } else if (c.playing && (acc += dt) > 4) { acc = 0; build(0); draw(); }
      raf = requestAnimationFrame(tick);
    }
    ctl.current.seek = (m) => { build(m); acc = 0; draw(); };
    ctl.current.restartIfDone = () => { if (k >= R.moves.length) { build(0); draw(); } };
    build(0); draw(); raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [R]);

  return (
    <section className="replay" aria-label={u.title}>
      <p className="kicker">IKT460 · R4G2</p>
      <h3>{u.title}</h3>
      <p className="sub">{u.sub}</p>
      <canvas ref={cvRef} className="rp-board" width={720} height={662} role="img" aria-label={u.title} />
      <div className="rp-ctl">
        <button
          className="btn ghost sm"
          onClick={() => { const v = !ctl.current.playing; ctl.current.playing = v; setPlaying(v); if (v) ctl.current.restartIfDone(); }}
        >
          {playing ? u.pause : u.play}
        </button>
        <input ref={seekRef} type="range" min={0} max={n} defaultValue={0} aria-label={u.move} onInput={(e) => ctl.current.seek(+e.currentTarget.value)} />
        <span ref={lblRef} className="mono">{u.move} 0 / {n}</span>
        <div className="seg" role="group" aria-label={u.speed}>
          {[1, 3, 8].map((v) => (
            <button key={v} aria-pressed={speed === v} onClick={() => { ctl.current.speed = v; setSpeed(v); }}>{v}×</button>
          ))}
        </div>
      </div>
      <ul className="rp-legend">
        {rows.map((x) => (
          <li key={x.c} className={x.c === "yellow" ? "me" : ""}>
            <i style={{ background: GC[x.c] }} />
            <span>{x.p}{x.c === "yellow" && <> <span className="mono">· {u.mine}</span></>}</span>
            <span className="mono">{x.f.pins}/10</span>
            <span className="mono">{x.f.final.toFixed(1)}</span>
          </li>
        ))}
      </ul>
      <p className="rp-src">{u.source}</p>
    </section>
  );
}

function Timeline({ items }: { items: { role: string; org: string; when: string; text: string }[] }) {
  return (
    <ul className="tl">
      {items.map((it) => (
        <li key={it.role + it.when}>
          <div className="tl-h"><strong>{it.role}</strong><span className="mono yrs">{it.when}</span></div>
          <div className="tl-o">{it.org}</div>
          {it.text && <p>{it.text}</p>}
        </li>
      ))}
    </ul>
  );
}

export function AboutView({ L, lang, inList = false }: { L: Copy; lang: Lang; inList?: boolean }) {
  const a = L.about;
  return (
    <>
      {inList ? (
        <h2 className="lv-h">{a.title}</h2>
      ) : (
        <>
          <p className="kicker">{a.title}</p>
          <h2 className="ptitle hero-line" id="panelTitle" tabIndex={-1}>{L.hero}</h2>
          <p className="lead">{L.bio}</p>
        </>
      )}
      <dl className="stats">
        {a.stats.map(([v, k]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <div className="dash">
        <section><h3 className="kicker">{a.now}</h3><Timeline items={a.nowItems} /></section>
        <section><h3 className="kicker">{a.before}</h3><Timeline items={a.beforeItems} /></section>
        <section><h3 className="kicker">{a.education}</h3><Timeline items={a.eduItems} /></section>
        <section><h3 className="kicker">{a.languagesT}</h3><Tags tags={a.languages} big /></section>
        <section className="wide">
          <h3 className="kicker">{a.toolkitT}</h3>
          <dl className="toolkit">
            {a.toolkit.map(([grp, items]) => <div key={grp}><dt className="mono">{grp}</dt><dd><Tags tags={items} /></dd></div>)}
          </dl>
          <p className="dim small">{a.sdd}</p>
        </section>
      </div>
      <a className="btn primary" href={C.cv(lang)} download>{a.resume}<Arrow c="↓" /></a>
    </>
  );
}

export function NotesView({ L, filter, onFilter, inList = false }: { L: Copy; filter: NotesFilter; onFilter(f: NotesFilter): void; inList?: boolean }) {
  const n = L.notesT;
  const list = L.notes.filter((x) => filter === "all" || x.level === filter);
  return (
    <>
      {inList ? (
        <h2 className="lv-h">{n.title}</h2>
      ) : (
        <>
          <p className="kicker">21</p>
          <h2 className="ptitle" id="panelTitle" tabIndex={-1}>{n.title}</h2>
        </>
      )}
      <p className="lead">{n.sub} {n.english && <span className="dim">{n.english}</span>}</p>
      <div className="chiprow" role="group" aria-label="Filter">
        {([["all", n.all], ["m", n.masters], ["b", n.bachelor]] as [NotesFilter, string][]).map(([k, v]) => (
          <button key={k} className="chip" aria-pressed={filter === k} onClick={() => onFilter(k)}>{v}</button>
        ))}
      </div>
      <ul className="notes">
        {list.map((x) => (
          <li key={x.slug}>
            <a href={x.href} target="_blank" rel="noopener">
              <span className="mono yrs">{x.date.slice(0, 7)}</span><span className="nt">{x.title}</span>
              <span className="mono lvl">{x.level === "m" ? n.masters : n.bachelor}</span><Arrow />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

type FieldErr = { name?: string; email?: string; message?: string };

export function ContactView({ L, onSent, inList = false, prefix = "p" }: { L: Copy; onSent(): void; inList?: boolean; prefix?: string }) {
  const c = L.contact;
  const formRef = useRef<HTMLFormElement>(null);
  const [errs, setErrs] = useState<FieldErr>({});
  const [sent, setSent] = useState<null | "api" | "mailto">(null);
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1600); };
    const fallback = () => {
      const t = document.createElement("textarea"); t.value = C.email; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch {}
      t.remove(); done();
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(C.email).then(done, fallback); else fallback();
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget, d = Object.fromEntries(new FormData(f)) as Record<string, string>;
    const next: FieldErr = {
      name: d.name.trim() ? undefined : c.vName,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim()) ? undefined : c.vEmail,
      message: d.message.trim() ? undefined : c.vMsg,
    };
    setErrs(next);
    const bad = (["name", "email", "message"] as const).find((k) => next[k]);
    if (bad) { (f.elements.namedItem(bad) as HTMLElement).focus(); return; }
    let ok = false;
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
      ok = r.ok && ((await r.json()) as { ok?: boolean }).ok === true;
    } catch {}
    if (!ok) {
      const subj = encodeURIComponent(`Hello from ${d.name.trim()}`);
      const body = encodeURIComponent(`${d.message.trim()}\n\n${d.name.trim()} <${d.email.trim()}>`);
      window.location.href = `mailto:${C.email}?subject=${subj}&body=${body}`;
    }
    setSent(ok ? "api" : "mailto"); f.reset(); onSent();
  }

  const field = (k: keyof FieldErr) => ({ "aria-invalid": String(!!errs[k]) as "true" | "false" });
  return (
    <>
      {inList ? (
        <h2 className="lv-h">{c.title}</h2>
      ) : (
        <>
          <p className="kicker">{L.ui.nav.contact}</p>
          <h2 className="ptitle" id="panelTitle" tabIndex={-1}>{c.title}</h2>
        </>
      )}
      <p className="lead">{c.body}</p>
      <div className="email">
        <span className="mono dim">{c.email}</span><a href={`mailto:${C.email}`}>{C.email}</a>
        <button className="btn ghost sm" onClick={copyEmail}>{copied ? c.copied : c.copy}</button>
      </div>
      <form ref={formRef} className="form" noValidate onSubmit={submit}>
        <label htmlFor={`${prefix}-name`}>{c.name}</label>
        <input id={`${prefix}-name`} name="name" autoComplete="name" placeholder={c.namePh} required maxLength={200} {...field("name")} />
        <span className="err">{errs.name}</span>
        <label htmlFor={`${prefix}-email`}>{c.email}</label>
        <input id={`${prefix}-email`} name="email" type="email" autoComplete="email" placeholder={c.emailPh} required maxLength={320} {...field("email")} />
        <span className="err">{errs.email}</span>
        <label htmlFor={`${prefix}-msg`}>{c.message}</label>
        <textarea id={`${prefix}-msg`} name="message" rows={5} placeholder={c.messagePh} required maxLength={5000} {...field("message")} />
        <span className="err">{errs.message}</span>
        {/* honeypot: hidden from people, filled by bots; /api/contact drops those */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
        <button className="btn primary" type="submit">{c.send}<Arrow c="→" /></button>
        <p className="sent" role="status" hidden={!sent}>{sent === "api" ? c.sentApi : c.sent}</p>
      </form>
      <div className="elsewhere">
        <span className="kicker">{c.elsewhere}</span>
        <a className="btn ghost" href={C.linkedin} target="_blank" rel="noopener">LinkedIn<Arrow /></a>
        <a className="btn ghost" href={C.github} target="_blank" rel="noopener">GitHub<Arrow /></a>
      </div>
    </>
  );
}

export function FanView({ L, lang, cat, onClose, onProject }: { L: Copy; lang: Lang; cat: Cat; onClose(): void; onProject(id: ProjectId): void }) {
  const u = L.ui;
  const ids = sortIds(C.order.filter((id) => C.P[id].cat === cat), "featured", L, lang), n = ids.length;
  const sp = Math.round(Math.min(172, (Math.min(window.innerWidth, 1180) - 330) / Math.max(1, n - 1)));
  return (
    <>
      <div className="fan-head">
        <div><p className="kicker">{u.shelf}</p><h2 className="ptitle" id="fanTitle" tabIndex={-1}>{u.filters[cat]}</h2></div>
        <button className="iconbtn" aria-label={u.close} onClick={onClose}>✕</button>
      </div>
      <div className="fan-cards" style={{ "--n": n, "--sp": `${sp}px` } as React.CSSProperties}>
        {ids.map((id, i) => (
          <button
            key={id}
            className="fcard"
            data-hl={id}
            style={{ "--i": i - (n - 1) / 2, "--a": Math.abs(i - (n - 1) / 2) } as React.CSSProperties}
            onClick={() => onProject(id)}
          >
            <span className="mono yrs">{C.P[id].years || "\u00a0"}</span>
            <span className="fc-t">{proj(L, id).title}</span>
            <span className="fc-k">{proj(L, id).hook}</span>
            <Tags tags={C.P[id].tags.slice(0, 3)} />
            <span className="fc-o mono">{u.openProject} →</span>
          </button>
        ))}
      </div>
      {cat === "research" && <SmallerStrip L={L} />}
    </>
  );
}
