// 연출용 소리. 파일 없이 WebAudio 로 그 자리에서 만든다. 추첨 결과와는 아무 관계가 없다.
// - 효과음 세 가지(출발·두근 박동·팡파르)는 여기서, 배경음악은 bgm.ts 에서 같은 출력(master)으로 낸다
// - 소리 모드: 끔(off) / 효과음만(sfx) / 음악까지(all, 기본). 한 번 끄면 localStorage 에 기억해 계속 끈다
// - 페이지를 열기만 해서는 소리가 나지 않는다 (시작 버튼을 눌러야 AudioContext 를 만든다)

export type SoundMode = 'off' | 'sfx' | 'all';

const KEY = 'wheel_sound';
/** 스피커 버튼으로 다시 켤 때 돌아갈 모드 */
const LAST_KEY = 'wheel_sound_last';
const MASTER = 0.3;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장에 실패하면 이번 방문에만 적용된다
  }
}

function loadMode(): SoundMode {
  const v = read(KEY);
  if (v === 'off' || v === 'sfx' || v === 'all') return v;
  return 'all'; // 처음 쓰는 컴퓨터, 또는 예전 값 'on'
}

function loadLast(): 'sfx' | 'all' {
  return read(LAST_KEY) === 'sfx' ? 'sfx' : 'all';
}

class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  mode: SoundMode = loadMode();
  private lastOn: 'sfx' | 'all' = loadLast();
  /** 모드가 바뀌면 부른다 (페이지의 버튼 표시를 맞추는 데 쓴다) */
  onChange: (() => void) | null = null;

  get enabled() {
    return this.mode !== 'off';
  }

  get musicOn() {
    return this.mode === 'all';
  }

  /** 사용자 동작(시작 버튼, 소리 버튼) 안에서 불러야 브라우저가 소리를 허락한다 */
  unlock() {
    if (!this.enabled) return;
    try {
      // 닫힌 출력은 다시 만든다 (브라우저가 오디오를 정리한 경우)
      if (this.ctx && this.ctx.state === 'closed') {
        this.ctx = null;
        this.master = null;
      }
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
      this.wake();
    } catch {
      this.ctx = null;
    }
  }

  /**
   * 멈춘 출력을 다시 깨운다. 아이패드·사파리는 화면이 잠기거나 다른 앱·탭이 소리를 쓰면 출력을
   * 'interrupted'(또는 'suspended')로 멈추고, 사용자가 다시 누를 때 resume 해야 소리가 난다.
   * 페이지를 누르거나 키를 칠 때, 탭이 다시 보일 때 부른다
   */
  wake() {
    const ctx = this.ctx;
    if (!this.enabled || !ctx) return;
    if (ctx.state !== 'running' && ctx.state !== 'closed') ctx.resume().catch(() => undefined);
  }

  /** 다른 탭(캐릭터·글자 버전)에서 소리 설정을 바꾸면 이 탭도 따라간다 */
  syncFromStorage() {
    const mode = loadMode();
    if (mode === this.mode) return;
    this.mode = mode;
    this.lastOn = loadLast();
    if (mode === 'off') this.ctx?.suspend();
    this.onChange?.();
  }

  setMode(mode: SoundMode) {
    this.mode = mode;
    write(KEY, mode);
    if (mode !== 'off') {
      this.lastOn = mode;
      write(LAST_KEY, mode);
      this.unlock();
    } else {
      this.ctx?.suspend();
    }
    this.onChange?.();
  }

  /** 스피커 버튼·M 키: 끄거나, 마지막으로 켜 두었던 모드로 다시 켠다 */
  setEnabled(on: boolean) {
    this.setMode(on ? this.lastOn : 'off');
  }

  /** 배경음악이 쓸 출력. 소리를 켤 수 없는 상태면 null */
  audio(): { ctx: AudioContext; master: GainNode } | null {
    if (!this.enabled || !this.ctx || !this.master || this.ctx.state !== 'running') return null;
    return { ctx: this.ctx, master: this.master };
  }

  private ready(): AudioContext | null {
    return this.audio()?.ctx ?? null;
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
