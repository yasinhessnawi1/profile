/* ============================================================
   SCENE — renderer, post, camera controls, neural network,
   picking, intro, render loop. Stations live in lab.js.
   ============================================================ */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { buildLab, PAL } from './lab.js';

// 'sky' = network hangs above the lab; 'board' = network mounted on a display board in the lab
const BOARD = (window.GATE_NET || new URLSearchParams(location.search).get('net')) === 'board';

const V3 = THREE.Vector3;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------- Neural network ---------------- */
const OUT = ['physgate', 'openpersona', 'glive', 'declassifai', 'safemedia', 'rlcc', 'tsetlin', 'personarag'];
function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

function buildNetwork(scene, C) {
  const LAYERS = [7, 10, 12, 10, 8], LX = [-9, -4.5, 0, 4.5, 9], C0 = new V3(0, 0, 0), NC = new V3(-5.6, 8.9, -10.6);
  const SC = BOARD ? 0.36 : 1, BC = new V3(-9.4, 2.75, -1.5), BYAW = 0.9, BN = new V3(Math.sin(BYAW), 0, Math.cos(BYAW));
  const group = new THREE.Group(); scene.add(group);
  if (BOARD) {
    group.position.copy(BC).addScaledVector(BN, 0.2); group.rotation.y = BYAW;
    const board = new THREE.Group(); board.position.copy(BC); board.rotation.y = BYAW; scene.add(board);
    const ink = new THREE.MeshPhysicalMaterial({ color: 0x0d1324, roughness: 0.2, metalness: 0.4, clearcoat: 1, clearcoatRoughness: 0.1 }), lab = new THREE.MeshPhysicalMaterial({ color: PAL.lab, roughness: 0.45, clearcoat: 0.4 });
    const gm = (k, c = PAL.cyan) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), toneMapped: false });
    const mk = (g, m, x, y, z, p = board) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
    mk(new RoundedBoxGeometry(7.5, 3.8, 0.12, 3, 0.06), ink, 0, 0, -0.02);
    mk(new RoundedBoxGeometry(7.32, 3.62, 0.03, 2, 0.02), new THREE.MeshBasicMaterial({ color: 0x03060e }), 0, 0, 0.045);
    const fr = [[-3.72, -1.87], [3.72, -1.87], [3.72, 1.87], [-3.72, 1.87], [-3.72, -1.87]].map(([x, y]) => new V3(x, y, 0.07));
    board.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(fr), new THREE.LineBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(1.8), toneMapped: false })));
    [[-3.72, 1.87, 1, -1], [3.72, 1.87, -1, -1], [-3.72, -1.87, 1, 1], [3.72, -1.87, -1, 1]].forEach(([x, y, sx, sy]) => { mk(new THREE.BoxGeometry(0.4, 0.035, 0.03), gm(3), x + sx * 0.2, y, 0.08); mk(new THREE.BoxGeometry(0.035, 0.4, 0.03), gm(3), x, y + sy * 0.2, 0.08); });
    // slim dark stand on a glowing plinth
    [-2.9, 2.9].forEach((x) => { mk(new RoundedBoxGeometry(0.1, 0.95, 0.1, 2, 0.04), ink, x, -2.35, -0.06); });
    const pl = mk(new RoundedBoxGeometry(6.6, 0.1, 0.9, 2, 0.05), ink, 0, -BC.y + 0.1, -0.06); void pl;
    mk(new THREE.BoxGeometry(6.4, 0.012, 0.012), gm(2.2), 0, -BC.y + 0.155, 0.4);
    // header + layer labels
    const lc = document.createElement('canvas'); lc.width = 1024; lc.height = 64; const lg = lc.getContext('2d');
    lg.font = '500 26px "JetBrains Mono", monospace'; lg.textBaseline = 'middle'; lg.fillStyle = '#8fd6ff'; lg.fillText('NEURAL NET · 5 LAYERS · LIVE', 6, 32); lg.textAlign = 'right'; lg.fillStyle = '#5f6d90'; lg.fillText('7 · 10 · 12 · 10 · 8', 1018, 32);
    const lt = new THREE.CanvasTexture(lc); lt.colorSpace = THREE.SRGBColorSpace;
    mk(new THREE.PlaneGeometry(6.6, 0.41), new THREE.MeshBasicMaterial({ map: lt, transparent: true, toneMapped: false, depthWrite: false }), 0, 2.15, 0.06).castShadow = false;
    const ll = document.createElement('canvas'); ll.width = 1024; ll.height = 48; const l2 = ll.getContext('2d');
    l2.font = '500 22px "JetBrains Mono", monospace'; l2.textBaseline = 'middle'; l2.fillStyle = '#6f7c9c'; l2.textAlign = 'center';
    ['INPUT', 'HIDDEN', 'HIDDEN', 'HIDDEN', 'OUTPUT · PROJECTS'].forEach((s, i) => l2.fillText(s, 512 + (LX[i] * SC / 7.32) * 1024 * 1.0, 24));
    const ltt = new THREE.CanvasTexture(ll); ltt.colorSpace = THREE.SRGBColorSpace;
    mk(new THREE.PlaneGeometry(7.32, 0.34), new THREE.MeshBasicMaterial({ map: ltt, transparent: true, toneMapped: false, depthWrite: false }), 0, -1.63, 0.07).castShadow = false;
  } else { group.position.copy(NC); group.rotation.y = 0.5; }
  let s = 11; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const nodes = [], layer = [];
  LAYERS.forEach((n, l) => {
    const ids = [];
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1) - 0.5, x = LX[l] + (rnd() - 0.5) * 0.7;
      const y = u * n * 0.62 + (rnd() - 0.5) * 0.3;
      const z = BOARD ? rnd() * 0.08 : -Math.cos(u * Math.PI) * 1.6 + (rnd() - 0.5) * 0.9 + (x / 9.5) ** 2 * 2.8;
      ids.push(nodes.length); nodes.push({ p: new V3(C0.x + x * SC, C0.y + y * SC * (BOARD ? 1.12 : 1), C0.z + z), l, act: 0, hl: 0, tgt: 0 });
    }
    layer.push(ids);
  });
  const edges = [], out = nodes.map(() => []), emap = new Map();
  for (let l = 0; l < 4; l++) for (const a of layer[l]) for (const b of layer[l + 1]) {
    const e = edges.length; edges.push({ a, b, len: nodes[a].p.distanceTo(nodes[b].p), hl: 0, tgt: 0, fl: 0 }); out[a].push(e); emap.set(a + '-' + b, e);
  }

  const CY = new THREE.Color(PAL.cyan), GR = new THREE.Color(PAL.green), tmpC = new THREE.Color();
  const nodeMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(BOARD ? 0.095 : 0.17, 18, 12), new THREE.MeshBasicMaterial({ toneMapped: false }), nodes.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new V3();
  nodes.forEach((n, i) => { sc.setScalar(n.l === 4 ? 1.35 : n.l === 0 ? 0.8 : 1); m4.compose(n.p, q, sc); nodeMesh.setMatrixAt(i, m4); nodeMesh.setColorAt(i, CY); });
  nodeMesh.computeBoundingSphere(); group.add(nodeMesh);

  const pos = new Float32Array(edges.length * 6), col = new Float32Array(edges.length * 6);
  edges.forEach((e, i) => { nodes[e.a].p.toArray(pos, i * 6); nodes[e.b].p.toArray(pos, i * 6 + 3); });
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); lg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  group.add(lines);

  const MAXP = 180;
  const pulseMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(BOARD ? 0.05 : 0.075, 10, 8), new THREE.MeshBasicMaterial({ toneMapped: false }), MAXP);
  pulseMesh.frustumCulled = false; pulseMesh.count = 0; group.add(pulseMesh);
  const pulses = [];

  // output-neuron hit targets
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const outputs = layer[4].map((ni, k) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(BOARD ? 0.3 : 0.6, 8, 6), hitMat); m.position.copy(nodes[ni].p);
    m.userData = { neuron: k, project: OUT[k] }; group.add(m); return { mesh: m, node: ni, project: OUT[k] };
  });

  function pathFor(key) {
    let h = hash(key); const r = () => ((h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0) / 4294967296);
    const o = OUT.indexOf(key); const p = [];
    for (let l = 0; l < 4; l++) p.push(layer[l][Math.floor(r() * layer[l].length)]);
    p.push(layer[4][o >= 0 ? o : hash(key) % 8]);
    const es = []; for (let i = 0; i < 4; i++) es.push(emap.get(p[i] + '-' + p[i + 1]));
    return { nodes: p, edges: es };
  }
  let active = [], pathT = 0, curKey = null;
  function setHighlight(key) {
    if (key === curKey) return; curKey = key;
    let keys = [];
    if (key) {
      if (key.startsWith('cat:')) keys = C.order.filter((id) => C.P[id].cat === key.slice(4));
      else if (key.startsWith('multi:')) keys = key.slice(6).split(',');
      else keys = [key];
    }
    active = keys.map(pathFor);
    nodes.forEach((n) => (n.tgt = 0)); edges.forEach((e) => (e.tgt = 0));
    active.forEach((p) => { p.nodes.forEach((n) => (nodes[n].tgt = 1)); p.edges.forEach((e) => (edges[e].tgt = 1)); });
    pathT = 1;
  }
  function spawn(e, path) { if (pulses.length < MAXP) pulses.push({ e, t: 0, path, pi: 0 }); edges[e].fl = 1; }
  let acc = 0;
  function update(dt, t, rate = 6, speed = 7) {
    if (!BOARD) group.position.y = NC.y + Math.sin(t * 0.25) * 0.18;
    speed *= SC;
    acc += dt * rate;
    while (acc >= 1) { acc--; const a = layer[0][Math.floor(Math.random() * layer[0].length)]; spawn(out[a][Math.floor(Math.random() * out[a].length)], null); }
    if (active.length) { pathT += dt; if (pathT > 0.32) { pathT = 0; active.forEach((p) => spawn(p.edges[0], p.edges)); } }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i]; p.t += (dt * speed) / edges[p.e].len;
      if (p.t >= 1) {
        const b = edges[p.e].b; nodes[b].act = Math.min(1.6, nodes[b].act + 0.7);
        if (p.path) { if (++p.pi < p.path.length) { p.e = p.path[p.pi]; p.t = 0; edges[p.e].fl = 1; continue; } }
        else if (out[b].length && Math.random() < 0.7) { p.e = out[b][Math.floor(Math.random() * out[b].length)]; p.t = 0; edges[p.e].fl = 1; continue; }
        pulses.splice(i, 1);
      }
    }
    const k = 1 - Math.exp(-dt * 6);
    nodes.forEach((n, i) => {
      n.hl += (n.tgt - n.hl) * k; n.act *= Math.exp(-dt * 2.4);
      tmpC.copy(CY).multiplyScalar(0.42 + n.act * 2.6 + n.hl * 2.4); nodeMesh.setColorAt(i, tmpC);
    });
    nodeMesh.instanceColor.needsUpdate = true;
    edges.forEach((e, i) => {
      e.hl += (e.tgt - e.hl) * k; e.fl *= Math.exp(-dt * 1.6);
      const v = 0.06 + e.hl * 0.95 + e.fl * 0.16;
      for (let j = 0; j < 2; j++) { col[i * 6 + j * 3] = CY.r * v; col[i * 6 + j * 3 + 1] = CY.g * v; col[i * 6 + j * 3 + 2] = CY.b * v; }
    });
    lg.attributes.color.needsUpdate = true;
    pulses.forEach((p, i) => {
      const e = edges[p.e]; sc.setScalar(p.path ? 1.25 : 1);
      m4.compose(tmpV.lerpVectors(nodes[e.a].p, nodes[e.b].p, p.t), q, sc); pulseMesh.setMatrixAt(i, m4);
      pulseMesh.setColorAt(i, tmpC.copy(p.path ? GR : CY).multiplyScalar(p.path ? 3.2 : 3.6));
    });
    pulseMesh.count = pulses.length; pulseMesh.instanceMatrix.needsUpdate = true; if (pulseMesh.instanceColor) pulseMesh.instanceColor.needsUpdate = true;
  }
  const tmpV = new V3();
  function flashNode(i) { nodes[i].act = 2.5; out[i].forEach((e) => (edges[e].fl = 1)); }
  function nodeWorld(i, v = new V3()) { return group.localToWorld(v.copy(nodes[i].p)); }
  function burst(n = 20) { for (let i = 0; i < n; i++) { const a = layer[0][Math.floor(Math.random() * layer[0].length)]; spawn(out[a][Math.floor(Math.random() * out[a].length)], null); } }
  const toWorld = (x, y, z) => { group.updateMatrixWorld(); return group.localToWorld(new V3(x, y, z)); };
  const hub = BOARD ? new V3(BC.x, 0, BC.z).addScaledVector(BN, 0.6) : new V3(-6.9, 0, -6.6);
  return { group, nodes, layer, outputs, update, setHighlight, flashNode, nodeWorld, burst, toWorld, hub, board: BOARD };
}

