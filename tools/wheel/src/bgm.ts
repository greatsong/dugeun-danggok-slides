// 배경음악: 이 저장소에서 새로 지은 짧은 칩튠 경주곡을 WebAudio 로 그 자리에서 연주한다 (음원 파일 없음).
// - 128 BPM, 8마디 반복. 코드 진행 C–G–Am–F | F–G–C–G
// - 드럼은 "두-근, 두-근" 심장 박자 (킥이 1·4번째, 9·12번째 16분음표)
// - 경주가 시작되면 드럼·베이스로 한 마디 달린 뒤 멜로디가 들어오고, 결승 직전 슬로모션(suspense)이 깊어지면
//   멜로디가 빠지고 소리가 먹먹해져 심장 소리(sfx.beat)가 앞에 나온다. 결과가 나오면 잦아든다.
// - 소리 모드가 '음악까지'(all)일 때만 들린다. 추첨 결과와는 아무 관계가 없다.
import { sfx } from './sfx';

const BPM = 128;
/** 16분음표 길이(초) */
const STEP = 60 / BPM / 4;
/** 음악 전체 음량 (master 0.3 에 곱해진다). 효과음(심장·팡파르)보다 조금 작게 */
const VOLUME = 0.9;
const LOOKAHEAD = 0.15;
const TICK_MS = 25;

const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);

/** 마디마다 베이스 근음과 화음 (MIDI 번호) */
const BARS: { root: number; chord: number[] }[] = [
  { root: 48, chord: [60, 64, 67] }, // C
  { root: 43, chord: [59, 62, 67] }, // G
  { root: 45, chord: [57, 60, 64] }, // Am
  { root: 41, chord: [57, 60, 65] }, // F
  { root: 41, chord: [57, 60, 65] }, // F
  { root: 43, chord: [59, 62, 67] }, // G
  { root: 48, chord: [60, 64, 67] }, // C
  { root: 43, chord: [59, 62, 67] }, // G
];

/** 멜로디: [16분음표 자리, MIDI, 길이(16분음표 수)] */
type Note = [number, number, number];
const MELODY: Note[][] = [
  [[0, 76, 2], [2, 79, 2], [4, 84, 3], [7, 83, 1], [8, 84, 2], [10, 79, 2], [12, 76, 4]],
  [[0, 74, 2], [2, 79, 2], [4, 83, 3], [7, 81, 1], [8, 79, 2], [10, 74, 2], [12, 79, 4]],
  [[0, 72, 2], [2, 76, 2], [4, 81, 3], [7, 79, 1], [8, 81, 2], [10, 84, 2], [12, 83, 2], [14, 81, 2]],
  [[0, 81, 3], [3, 79, 1], [4, 77, 2], [6, 76, 2], [8, 77, 2], [10, 81, 2], [12, 84, 4]],
  [[0, 84, 2], [2, 81, 2], [4, 77, 2], [6, 81, 2], [8, 84, 2], [10, 86, 2], [12, 84, 2], [14, 81, 2]],
  [[0, 83, 2], [2, 79, 2], [4, 74, 2], [6, 79, 2], [8, 83, 2], [10, 86, 2], [12, 83, 2], [14, 79, 2]],
  [[0, 84, 3], [3, 83, 1], [4, 84, 2], [6, 88, 2], [8, 86, 2], [10, 84, 2], [12, 79, 4]],
  [[0, 79, 2], [2, 81, 2], [4, 83, 2], [6, 86, 2], [8, 79, 1], [9, 79, 1], [10, 83, 2], [12, 86, 4]],
];

/** 베이스: 8분음표마다 근음에서 몇 반음 위 (옥타브를 오가는 칩튠 베이스) */
const BASS_STEPS = [0, 12, 0, 12, 0, 12, 7, 12];
/** 드럼: "두-근, 두-근" 킥, 2·4박 스네어, 엇박 하이햇 */
const KICK = new Set([0, 3, 8, 11]);
const SNARE = new Set([4, 12]);
const CHORD_STABS = new Set([2, 6, 10, 14]);

