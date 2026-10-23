/* ============================================================
   LAB STATIONS — floor, dome + agents, conveyor + gate,
   redaction desk, game table, hex panel, shelves, status display,
   whiteboard, logbook, antenna. Procedural primitives only.
   ============================================================ */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const PAL = { ink: 0x0b1020, lab: 0xe9e6df, cyan: 0x5bc8ff, green: 0x3ddc97, red: 0xff5a5f, amber: 0xffb547, redact: 0x111111 };
const V3 = THREE.Vector3;
// canvas text uses the page's font stacks (next/font family names), passed in to buildLab
let FD = '"Space Grotesk", system-ui, sans-serif', FM = '"JetBrains Mono", ui-monospace, monospace';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

export async function buildLab({ scene, camera, UI, net, renderer, content, replay, fonts }) {
  if (fonts) { FD = fonts.display; FM = fonts.mono; }
  const C = content;
  const L = () => UI.L();
  /* ---------- materials & helpers ---------- */
  const ENV = renderer ? (() => { const pm = new THREE.PMREMGenerator(renderer); const t = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose(); return t; })() : null;
  const M = {
    lab: new THREE.MeshPhysicalMaterial({ color: PAL.lab, roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.35 }),
    lab2: new THREE.MeshPhysicalMaterial({ color: 0xd2cec5, roughness: 0.62, clearcoat: 0.2, clearcoatRoughness: 0.5 }),
    tile: new THREE.MeshPhysicalMaterial({ color: PAL.lab, roughness: 0.68, clearcoat: 0.15, clearcoatRoughness: 0.6 }),
    ink: new THREE.MeshPhysicalMaterial({ color: 0x151c30, roughness: 0.22, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.12 }),
    slat: new THREE.MeshStandardMaterial({ color: 0x2a3350, roughness: 0.4, metalness: 0.4 }),
    black: new THREE.MeshStandardMaterial({ color: PAL.redact, roughness: 0.75 }),
    paper: new THREE.MeshStandardMaterial({ color: 0xf3f1ec, roughness: 0.95 }),
  };
  const glow = (hex, k = 3.4) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), toneMapped: false });
  const CAT = { safe: PAL.cyan, ventures: PAL.amber, research: PAL.green };
  const catMat = Object.fromEntries(Object.entries(CAT).map(([k, v]) => [k, glow(v, 1.0)]));
  const HIT = new THREE.MeshBasicMaterial({ visible: false });
  function rb(w, h, d, r, mat) {
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.max(0.001, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001))), mat);
    m.castShadow = true; m.receiveShadow = true; return m;
  }
  function at(o, x, y, z, parent = scene) { o.position.set(x, y, z); parent.add(o); return o; }
  function canvasTex(w, h) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    return { c, g: c.getContext('2d'), tex, w, h };
  }
  function fitFont(g, text, weight, size, family, maxW) { let s = size; do { g.font = `${weight} ${s}px ${family}`; s -= 2; } while (g.measureText(text).width > maxW && s > 10); return s + 2; }

  const hotspots = [], stations = [], stationMap = {};
  function hitBox(w, h, d, x, y, z, station, extra = {}) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), HIT); m.position.set(x, y, z); m.userData = { station, ...extra }; scene.add(m); hotspots.push(m); return m;
  }
  const beaconGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.04, 6).rotateX(Math.PI / 2);
  function station(id, o) {
    const st = { id, glows: [], hover: 0, panel: 'panel', ...o };
    const bm = glow(PAL.cyan, 2.4); st.beacon = at(new THREE.Mesh(beaconGeo, bm), o.anchor.x, o.anchor.y, o.anchor.z); st.beaconY = o.anchor.y;
    addGlow(st, bm); stations.push(st); stationMap[id] = st; return st;
  }
  function addGlow(st, mat) { st.glows.push({ mat, base: mat.color.clone() }); return mat; }
  const S = (id) => stationMap[id];

  // keyboard / arrow order
  station('gate', { anchor: new V3(2.48, 3.85, 0.6), focus: new V3(2.5, 1.4, 0.6), view: { theta: 0.8, phi: 1.02, r: 10 }, hl: 'physgate' });
  station('dome', { anchor: new V3(-4.6, 3.95, 0.6), focus: new V3(-4.6, 1.1, 0.6), view: { theta: 0.62, phi: 0.98, r: 9.5 }, hl: 'physgate' });
  station('redaction', { anchor: new V3(3.4, 2.2, 5.6), focus: new V3(3.4, 1.15, 5.4), view: { theta: 0.45, phi: 0.9, r: 6.4 }, hl: 'multi:declassifai,safemedia' });
  station('persona', { anchor: new V3(-1.6, 3.2, 6.8), focus: new V3(-1.6, 1.4, 6.8), view: { theta: 0.42, phi: 1.02, r: 6.6 }, hl: 'openpersona' });
  station('game', { anchor: new V3(4.8, 3.3, -3.4), focus: new V3(4.8, 1.0, -3.4), view: { theta: 0.6, phi: 0.88, r: 6.6 }, hl: 'rlcc' });
  station('hex', { anchor: new V3(5.7, 3.55, -7.2), focus: new V3(5.7, 2.15, -7.4), view: { theta: 0.22, phi: 1.28, r: 6.6 }, hl: 'tsetlin' });
  station('shelf_safe', { anchor: new V3(0.55, 2.75, -6.3), focus: new V3(-1.5, 2.6, -6.85), view: { theta: 0.25, phi: 1.2, r: 6.4 }, hl: 'cat:safe', panel: 'fan' });
  station('shelf_ventures', { anchor: new V3(0.55, 1.68, -6.3), focus: new V3(-1.5, 1.7, -6.85), view: { theta: 0.25, phi: 1.2, r: 6.4 }, hl: 'cat:ventures', panel: 'fan' });
  station('shelf_research', { anchor: new V3(0.55, 0.6, -6.3), focus: new V3(-1.5, 1.0, -6.85), view: { theta: 0.25, phi: 1.12, r: 6.4 }, hl: 'cat:research', panel: 'fan' });
  station('status', { anchor: new V3(2.1, 4.0, -7.2), focus: new V3(2.1, 3.25, -7.4), view: { theta: 0.18, phi: 1.3, r: 6 }, hl: 'status' });
  station('whiteboard', { anchor: new V3(-5.3, 3.55, -7.2), focus: new V3(-5.3, 2.3, -7.4), view: { theta: 0.12, phi: 1.3, r: 6.6 }, hl: 'about' });
  station('logbook', { anchor: new V3(-6.6, 3.45, 6.0), focus: new V3(-6.6, 1.75, 6.0), view: { theta: 0.4, phi: 1.12, r: 6.8 }, hl: 'notes' });
  station('mailbox', { anchor: new V3(8.9, 2.45, 3.0), focus: new V3(9.1, 1.9, 2.7), view: { theta: 0.62, phi: 1.12, r: 9.5 }, hl: 'contact' });

  const m4 = new THREE.Matrix4(), tc = new THREE.Color(), tv = new V3();
  const COL = { cyan: new THREE.Color(PAL.cyan), green: new THREE.Color(PAL.green), red: new THREE.Color(PAL.red), amber: new THREE.Color(PAL.amber), lab: new THREE.Color(PAL.lab) };

  /* ================= FLOOR ================= */
  {
    const size = 0.62, N = 11, tiles = [];
    for (let q = -N; q <= N; q++) for (let r = Math.max(-N, -q - N); r <= Math.min(N, -q + N); r++) tiles.push([size * Math.sqrt(3) * (q + r / 2), size * 1.5 * r]);
    const tm = new THREE.InstancedMesh(new THREE.CylinderGeometry(size * 0.94, size * 0.94, 0.1, 6), M.tile, tiles.length);
    tiles.forEach(([x, z], i) => { m4.makeTranslation(x, 0, z); tm.setMatrixAt(i, m4); const v = 0.9 + Math.random() * 0.07; tm.setColorAt(i, tc.setRGB(v, v, v * 0.98)); });
    tm.receiveShadow = true; scene.add(tm);
    const plat = new THREE.Mesh(new THREE.CylinderGeometry(12.6, 12.2, 0.7, 6), M.lab2); plat.rotation.y = Math.PI / 2; plat.receiveShadow = true; at(plat, 0, -0.36, 0);
    const edge = (y, R, k) => { const pts = []; for (let i = 0; i <= 6; i++) { const a = (i / 6) * Math.PI * 2; pts.push(new V3(Math.cos(a) * R, y, Math.sin(a) * R)); } scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(k), toneMapped: false }))); };
    edge(0.0, 12.62, 1.6); edge(-0.71, 12.22, 0.6);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(12.64, 12.64, 0.1, 6, 1, true), M.ink); band.rotation.y = Math.PI / 2; at(band, 0, -0.06, 0);
    edge(-0.12, 12.66, 0.9);
    at(rb(15, 4.2, 0.35, 0.08, M.lab), 0, 2.1, -7.6);
    at(rb(15.1, 0.16, 0.42, 0.04, M.lab2), 0, 0.12, -7.6);
    [-3.45, 4.07].forEach((x) => at(new THREE.Mesh(new THREE.BoxGeometry(0.016, 3.6, 0.016), glow(PAL.cyan, 1.2)), x, 2.15, -7.42));
    at(new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.016, 0.016), glow(PAL.cyan, 1.0)), 0, 4.18, -7.42);
  }

  /* ================= DOME + AGENTS ================= */
  const DC = new V3(-4.6, 0, 0.6), R = 3.4;
  const domeMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(PAL.cyan) }, uHit: { value: new V3(0, -99, 0) }, uHitT: { value: 99 }, uHover: { value: 0 }, uR: { value: R } },
    vertexShader: 'varying vec3 vW; varying vec3 vN; varying vec3 vL; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vL = position; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: `uniform vec3 uColor; uniform vec3 uHit; uniform float uHitT; uniform float uHover; uniform float uR; varying vec3 vW; varying vec3 vN; varying vec3 vL;
      float hexD(vec2 p){ p = abs(p); return max(dot(p, vec2(0.5, 0.8660254)), p.x); }
      void main(){
        vec3 V = normalize(cameraPosition - vW); float f = pow(1.0 - abs(dot(normalize(vN), V)), 3.0);
        vec3 p = normalize(vL); vec2 uv = vec2(atan(p.z, p.x) * uR, asin(clamp(p.y, -1.0, 1.0)) * uR) * 2.2;
        vec2 r = vec2(1.0, 1.7320508), h = r * 0.5; vec2 a = mod(uv, r) - h, b = mod(uv - h, r) - h; vec2 gv = dot(a,a) < dot(b,b) ? a : b;
        float edge = smoothstep(0.40, 0.48, hexD(gv));
        float d = distance(vW, uHit); float hit = exp(-d * d * 0.9) * exp(-uHitT * 1.8);
        float ring = exp(-pow(d - uHitT * 3.2, 2.0) * 5.0) * exp(-uHitT * 1.5);
        float k = edge * 0.03 + f * (0.26 + uHover * 0.45) + edge * (hit * 2.8 + ring * 1.2) + hit * 0.2;
        gl_FragColor = vec4(uColor * k, 1.0);
      }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  {
    const dft = canvasTex(1024, 1024); { const g = dft.g, S2 = 1024 / (2 * R), px = (x, z) => [512 + (z - DC.z) * S2, 512 - (x - DC.x) * S2];
      g.fillStyle = '#c9ced6'; g.fillRect(0, 0, 1024, 1024);
      g.strokeStyle = 'rgba(40,52,84,0.18)'; g.lineWidth = 2; const hs = 34;
      for (let row = -18; row < 18; row++) for (let col = -18; col < 18; col++) { const cx = 512 + col * hs * 1.732 + (row % 2) * hs * 0.866, cy = 512 + row * hs * 1.5; g.beginPath(); for (let k = 0; k <= 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; g.lineTo(cx + Math.cos(a) * hs * 0.96, cy + Math.sin(a) * hs * 0.96); } g.stroke(); }
      g.strokeStyle = 'rgba(40,52,84,0.35)'; g.lineWidth = 3; [0.62, 0.9].forEach((k) => { g.beginPath(); g.arc(512, 512, 512 * k, 0, 7); g.stroke(); });
      g.setLineDash([18, 14]); g.strokeStyle = 'rgba(255,181,71,0.7)'; g.lineWidth = 5; g.beginPath(); g.arc(512, 512, 512 * 0.97, 0, 7); g.stroke(); g.setLineDash([]);
      const pad = (x, z, col) => { const [a, b] = px(x, z); g.fillStyle = 'rgba(20,28,48,0.55)'; g.beginPath(); g.arc(a, b, 46, 0, 7); g.fill(); g.strokeStyle = col; g.lineWidth = 5; g.beginPath(); g.arc(a, b, 46, 0, 7); g.stroke(); g.beginPath(); g.arc(a, b, 30, 0, 7); g.stroke(); };
      [[-6.45, -0.85], [-6.45, -0.1], [-6.45, 0.65]].forEach(([x, z]) => pad(x, z, '#3DDC97')); [[-2.75, 0.05], [-2.75, 1.15]].forEach(([x, z]) => pad(x, z, '#5BC8FF'));
      g.save(); g.translate(512 + 512 * 0.72, 512); g.rotate(Math.PI / 2); g.fillStyle = 'rgba(40,52,84,0.55)'; g.font = '600 30px "JetBrains Mono", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SANDBOX · AGENT FLOOR', 0, 0); g.restore(); dft.tex.needsUpdate = true; }
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.08, 72), [new THREE.MeshStandardMaterial({ color: 0xc9ced6, roughness: 0.6 }), new THREE.MeshPhysicalMaterial({ map: dft.tex, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3 }), new THREE.MeshStandardMaterial({ color: 0xc9ced6 })]); floor.receiveShadow = true; at(floor, DC.x, 0.07, DC.z);
    const ringM = addGlow(S('dome'), glow(PAL.cyan, 2.2)); const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.04, 8, 120), ringM); ring.rotation.x = Math.PI / 2; at(ring, DC.x, 0.12, DC.z);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(R, 72, 36, 0, Math.PI * 2, 0, Math.PI / 2), domeMat); at(dome, DC.x, 0.1, DC.z);
    dome.userData = { station: 'dome' }; hotspots.push(dome);
    // supply rack inside the dome
    const RKx = -7.25, RKz = -0.1;
    [-1, 1].forEach((sz) => [-1, 1].forEach((sx) => at(rb(0.05, 1.3, 0.05, 0.02, M.ink), RKx + sx * 0.22, 0.73, RKz + sz * 0.95)));
    [0.16, 0.6, 1.04].forEach((y, li) => {
      at(rb(0.5, 0.03, 1.94, 0.012, M.ink), RKx, y, RKz);
      at(new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 1.86), glow(PAL.green, 2)), RKx + 0.25, y - 0.025, RKz);
      if (li < 2) for (let k = 0; k < 4; k++) {
        const b = at(rb(0.34, 0.34, 0.36, 0.04, M.lab), RKx + 0.02, y + 0.19, RKz - 0.7 + k * 0.47);
        const sl = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.02, 0.22), catMat[['safe', 'ventures', 'research'][(k + li) % 3]]); sl.position.set(0.172, -0.06, 0); b.add(sl);
      }
    });
    const rkl = canvasTex(256, 48); rkl.g.fillStyle = '#3DDC97'; rkl.g.font = '600 26px "JetBrains Mono", monospace'; rkl.g.textBaseline = 'middle'; rkl.g.fillText('SUPPLY', 8, 25); rkl.tex.needsUpdate = true;
    const rkm = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.11), new THREE.MeshBasicMaterial({ map: rkl.tex, transparent: true, toneMapped: false })); rkm.rotation.y = Math.PI / 2; at(rkm, RKx + 0.27, 1.16, RKz - 0.6);
  }
  /* ---- modern humanoid agent: gloss shell, graphite joints, glass visor with a light bar ---- */
  const RM = {
    shell: new THREE.MeshPhysicalMaterial({ color: 0xf2f1ee, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.16 }),
    shell2: new THREE.MeshPhysicalMaterial({ color: 0xd9dbe0, roughness: 0.34, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
    joint: new THREE.MeshStandardMaterial({ color: 0x2a2f3b, roughness: 0.38, metalness: 0.7 }),
    visor: new THREE.MeshPhysicalMaterial({ color: 0x03050b, roughness: 0.05, metalness: 0.4, clearcoat: 1, clearcoatRoughness: 0.04 }),
  };
  if (ENV) { Object.values(RM).forEach((m) => { m.envMap = ENV; m.envMapIntensity = 0.6; }); Object.values(M).forEach((m) => { m.envMap = ENV; m.envMapIntensity = 0.35; }); }
  const G = { sph: (r) => new THREE.SphereGeometry(r, 16, 12), cap: (r, len) => new THREE.CapsuleGeometry(r, Math.max(0.001, len - 2 * r), 4, 14) };
  function makeAgent(eyeHex = PAL.cyan, scale = 1) {
    const g = new THREE.Group();
    const add = (p, m, x = 0, y = 0, z = 0) => { m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; p.add(m); return m; };
    const grp = (p, x, y, z) => { const o = new THREE.Group(); o.position.set(x, y, z); p.add(o); return o; };
    const mesh = (geo, mat) => new THREE.Mesh(geo, mat);
    const hips = grp(g, 0, 0.57, 0);
    add(hips, rb(0.22, 0.09, 0.14, 0.04, RM.joint));
    const legs = [-1, 1].map((s) => {
      const hip = grp(hips, s * 0.072, -0.03, 0);
      add(hip, mesh(G.sph(0.048), RM.joint));
      add(hip, mesh(G.cap(0.05, 0.25), RM.shell), 0, -0.13, 0.005);
      const knee = grp(hip, 0, -0.26, 0);
      add(knee, mesh(G.sph(0.04), RM.joint));
      add(knee, mesh(G.cap(0.042, 0.24), RM.shell2), 0, -0.12, 0);
      const ankle = grp(knee, 0, -0.25, 0);
      add(ankle, rb(0.085, 0.045, 0.19, 0.02, RM.joint), 0, -0.008, 0.035);
      return { hip, knee, ankle };
    });
    const torso = grp(hips, 0, 0.05, 0);
    add(torso, mesh(G.cap(0.062, 0.15), RM.joint), 0, 0.07, 0);
    const chest = add(torso, rb(0.3, 0.25, 0.17, 0.075, RM.shell), 0, 0.25, 0);
    add(torso, rb(0.2, 0.17, 0.06, 0.03, RM.joint), 0, 0.26, -0.1);
    add(torso, rb(0.16, 0.05, 0.02, 0.01, RM.visor), 0, 0.3, 0.083);
    const lightMat = glow(eyeHex, 2.4); add(torso, mesh(new THREE.BoxGeometry(0.1, 0.01, 0.004), lightMat), 0, 0.3, 0.095);
    const neck = grp(torso, 0, 0.385, 0); add(neck, mesh(new THREE.CylinderGeometry(0.03, 0.036, 0.07, 12), RM.joint), 0, 0.02, 0);
    const head = grp(neck, 0, 0.06, 0);
    add(head, rb(0.18, 0.2, 0.19, 0.085, RM.shell), 0, 0.09, 0);
    add(head, rb(0.165, 0.105, 0.03, 0.028, RM.visor), 0, 0.1, 0.087);
    const eyeMat = glow(eyeHex, 3); const eye = add(head, mesh(new THREE.BoxGeometry(0.11, 0.013, 0.004), eyeMat), 0, 0.106, 0.104);
    [-1, 1].forEach((s) => add(head, mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.02, 16).rotateZ(Math.PI / 2), RM.joint), s * 0.092, 0.09, 0));
    const arms = [-1, 1].map((s) => {
      const sh = grp(torso, s * 0.188, 0.33, 0); sh.rotation.z = s * 0.06;
      add(sh, mesh(G.sph(0.052), RM.joint));
      add(sh, mesh(G.cap(0.038, 0.21), RM.shell), 0, -0.11, 0);
      const el = grp(sh, 0, -0.22, 0);
      add(el, mesh(G.sph(0.033), RM.joint));
      add(el, mesh(G.cap(0.033, 0.18), RM.shell2), 0, -0.09, 0);
      add(el, rb(0.045, 0.075, 0.04, 0.016, RM.joint), 0, -0.2, 0.004);
      return { sh, el, s };
    });
    const box = rb(0.3, 0.26, 0.28, 0.04, M.lab); box.position.set(0, 0.74, 0.27); const bb = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.04, 0.29), catMat.safe); bb.position.y = 0.05; box.add(bb); box.visible = false; g.add(box);
    const hit = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.8, 4, 8), HIT); hit.position.y = 0.64; g.add(hit);
    g.scale.setScalar(scale); scene.add(g);
    return { g, body: hit, chest, eye, eyeMat, lightMat, box, bb, rig: { hips, legs, torso, neck, head, arms }, phase: Math.random() * 6 };
  }
  // pose: walk cycle, carry, held (arms up, legs kicking), idle look-around
  function poseAgent(p, o) {
    const { hips, legs, torso, head, arms } = p.rig, w = o.walk || 0, ph = p.phase, t = o.t;
    legs.forEach((L, k) => {
      const q = ph + (k ? Math.PI : 0);
      L.hip.rotation.x = -Math.sin(q) * 0.5 * w + (o.held ? Math.sin(t * 8 + k * 2.4) * 0.4 : 0) + (o.seated ? -1.5 : 0);
      L.knee.rotation.x = Math.max(0, -Math.sin(q - 0.9)) * 0.95 * w + 0.05 + (o.held ? 0.35 + Math.sin(t * 8 + k) * 0.2 : 0) + (o.seated ? 1.45 : 0);
      L.ankle.rotation.x = o.seated ? 0.05 : -L.knee.rotation.x * 0.25 + Math.sin(q) * 0.15 * w;
    });
    arms.forEach((A, k) => {
      const q = ph + (k ? 0 : Math.PI);
      if (o.carry) { A.sh.rotation.x = -1.1; A.el.rotation.x = -0.5; A.sh.rotation.z = A.s * -0.02; }
      else if (o.held) { A.sh.rotation.x = -2.75 + Math.sin(t * 9 + k * 2) * 0.25; A.el.rotation.x = -0.25; A.sh.rotation.z = A.s * 0.25; }
      else if (o.seated) { A.sh.rotation.x = -0.95 - (k === 1 ? o.reach || 0 : 0) * 0.65; A.el.rotation.x = -0.55 + (k === 1 ? o.reach || 0 : 0) * 0.35; A.sh.rotation.z = A.s * 0.04; }
      else { A.sh.rotation.x = Math.sin(q) * 0.45 * w + Math.sin(t * 1.3 + p.phase) * 0.03; A.el.rotation.x = -0.22 - w * 0.25; A.sh.rotation.z = A.s * 0.07; }
    });
    hips.position.y = 0.57 + Math.abs(Math.sin(ph)) * 0.022 * w - (o.seated ? 0 : 0);
    torso.rotation.x = w * 0.07 + (o.lean || 0); torso.rotation.y = Math.sin(ph) * 0.07 * w;
    head.rotation.y = o.look || 0; head.rotation.x = o.nod || 0;
  }
  const pickSpots = [new V3(-6.45, 0, -0.85), new V3(-6.45, 0, -0.1), new V3(-6.45, 0, 0.65)];
  const dropSpots = [new V3(-2.75, 0, 0.05), new V3(-2.75, 0, 1.15)];
  const agents = [], agentMeshes = [];
  let qi = 0; const queue = [];
  const nextProj = () => queue.length ? queue.shift() : C.order[qi++ % C.order.length];
  const randInDome = () => { const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * (R - 0.9); return new V3(DC.x + Math.cos(a) * d, 0, DC.z + Math.sin(a) * d); };
  for (let i = 0; i < 6; i++) {
    const parts = makeAgent();
    const a = { i, ...parts, pos: randInDome(), yaw: Math.random() * 6, y: 0, state: 'toPick', target: pickSpots[i % 3].clone(), wait: 0, carry: null, vel: new V3(), jumpT: 0, walk: 0 };
    if (i % 2) { a.carry = nextProj(); a.state = 'toDrop'; a.target = dropSpots[i % 2].clone(); }
    parts.body.userData = { agent: i }; agentMeshes.push(parts.body); agents.push(a);
  }
  let held = null, hitT = 99; const dragPlane = new THREE.Plane(new V3(0, 1, 0), -1.0), hp = new V3();
  function setCarry(a, p) { a.carry = p; a.box.visible = !!p; if (p) a.bb.material = catMat[C.P[p].cat]; }
  agents.forEach((a) => setCarry(a, a.carry));
  function dragStart(i) { held = agents[i]; held.state = 'held'; }
  function dragMove(ray) {
    if (!held || !ray.intersectPlane(dragPlane, hp)) return;
    const dx = hp.x - DC.x, dz = hp.z - DC.z, d = Math.hypot(dx, dz), lim = R - 0.42;
    if (d > lim) {
      const nx = dx / d, nz = dz / d; held.pos.set(DC.x + nx * lim, 0, DC.z + nz * lim);
      const hy = 1.0, hr = Math.sqrt(R * R - hy * hy); domeMat.uniforms.uHit.value.set(DC.x + nx * hr, hy + 0.1, DC.z + nz * hr); hitT = 0;
      held.vel.set(-nx * 3.6, 0, -nz * 3.6); held.state = 'bounce'; held.jumpT = 0; held = null;
      UI.blocked(); UI.Sound.bonk(); return 'blocked';
    }
    held.pos.lerp(tv.set(hp.x, 0, hp.z), 0.55);
  }
  function dragEnd() { if (!held) return; held.state = 'bounce'; held.vel.set(0, 0, 0); held.jumpT = 0.7; held = null; }
  function moveTo(a, dt, speed = 0.95) {
    const dx = a.target.x - a.pos.x, dz = a.target.z - a.pos.z, d = Math.hypot(dx, dz);
    if (d < 0.06 || (d < 0.8 && a.blockT > 0.7)) { a.walk = 0; a.blockT = 0; return true; }
    if (a.blockT > 2.2) { a.blockT = 0; const ang = Math.random() * Math.PI * 2; a.target.x += Math.cos(ang) * 0.45; a.target.z += Math.sin(ang) * 0.45; }
    const s = Math.min(d, speed * dt); a.pos.x += (dx / d) * s; a.pos.z += (dz / d) * s; a.walk = 1;
    turn(a, Math.atan2(dx, dz), dt); return false;
  }
  function turn(a, yaw, dt) { let d = yaw - a.yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); a.yaw += d * Math.min(1, dt * 7); }
  function updateAgents(dt, t) {
    for (const a of agents) {
      switch (a.state) {
        case 'held': a.walk = 0; break;
        case 'bounce': {
          a.pos.addScaledVector(a.vel, dt); a.vel.multiplyScalar(Math.exp(-dt * 2.4)); a.jumpT += dt;
          if (a.jumpT > 1.4) { a.state = a.carry ? 'toDrop' : 'toPick'; a.target = (a.carry ? dropSpots[a.i % 2] : pickSpots[a.i % 3]).clone(); }
          break;
        }
        case 'toPick': if (moveTo(a, dt)) { a.state = 'pick'; a.wait = 0.55; } break;
        case 'pick': turn(a, -Math.PI / 2, dt); if ((a.wait -= dt) <= 0) { setCarry(a, nextProj()); a.state = 'toDrop'; a.target = dropSpots[a.i % 2].clone(); } break;
        case 'toDrop': if (moveTo(a, dt)) { a.state = 'drop'; a.wait = 0.3; } break;
        case 'drop':
          turn(a, Math.PI / 2, dt);
          if ((a.wait -= dt) < -4.5) { a.state = 'wander'; a.target = randInDome(); break; }
          if (a.wait <= 0 && belt.canAccept()) {
            a.box.getWorldPosition(tv); belt.add(a.carry, tv.clone()); setCarry(a, null);
            if (Math.random() < 0.4) { a.state = 'wander'; a.target = randInDome(); } else { a.state = 'toPick'; a.target = pickSpots[Math.floor(Math.random() * 3)].clone(); }
          }
          break;
        case 'wander': if (moveTo(a, dt, 0.7)) { a.state = 'idle'; a.wait = 0.6 + Math.random(); } break;
        case 'idle': if ((a.wait -= dt) <= 0) { if (a.carry) { a.state = 'toDrop'; a.target = dropSpots[Math.floor(Math.random() * 2)].clone(); } else { a.state = 'toPick'; a.target = pickSpots[Math.floor(Math.random() * 3)].clone(); } } break;
      }
    }
    // separation + containment
    for (let i = 0; i < agents.length; i++) for (let j = i + 1; j < agents.length; j++) {
      const A = agents[i], B = agents[j]; if (A.state === 'held' || B.state === 'held') continue;
      const dx = B.pos.x - A.pos.x, dz = B.pos.z - A.pos.z, d = Math.hypot(dx, dz) || 0.001;
      if (d < 0.62) { const p = (0.62 - d) * 0.5, nx = dx / d, nz = dz / d; A.pos.x -= nx * p; A.pos.z -= nz * p; B.pos.x += nx * p; B.pos.z += nz * p; }
    }
    for (const a of agents) {
      const dx = a.pos.x - DC.x, dz = a.pos.z - DC.z, d = Math.hypot(dx, dz), lim = R - 0.42;
      if (d > lim) { a.pos.x = DC.x + (dx / d) * lim; a.pos.z = DC.z + (dz / d) * lim; if (a.state === 'bounce') a.vel.multiplyScalar(-0.5); }
      const moved = Math.hypot(a.pos.x - (a.px ?? a.pos.x), a.pos.z - (a.pz ?? a.pos.z)); a.px = a.pos.x; a.pz = a.pos.z;
      if (a.walk && moved < 0.3 * 0.95 * dt) a.blockT = (a.blockT || 0) + dt; else a.blockT = Math.max(0, (a.blockT || 0) - dt * 2);
      a.phase += dt * 8.5 * a.walk; let y = 0;
      if (a.state === 'held') y = 0.55 + Math.sin(t * 10) * 0.04;
      if (a.state === 'bounce') y = Math.abs(Math.sin(a.jumpT * 7)) * 0.38 * Math.exp(-a.jumpT * 2.2);
      a.g.position.set(a.pos.x, 0.06 + y, a.pos.z); a.g.rotation.y = a.yaw;
      a.g.rotation.z = a.state === 'held' ? Math.sin(t * 6) * 0.12 : 0;
      const idle = a.state === 'idle' || a.state === 'drop' || a.state === 'pick';
      poseAgent(a, { t, walk: a.walk, carry: !!a.carry, held: a.state === 'held' || (a.state === 'bounce' && a.jumpT < 0.5), look: idle ? Math.sin(t * 0.7 + a.i * 2) * 0.55 : 0, nod: a.state === 'pick' ? 0.35 : a.state === 'held' ? -0.2 : 0 });
      a.eyeMat.color.copy(COL.cyan).multiplyScalar(2.6 + Math.sin(t * 1.7 + a.i * 2) * 0.4);
      a.lightMat.color.copy(a.carry ? COL.green : COL.cyan).multiplyScalar(1.8 + (Math.sin(t * 3 + a.i) > 0.6 ? 1.2 : 0));
    }
    hitT += dt; domeMat.uniforms.uHitT.value = hitT; domeMat.uniforms.uHover.value = S('dome').hover;
  }

  /* ================= CONVEYOR + GATE ================= */
  const BX0 = -2.2, BX1 = 6.4, BZ = 0.6, BOXY = 0.8, SPEED = 0.55, RZ = 2.3, RY = 0.61, REJ_X = 3.95, PASS_X = 5.75;
  const RX = [...Array(7)].map((_, i) => 1.7 + i * 0.26);
  {
    at(rb(BX1 - BX0, 0.5, 1.0, 0.08, M.lab2), (BX0 + BX1) / 2, 0.3, BZ);
    at(rb(BX1 - BX0, 0.04, 0.82, 0.02, M.ink), (BX0 + BX1) / 2, 0.565, BZ);
    [-1, 1].forEach((s) => at(new THREE.Mesh(new THREE.BoxGeometry(BX1 - BX0 - 0.2, 0.014, 0.014), glow(PAL.cyan, 1.5)), (BX0 + BX1) / 2, 0.5, BZ + s * 0.505));
    [-1, 1].forEach((s) => at(new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.012, 0.012), glow(PAL.red, 1.3)), 1.15, 0.33, RZ + s * 0.305));
    at(rb(5.6, 0.34, 0.6, 0.06, M.lab2), 1.15, 0.22, RZ);
    at(rb(5.6, 0.03, 0.48, 0.01, M.ink), 1.15, 0.395, RZ);

    // gate frame
    const AR = 1.32, AY = 1.05;
    [1.42, 3.54].forEach((x) => {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(AR, 0.13, 20, 64, Math.PI), M.lab); arch.rotation.y = Math.PI / 2; arch.castShadow = arch.receiveShadow = true; at(arch, x, AY, BZ);
      const strip = new THREE.Mesh(new THREE.TorusGeometry(AR - 0.135, 0.012, 6, 64, Math.PI), addGlow(S('gate'), glow(PAL.cyan, 2.6))); strip.rotation.y = Math.PI / 2; at(strip, x, AY, BZ);
      [-1, 1].forEach((s) => { at(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, AY, 24), M.lab), x, AY / 2, BZ + s * AR).castShadow = true; at(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.08, 24), M.ink), x, 0.09, BZ + s * AR); });
    });
    [-1, 1].forEach((s) => at(rb(2.12, 0.08, 0.06, 0.03, M.ink), 2.48, 0.2, BZ + s * AR));
    at(rb(2.3, 0.08, 0.3, 0.03, M.ink), 2.48, AY + AR + 0.05, BZ);
    const sign = canvasTex(512, 96); const g = sign.g;
    g.fillStyle = '#121a30'; g.fillRect(0, 0, 512, 96); g.fillStyle = '#FFB547'; g.font = `500 34px ${FM}`; g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillText('PHYSGATE · 7 CHECKS', 256, 50);
    const sp = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.41), new THREE.MeshBasicMaterial({ map: sign.tex, toneMapped: false, color: new THREE.Color(1.3, 1.3, 1.3) })); sp.scale.setScalar(0.62); at(sp, 2.48, AY + AR + 0.45, BZ + 0.02); sp.rotation.y = 0.7;
    hitBox(2.5, 3.4, 2.9, 2.48, 1.7, BZ, 'gate');
  }
  // rework lane: rejected boxes ride back to the agents; animated chevrons, red edge, diverter flap, sign
  const chevMat = glow(PAL.red, 1.6), chevrons = [];
  for (let i = 0; i < 9; i++) { const ch = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.13, 3).rotateZ(Math.PI / 2), chevMat); ch.rotation.x = -Math.PI / 2; at(ch, 0, 0.415, RZ); chevrons.push(ch); }
  const rwSign = canvasTex(512, 96);
  function drawReworkSign() { const g = rwSign.g, u = L().ui.rework; g.clearRect(0, 0, 512, 96); g.fillStyle = 'rgba(30,8,12,0.9)'; g.beginPath(); g.roundRect(2, 2, 508, 92, 18); g.fill(); g.strokeStyle = '#FF5A5F'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#FF5A5F'; g.font = `600 30px ${FM}`; g.textBaseline = 'middle'; g.fillText('↺ ' + u.title, 22, 36); g.fillStyle = '#f3b4b6'; g.font = `500 20px ${FM}`; g.fillText(u.sub, 24, 70); rwSign.tex.needsUpdate = true; }
  drawReworkSign();
  { const sp = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.3), new THREE.MeshBasicMaterial({ map: rwSign.tex, transparent: true, toneMapped: false, depthWrite: false, side: THREE.DoubleSide, color: new THREE.Color(1.3, 1.3, 1.3) }));
    at(rb(0.04, 0.62, 0.04, 0.015, M.ink), 3.7, 0.31, RZ + 0.42); sp.position.set(3.7, 0.8, RZ + 0.42); sp.rotation.y = 0.5; scene.add(sp); }
  const diverter = new THREE.Group(); at(diverter, 3.98, 0.62, BZ - 0.48);
  { const arm = rb(0.08, 0.1, 0.9, 0.03, M.ink); arm.position.z = 0.45; diverter.add(arm); const tipG = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.86), glow(PAL.red, 2)); tipG.position.set(0, 0.06, 0.45); diverter.add(tipG);
    at(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.62, 16), M.ink), 3.98, 0.31, BZ - 0.48); }
  let divT = 0;
  const slats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.012, 0.76), M.slat, 30); scene.add(slats);
  const rings = RX.map((x, i) => {
    const mat = glow(PAL.amber, 2.2); const m = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.034, 10, 72), mat); m.rotation.y = Math.PI / 2; at(m, x, 0.95, BZ);
    const h = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.12, 6, 24), HIT); h.rotation.y = Math.PI / 2; h.position.set(x, 0.95, BZ); h.userData = { station: 'gate', ring: i }; scene.add(h); hotspots.push(h);
    return { mat, g: 0, r: 0, p: 0 };
  });
  const boxPool = [], boxes = [];
  function getBox(proj) {
    let o = boxPool.pop();
    if (!o) { const g = new THREE.Group(); g.add(rb(0.42, 0.42, 0.42, 0.05, M.lab)); const band = new THREE.Mesh(new THREE.BoxGeometry(0.432, 0.06, 0.432), catMat.safe); band.position.y = 0.07; g.add(band); const tape = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.004, 0.43), M.lab2); tape.position.y = 0.211; g.add(tape); o = { g, band }; }
    o.band.material = catMat[C.P[proj].cat]; o.g.scale.setScalar(1); o.g.rotation.set(0, 0, 0); scene.add(o.g); return o;
  }
  const belt = {
    canAccept: () => !boxes.some((b) => ['belt', 'place', 'stop'].includes(b.state) && b.x < BX0 + 0.72),
    add(proj, from) { const fail = Math.random() < 0.18; boxes.push({ o: getBox(proj), proj, x: BX0 + 0.3, y: BOXY, z: BZ, state: 'place', t: 0, from, next: 0, fail, failRing: 1 + Math.floor(Math.random() * 6), rejected: false }); },
  };
  const cards = [], cardTex = {};
  function cardTexture(proj) {
    if (cardTex[proj]) return cardTex[proj];
    const ct = canvasTex(512, 320), g = ct.g, t = L().projects[proj], cat = C.P[proj].cat;
    g.fillStyle = 'rgba(11,16,32,0.94)'; g.beginPath(); g.roundRect(6, 6, 500, 308, 24); g.fill();
    g.lineWidth = 3; g.strokeStyle = '#5BC8FF'; g.stroke();
    g.strokeStyle = '#3DDC97'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(36, 58); g.lineTo(46, 68); g.lineTo(64, 46); g.stroke();
    g.fillStyle = '#3DDC97'; g.font = `500 22px ${FM}`; g.textBaseline = 'middle'; g.fillText('7 / 7', 78, 58);
    g.fillStyle = '#E9E6DF'; const fs = fitFont(g, t.title, 600, 50, FD, 440); g.font = `600 ${fs}px ${FD}`; g.fillText(t.title, 36, 160);
    g.fillStyle = '#8b98b8'; g.font = `400 22px ${FM}`; g.fillText(C.P[proj].years || '·', 36, 262);
    g.fillStyle = '#' + new THREE.Color(CAT[cat]).getHexString(); g.textAlign = 'right'; g.fillText(L().ui.filters[cat].split(' ')[0].toUpperCase(), 476, 262);
    return (cardTex[proj] = ct.tex);
  }
  const cardGeo = new THREE.PlaneGeometry(1.3, 0.81);
  function spawnCard(proj, pos) {
    const mat = new THREE.MeshBasicMaterial({ map: cardTexture(proj), transparent: true, toneMapped: false, depthWrite: false, side: THREE.DoubleSide, color: new THREE.Color(1.3, 1.3, 1.3) });
    const m = new THREE.Mesh(cardGeo, mat); m.position.copy(pos); m.userData = { card: true, project: proj }; scene.add(m); cards.push({ m, t: 0, x: pos.x });
  }
  function updateBelt(dt, t) {
    const off = (t * SPEED) % 0.29;
    const rworking = boxes.some((b) => b.state === 'slide' || b.state === 'rework');
    chevrons.forEach((c, i) => { const u = ((i / 9 - t * 0.12) % 1 + 1) % 1; c.position.x = -1.5 + u * 5.3; });
    chevMat.color.copy(COL.red).multiplyScalar(rworking ? 2.2 + Math.sin(t * 8) * 0.6 : 1.1);
    divT = Math.max(0, divT - dt * 0.9); diverter.rotation.y = -smooth(0, 0.25, divT) * 0.95;
    for (let i = 0; i < 30; i++) { m4.makeTranslation(BX0 + 0.05 + ((i * 0.29 + off) % (BX1 - BX0 - 0.1)), 0.592, BZ); slats.setMatrixAt(i, m4); }
    slats.instanceMatrix.needsUpdate = true;
    const onBelt = boxes.filter((b) => b.state === 'belt' || b.state === 'stop').sort((a, b) => b.x - a.x);
    for (let i = boxes.length - 1; i >= 0; i--) {
      const b = boxes[i];
      if (b.state === 'place') {
        b.t += dt / 0.45; const k = ease(Math.min(1, b.t));
        tv.set(b.x, BOXY, BZ); b.o.g.position.lerpVectors(b.from, tv, k); b.o.g.position.y += Math.sin(k * Math.PI) * 0.25;
        if (b.t >= 1) b.state = 'belt'; continue;
      }
      if (b.state === 'belt') {
        const ahead = onBelt.filter((o) => o.x > b.x && o !== b).pop();
        if (!ahead || ahead.x - b.x > 0.62) b.x += SPEED * dt;
        while (b.next < 7 && b.x >= RX[b.next]) {
          const r = b.next++;
          if (b.fail && r === b.failRing) { rings[r].r = 1; b.state = 'stop'; b.t = 0; b.rejected = true; b.next = 7; UI.Sound.fail(); }
          else { rings[r].p = 1; UI.Sound.click(r); if (r === 6) UI.Sound.pass(); }
        }
        if (b.rejected && b.x >= REJ_X) { b.state = 'slide'; b.t = 0; divT = 1; b.o.band.material = chevMat; }
        else if (!b.rejected && b.x >= PASS_X) { b.state = 'unfold'; b.t = 0; spawnCard(b.proj, new V3(b.x, BOXY + 0.15, BZ)); }
      } else if (b.state === 'stop') { b.t += dt; if (b.t > 0.9) b.state = 'belt'; }
      else if (b.state === 'slide') { b.t += dt / 0.7; const k = ease(Math.min(1, b.t)); b.z = BZ + (RZ - BZ) * k; b.y = BOXY + (RY - BOXY) * k + Math.sin(k * Math.PI) * 0.22; if (b.t >= 1) { b.state = 'rework'; b.y = RY; } }
      else if (b.state === 'rework') { b.x -= 0.65 * dt; if (b.x <= -1.45) { b.state = 'sink'; b.t = 0; } }
      else if (b.state === 'sink' || b.state === 'unfold') {
        b.t += dt / (b.state === 'sink' ? 0.5 : 0.55); const k = Math.min(1, b.t);
        b.o.g.scale.setScalar(Math.max(0.001, 1 - ease(k))); if (b.state === 'unfold') { b.y = BOXY + k * 0.5; b.o.g.rotation.y = k * 2; } else b.y = RY - k * 0.2;
        if (b.t >= 1) { if (b.state === 'sink') queue.unshift(b.proj); scene.remove(b.o.g); boxPool.push(b.o); boxes.splice(i, 1); continue; }
      }
      b.o.g.position.set(b.x, b.y, b.z);
    }
    const gh = S('gate').hover;
    rings.forEach((rg, i) => {
      const on = boxes.some((b) => !b.rejected && b.next > i && (b.state === 'belt' || b.state === 'stop') && b.x < RX[6] + 0.7);
      rg.g += ((on ? 1 : 0) - rg.g) * (1 - Math.exp(-dt * (on ? 10 : 2.5)));
      rg.p *= Math.exp(-dt * 5); rg.r = Math.max(0, rg.r - dt / 1.3);
      const blink = rg.r > 0 ? (0.55 + 0.45 * Math.sin(t * 26)) * Math.min(1, rg.r * 2) : 0;
      tc.copy(COL.amber).lerp(COL.green, rg.g).lerp(COL.red, blink);
      rg.mat.color.copy(tc).multiplyScalar(2.7 + rg.g * 0.8 + rg.p * 1.6 + blink * 1.6 + gh * 0.9);
    });
    for (let i = cards.length - 1; i >= 0; i--) {
      const c = cards[i]; c.t += dt;
      c.m.scale.setScalar(0.2 + 0.8 * ease(Math.min(1, c.t / 0.6)));
      c.m.position.set(c.x + c.t * 0.08, BOXY + 0.3 + ease(Math.min(1, c.t / 1.2)) * 1.4 + c.t * 0.12, BZ + Math.sin(c.t * 1.3) * 0.05);
      c.m.quaternion.copy(camera.quaternion);
      c.m.material.opacity = c.t < 3.6 ? 1 : Math.max(0, 1 - (c.t - 3.6));
      if (c.t > 4.6) { scene.remove(c.m); c.m.material.dispose(); cards.splice(i, 1); }
    }
  }

  /* ================= REDACTION DESK ================= */
  const RD = new V3(3.4, 0, 5.6), SHW = 0.7, SHH = 0.9;
  const sheetTex = canvasTex(700, 900); const sheetMat = new THREE.MeshStandardMaterial({ map: sheetTex.tex, roughness: 0.95 });
  let barRects = [];
  function drawSheet() {
    const g = sheetTex.g, lines = L().ui.sheet; barRects = [];
    g.fillStyle = '#F3F1EC'; g.fillRect(0, 0, 700, 900);
    g.fillStyle = '#9a9a96'; g.font = `500 26px ${FM}`; g.textBaseline = 'alphabetic'; g.fillText('DOC-0042 · PII SCAN', 50, 90);
    g.fillStyle = '#d9d6cf'; g.fillRect(50, 110, 600, 3);
    lines.forEach(([pre, secret], i) => {
      const fs = i === 0 ? 62 : 40, y = [230, 350, 450, 550][i];
      g.font = `${i === 0 ? 600 : 500} ${fs}px ${FD}`; g.fillStyle = '#1c2030';
      g.fillText(pre, 50, y); const x0 = 50 + g.measureText(pre).width; g.fillText(secret, x0, y);
      barRects.push({ x0: x0 - 6, w: g.measureText(secret).width + 12, cy: y - fs * 0.34, h: fs * 1.08 });
    });
    g.fillStyle = '#dedbd4'; for (let i = 0; i < 5; i++) g.fillRect(50, 640 + i * 46, 600 - (i % 2) * 140 - (i === 4 ? 250 : 0), 16);
    sheetTex.tex.needsUpdate = true;
  }
  drawSheet();
  const sheetGeo = new THREE.PlaneGeometry(SHW, SHH);
  const sheets = [0, 1, 2].map((i) => { const m = new THREE.Mesh(sheetGeo, sheetMat); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; scene.add(m); return { m, bars: [], i }; });
  const detMats = sheets.map(() => new THREE.LineBasicMaterial({ color: new THREE.Color(PAL.amber).multiplyScalar(2.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  function buildBars() {
    sheets.forEach((s, si) => {
      s.bars.forEach((b) => { s.m.remove(b); b.geometry.dispose(); }); if (s.det) { s.m.remove(s.det); s.det.geometry.dispose(); }
      const pts = [];
      s.bars = barRects.map((r) => {
        const w = (r.w / 700) * SHW, h = (r.h / 900) * SHH, x0 = (r.x0 / 700) * SHW - SHW / 2, cy = SHH / 2 - (r.cy / 900) * SHH, z = 0.05;
        const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.008).translate(w / 2, 0, 0), M.black); b.castShadow = true;
        b.position.set(x0, cy, 0.005); s.m.add(b);
        const c = [[x0 - 0.01, cy - h / 2 - 0.01], [x0 + w + 0.01, cy - h / 2 - 0.01], [x0 + w + 0.01, cy + h / 2 + 0.01], [x0 - 0.01, cy + h / 2 + 0.01]];
        for (let k = 0; k < 4; k++) { const [ax, ay] = c[k], [bx, by] = c[(k + 1) % 4]; pts.push(new V3(ax, ay, z), new V3(bx, by, z)); }
        return b;
      });
      s.det = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), detMats[si]); s.m.add(s.det);
    });
  }
  buildBars();
  const hudScan = canvasTex(768, 400); let docsScanned = 41, hudDirty = true;
  function drawScanHud() {
    const g = hudScan.g, u = L().ui.scan;
    g.clearRect(0, 0, 768, 400);
    g.strokeStyle = 'rgba(91,200,255,0.55)'; g.lineWidth = 2; g.beginPath(); g.roundRect(4, 4, 760, 392, 22); g.stroke();
    g.fillStyle = 'rgba(91,200,255,0.06)'; g.fill();
    g.fillStyle = '#FF5A5F'; g.beginPath(); g.arc(34, 40, 7, 0, 7); g.fill();
    g.fillStyle = '#8fd6ff'; g.font = `500 22px ${FM}`; g.textBaseline = 'middle'; g.fillText(u.title, 52, 41);
    g.textAlign = 'right'; g.fillStyle = '#8b98b8'; g.fillText(`DOC-${String(docsScanned).padStart(4, '0')}`, 736, 41); g.textAlign = 'left';
    [[u.name, 150], [u.number, 92]].forEach(([k, w], i) => {
      const y = 98 + i * 52; g.fillStyle = '#c9cfdd'; g.font = `500 20px ${FM}`; g.fillText(k, 30, y);
      g.strokeStyle = '#FFB547'; g.lineWidth = 2; g.strokeRect(190, y - 16, w + 14, 32); g.fillStyle = '#111'; g.fillRect(197, y - 10, w, 20);
      g.fillStyle = '#FFB547'; g.beginPath(); g.arc(222 + w, y, 6, 0, 7); g.fill();
    });
    g.fillStyle = '#3DDC97'; g.font = `600 84px ${FD}`; g.fillText('91%+', 30, 262);
    g.fillStyle = '#9aa6c4'; g.font = `500 20px ${FM}`; g.fillText(u.detect, 34, 316);
    g.fillStyle = '#E9E6DF'; g.font = `600 64px ${FD}`; g.fillText('0', 420, 258);
    g.fillStyle = '#9aa6c4'; g.font = `500 20px ${FM}`; g.fillText(u.stored, 424, 316);
    g.strokeStyle = '#5BC8FF'; g.lineWidth = 3; g.strokeRect(32, 344, 22, 18); g.beginPath(); g.arc(43, 344, 8, Math.PI, 0); g.stroke();
    g.fillStyle = '#8fd6ff'; g.font = `500 19px ${FM}`; g.fillText(u.e2e, 68, 354);
    hudScan.tex.needsUpdate = true; hudDirty = false;
  }
  {
    at(rb(3.2, 0.78, 1.5, 0.1, M.lab), RD.x, 0.43, RD.z);
    at(rb(3.0, 0.05, 1.22, 0.02, M.ink), RD.x, 0.835, RD.z);
    [-1, 1].forEach((s) => at(new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.012, 0.012), glow(PAL.cyan, 1.4)), RD.x, 0.865, RD.z + s * 0.6));
    at(new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.012, 0.012), glow(PAL.cyan, 1.6)), RD.x, 0.08, RD.z + 0.76);
    const archM = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.07, 18, 56, Math.PI), M.lab); archM.rotation.y = Math.PI / 2; archM.castShadow = true; at(archM, RD.x, 0.86, RD.z);
    const archS = new THREE.Mesh(new THREE.TorusGeometry(0.665, 0.01, 6, 56, Math.PI), glow(PAL.cyan, 2.4)); archS.rotation.y = Math.PI / 2; at(archS, RD.x, 0.86, RD.z);
    const scan = addGlow(S('redaction'), glow(PAL.cyan, 3)); at(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.006, 1.14), scan), RD.x, 0.868, RD.z);
    const fanG = new THREE.BufferGeometry().setFromPoints([new V3(RD.x, 1.56, RD.z), new V3(RD.x, 0.87, RD.z - 0.57), new V3(RD.x, 0.87, RD.z + 0.57)]);
    scene.add(new THREE.Mesh(fanG, new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(0.9), transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })));
    at(new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), glow(PAL.cyan, 3)), RD.x, 1.56, RD.z);
    at(rb(0.78, 0.1, 0.98, 0.02, M.paper), RD.x - 1.05, 0.91, RD.z);
    at(rb(0.84, 0.03, 1.04, 0.012, M.slat), RD.x + 1.06, 0.875, RD.z);
    at(rb(0.74, 0.05, 0.94, 0.02, M.paper), RD.x + 1.06, 0.91, RD.z);
    at(rb(1.5, 0.05, 0.08, 0.02, M.ink), RD.x, 0.88, RD.z - 0.68);
    at(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.01, 0.01), glow(PAL.cyan, 2.2)), RD.x, 0.91, RD.z - 0.65);
    const hp = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 0.81), new THREE.MeshBasicMaterial({ map: hudScan.tex, transparent: true, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending, color: new THREE.Color(1.4, 1.4, 1.4) }));
    hp.rotation.x = -0.12; at(hp, RD.x, 1.5, RD.z - 0.68);
    hitBox(3.3, 2.2, 1.8, RD.x, 1.05, RD.z, 'redaction');
  }
  const scanMat = S('redaction').glows[1].mat;
  function updateDesk(dt, t) {
    const peel = S('redaction').hover;
    sheets.forEach((s, si) => {
      const ph = ((t / 7 + s.i / 3) % 1 + 1) % 1, x = RD.x - 1.05 + ph * 2.1;
      const y = 0.87 + (ph < 0.05 ? 0.09 * (1 - ph / 0.05) : 0) + (ph > 0.95 ? 0.08 * ((ph - 0.95) / 0.05) : 0);
      s.m.position.set(x, y, RD.z);
      const stamp = smooth(RD.x - 0.02, RD.x + 0.18, x);
      if (stamp > 0.5 && !s.counted) { s.counted = true; docsScanned++; hudDirty = true; } if (ph < 0.05) s.counted = false;
      s.bars.forEach((b, j) => { b.scale.set(Math.max(0.001, stamp), 1, 1); b.rotation.y = -peel * (2.1 + j * 0.15); b.visible = stamp > 0.01; });
      detMats[si].opacity = Math.max(smooth(RD.x - 0.5, RD.x - 0.15, x) * (1 - smooth(RD.x + 0.25, RD.x + 0.6, x)), peel * 0.6) * (0.75 + 0.25 * Math.sin(t * 14));
      detMats[si].color.copy(peel > 0.5 ? COL.green : COL.amber).multiplyScalar(2.6);
    });
    scanMat.color.copy(COL.cyan).multiplyScalar(2.6 + Math.sin(t * 6) * 0.8 + peel);
    if (hudDirty) drawScanHud();
  }

  /* ================= GAME TABLE — replays a real tournament game (replay-r4g2.ts) ================= */
  const GT = new V3(4.8, 0, -3.4), GD = 0.15, MY = 1.075;
  const REP = replay;
  const GCOL = { red: 0xff5a5f, 'lawn green': 0x3ddc97, yellow: 0xffc94a, blue: 0x4c8dff, gray0: 0xc9ced8, purple: 0xa98bff };
  const MINE = REP.order.indexOf('yellow');
  const cellPos = REP.cells.map(([q, r]) => new V3(GT.x + GD * (q + r / 2), MY, GT.z + GD * r * 0.866));
  {
    at(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.3, 0.86, 32), M.ink), GT.x, 0.47, GT.z).castShadow = true;
    at(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.66, 0.06, 6), M.ink), GT.x, 0.08, GT.z).receiveShadow = true;
    const top = at(new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.58, 0.12, 6), M.lab), GT.x, 0.93, GT.z); top.castShadow = top.receiveShadow = true;
    at(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.03, 6), M.ink), GT.x, 1.0, GT.z).receiveShadow = true;
    const rim = []; for (let i = 0; i <= 6; i++) { const a = (i / 6) * Math.PI * 2; rim.push(new V3(GT.x + Math.sin(a) * 1.52, 1.018, GT.z + Math.cos(a) * 1.52)); }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rim), addGlow(S('game'), new THREE.LineBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(2.2), toneMapped: false }))));
    const holes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.006, 14), new THREE.MeshBasicMaterial({ toneMapped: false }), REP.cells.length);
    REP.cells.forEach((c, i) => { m4.makeTranslation(cellPos[i].x, 1.019, cellPos[i].z); holes.setMatrixAt(i, m4); holes.setColorAt(i, c[2] === 'board' ? tc.setRGB(0.07, 0.1, 0.18) : tc.set(GCOL[c[2]]).multiplyScalar(0.22)); });
    scene.add(holes);
    hitBox(4.6, 1.8, 4.6, GT.x, 0.85, GT.z, 'game');
  }
  const marbleMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.058, 18, 12), new THREE.MeshBasicMaterial({ toneMapped: false }), 60); marbleMesh.castShadow = true; scene.add(marbleMesh);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.008, 6, 24).rotateX(Math.PI / 2), glow(GCOL.yellow, 3)); scene.add(halo);
  // one seated robot per team, facing its home corner
  const seats = REP.order.map((col, ti) => {
    const idx = REP.cells.map((c, i) => (c[2] === col ? i : -1)).filter((i) => i >= 0);
    const cx = idx.reduce((s, i) => s + cellPos[i].x, 0) / idx.length - GT.x, cz = idx.reduce((s, i) => s + cellPos[i].z, 0) / idx.length - GT.z, d = Math.hypot(cx, cz);
    const px = GT.x + (cx / d) * 2.05, pz = GT.z + (cz / d) * 2.05;
    at(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.72, 24), M.ink), px, 0.41, pz).castShadow = true;
    at(new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.012, 6, 32).rotateX(Math.PI / 2), glow(GCOL[col], 2.4)), px, 0.775, pz);
    const p = makeAgent(GCOL[col], 0.8); p.g.position.set(px, 0.36, pz); p.g.rotation.y = Math.atan2(-cx, -cz); p.col = new THREE.Color(GCOL[col]); p.nod = 0;
    return p;
  });
  // floating replay HUD
  const hud = canvasTex(640, 240);
  const hudM = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.71), new THREE.MeshBasicMaterial({ map: hud.tex, transparent: true, toneMapped: false, depthWrite: false, color: new THREE.Color(1.35, 1.35, 1.35) }));
  at(hudM, GT.x, 2.55, GT.z);
  const rp = { k: 0, timer: 0, endT: 0, marbles: [], occ: new Map() };
  function resetReplay() {
    rp.k = 0; rp.endT = 0; rp.marbles = []; rp.occ.clear();
    REP.order.forEach((col, ti) => REP.cells.forEach((c, i) => { if (c[2] !== col) return; const m = { ti, from: cellPos[i].clone(), to: cellPos[i].clone(), t: 1, h: 0 }; rp.marbles.push(m); rp.occ.set(i, m); }));
    drawHud();
  }
  const homeOf = (ti) => { const goal = { red: 'blue', blue: 'red', yellow: 'purple', purple: 'yellow', 'lawn green': 'gray0', gray0: 'lawn green' }[REP.order[ti]]; let n = 0; rp.occ.forEach((m, i) => { if (m.ti === ti && REP.cells[i][2] === goal) n++; }); return n; };
  function drawHud() {
    const g = hud.g, u = L().ui.replay, n = REP.moves.length, home = homeOf(MINE);
    g.clearRect(0, 0, 640, 240);
    g.fillStyle = 'rgba(8,12,24,0.86)'; g.beginPath(); g.roundRect(4, 4, 632, 232, 26); g.fill(); g.strokeStyle = 'rgba(91,200,255,0.55)'; g.lineWidth = 2; g.stroke();
    g.fillStyle = rp.k < n ? '#FF5A5F' : '#3DDC97'; g.beginPath(); g.arc(36, 42, 7, 0, 7); g.fill();
    g.fillStyle = '#8fd6ff'; g.font = `500 21px ${FM}`; g.textBaseline = 'middle'; g.fillText(u.live, 54, 43);
    g.textAlign = 'right'; g.fillStyle = '#8b98b8'; g.fillText('22.05.2026', 604, 43); g.textAlign = 'left';
    g.fillStyle = '#E9E6DF'; g.font = `600 56px ${FD}`; g.fillText(`${u.move} ${rp.k}`, 30, 112);
    const w = g.measureText(`${u.move} ${rp.k}`).width; g.fillStyle = '#6f7c9c'; g.font = `500 26px ${FM}`; g.fillText(`/ ${n}`, 44 + w, 120);
    g.fillStyle = '#FFC94A'; g.font = `500 20px ${FM}`; g.fillText(`group 99 · ${u.mine}`, 30, 176);
    for (let i = 0; i < 10; i++) { g.fillStyle = i < home ? '#FFC94A' : 'rgba(255,201,74,0.16)'; g.beginPath(); g.arc(34 + i * 30, 212, 9, 0, 7); g.fill(); }
    g.fillStyle = '#c9cfdd'; g.textAlign = 'right'; g.fillText(`${home}/10 ${u.home}`, 606, 212); g.textAlign = 'left';
    hud.tex.needsUpdate = true;
  }
  resetReplay();
  function stepReplay() {
    const [ti, a, b] = REP.moves[rp.k++], m = rp.occ.get(a); if (!m) return;
    rp.occ.delete(a); rp.occ.set(b, m); m.from.copy(m.to); m.to.copy(cellPos[b]); m.t = 0; m.h = 0.08 + Math.min(0.32, m.from.distanceTo(m.to) * 0.16);
    seats[ti].nod = 1; if (ti === MINE) UI.Sound.click(2);
    drawHud();
  }
  function updateGame(dt, t) {
    if (rp.k < REP.moves.length) { if ((rp.timer += dt) > 0.42) { rp.timer = 0; stepReplay(); } }
    else if ((rp.endT += dt) > 6) resetReplay();
    const done = rp.k >= REP.moves.length, gh = S('game').hover;
    rp.marbles.forEach((m, i) => {
      m.t = Math.min(1, m.t + dt / 0.36); const k = ease(m.t);
      tv.lerpVectors(m.from, m.to, k); tv.y += Math.sin(k * Math.PI) * m.h;
      m4.makeTranslation(tv.x, tv.y, tv.z); marbleMesh.setMatrixAt(i, m4);
      const mine = m.ti === MINE, w = done && mine ? 1 + Math.sin(rp.endT * 10) * 0.8 : 0;
      marbleMesh.setColorAt(i, tc.set(GCOL[REP.order[m.ti]]).multiplyScalar((mine ? 1.55 : 1.1) + w + gh * 0.4));
      if (mine && m.t < 1) halo.position.copy(tv);
    });
    halo.visible = rp.marbles.some((m) => m.ti === MINE && m.t < 1);
    marbleMesh.instanceMatrix.needsUpdate = true; marbleMesh.instanceColor.needsUpdate = true;
    hudM.position.y = 2.55 + Math.sin(t * 1.1) * 0.04; hudM.rotation.y = Math.atan2(camera.position.x - GT.x, camera.position.z - GT.z);
    seats.forEach((p, i) => { p.nod *= Math.exp(-dt * 3.5); poseAgent(p, { t, seated: true, reach: p.nod, nod: 0.32 + p.nod * 0.15, look: Math.sin(t * 0.4 + i * 3) * 0.1, lean: 0.12 + p.nod * 0.08 }); p.lightMat.color.copy(p.col).multiplyScalar(1.6 + (i === MINE ? 1 : 0)); p.eyeMat.color.copy(p.col).multiplyScalar(2.3 + p.nod * 1.6); });
  }

  /* ================= HEX PANEL (Graph Tsetlin Machine) ================= */
  const HP = new V3(5.7, 2.15, -7.4), HW = 0.172;
  const hexCells = []; for (let j = 0; j < 11; j++) for (let i = 0; i < 11; i++) hexCells.push({ i, j, stone: 0 });
  const hexMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.082, 0.082, 0.035, 6).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ toneMapped: false }), 121);
  const hexPos = (i, j) => new V3(HP.x + (i + j * 0.5 - 7.5) * HW, HP.y + (j * 0.866 - 4.33) * HW - 0.02, -7.3);
  {
    at(rb(3.1, 2.1, 0.06, 0.04, M.ink), HP.x, HP.y, -7.39);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.0), new THREE.MeshPhysicalMaterial({ color: 0x0a1020, roughness: 0.06, metalness: 0.2, clearcoat: 1, transparent: true, opacity: 0.3, envMap: ENV, envMapIntensity: 0.9 })); at(glass, HP.x, HP.y, -7.27);
    const frame = [[-1.55, -1.05], [1.55, -1.05], [1.55, 1.05], [-1.55, 1.05], [-1.55, -1.05]].map(([x, y]) => new V3(HP.x + x, HP.y + y, -7.355));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(frame), addGlow(S('hex'), new THREE.LineBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(2.2), toneMapped: false }))));
    const ctr = new V3(HP.x, HP.y - 0.02, -7.3);
    [[[0, 0], [10, 0], PAL.amber], [[0, 10], [10, 10], PAL.amber], [[0, 0], [0, 10], PAL.lab], [[10, 0], [10, 10], PAL.lab]].forEach(([a, b, col]) => {
      const A = hexPos(...a), B = hexPos(...b), mid = A.clone().add(B).multiplyScalar(0.5), out = mid.clone().sub(ctr).setZ(0).normalize().multiplyScalar(0.13);
      const geo = new THREE.BufferGeometry().setFromPoints([A.clone().add(out), B.clone().add(out)]);
      scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: new THREE.Color(col).multiplyScalar(col === PAL.lab ? 1.3 : 2.2), toneMapped: false })));
    });
    hexCells.forEach((c, n) => { m4.makeTranslation(...hexPos(c.i, c.j).toArray()); hexMesh.setMatrixAt(n, m4); if (Math.random() < 0.32) c.stone = Math.random() < 0.5 ? 1 : 2; });
    scene.add(hexMesh);
    const cap = canvasTex(512, 48); cap.g.fillStyle = '#8b98b8'; cap.g.font = `500 24px ${FM}`; cap.g.textBaseline = 'middle'; cap.g.fillText('GRAPH TSETLIN MACHINE · HEX 11×11', 4, 26); cap.tex.needsUpdate = true;
    at(new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.15), new THREE.MeshBasicMaterial({ map: cap.tex, transparent: true, toneMapped: false })), HP.x - 0.7, HP.y - 1.2, -7.41);
    hitBox(3.0, 2.1, 0.4, HP.x, HP.y, -7.3, 'hex');
  }
  const clauses = []; let clauseT = 0; const hexLight = new Float32Array(121);
  const HB = [new THREE.Color(0.05, 0.08, 0.15), new THREE.Color(PAL.amber).multiplyScalar(0.55), new THREE.Color(PAL.lab).multiplyScalar(0.42)];
  function updateHex(dt) {
    if ((clauseT -= dt) <= 0) {
      clauseT = 1.2 + Math.random() * 0.8; let i = Math.floor(Math.random() * 11), j = Math.floor(Math.random() * 11); const cells = [];
      for (let k = 0; k < 5 + Math.floor(Math.random() * 4); k++) { cells.push(j * 11 + i); const [di, dj] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]][Math.floor(Math.random() * 6)]; i = clamp(i + di, 0, 10); j = clamp(j + dj, 0, 10); }
      clauses.push({ cells, t: 0 });
    }
    const light = hexLight.fill(0);
    for (let c = clauses.length - 1; c >= 0; c--) {
      const cl = clauses[c]; cl.t += dt;
      cl.cells.forEach((n, k) => { const l = cl.t - k * 0.09; const a = l < 0 ? 0 : l < 0.2 ? l / 0.2 : Math.max(0, 1 - (l - 0.9) / 1.2); light[n] = Math.max(light[n], a); });
      if (cl.t > 3.2) clauses.splice(c, 1);
    }
    const hv = S('hex').hover;
    hexCells.forEach((c, n) => { tc.copy(HB[c.stone]).lerp(COL.cyan, light[n] * 0.8).multiplyScalar(1 + light[n] * 2.4 + hv * 0.5); hexMesh.setColorAt(n, tc); });
    hexMesh.instanceColor.needsUpdate = true;
  }

  /* ================= SHELVES ================= */
  const SR = new V3(-1.5, 0, -6.85), SW = 3.3, SD = 0.95;
  const levels = [{ cat: 'research', y: 0.16 }, { cat: 'ventures', y: 1.24 }, { cat: 'safe', y: 2.32 }];
  const shelfLabels = [];
  {
    [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => at(rb(0.06, 3.5, 0.06, 0.02, M.ink), SR.x + sx * (SW / 2 - 0.03), 1.8, SR.z + sz * (SD / 2 - 0.03))));
    const glassM = new THREE.MeshPhysicalMaterial({ color: 0xdfe8f2, roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.3, envMap: ENV, envMapIntensity: 1 });
    [0.12, 1.2, 2.28, 3.42].forEach((y) => { const s = rb(SW, 0.03, SD, 0.012, glassM); s.castShadow = false; at(s, SR.x, y, SR.z); [-1, 1].forEach((sz) => at(rb(SW, 0.03, 0.04, 0.012, M.ink), SR.x, y, SR.z + sz * (SD / 2 - 0.02))); });
    const faceM = new THREE.MeshPhysicalMaterial({ color: PAL.lab, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.15, envMap: ENV, envMapIntensity: 0.4 });
    const okM = glow(PAL.green, 2.4);
    levels.forEach((lv, li) => {
      const ids = C.order.filter((id) => C.P[id].cat === lv.cat), n = ids.length, bw = Math.min(0.6, 2.9 / n - 0.12), slitM = glow(CAT[lv.cat], 2.4);
      ids.forEach((id, k) => {
        const h = 0.5 + ((k * 37 + li * 11) % 4) * 0.09, x = SR.x - 1.45 + bw / 2 + k * ((2.9 - bw) / Math.max(1, n - 1));
        const b = at(rb(bw, h, 0.6, 0.05, M.ink), x, lv.y + 0.02 + h / 2, SR.z + 0.04);
        const face = rb(bw * 0.84, h * 0.8, 0.02, 0.02, faceM); face.position.set(0, 0.02, 0.3); face.castShadow = false; b.add(face);
        const slit = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.56, 0.02, 0.01), slitM); slit.position.set(0, -h * 0.26, 0.315); b.add(slit);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), okM); dot.position.set(bw * 0.3, h * 0.3, 0.315); b.add(dot);
      });
      const led = addGlow(S('shelf_' + lv.cat), glow(CAT[lv.cat], 2.4));
      at(new THREE.Mesh(new THREE.BoxGeometry(SW - 0.2, 0.014, 0.014), led), SR.x, lv.y - 0.06, SR.z + SD / 2 - 0.05);
      const wash = new THREE.Mesh(new THREE.PlaneGeometry(SW - 0.2, SD - 0.15), new THREE.MeshBasicMaterial({ color: new THREE.Color(CAT[lv.cat]).multiplyScalar(0.5), transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
      wash.rotation.x = -Math.PI / 2; at(wash, SR.x, lv.y - 0.025, SR.z);
      const lt = canvasTex(512, 64); const lm = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.15), new THREE.MeshBasicMaterial({ map: lt.tex, transparent: true, toneMapped: false }));
      at(lm, SR.x - SW / 2 + 0.75, lv.y - 0.13, SR.z + SD / 2 + 0.01); shelfLabels.push({ lt, li, cat: lv.cat });
      hitBox(SW, 1.04, SD + 0.2, SR.x, lv.y + 0.52, SR.z, 'shelf_' + lv.cat);
    });
  }
  function drawShelfLabels() {
    shelfLabels.forEach(({ lt, li, cat }) => { const g = lt.g; g.clearRect(0, 0, 512, 64); g.fillStyle = '#c9cfdd'; g.textBaseline = 'middle'; const txt = `0${3 - li} · ${L().ui.filters[cat].toUpperCase()}`; fitFont(g, txt, 500, 30, FM, 500); g.fillText(txt, 4, 34); lt.tex.needsUpdate = true; });
  }
  drawShelfLabels();

  /* ================= STATUS DISPLAY ================= */
  const stTex = canvasTex(1024, 234);
  {
    at(rb(3.66, 0.94, 0.05, 0.03, M.ink), 2.1, 3.25, -7.36);
    [-1.6, 1.6].forEach((x) => at(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 12).rotateX(Math.PI / 2), M.slat), 2.1 + x, 3.25, -7.4));
    at(new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.012, 0.012), glow(PAL.cyan, 2)), 2.1, 2.76, -7.33);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.8), new THREE.MeshBasicMaterial({ map: stTex.tex, toneMapped: false, color: new THREE.Color(1.7, 1.7, 1.7) })); at(scr, 2.1, 3.25, -7.332);
    hitBox(3.7, 1.0, 0.3, 2.1, 3.25, -7.3, 'status');
  }
  const status = { i: 0, typed: 0, hold: 0, drawn: -1 };
  function drawStatus(blink) {
    const g = stTex.g, lines = L().ui.status, line = lines[status.i % lines.length], n = Math.floor(status.typed);
    g.fillStyle = '#05080f'; g.fillRect(0, 0, 1024, 234);
    g.fillStyle = '#3DDC97'; g.beginPath(); g.arc(40, 46, 8, 0, 7); g.fill();
    g.fillStyle = '#5f6d90'; g.font = `500 22px ${FM}`; g.textBaseline = 'middle'; g.fillText('LAB STATUS', 60, 47);
    g.textAlign = 'right'; g.fillText(`${String((status.i % lines.length) + 1).padStart(2, '0')} / ${String(lines.length).padStart(2, '0')}`, 990, 47); g.textAlign = 'left';
    fitFont(g, line, 500, 46, FM, 950); g.fillStyle = '#5BC8FF'; const shown = line.slice(0, n); g.fillText(shown, 30, 148);
    if (blink) { const w = g.measureText(shown).width; g.fillRect(36 + w, 124, 20, 46); }
    const prog = status.typed < line.length ? (status.typed / line.length) * 0.25 : 0.25 + Math.min(1, status.hold / 3.4) * 0.75;
    g.fillStyle = 'rgba(91,200,255,0.12)'; g.fillRect(30, 204, 964, 4); g.fillStyle = '#5BC8FF'; g.fillRect(30, 204, 964 * prog, 4);
    g.fillStyle = 'rgba(255,255,255,0.022)'; for (let y = 0; y < 234; y += 4) g.fillRect(0, y, 1024, 1);
    stTex.tex.needsUpdate = true;
  }
  function updateStatus(dt, t) {
    const line = L().ui.status[status.i % 4];
    if (status.typed < line.length) status.typed = Math.min(line.length, status.typed + dt * 30);
    else if ((status.hold += dt) > 3.4) { status.hold = 0; status.typed = 0; status.i++; }
    const blink = Math.floor(t * 2.2) % 2 === 0, sig = `${Math.floor(status.typed)}|${blink}|${status.i}|${Math.floor(status.hold * 15)}`;
    if (sig !== status.drawn) { status.drawn = sig; drawStatus(blink); }
  }

  /* ================= WHITEBOARD ================= */
  const wbTex = canvasTex(1024, 614);
  {
    at(rb(3.14, 1.94, 0.03, 0.02, M.ink), -5.3, 2.3, -7.4);
    at(new THREE.Mesh(new THREE.PlaneGeometry(3.06, 1.86), new THREE.MeshStandardMaterial({ map: wbTex.tex, roughness: 0.35 })), -5.3, 2.3, -7.355);
    const wbGlass = rb(3.12, 1.92, 0.025, 0.03, new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, clearcoat: 1, transparent: true, opacity: 0.1, envMap: ENV, envMapIntensity: 1.4 })); wbGlass.castShadow = false; at(wbGlass, -5.3, 2.3, -7.33);
    [[-1.45, 0.86], [1.45, 0.86], [-1.45, -0.86], [1.45, -0.86]].forEach(([x, y]) => at(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.07, 16).rotateX(Math.PI / 2), M.slat), -5.3 + x, 2.3 + y, -7.31));
    at(rb(1.6, 0.03, 0.12, 0.012, M.ink), -5.3, 1.3, -7.32);
    [[0x1c2440, -5.65], [PAL.red, -5.4], [PAL.green, -5.15]].forEach(([c, x]) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.15, 4, 8), new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.3, clearcoat: 1 })); m.rotation.z = Math.PI / 2; at(m, x, 1.34, -7.3); });
    hitBox(3.2, 2.1, 0.3, -5.3, 2.3, -7.3, 'whiteboard');
  }
  function drawWhiteboard() {
    const g = wbTex.g; let s = 3; const j = () => ((s = (s * 16807) % 2147483647) / 2147483647 - 0.5) * 3;
    g.fillStyle = '#F4F3EE'; g.fillRect(0, 0, 1024, 614);
    const ln = (pts, col, w = 6) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x + j(), y + j()) : g.moveTo(x + j(), y + j()))); g.stroke(); };
    const circ = (x, y, r, col) => { const p = []; for (let a = 0; a <= 6.5; a += 0.4) p.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); ln(p, col, 5); };
    const INK = '#24304f', RED = '#e04a50', GRN = '#21a874', CYN = '#2c8fc7';
    const cols = [[90, [150, 230, 310]], [170, [120, 190, 260, 330]], [250, [180, 280]]];
    for (let c = 0; c < 2; c++) for (const y1 of cols[c][1]) for (const y2 of cols[c + 1][1]) ln([[cols[c][0], y1], [cols[c + 1][0], y2]], '#a9b3c9', 2.5);
    cols.forEach(([x, ys]) => ys.forEach((y) => circ(x, y, 13, CYN)));
    ln([[300, 230], [410, 230]], INK); ln([[392, 214], [412, 230], [392, 246]], INK);
    ln([[450, 330], [450, 140], [610, 140], [610, 330]], INK, 7); ln([[440, 128], [622, 128]], INK, 7);
    for (let k = 0; k < 3; k++) { g.strokeStyle = '#d89a2b'; g.lineWidth = 4; g.beginPath(); g.ellipse(500 + k * 30, 240, 16, 62, 0, 0, 7); g.stroke(); }
    ln([[640, 230], [740, 230]], INK); ln([[722, 214], [742, 230], [722, 246]], INK);
    ln([[770, 170], [930, 170], [930, 290], [770, 290], [770, 170]], INK, 5); ln([[795, 232], [825, 262], [895, 196]], GRN, 8);
    ln([[740, 260], [680, 330], [560, 352]], RED, 4); g.fillStyle = RED; g.font = `600 30px ${FD}`; g.fillText('rework', 440, 368);
    g.fillStyle = INK; g.font = `italic 700 76px ${FD}`; g.textBaseline = 'alphabetic'; const txt = L().about.title.toLowerCase() + ' →'; g.fillText(txt, 90, 520);
    ln([[90, 545], [90 + g.measureText(txt).width, 545]], RED, 5);
    g.font = `500 26px ${FM}`; g.fillStyle = '#6b7590'; g.fillText('agents → gate → ✓', 640, 520);
    wbTex.tex.needsUpdate = true;
  }
  drawWhiteboard();

  /* ================= LOG MAP — holographic course map (opens Notes) ================= */
  const LB = new V3(-6.6, 0, 6.0), HY = 1.95;
  const holo = new THREE.Group(); holo.position.set(LB.x, HY, LB.z); scene.add(holo);
  const holoSpin = new THREE.Group(); holo.add(holoSpin);
  const holoMats = [];
  const hm = (m) => { holoMats.push({ m, base: m.opacity }); return m; };
  const addM = (hex, k, op) => hm(new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }));
  const lineM = (hex, k, op) => hm(new THREE.LineBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  // emitter pedestal
  {
    at(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.08, 48), M.ink), LB.x, 0.09, LB.z).receiveShadow = true;
    at(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.55, 0.5, 48), M.ink), LB.x, 0.38, LB.z).castShadow = true;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.014, 6, 72), addGlow(S('logbook'), glow(PAL.cyan, 2.4))); rim.rotation.x = Math.PI / 2; at(rim, LB.x, 0.635, LB.z);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.3, 48), glow(PAL.cyan, 1.6)); lens.rotation.x = -Math.PI / 2; at(lens, LB.x, 0.637, LB.z);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; at(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.012), glow(PAL.cyan, 1.4)), LB.x + Math.cos(a) * 0.5, 0.25, LB.z + Math.sin(a) * 0.5).rotation.y = -a; }
    hitBox(2.1, 3.2, 2.1, LB.x, 1.5, LB.z, 'logbook');
  }
  // light cone: fades upward, scanlines drift
  const coneMat = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uK: { value: 1 }, uC: { value: new THREE.Color(PAL.cyan) } },
    vertexShader: 'varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: 'uniform float uT; uniform float uK; uniform vec3 uC; varying vec2 vUv; varying vec3 vW; void main(){ float f = pow(clamp(1.0 - vUv.y, 0.0, 1.0), 1.7) * 0.42 + 0.04; float s = 0.72 + 0.28 * sin(vW.y * 70.0 - uT * 5.0); gl_FragColor = vec4(uC * f * s * uK, 1.0); }',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  at(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.3, 0.92, 64, 1, true), coneMat), LB.x, 1.1, LB.z);
  // polar grid floor of the hologram
  {
    const gy = -0.4, pts = [];
    [0.3, 0.6, 0.9].forEach((rr) => { for (let i = 0; i < 64; i++) { const a0 = (i / 64) * Math.PI * 2, a1 = ((i + 1) / 64) * Math.PI * 2; pts.push(new V3(Math.cos(a0) * rr, gy, Math.sin(a0) * rr), new V3(Math.cos(a1) * rr, gy, Math.sin(a1) * rr)); } });
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; pts.push(new V3(Math.cos(a) * 0.12, gy, Math.sin(a) * 0.12), new V3(Math.cos(a) * 0.96, gy, Math.sin(a) * 0.96)); }
    holo.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), lineM(PAL.cyan, 1.6, 0.35)));
  }
  // wire globe + core
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.8, 2)), lineM(PAL.cyan, 1.3, 0.13)); holo.add(wire);
  holo.add(new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), addM(PAL.lab, 2.6, 0.9)));
  // orbit rings with satellites
  const orbits = [[0.98, 0.35, 0.2], [1.08, -0.5, 1.2], [0.9, 1.1, -0.4]].map(([rr, tx, tz], i) => {
    const g = new THREE.Group(); g.rotation.set(tx, 0, tz); holo.add(g);
    g.add(new THREE.Mesh(new THREE.TorusGeometry(rr, 0.004, 4, 128), addM(i === 1 ? PAL.amber : PAL.cyan, 2.2, 0.55)));
    const sat = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), addM(i === 1 ? PAL.amber : PAL.cyan, 3, 1)); sat.position.x = rr; g.add(sat);
    return g;
  });
  // the 21 courses: spiral by date, inner ring bachelor, outer ring master
  const notesData = C.en.notes.slice().sort((a, b) => a.date.localeCompare(b.date));
  const nodeP = notesData.map((n, k) => {
    const yr = +n.date.slice(0, 4) + (+n.date.slice(5, 7) - 1) / 12, u = clamp((yr - 2023) / 3.5, 0, 1);
    const a = k * 0.92 + 0.4, rr = (n.level === 'm' ? 0.64 : 0.42) + ((k * 7) % 5) * 0.025;
    return new V3(Math.cos(a) * rr, -0.32 + u * 0.66, Math.sin(a) * rr);
  });
  const NODE_C = notesData.map((n) => new THREE.Color(n.level === 'm' ? PAL.cyan : PAL.amber));
  const nodeMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.036, 14, 10), new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), nodeP.length);
  nodeP.forEach((p, i) => { m4.makeTranslation(p.x, p.y, p.z); nodeMesh.setMatrixAt(i, m4); nodeMesh.setColorAt(i, NODE_C[i]); });
  holoSpin.add(nodeMesh);
  { const pts = []; nodeP.forEach((p) => pts.push(p.clone(), new V3(p.x, -0.4, p.z))); holoSpin.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), lineM(PAL.cyan, 1.2, 0.16))); }
  const thread = new THREE.CatmullRomCurve3(nodeP, false, 'centripetal');
  holoSpin.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(thread.getPoints(260)), lineM(PAL.lab, 1.6, 0.45)));
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 10), addM(PAL.lab, 3.2, 1)); holoSpin.add(pulse);
  // drifting data particles
  const dust = (() => { const n = 180, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const v = new V3().randomDirection().multiplyScalar(Math.cbrt(Math.random()) * 0.9); v.toArray(p, i * 3); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); return new THREE.Points(g, hm(new THREE.PointsMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(1.8), size: 0.018, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))); })();
  holoSpin.add(dust);
  // floating label
  const mapLbl = canvasTex(640, 96);
  { const g = mapLbl.g; g.font = `500 30px ${FM}`; g.textBaseline = 'middle'; g.fillStyle = '#8fd6ff'; g.fillText('LOG MAP · 21 · 2023–26', 10, 36); g.fillStyle = '#FFB547'; g.beginPath(); g.arc(18, 76, 7, 0, 7); g.fill(); g.fillStyle = '#5BC8FF'; g.beginPath(); g.arc(190, 76, 7, 0, 7); g.fill(); g.fillStyle = '#9aa6c4'; g.font = `500 22px ${FM}`; g.fillText('B.Eng', 34, 77); g.fillText('M.Sc', 206, 77); mapLbl.tex.needsUpdate = true; }
  const mapLabel = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.19), hm(new THREE.MeshBasicMaterial({ map: mapLbl.tex, transparent: true, opacity: 0.95, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending })));
  scene.add(mapLabel);
  const tmpC2 = new THREE.Color();
  function updateLog(dt, t) {
    const hv = S('logbook').hover;
    holo.position.y = HY + Math.sin(t * 0.8) * 0.03;
    holoSpin.rotation.y += dt * 0.22 * (1 + hv * 1.6);
    wire.rotation.y -= dt * 0.08; wire.rotation.x = Math.sin(t * 0.2) * 0.2;
    orbits.forEach((o, i) => { o.children[1].position.set(Math.cos(t * (0.7 + i * 0.3)) * o.children[0].geometry.parameters.radius, Math.sin(t * (0.7 + i * 0.3)) * o.children[0].geometry.parameters.radius, 0); o.rotation.y += dt * 0.05 * (i + 1); });
    const flick = 0.93 + Math.sin(t * 37) * 0.03 + (Math.random() < 0.015 ? -0.3 : 0);
    holoMats.forEach(({ m, base }) => (m.opacity = Math.min(1, base * flick * (1 + hv * 0.7))));
    coneMat.uniforms.uT.value = t; coneMat.uniforms.uK.value = flick * (1 + hv * 0.9);
    const u = (t * 0.07) % 1; pulse.position.copy(thread.getPoint(u));
    const ui = u * (nodeP.length - 1);
    nodeP.forEach((p, i) => { nodeMesh.setColorAt(i, tmpC2.copy(NODE_C[i]).multiplyScalar(1.7 + 2.6 * Math.exp(-((ui - i) ** 2) * 1.5) + hv)); });
    nodeMesh.instanceColor.needsUpdate = true;
    mapLabel.position.set(LB.x, holo.position.y + 1.08, LB.z); mapLabel.quaternion.copy(camera.quaternion);
  }

  /* ================= MAILBOX + ANTENNA ================= */
  const MB = new V3(8.9, 0, 3.0), TIP = new V3(9.55, 4.42, 2.2);
  let tipMat; const sigRings = [];
  const termTex = canvasTex(640, 400);
  function drawTerminal(blink) {
    const g = termTex.g, u = L().ui.terminal;
    g.fillStyle = '#060a15'; g.fillRect(0, 0, 640, 400);
    g.fillStyle = '#3DDC97'; g.beginPath(); g.arc(34, 38, 7, 0, 7); g.fill();
    g.fillStyle = '#7f8db0'; g.font = `500 20px ${FM}`; g.textBaseline = 'middle'; g.fillText(u.status, 52, 39);
    g.fillStyle = '#E9E6DF'; fitFont(g, L().contact.title, 600, 52, FD, 580); g.fillText(L().contact.title, 30, 128);
    g.fillStyle = '#5BC8FF'; g.font = `500 23px ${FM}`; g.fillText(C.email, 30, 196);
    g.fillStyle = 'rgba(91,200,255,0.12)'; g.fillRect(30, 222, 580, 2);
    g.strokeStyle = '#5BC8FF'; g.lineWidth = 2; g.beginPath(); g.roundRect(30, 262, 300, 62, 14); g.stroke();
    g.fillStyle = '#5BC8FF'; g.font = `500 22px ${FM}`; g.fillText(u.send + ' →', 52, 294);
    if (blink) g.fillRect(352, 276, 14, 34);
    g.fillStyle = 'rgba(255,255,255,0.025)'; for (let y = 0; y < 400; y += 4) g.fillRect(0, y, 640, 1);
    termTex.tex.needsUpdate = true;
  }
  const envOpen = { v: 0 }; let envGroup, envFlap, envMat;
  {
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.68, 0.06, 6), M.ink); pad.rotation.y = Math.PI / 6; pad.receiveShadow = true; at(pad, MB.x, 0.08, MB.z);
    const padRing = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.012, 6, 6), addGlow(S('mailbox'), glow(PAL.cyan, 2.2))); padRing.rotation.set(Math.PI / 2, 0, Math.PI / 6); at(padRing, MB.x, 0.115, MB.z);
    const body = rb(0.62, 0.92, 0.42, 0.12, M.lab); body.rotation.y = 0.5; at(body, MB.x, 0.57, MB.z);
    const head = new THREE.Group(); head.rotation.y = 0.5; at(head, MB.x, 1.06, MB.z);
    const tilt = new THREE.Group(); tilt.rotation.x = -0.55; head.add(tilt);
    tilt.add(rb(0.78, 0.52, 0.06, 0.04, M.ink));
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.44), new THREE.MeshBasicMaterial({ map: termTex.tex, toneMapped: false, color: new THREE.Color(1.5, 1.5, 1.5) })); scr.position.z = 0.032; tilt.add(scr);
    const sl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.012, 0.012), glow(PAL.cyan, 2)); sl.position.set(0, -0.05, 0.215); body.add(sl);
    envGroup = new THREE.Group(); at(envGroup, MB.x, 1.78, MB.z);
    envMat = new THREE.LineBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(2.6), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    const W = 0.36, H = 0.24;
    envGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new V3(-W, -H, 0), new V3(W, -H, 0), new V3(W, -H, 0), new V3(W, H, 0), new V3(W, H, 0), new V3(-W, H, 0), new V3(-W, H, 0), new V3(-W, -H, 0), new V3(-W, -H, 0), new V3(-0.06, 0.02, 0), new V3(W, -H, 0), new V3(0.06, 0.02, 0)]), envMat));
    envFlap = new THREE.Group(); envFlap.position.y = H; envGroup.add(envFlap);
    envFlap.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([new V3(-W, 0, 0), new V3(0, -H * 1.05, 0), new V3(0, -H * 1.05, 0), new V3(W, 0, 0)]), envMat));
    envGroup.add(new THREE.Mesh(new THREE.PlaneGeometry(W * 2, H * 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(0.5), transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })));
    const envRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.006, 6, 96), glow(PAL.cyan, 2)); envRing.rotation.x = Math.PI / 2; envRing.position.y = -0.38; envGroup.add(envRing);
    at(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.06, 40), M.ink), TIP.x, 0.08, TIP.z);
    [[0.11, 0.08, 0.1, 1.6], [0.08, 0.06, 1.7, 1.3], [0.055, 0.04, 3.0, 1.3]].forEach(([r0, r1, y0, h], i) => {
      at(new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, h, 24), M.lab), TIP.x, y0 + h / 2, TIP.z).castShadow = true;
      at(new THREE.Mesh(new THREE.CylinderGeometry(r1 + 0.02, r1 + 0.02, 0.05, 24), M.ink), TIP.x, y0 + h, TIP.z);
      const em = new THREE.Mesh(new THREE.TorusGeometry(0.24 - i * 0.05, 0.011, 6, 48), glow(PAL.cyan, 1.8)); em.rotation.x = Math.PI / 2; at(em, TIP.x, y0 + h - 0.12, TIP.z);
    });
    const labD = M.lab.clone(); labD.side = THREE.DoubleSide;
    const dish = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 12, 0, Math.PI * 2, 0, 0.75), labD); dish.rotation.set(-0.5, 0, 0.75); dish.castShadow = true; at(dish, TIP.x - 0.25, 2.95, TIP.z);
    at(new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), glow(PAL.amber, 2.4)), TIP.x - 0.25 - 0.18, 3.13, TIP.z - 0.08);
    tipMat = addGlow(S('mailbox'), glow(PAL.cyan, 3)); at(new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), tipMat), TIP.x, TIP.y, TIP.z);
    for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.012, 6, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); m.rotation.x = Math.PI / 2; at(m, TIP.x, TIP.y, TIP.z); sigRings.push(m); }
    hitBox(1.9, 4.7, 1.8, 9.2, 2.35, 2.6, 'mailbox');
  }
  let termSig = '';
  const planeGeo = (() => { const g = new THREE.BufferGeometry(); const v = [0, 0, 0.3, -0.22, 0.02, -0.2, 0, 0, -0.2, 0, 0, 0.3, 0, 0, -0.2, 0.22, 0.02, -0.2, 0, 0, 0.3, 0, -0.08, -0.2, 0, 0, -0.2]; g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.computeVertexNormals(); return g; })();
  const planes = []; let flagUp = 0;
  function paperPlane() {
    const out = net.outputs[Math.floor(Math.random() * net.outputs.length)], end = net.nodeWorld(out.node);
    const m = new THREE.Mesh(planeGeo, new THREE.MeshStandardMaterial({ color: 0xf6f4ee, roughness: 0.6, emissive: new THREE.Color(PAL.cyan), emissiveIntensity: 0.35, side: THREE.DoubleSide })); m.castShadow = true; scene.add(m);
    const start = envGroup.position.clone();
    const curve = new THREE.CubicBezierCurve3(start, start.clone().add(new V3(0.2, 2.6, 0.8)), end.clone().add(new V3(5, -1, 5)), end);
    const trailN = 40, tp = new Float32Array(trailN * 3); for (let i = 0; i < trailN; i++) start.toArray(tp, i * 3);
    const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.BufferAttribute(tp, 3));
    const trail = new THREE.Line(tg, new THREE.LineBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(2.4), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); trail.frustumCulled = false; scene.add(trail);
    planes.push({ m, curve, t: 0, node: out.node, trail, tp, trailN }); flagUp = 1;
  }
  function updateMail(dt, t) {
    const hv = S('mailbox').hover; flagUp = Math.max(0, flagUp - dt * 0.15);
    envOpen.v += ((Math.max(hv, flagUp > 0 ? 1 : 0)) - envOpen.v) * (1 - Math.exp(-dt * 6));
    envFlap.rotation.x = -envOpen.v * 2.6;
    envGroup.rotation.y = t * 0.6; envGroup.position.y = 1.78 + Math.sin(t * 1.4) * 0.05;
    envMat.opacity = (0.75 + 0.2 * Math.sin(t * 31)) * (1 + hv * 0.4);
    const blink = Math.floor(t * 2) % 2 === 0, sig = blink + L().contact.title; if (sig !== termSig) { termSig = sig; drawTerminal(blink); }
    tipMat.color.copy(COL.cyan).multiplyScalar(1.6 + (Math.sin(t * 3) > 0.7 ? 2.2 : 0) + hv * 1.2);
    sigRings.forEach((m, i) => { const ph = ((t * 0.45 + i / 3) % 1); m.scale.setScalar(1 + ph * 3.2); m.material.opacity = (1 - ph) * 0.5; });
    for (let i = planes.length - 1; i >= 0; i--) {
      const p = planes[i]; p.t += dt / 3.4; const k = ease(Math.min(1, p.t));
      p.m.position.copy(p.curve.getPoint(k)); p.m.lookAt(p.curve.getPoint(Math.min(1, k + 0.01))); p.m.rotateZ(Math.sin(p.t * 9) * 0.25);
      p.tp.copyWithin(3, 0, (p.trailN - 1) * 3); p.m.position.toArray(p.tp, 0); p.trail.geometry.attributes.position.needsUpdate = true; p.trail.material.opacity = 0.8 * (1 - Math.max(0, p.t - 0.85) / 0.15);
      if (p.t >= 1) { net.flashNode(p.node); net.burst(14); scene.remove(p.m); scene.remove(p.trail); p.trail.geometry.dispose(); planes.splice(i, 1); }
    }
  }

  /* ---- hologram human: fresnel rim, rising scanlines, a travelling scan band and a rare glitch ---- */
  const holoVS = `uniform float uT; uniform float uSeed; varying vec3 vN; varying vec3 vW;
    void main(){ vec3 p = position; float gl = step(0.975, fract(sin(floor(uT * 7.0 + uSeed) * 12.9898) * 43758.5453));
      vec4 w = modelMatrix * vec4(p, 1.0); w.x += gl * sin(w.y * 55.0 + uT * 30.0) * 0.018; vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`;
  const holoFS = `uniform vec3 uC; uniform float uT; uniform float uK; uniform float uY0; varying vec3 vN; varying vec3 vW;
    void main(){ vec3 V = normalize(cameraPosition - vW); float f = 1.0 - abs(dot(normalize(vN), V)); float rim = pow(f, 2.0);
      float scan = 0.72 + 0.28 * sin(vW.y * 95.0 - uT * 7.0);
      float h = fract((vW.y - uY0) * 0.75 - uT * 0.4); float band = smoothstep(0.0, 0.03, h) * (1.0 - smoothstep(0.03, 0.09, h));
      vec3 col = mix(uC * 0.42, uC * 1.9, rim) * scan + uC * band * 0.9;
      float a = clamp((0.42 + rim * 0.55) * scan + band * 0.35, 0.0, 1.0) * clamp(uK, 0.0, 1.2);
      gl_FragColor = vec4(col * uK, a); }`;
  function holoMat(hex, seed) { return new THREE.ShaderMaterial({ uniforms: { uC: { value: new THREE.Color(hex).multiplyScalar(1.15) }, uT: { value: 0 }, uK: { value: 1 }, uSeed: { value: seed }, uY0: { value: 0 } }, vertexShader: holoVS, fragmentShader: holoFS, transparent: true, depthWrite: false, toneMapped: false }); }
  function makeHuman(hex, kind, seed) {
    const mat = holoMat(hex, seed), root = new THREE.Group();
    const mesh = (geo, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
    const grp = (parent, x, y, z) => { const o = new THREE.Group(); o.position.set(x, y, z); parent.add(o); return o; };
    const cap = (r, len) => new THREE.CapsuleGeometry(r, Math.max(0.001, len - 2 * r), 6, 16);
    const lathe = (pts, sz = 1) => { const g = new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 36); g.scale(1, 1, sz); return g; };
    // legs
    const legs = [-1, 1].map((s) => { const hip = grp(root, s * 0.062, 0.54, 0); mesh(cap(0.052, 0.3), hip, 0, -0.14, 0); const knee = grp(hip, 0, -0.27, 0); mesh(cap(0.042, 0.28), knee, 0, -0.13, 0); const foot = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.08, 4, 10).rotateX(Math.PI / 2), mat); foot.position.set(0, -0.27, 0.03); knee.add(foot); return { hip, knee }; });
    mesh(new THREE.SphereGeometry(0.1, 24, 16).scale(1.3, 0.75, 0.85), root, 0, 0.57, 0);
    // torso: waist to shoulders
    const torso = grp(root, 0, 0.56, 0);
    mesh(lathe([[0.0, 0], [0.105, 0.0], [0.112, 0.08], [0.118, 0.16], [0.135, 0.24], [0.155, 0.31], [0.165, 0.35], [0.14, 0.385], [0.06, 0.405], [0.0, 0.41]], 0.62), torso);
    const neck = grp(torso, 0, 0.405, 0); mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.07, 18), neck, 0, 0.025, 0);
    const head = grp(neck, 0, 0.06, 0);
    mesh(new THREE.SphereGeometry(0.082, 32, 24).scale(0.86, 1.12, 0.98), head, 0, 0.07, 0);
    mesh(new THREE.SphereGeometry(0.05, 20, 14).scale(1.05, 0.7, 0.9), head, 0, 0.018, 0.022);
    mesh(new THREE.ConeGeometry(0.012, 0.03, 10).rotateX(Math.PI / 2 + 0.25), head, 0, 0.065, 0.082);
    [-1, 1].forEach((s) => mesh(new THREE.SphereGeometry(0.014, 10, 8).scale(0.5, 1, 0.7), head, s * 0.07, 0.068, 0));
    // arms
    const arms = [-1, 1].map((s) => { const sh = grp(torso, s * 0.17, 0.355, 0); sh.rotation.z = s * 0.08; mesh(new THREE.SphereGeometry(0.042, 16, 12), sh); mesh(cap(0.036, 0.26), sh, 0, -0.13, 0); const el = grp(sh, 0, -0.26, 0); mesh(cap(0.03, 0.24), el, 0, -0.115, 0); mesh(new THREE.SphereGeometry(0.03, 12, 10).scale(0.7, 1.25, 0.45), el, 0, -0.255, 0.004); return { sh, el, s }; });
    // character details
    if (kind === 'socrates') {
      mesh(lathe([[0.125, 0], [0.14, -0.12], [0.155, -0.26], [0.165, -0.38], [0.15, -0.4]], 0.72), root, 0, 0.58, 0);
      mesh(new THREE.SphereGeometry(0.05, 18, 14).scale(1, 1.3, 0.8), head, 0, -0.01, 0.045);
      mesh(new THREE.TorusGeometry(0.17, 0.02, 8, 30, Math.PI).rotateZ(-0.9), torso, 0, 0.26, 0.02);
    } else if (kind === 'quill') {
      mesh(new THREE.SphereGeometry(0.1, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.62).scale(0.95, 1.18, 1.05), head, 0, 0.08, -0.012);
      mesh(new THREE.CylinderGeometry(0.17, 0.3, 0.78, 28, 1, true, Math.PI * 0.55, Math.PI * 0.9), torso, 0, -0.02, -0.02);
    } else {
      mesh(new THREE.SphereGeometry(0.088, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58).scale(0.92, 1.15, 1.02), head, 0, 0.082, -0.006);
      mesh(new THREE.SphereGeometry(0.036, 14, 12), head, 0, 0.1, -0.09);
      mesh(new THREE.BoxGeometry(0.1, 0.01, 0.004), torso, 0, 0.33, 0.1);
    }
    return { root, mat, rig: { legs, torso, neck, head, arms } };
  }

  /* ================= PERSONA STAGE — Open Personas: personas, typed memory, one shared brain ================= */
  const PS = new V3(-1.6, 0, 6.8), BR = new V3(PS.x, 2.25, PS.z);
  const PCOL = [0xa98bff, 0xffb547, 0x3ddc97], PNAME = ['Socrates', 'Quill', 'Astrid'];
  const hol = (hex, k, op, wire = false) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, wireframe: wire, side: THREE.DoubleSide });
  const personas = [];
  let brainNodes, brainGroup;
  {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.08, 6), M.ink); base.rotation.y = Math.PI / 6; base.receiveShadow = true; at(base, PS.x, 0.08, PS.z);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.014, 6, 6), addGlow(S('persona'), glow(0xa98bff, 2.6))); rim.rotation.set(Math.PI / 2, 0, Math.PI / 6); at(rim, PS.x, 0.125, PS.z);
    const inner = new THREE.Mesh(new THREE.CircleGeometry(0.55, 6), hol(0xa98bff, 0.8, 0.25)); inner.rotation.set(-Math.PI / 2, 0, Math.PI / 6); at(inner, PS.x, 0.127, PS.z);
    brainGroup = new THREE.Group(); brainGroup.position.copy(BR); scene.add(brainGroup);
    const bn = []; for (let i = 0; i < 16; i++) bn.push(new V3().randomDirection().multiplyScalar(0.18 + Math.random() * 0.16));
    brainNodes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ toneMapped: false }), bn.length);
    bn.forEach((p, i) => { m4.makeTranslation(p.x, p.y, p.z); brainNodes.setMatrixAt(i, m4); brainNodes.setColorAt(i, tc.set(0xa98bff).multiplyScalar(2)); });
    brainGroup.add(brainNodes); brainGroup.userData.act = new Float32Array(bn.length);
    const lp = []; bn.forEach((a, i) => bn.forEach((b, j) => { if (j > i && a.distanceTo(b) < 0.27) lp.push(a, b); }));
    brainGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lp), new THREE.LineBasicMaterial({ color: new THREE.Color(0xa98bff).multiplyScalar(1.6), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
    brainGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), hol(0xa98bff, 1.2, 0.12, true)));
    PCOL.forEach((col, k) => {
      const a = Math.PI / 2 + (k * Math.PI * 2) / 3, p = new V3(PS.x + Math.cos(a) * 0.86, 0, PS.z + Math.sin(a) * 0.86);
      const g = new THREE.Group(); g.position.copy(p); g.rotation.y = Math.atan2(PS.x - p.x, PS.z - p.z); scene.add(g);
      const em = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.05, 32), M.ink); em.position.y = 0.15; g.add(em);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.008, 6, 48), glow(col, 2.4)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.18; g.add(ring);
      const yC = Math.atan2(PS.x - p.x, PS.z - p.z), yK = 0.74; let dy = yK - yC; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); g.rotation.y = yC + dy * 0.45;
      const H = makeHuman(col, ['socrates', 'quill', 'astrid'][k], k * 3.7); H.root.position.y = 0.18; H.root.scale.setScalar(1.3); g.add(H.root);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.23, 1.45, 32, 1, true), hol(col, 0.6, 0.04)); beam.position.y = 0.9; g.add(beam);
      const mem = [0.2, 0.225, 0.25, 0.275].map((y, i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(0.235 - i * 0.008, 0.003, 4, 48), hol(col, 2, 0.4)); m.rotation.x = Math.PI / 2; m.position.y = y; g.add(m); return m; });
      const bub = canvasTex(320, 120); const bubM = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.19), new THREE.MeshBasicMaterial({ map: bub.tex, transparent: true, toneMapped: false, depthWrite: false })); scene.add(bubM);
      const head = new V3(p.x, 1.6, p.z);
      const link = new THREE.Line(new THREE.BufferGeometry().setFromPoints([head, BR]), new THREE.LineBasicMaterial({ color: new THREE.Color(col).multiplyScalar(1.4), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })); scene.add(link);
      const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), glow(col, 3.2)); pulse.visible = false; scene.add(pulse);
      personas.push({ g, H, mem, beam, bub, bubM, head, pulse, link, col: new THREE.Color(col), name: PNAME[k], drawn: '' });
    });
    const sg = canvasTex(512, 72), sgc = sg.g; sgc.fillStyle = 'rgba(10,14,28,0.9)'; sgc.beginPath(); sgc.roundRect(2, 2, 508, 68, 16); sgc.fill(); sgc.strokeStyle = '#A98BFF'; sgc.lineWidth = 2; sgc.stroke(); sgc.fillStyle = '#d6c9ff'; sgc.font = `600 26px ${FM}`; sgc.textBaseline = 'middle'; sgc.fillText('OPEN PERSONAS', 20, 37); sgc.fillStyle = '#8b80b8'; sgc.font = `500 20px ${FM}`; sgc.textAlign = 'right'; sgc.fillText('persona-core', 492, 38); sg.tex.needsUpdate = true;
    at(rb(0.06, 0.5, 0.06, 0.02, M.ink), PS.x + 0.95, 0.35, PS.z + 1.2);
    const sp = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.155), new THREE.MeshBasicMaterial({ map: sg.tex, transparent: true, toneMapped: false, side: THREE.DoubleSide, color: new THREE.Color(1.3, 1.3, 1.3) })); sp.rotation.y = 0.45; at(sp, PS.x + 0.95, 0.66, PS.z + 1.2);
    hitBox(2.8, 2.9, 2.8, PS.x, 1.35, PS.z, 'persona');
  }
  function drawBubble(p, speaking, ph) {
    const g = p.bub.g, hex = '#' + p.col.getHexString(), sig = speaking ? 's' + ph : 'q';
    if (sig === p.drawn) return; p.drawn = sig;
    g.clearRect(0, 0, 320, 120);
    g.fillStyle = 'rgba(10,14,28,0.88)'; g.strokeStyle = hex; g.lineWidth = 2; g.beginPath(); g.roundRect(4, 4, 312, 84, 20); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(40, 87); g.lineTo(56, 112); g.lineTo(68, 87); g.fill(); g.beginPath(); g.moveTo(40, 88); g.lineTo(56, 112); g.lineTo(68, 88); g.stroke();
    g.fillStyle = hex; g.font = `600 24px ${FM}`; g.textBaseline = 'middle'; g.fillText(p.name, 22, 46);
    for (let i = 0; i < 3; i++) { g.globalAlpha = speaking ? (ph === i ? 1 : 0.35) : 0.25; g.beginPath(); g.arc(240 + i * 22, 46, 7, 0, 7); g.fill(); } g.globalAlpha = 1;
    p.bub.tex.needsUpdate = true;
  }
  const ps = { k: 0, t: 0 };
  function updatePersona(dt, t) {
    const hv = S('persona').hover; ps.t += dt; if (ps.t > 4.2) { ps.t = 0; ps.k = (ps.k + 1) % personas.length; }
    brainGroup.rotation.y += dt * (0.3 + hv * 0.8); brainGroup.rotation.x = Math.sin(t * 0.3) * 0.25;
    const act = brainGroup.userData.act;
    personas.forEach((p, k) => {
      const spk = k === ps.k, fl = 0.9 + Math.sin(t * 29 + k) * 0.06;
      const U = p.H.mat.uniforms; U.uT.value = t; U.uK.value = (spk ? 1.15 : 0.9) * fl * (1 + hv * 0.2);
      const Rg = p.H.rig, br = Math.sin(t * 1.7 + k) * 0.012;
      Rg.torso.scale.set(1 + br * 0.5, 1 + br, 1 + br); Rg.torso.rotation.y = Math.sin(t * 0.45 + k) * 0.05;
      Rg.head.rotation.y = Math.sin(t * 0.55 + k * 2) * 0.32; Rg.head.rotation.x = spk ? 0.05 + Math.sin(t * 5.2) * 0.05 : 0.08;
      const gest = spk ? 0.5 + 0.5 * Math.sin(t * 2.3) : 0;
      Rg.arms[1].sh.rotation.x = -0.12 - gest * 0.75; Rg.arms[1].el.rotation.x = -0.2 - gest * 0.95; Rg.arms[1].sh.rotation.z = 0.12 + gest * 0.12;
      Rg.arms[0].sh.rotation.x = -0.06 - (spk ? 0.18 : 0); Rg.arms[0].el.rotation.x = -0.14 - (spk ? 0.35 : 0); Rg.arms[0].sh.rotation.z = -0.1;
      Rg.legs[0].hip.rotation.x = 0.02; Rg.legs[1].hip.rotation.x = -0.04 + Math.sin(t * 0.7 + k) * 0.02; Rg.legs[1].knee.rotation.x = 0.06;
      p.beam.material.opacity = (spk ? 0.06 : 0.035) * fl;
      p.mem.forEach((m, i) => { m.rotation.z = t * (i % 2 ? 0.6 : -0.5); m.material.opacity = 0.3 + (spk ? 0.3 : 0) * Math.abs(Math.sin(t * 3 + i)); });
      drawBubble(p, spk, Math.floor(t * 4) % 3);
      p.bubM.visible = spk || hv > 0.3; p.bubM.position.set(p.head.x, 1.98 + Math.sin(t * 1.5 + k) * 0.02, p.head.z); p.bubM.quaternion.copy(camera.quaternion);
      let u = -1, from, to;
      if (spk && ps.t < 1.4) { u = ps.t / 1.4; from = p.head; to = BR; }
      else if (k === (ps.k + 1) % personas.length && ps.t > 1.6 && ps.t < 3.0) { u = (ps.t - 1.6) / 1.4; from = BR; to = p.head; }
      p.pulse.visible = u >= 0; if (u >= 0) p.pulse.position.lerpVectors(from, to, ease(u));
      p.link.material.opacity = 0.2 + (u >= 0 ? 0.5 : 0) + hv * 0.3;
    });
    if (ps.t > 1.35 && ps.t < 1.45) for (let i = 0; i < act.length; i++) if (Math.random() < 0.35) act[i] = 1.6;
    for (let i = 0; i < act.length; i++) { act[i] *= Math.exp(-dt * 2); brainNodes.setColorAt(i, tc.set(0xa98bff).multiplyScalar(1.6 + act[i] * 2 + hv)); }
    brainNodes.instanceColor.needsUpdate = true;
  }

  /* ================= DATA CONDUITS — floor lines from each station to the network ================= */
  const conduits = [];
  {
    const HUB = net.hub;
    const hubPad = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.05, 6), M.ink); hubPad.rotation.y = Math.PI / 6; at(hubPad, HUB.x, 0.075, HUB.z);
    const hubRing = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.012, 6, 6), glow(PAL.cyan, 2.4)); hubRing.rotation.set(Math.PI / 2, 0, Math.PI / 6); at(hubRing, HUB.x, 0.105, HUB.z);
    if (!net.board) { const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.25, 9, 24, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(0.8), transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })); at(beam, HUB.x, 4.6, HUB.z); }
    const ends = { gate: [2.48, 2.1], dome: [-4.6, 4.1], redaction: [3.4, 6.45], game: [4.8, -1.6], hex: [5.7, -7.15], shelf_safe: [-1.5, -6.2], status: [2.1, -7.15], whiteboard: [-5.3, -7.15], logbook: [-6.6, 5.2], mailbox: [8.4, 3.4], persona: [-1.6, 5.4] };
    const vs = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }';
    const fs = 'uniform float uT; uniform float uHot; uniform float uLen; uniform vec3 uC; varying vec2 vUv; void main(){ float x = vUv.x * uLen; float p = smoothstep(0.82, 1.0, fract(x * 0.35 + uT * (0.35 + uHot * 0.9))); float k = 0.08 + p * (1.6 + uHot * 2.4) + uHot * 0.4; gl_FragColor = vec4(uC * k, 1.0); }';
    Object.entries(ends).forEach(([id, [x, z]]) => {
      const a = new V3(x, 0.075, z), b = new V3(HUB.x, 0.075, HUB.z), mid = new V3((a.x + b.x) / 2, 0.075, (a.z + b.z) / 2);
      const off = new V3(-(b.z - a.z), 0, b.x - a.x).normalize().multiplyScalar(0.6 + (id.length % 3) * 0.25); mid.add(off);
      const curve = new THREE.CatmullRomCurve3([a, mid, b]); const len = curve.getLength();
      const mat = new THREE.ShaderMaterial({ uniforms: { uT: { value: 0 }, uHot: { value: 0 }, uLen: { value: len }, uC: { value: new THREE.Color(PAL.cyan) } }, vertexShader: vs, fragmentShader: fs, toneMapped: false });
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.026, 6, false), mat); scene.add(tube);
      const groove = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.05, 6, false), M.ink); groove.scale.y = 0.35; groove.position.y = 0.03; groove.receiveShadow = true; scene.add(groove);
      conduits.push({ id, mat });
    });
  }
  function updateConduits(dt, t) { conduits.forEach((c) => { const st = S(c.id); c.mat.uniforms.uT.value = t; c.mat.uniforms.uHot.value = st ? st.hover : 0; }); }

  /* ================= hover & per-frame ================= */
  let hoverId = null;
  function setHover(id) { hoverId = id === 'agent' ? 'dome' : id === 'card' ? 'gate' : id; }
  function update(dt, t) {
    stations.forEach((st) => {
      st.hover += ((hoverId === st.id ? 1 : 0) - st.hover) * (1 - Math.exp(-dt * 8));
      st.glows.forEach((g) => { if (g.mat !== scanMat && g.mat !== tipMat) g.mat.color.copy(g.base).multiplyScalar(1 + st.hover * 1.1); });
      st.beacon.position.y = st.beaconY + Math.sin(t * 1.6 + st.anchor.x) * 0.06; st.beacon.rotation.y = t * 0.8 + st.anchor.z; st.beacon.scale.setScalar(1 + st.hover * 0.45);
    });
    updateAgents(dt, t); updateBelt(dt, t); updateDesk(dt, t); updateGame(dt, t); updateHex(dt); updateStatus(dt, t); updateLog(dt, t); updateMail(dt, t); updateConduits(dt, t); updatePersona(dt, t);
  }
  function setLang() {
    drawSheet(); buildBars(); drawShelfLabels(); drawWhiteboard(); status.drawn = -1; hudDirty = true; termSig = ''; drawReworkSign();
    for (const k in cardTex) { cardTex[k].dispose(); delete cardTex[k]; }
  }

  return { stations, stationMap, hotspots, agentMeshes, cardHits: () => cards.map((c) => c.m), update, setHover, dragStart, dragMove, dragEnd, setLang, paperPlane, bigMove: false };
}
