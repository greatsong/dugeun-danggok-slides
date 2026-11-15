// 연출용 효과음 세 가지(출발·두근 박동·팡파르). 파일 없이 WebAudio 로 그 자리에서 만든다.
// 추첨 결과와는 아무 관계가 없다. 기본은 켜짐 + 작은 소리이고, 한 번 끄면 localStorage 에 기억해 계속 끈다.
// 페이지를 열기만 해서는 소리가 나지 않는다 (시작 버튼을 눌러야 AudioContext 를 만든다).

const KEY = 'wheel_sound';
const MASTER = 0.3;

function loadEnabled(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  enabled = loadEnabled();

  /** 사용자 동작(시작 버튼) 안에서 불러야 브라우저가 소리를 허락한다 */
  unlock() {
    if (!this.enabled) return;
    try {
      if (!this.ctx) {
        this.ctx = new AudioContext();
        this.master = this.ctx.createGain();
        this.master.gain.value = MASTER;
        this.master.connect(this.ctx.destination);
        const len = Math.floor(this.ctx.sampleRate * 0.03);
        this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noise.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    try {
      localStorage.setItem(KEY, on ? 'on' : 'off');
    } catch {
      // 저장에 실패하면 이번 방문에만 적용된다
    }
    if (on) this.unlock();
    else this.ctx?.suspend();
  }

  private ready(): AudioContext | null {
    if (!this.enabled || !this.ctx || !this.master || this.ctx.state !== 'running') return null;
    return this.ctx;
  }

  private tone(type: OscillatorType, f0: number, f1: number, at: number, dur: number, peak: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, at);
    o.frequency.exponentialRampToValueAtTime(f1, at + dur);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(this.master!);
    o.start(at);
    o.stop(at + dur + 0.02);
  }

  /** 심장 소리 한 번. 노트북 스피커에서도 들리도록 110Hz 몸통 + 짧은 딸깍 소리 */
  beat(strength: number) {
    const ctx = this.ready();
    if (!ctx) return;
    const t = ctx.currentTime;
    this.tone('sine', 120, 55, t, 0.16, 0.9 * strength);
    if (this.noise) {
      const s = ctx.createBufferSource();
      s.buffer = this.noise;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 1500;
      const g = ctx.createGain();
      g.gain.value = 0.25 * strength;
      s.connect(f).connect(g).connect(this.master!);
      s.start(t);
    }
  }

  /** 출발 */
  go() {
    const ctx = this.ready();
    if (!ctx) return;
    const t = ctx.currentTime;
    this.tone('triangle', 520, 1040, t, 0.12, 0.5);
    this.tone('triangle', 1040, 1040, t + 0.12, 0.1, 0.35);
  }

  /** 당첨 팡파르: 도-미-솔-도 */
  fanfare() {
    const ctx = this.ready();
    if (!ctx) return;
    const t = ctx.currentTime;
    [523, 659, 784].forEach((f, i) => this.tone('triangle', f, f, t + i * 0.09, 0.16, 0.45));
    this.tone('triangle', 1047, 1047, t + 0.27, 0.6, 0.5);
    this.tone('sine', 523, 523, t + 0.27, 0.6, 0.25);
  }
}

export const sfx = new Sfx();