type Graph = {
  bus: GainNode;
  lead: GainNode;
  drums: GainNode;
  filter: BiquadFilterNode;
  pulse: PeriodicWave;
  noise: AudioBuffer;
};

/** 듀티비 25% 펄스파 (칩튠 멜로디 소리) */
function pulseWave(ctx: AudioContext, duty = 0.25, harmonics = 32): PeriodicWave {
  const real = new Float32Array(harmonics + 1);
  const imag = new Float32Array(harmonics + 1);
  for (let n = 1; n <= harmonics; n++) {
    real[n] = (2 / (n * Math.PI)) * Math.sin(2 * Math.PI * n * duty);
    imag[n] = (2 / (n * Math.PI)) * (1 - Math.cos(2 * Math.PI * n * duty));
  }
  return ctx.createPeriodicWave(real, imag);
}

class Bgm {
  private graph: Graph | null = null;
  private graphCtx: AudioContext | null = null;
  private timer: number | null = null;
  private stopTimer: number | null = null;
  private nextTime = 0;
  /** 시작부터 센 16분음표 번호 */
  private step = 0;
  private playing = false;
  private suspense = 0;

  /** 경주 시작 */
  start() {
    if (this.stopTimer !== null) {
      window.clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    this.playing = true;
    this.step = 0;
    this.nextTime = 0;
    this.suspense = 0;
    if (this.timer === null) this.timer = window.setInterval(() => this.tick(), TICK_MS);
    this.tick();
  }

  /** 결과가 나오거나 경주가 끝나면 잦아든다 */
  stop() {
    if (!this.playing) return;
    this.playing = false;
    const g = this.graph;
    const ctx = this.graphCtx;
    if (g && ctx) g.bus.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
    this.stopTimer = window.setTimeout(() => {
      if (this.timer !== null) window.clearInterval(this.timer);
      this.timer = null;
      this.stopTimer = null;
    }, 900);
  }

  /** 0 ~ 1. 결승 직전 슬로모션 깊이 (funLayer 가 매 프레임 넘긴다) */
  setSuspense(value: number) {
    this.suspense = value;
  }

  private ensureGraph(ctx: AudioContext, master: GainNode): Graph {
    if (this.graph && this.graphCtx === ctx) return this.graph;
    const bus = ctx.createGain();
    bus.gain.value = 0;
    bus.connect(master);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 4000;
    filter.Q.value = 0.7;
    filter.connect(bus);
    const lead = ctx.createGain();
    lead.connect(filter);
    const drums = ctx.createGain();
    drums.connect(bus);
    const noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.3), ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.graph = { bus, lead, drums, filter, pulse: pulseWave(ctx), noise };
    this.graphCtx = ctx;
    return this.graph;
  }

  private tick() {
    const a = sfx.audio();
    if (!a) return;
    const { ctx, master } = a;
    const g = this.ensureGraph(ctx, master);
    const now = ctx.currentTime;

    // 결승 직전: 멜로디를 빼고, 소리를 먹먹하게, 전체를 조금 줄인다
    const s = this.suspense;
    const on = this.playing && sfx.musicOn;
    g.bus.gain.setTargetAtTime(on ? VOLUME * (1 - 0.45 * s) : 0, now, 0.15);
    g.lead.gain.setTargetAtTime(1 - s, now, 0.2);
    g.drums.gain.setTargetAtTime(1 - 0.55 * s, now, 0.2);
    g.filter.frequency.setTargetAtTime(700 + 3300 * (1 - s), now, 0.2);
    if (!this.playing) return;

    // 탭이 가려져 타이머가 늦게 돌았으면 지금부터 다시 맞춘다
    if (this.nextTime < now - 0.1) this.nextTime = now + 0.05;
    while (this.nextTime < now + LOOKAHEAD) {
      if (on) this.playStep(ctx, g, this.step, this.nextTime);
      this.nextTime += STEP;
      this.step++;
    }
  }