/* ---------------- Boot ---------------- */
// Returns the scene's control surface (highlight, onPanel, step, … dispose), or null if
// disposed while loading. Every listener hangs off one AbortController so dispose() is total.
export async function start({ ui, content, replay, fonts, signal: abortSignal }) {
  const UI = ui;
  const canvas = document.getElementById('c');
  const ac = new AbortController(), signal = ac.signal;
  let disposed = false;
  abortSignal?.addEventListener('abort', () => { disposed = true; }, { once: true });
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: /[?&]shot\b/.test(location.search) });
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let W = innerWidth, H = innerHeight;
  renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAL.ink); scene.fog = new THREE.FogExp2(PAL.ink, 0.0105);
  const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 220);

  // lights: cool ambience, one warm key, cool rim
  scene.add(new THREE.HemisphereLight(0xc4d0ea, 0x1a2036, 0.95));
  const key = new THREE.DirectionalLight(0xffe4c6, 1.7); key.position.set(9, 17, 9); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 50 });
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.025; key.shadow.radius = 4; scene.add(key);
  const rim = new THREE.DirectionalLight(0x5bc8ff, 0.45); rim.position.set(-12, 7, -10); scene.add(rim);
  const fill = new THREE.PointLight(0x5bc8ff, 18, 26, 2); fill.position.set(0, 7, -9); scene.add(fill);

  const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt); composer.setPixelRatio(dpr); composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.6, 0.55, 1.45); composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const bail = () => { composer.dispose(); rt.dispose(); renderer.dispose(); return null; };

  // dust
  { const n = 420, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { p[i * 3] = (Math.random() - 0.5) * 90; p[i * 3 + 1] = Math.random() * 40 - 12; p[i * 3 + 2] = (Math.random() - 0.5) * 90; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x3a5a8a, size: 0.09, sizeAttenuation: true, transparent: true, opacity: 0.7, depthWrite: false }))); }

  await Promise.race([Promise.all([document.fonts.load(`600 40px ${fonts.display}`), document.fonts.load(`500 30px ${fonts.mono}`)]).catch(() => {}), sleep(2500)]);
  if (disposed) return bail();

  const net = buildNetwork(scene, content);
  const lab = await buildLab({ scene, camera, UI, net, renderer, content, replay, fonts });
  if (disposed) return bail();

  /* ---------------- Camera controller ---------------- */
  const HOME = { theta: 0.74, phi: 1.0, r: BOARD ? 29 : 35 };
  const LIM = { tMin: HOME.theta - 1.0, tMax: HOME.theta + 0.85, pMin: 0.55, pMax: 1.27, rMin: 8.5, rMax: 42 };
  const freeTarget = (r, v = new V3()) => v.set(0, 0.9, 0.8).lerp(BOARD ? new V3(-1.0, 1.6, -1.0) : new V3(-0.4, 3.3, -2.2), smooth(9, HOME.r, r));
  const cur = { theta: HOME.theta, phi: HOME.phi, r: HOME.r, target: freeTarget(HOME.r) };
  const des = { theta: HOME.theta, phi: HOME.phi, r: HOME.r };
  let mode = 'free', fly = null, locked = false, saved = null, par = new THREE.Vector2(), parT = new THREE.Vector2(), parAmt = 0;
  function sph(theta, phi, r, target, out = new V3()) { return out.set(target.x + r * Math.sin(phi) * Math.sin(theta), target.y + r * Math.cos(phi), target.z + r * Math.sin(phi) * Math.cos(theta)); }
  function applyCam() {
    const th = cur.theta + par.x * 0.035 * parAmt, ph = cur.phi - par.y * 0.03 * parAmt;
    sph(th, ph, cur.r, cur.target, camera.position); camera.lookAt(cur.target);
  }
  function panelOffset(st) { // shift target so the object sits left of the right-hand panel
    if (st.panel === 'fan' || innerWidth < 900) return new V3();
    const frac = Math.min(560, innerWidth * 0.42) / innerWidth;
    const half = st.view.r * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    return new V3(Math.cos(st.view.theta), 0, -Math.sin(st.view.theta)).multiplyScalar(frac * half);
  }
  function flyTo(to, cb, dur = 0.8) { mode = 'fly'; fly = { t: 0, dur, from: { theta: cur.theta, phi: cur.phi, r: cur.r, target: cur.target.clone() }, to, cb }; }
  function updateCam(dt) {
    parAmt += ((locked || mode !== 'free' ? 0 : 1) - parAmt) * (1 - Math.exp(-dt * 3));
    par.lerp(parT, 1 - Math.exp(-dt * 4));
    if (mode === 'fly') {
      fly.t += dt; const k = ease(clamp(fly.t / fly.dur, 0, 1));
      cur.theta = THREE.MathUtils.lerp(fly.from.theta, fly.to.theta, k); cur.phi = THREE.MathUtils.lerp(fly.from.phi, fly.to.phi, k);
      cur.r = THREE.MathUtils.lerp(fly.from.r, fly.to.r, k); cur.target.lerpVectors(fly.from.target, fly.to.target, k);
      if (fly.t >= fly.dur) { const cb = fly.cb; mode = fly.to.free ? 'free' : 'focus'; fly = null; cb && cb(); }
    } else if (mode === 'free') {
      const k = 1 - Math.exp(-dt * 7);
      cur.theta += (des.theta - cur.theta) * k; cur.phi += (des.phi - cur.phi) * k; cur.r += (des.r - cur.r) * k;
      freeTarget(cur.r, cur.target);
    }
    applyCam();
  }

  /* ---------------- Picking ---------------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const hitList = () => [...lab.hotspots, ...lab.cardHits(), ...net.outputs.map((o) => o.mesh)];
  function pick() {
    ray.setFromCamera(ndc, camera);
    const a = ray.intersectObjects(lab.agentMeshes, false)[0];
    if (a) return { kind: 'agent', agent: a.object.userData.agent, station: 'agent', label: UI.stationLabel('agent') };
    const hits = ray.intersectObjects(hitList(), false); if (!hits.length) return null;
    let h = hits[0].object.userData;
    if (h.station === 'gate') { const ring = hits.find((x) => x.object.userData.ring != null); if (ring) h = ring.object.userData; }
    if (h.neuron != null) return { kind: 'neuron', project: h.project, key: h.project, label: UI.L().projects[h.project].title };
    if (h.card) return { kind: 'card', project: h.project, key: h.project, station: 'card', label: `${UI.stationLabel('card')} · ${UI.L().projects[h.project].title}` };
    const st = lab.stationMap[h.station];
    const label = h.ring != null ? `${UI.L().ui.check} ${h.ring + 1} · ${UI.L().ui.checks[h.ring]}` : UI.stationLabel(h.station);
    return { kind: 'station', station: h.station, key: st.hl, label };
  }
  const labelEl = document.getElementById('label');
  let hover = null, kbHover = null;
  function setHover(h, at) {
    hover = h;
    const src = h || kbHover;
    lab.setHover(src && (src.station || null));
    if (!UI.isOpen()) net.setHighlight(src ? src.key || null : null);
    if (src) {
      labelEl.textContent = src.label; labelEl.classList.add('show');
      if (at) { labelEl.style.transform = `translate(${at.x}px, ${at.y - 22}px) translate(-50%, -100%)`; }
    } else labelEl.classList.remove('show');
    canvas.style.cursor = h ? (h.kind === 'agent' ? 'grab' : 'pointer') : 'grab';
  }

  function activate(target) {
    if (!target || locked) return;
    setHover(null); kbHover = null; labelEl.classList.remove('show');
    if (target.kind === 'neuron') { UI.openStation('project', target.project); return; }
    const sid = target.kind === 'card' ? 'gate' : target.kind === 'agent' ? 'dome' : target.station;
    const st = lab.stationMap[sid];
    if (!saved && mode === 'free') saved = { theta: des.theta, phi: des.phi, r: des.r };
    locked = true;
    const to = { theta: st.view.theta, phi: st.view.phi, r: st.view.r, target: st.focus.clone().add(panelOffset(st)) };
    flyTo(to, () => { locked = false; UI.openStation(target.kind === 'card' ? 'project' : sid, target.project); locked = true; });
  }

  /* ---------------- Pointer input ---------------- */
  const pts = new Map(); let drag = null, lastMove = null, introOn = false;
  const setNDC = (x, y) => ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
  canvas.addEventListener('pointerdown', (e) => {
    if (locked || introOn) return;
    canvas.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) { const [a, b] = [...pts.values()]; drag = { type: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y), r0: des.r }; return; }
    setNDC(e.clientX, e.clientY); const h = pick();
    if (h && h.kind === 'agent' && e.button === 0) { drag = { type: 'agent', i: h.agent, sx: e.clientX, sy: e.clientY, moved: 0, h }; lab.dragStart(h.agent); canvas.style.cursor = 'grabbing'; return; }
    drag = { type: 'orbit', lx: e.clientX, ly: e.clientY, moved: 0, h, pt: e.pointerType };
  }, { signal });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') parT.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!drag) { lastMove = { x: e.clientX, y: e.clientY, pt: e.pointerType }; return; }
    if (drag.type === 'pinch' && pts.size === 2) { const [a, b] = [...pts.values()]; des.r = clamp(drag.r0 * (drag.d0 / Math.max(20, Math.hypot(a.x - b.x, a.y - b.y))), LIM.rMin, LIM.rMax); return; }
    if (drag.type === 'orbit') {
      const dx = e.clientX - drag.lx, dy = e.clientY - drag.ly; drag.lx = e.clientX; drag.ly = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.moved > 5) { des.theta = clamp(des.theta - dx * 0.0052, LIM.tMin, LIM.tMax); des.phi = clamp(des.phi - dy * 0.0042, LIM.pMin, LIM.pMax); canvas.style.cursor = 'grabbing'; if (hover) setHover(null); }
    } else if (drag.type === 'agent') {
      drag.moved += Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy); drag.sx = e.clientX; drag.sy = e.clientY;
      setNDC(e.clientX, e.clientY); ray.setFromCamera(ndc, camera);
      if (lab.dragMove(ray.ray) === 'blocked') { drag = null; canvas.style.cursor = 'grab'; }
    }
  }, { signal });
  const endPointer = (e) => {
    pts.delete(e.pointerId);
    if (!drag) return;
    const d = drag; drag = null; canvas.style.cursor = 'grab';
    if (d.type === 'agent') { lab.dragEnd(); if (d.moved < 6) activate(d.h); return; }
    if (d.type === 'orbit' && d.moved <= 5 && e.type === 'pointerup') {
      setNDC(e.clientX, e.clientY); const h = pick(); if (!h) { setHover(null); return; }
      const same = hover && hover.label === h.label;
      if (d.pt !== 'mouse' && !same) { setHover(h, { x: e.clientX, y: e.clientY }); return; } // first tap shows label
      activate(h);
    }
  };
  canvas.addEventListener('pointerup', endPointer, { signal }); canvas.addEventListener('pointercancel', endPointer, { signal });
  canvas.addEventListener('pointerleave', () => { if (!drag) { lastMove = null; setHover(null); parT.set(0, 0); } }, { signal });
  canvas.addEventListener('wheel', (e) => { if (locked || introOn) return; e.preventDefault(); des.r = clamp(des.r * (1 + clamp(e.deltaY, -120, 120) * 0.0011), LIM.rMin, LIM.rMax); }, { passive: false, signal });

  /* ---------------- Keyboard hotspots ---------------- */
  const hsWrap = document.getElementById('hotspots');
  const buttons = lab.stations.map((st, i) => {
    const b = document.createElement('button'); b.className = 'hs'; b.type = 'button'; b.dataset.st = st.id;
    b.setAttribute('aria-label', UI.stationLabel(st.id));
    b.addEventListener('focus', () => { kbIdx = i; kbHover = { kind: 'station', station: st.id, key: st.hl, label: UI.stationLabel(st.id), anchor: st.anchor }; setHover(hover); });
    b.addEventListener('blur', () => { kbHover = null; setHover(hover); });
    b.addEventListener('click', () => activate({ kind: 'station', station: st.id, key: st.hl }));
    hsWrap.appendChild(b); return b;
  });
  let kbIdx = -1;
  const proj = new V3();
  function updateHotspots() {
    buttons.forEach((b, i) => {
      proj.copy(lab.stations[i].anchor).project(camera);
      const vis = proj.z < 1 && Math.abs(proj.x) < 1.1 && Math.abs(proj.y) < 1.1;
      b.style.visibility = vis ? 'visible' : 'hidden';
      b.style.transform = `translate(${(proj.x * 0.5 + 0.5) * innerWidth}px, ${(-proj.y * 0.5 + 0.5) * innerHeight}px) translate(-50%, -50%)`;
      if (kbHover && kbHover.station === lab.stations[i].id) labelEl.style.transform = `translate(${(proj.x * 0.5 + 0.5) * innerWidth}px, ${(-proj.y * 0.5 + 0.5) * innerHeight - 26}px) translate(-50%, -100%)`;
    });
  }

  /* ---------------- Public API for UI ---------------- */
  let paused = UI.mode !== '3d', introSkip = null;
  const gate = {
    highlight(key) { net.setHighlight(key); },
    onPanel(open) {
      document.body.classList.toggle('scene-locked', open);
      if (open) { locked = true; setHover(null); return; }
      locked = false;
      if (saved) { const s = saved; saved = null; des.theta = s.theta; des.phi = s.phi; des.r = s.r; flyTo({ theta: s.theta, phi: s.phi, r: s.r, target: freeTarget(s.r), free: true }, null, 0.8); }
      else if (mode === 'focus') mode = 'free';
    },
    step(dir) { const n = buttons.length; kbIdx = ((kbIdx < 0 ? (dir > 0 ? -1 : 0) : kbIdx) + dir + n) % n; buttons[kbIdx].focus(); },
    skipIntro() { introSkip && introSkip(); },
    setLang() { lab.setLang(); buttons.forEach((b) => b.setAttribute('aria-label', UI.stationLabel(b.dataset.st))); },
    paperPlane() { lab.paperPlane(); },
    pause(v) { paused = v; if (!v) { last = performance.now(); requestAnimationFrame(frame); } },
    dispose() {
      disposed = true; ac.abort(); buttons.forEach((b) => b.remove());
      composer.dispose(); rt.dispose(); renderer.dispose();
    },
  };

  /* ---------------- Resize / visibility / perf ---------------- */
  function resize() {
    W = innerWidth; H = innerHeight; camera.aspect = W / H; camera.fov = W / H < 1 ? 52 : 40; camera.updateProjectionMatrix();
    renderer.setSize(W, H, false); composer.setPixelRatio(dpr); composer.setSize(W, H); bloom.setSize(W * dpr, H * dpr);
  }
  addEventListener('resize', resize, { signal }); resize();
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !paused) { last = performance.now(); requestAnimationFrame(frame); } }, { signal });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); paused = true; document.getElementById('toList').click(); }, { signal });
  let fpsAcc = 0, fpsN = 0, fpsLock = 0;
  function perf(dt) {
    if (introOn) return; fpsAcc += dt; fpsN++;
    if (fpsAcc > 2) { const fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; if (fps < 45 && dpr > 0.75 && ++fpsLock >= 1) { dpr = Math.max(0.75, dpr - 0.25); renderer.setPixelRatio(dpr); resize(); } }
  }

  /* ---------------- Intro ---------------- */
  const homePos = sph(HOME.theta, HOME.phi, HOME.r, freeTarget(HOME.r));
  const introCurve = BOARD
    ? new THREE.CatmullRomCurve3([net.toWorld(-3.6, 0.1, 0.55), net.toWorld(-1.2, 0.15, 0.7), net.toWorld(1.4, 0.3, 1.4), net.toWorld(3.5, 1.4, 5), new V3(9, 14, 13), homePos], false, 'centripetal')
    : new THREE.CatmullRomCurve3([net.toWorld(-13, 0.3, 0.9), net.toWorld(-6, 0.4, 1.2), net.toWorld(1.5, 0.8, 2.2), net.toWorld(7.5, 2.4, 7), new V3(9, 18, 13), homePos], false, 'centripetal');
  const introLook = BOARD ? net.toWorld(3.6, 0, 0) : net.toWorld(9, 0, 0);
  let intro = null;
  function finishIntro() {
    if (!intro) return; intro = null; introOn = false;
    cur.theta = des.theta = HOME.theta; cur.phi = des.phi = HOME.phi; cur.r = des.r = HOME.r; mode = 'free';
    UI.intro('end'); UI.store.set('gate.introSeen', '1');
  }
  introSkip = finishIntro;
  const seen = UI.store.get('gate.introSeen') === '1';

  /* ---------------- Loop ---------------- */
  let last = performance.now(), t = 0, frameN = 0;
  function frame(now) {
    if (disposed || paused || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    core(dt);
    requestAnimationFrame(frame);
  }
  function core(dt) {
    t += dt; frameN++;
    if (intro) {
      intro.t += dt; const k = clamp(intro.t / intro.dur, 0, 1), e = ease(k);
      camera.position.copy(introCurve.getPoint(e));
      camera.lookAt(new V3().lerpVectors(introLook, freeTarget(HOME.r), smooth(0.3, 0.92, e)));
      if (k > 0.62 && !intro.titled) { intro.titled = true; UI.intro('title'); }
      net.update(dt, t, 34 * (1 - k) + 6, 12 - 5 * k);
      if (k >= 1) finishIntro();
    } else { updateCam(dt); net.update(dt, t); }
    lab.update(dt, t, { locked });
    if (lastMove && lastMove.pt === 'mouse' && !drag && frameN % 2 === 0 && !locked && !introOn) { setNDC(lastMove.x, lastMove.y); setHover(pick(), lastMove); }
    if (!introOn && !locked && UI.mode === '3d') updateHotspots();
    if (frameN % 2 === 0 || lab.bigMove) renderer.shadowMap.needsUpdate = true;
    composer.render(); perf(dt);
  }
  if (/[?&]shot\b/.test(location.search)) { window.Gate = gate; window.Gate._step = (n = 1, dt = 1 / 60) => { for (let i = 0; i < n; i++) core(dt); }; window.Gate._intro = () => { intro = { t: 0, dur: 4.2 }; introOn = true; }; window.Gate._cam = (theta, phi, r, x, y, z) => { mode = 'focus'; Object.assign(cur, { theta, phi, r }); cur.target.set(x, y, z); applyCam(); }; window.Gate._free = () => { mode = 'free'; }; window.Gate._lab = lab; }

  renderer.shadowMap.needsUpdate = true;
  if (!seen) { intro = { t: 0, dur: 4.2 }; introOn = true; UI.intro('start'); net.burst(40); }
  else { applyCam(); UI.intro('end'); }
  UI.ready();
  requestAnimationFrame((n) => { last = n; frame(n); });
  return gate;
}
