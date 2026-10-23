// Synthesised WebAudio for the lab: a low hum plus short blips for clicks,
// gate passes/fails and the paper plane. Silent until the visitor turns it on.
type Wave = OscillatorType;

export function createSound(store: { set(k: string, v: string): void }) {
  const S = {
    on: false,
    ctx: null as AudioContext | null,
    master: null as GainNode | null,
    hum: null as GainNode | null,
    ensure() {
      if (S.ctx) return true;
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return false;
      S.ctx = new AC();
      S.master = S.ctx.createGain();
      S.master.gain.value = 0;
      S.master.connect(S.ctx.destination);
      return true;
    },
    set(v: boolean) {
      S.on = v;
      store.set("gate.sound", v ? "1" : "0");
      if (v) {
        if (!S.ensure() || !S.ctx || !S.master) return;
        S.ctx.resume();
        if (!S.hum) S.startHum();
        S.master.gain.setTargetAtTime(1, S.ctx.currentTime, 0.4);
      } else if (S.ctx && S.master) S.master.gain.setTargetAtTime(0, S.ctx.currentTime, 0.12);
    },
    startHum() {
      const c = S.ctx!, g = c.createGain(), f = c.createBiquadFilter();
      g.gain.value = 0.02; f.type = "lowpass"; f.frequency.value = 240;
      ([[55, "triangle", 1], [110.3, "sine", 0.45], [164.6, "sine", 0.18]] as [number, Wave, number][]).forEach(([hz, type, amp]) => {
        const o = c.createOscillator(), og = c.createGain();
        o.type = type; o.frequency.value = hz; og.gain.value = amp; o.connect(og).connect(f); o.start();
      });
      const lfo = c.createOscillator(), lg = c.createGain();
      lfo.frequency.value = 0.13; lg.gain.value = 0.007; lfo.connect(lg).connect(g.gain); lfo.start();
      f.connect(g).connect(S.master!);
      S.hum = g;
    },
    blip(freq: number, dur: number, gain: number, type: Wave = "sine", end?: number) {
      if (!S.on || !S.ctx || !S.master) return;
      const c = S.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      if (end) o.frequency.exponentialRampToValueAtTime(end, t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(S.master); o.start(t); o.stop(t + dur + 0.05);
    },
    click(i = 0) { S.blip(1150 + i * 70, 0.05, 0.03); },
    pass() { S.blip(880, 0.3, 0.025, "sine", 1320); },
    fail() { S.blip(300, 0.22, 0.045, "triangle", 200); },
    bonk() { S.blip(250, 0.34, 0.16, "sine", 85); },
    plane() { S.blip(500, 0.9, 0.03, "sine", 1600); },
  };
  return S;
}

export type Sound = ReturnType<typeof createSound>;