  private playStep(ctx: AudioContext, g: Graph, step: number, t: number) {
    const bar = Math.floor(step / 16);
    const pos = step % 16;
    const section = BARS[bar % BARS.length];

    if (KICK.has(pos)) this.kick(ctx, g, t, pos === 0 || pos === 8 ? 1 : 0.75);
    if (SNARE.has(pos)) this.snare(ctx, g, t);
    if (pos % 2 === 0) this.hat(ctx, g, t, pos % 4 === 2 ? 0.08 : 0.04);
    if (pos % 2 === 0) this.bass(ctx, g, t, section.root + BASS_STEPS[pos / 2]);
    if (bar === 0) return; // 첫 마디는 드럼·베이스로만 달린다

    if (CHORD_STABS.has(pos)) {
      for (const m of section.chord) this.stab(ctx, g, t, m);
    }
    const melody = MELODY[(bar - 1) % MELODY.length];
    for (const [at, m, len] of melody) {
      if (at === pos) this.lead(ctx, g, t, m, len * STEP);
    }
  }

  private lead(ctx: AudioContext, g: Graph, t: number, midi: number, dur: number) {
    const o = ctx.createOscillator();
    const v = ctx.createGain();
    o.setPeriodicWave(g.pulse);
    o.frequency.setValueAtTime(mtof(midi), t);
    v.gain.setValueAtTime(0.0001, t);
    v.gain.exponentialRampToValueAtTime(0.13, t + 0.006);
    v.gain.exponentialRampToValueAtTime(0.07, t + Math.min(dur * 0.6, 0.15));
    v.gain.setValueAtTime(0.07, t + dur * 0.85);
    v.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.98);
    o.connect(v).connect(g.lead);
    o.start(t);
    o.stop(t + dur);
  }

  private stab(ctx: AudioContext, g: Graph, t: number, midi: number) {
    const o = ctx.createOscillator();
    const v = ctx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(mtof(midi), t);
    v.gain.setValueAtTime(0.0001, t);
    v.gain.exponentialRampToValueAtTime(0.035, t + 0.005);
    v.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(v).connect(g.filter);
    o.start(t);
    o.stop(t + 0.1);
  }

  private bass(ctx: AudioContext, g: Graph, t: number, midi: number) {
    const o = ctx.createOscillator();
    const v = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(mtof(midi), t);
    v.gain.setValueAtTime(0.0001, t);
    v.gain.exponentialRampToValueAtTime(0.32, t + 0.005);
    v.gain.exponentialRampToValueAtTime(0.0001, t + STEP * 1.8);
    o.connect(v).connect(g.bus);
    o.start(t);
    o.stop(t + STEP * 2);
  }

  private kick(ctx: AudioContext, g: Graph, t: number, strength: number) {
    const o = ctx.createOscillator();
    const v = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    v.gain.setValueAtTime(0.0001, t);
    v.gain.exponentialRampToValueAtTime(0.6 * strength, t + 0.004);
    v.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(v).connect(g.drums);
    o.start(t);
    o.stop(t + 0.18);
  }

  private snare(ctx: AudioContext, g: Graph, t: number) {
    const s = ctx.createBufferSource();
    s.buffer = g.noise;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1800;
    const v = ctx.createGain();
    v.gain.setValueAtTime(0.2, t);
    v.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    s.connect(f).connect(v).connect(g.drums);
    s.start(t);
    s.stop(t + 0.13);
  }

  private hat(ctx: AudioContext, g: Graph, t: number, level: number) {
    const s = ctx.createBufferSource();
    s.buffer = g.noise;
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 7000;
    const v = ctx.createGain();
    v.gain.setValueAtTime(level, t);
    v.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    s.connect(f).connect(v).connect(g.drums);
    s.start(t, Math.random() * 0.2);
    s.stop(t + 0.05);
  }
}

export const bgm = new Bgm();
