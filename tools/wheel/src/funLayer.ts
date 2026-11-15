// 재미 연출 레이어: 결승선, 골인 링, 두근 박동(결승 직전 슬로모션), 역전 알림, 출발 도장, 발표 뒤 막.
// 게임 상태를 "읽기만" 하고 물리·순위·시간·판정에는 값을 쓰지 않는다. 그래서 추첨 결과에는 영향이 없다.
// 렌더러가 매 프레임 update → renderWorld(카메라 좌표) → renderBackdrop(화면, UI 아래) → renderOverlay(화면, 맨 위) 순서로 부른다.
import { readableHue } from './colors';
import { FONT } from './data/constants';
import type { Marble } from './marble';
import type { RenderParameters } from './rouletteRenderer';
import { sfx } from './sfx';

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const easeOutCubic = (t: number) => 1 - (1 - clamp01(t)) ** 3;
/** 슬라이드 덱의 pop(cubic-bezier(.2,.9,.25,1.2)) 과 비슷한 살짝 튀는 곡선 */
export const easeOutBack = (t: number, s = 1.6) => {
  const x = clamp01(t) - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
};
/** 심장 박동 한 번의 밝기 곡선: 40ms 에 올라가 110ms 시정수로 사라진다 */
const pulse = (t: number) => (t < 0 ? 0 : t < 40 ? t / 40 : Math.exp(-(t - 40) / 110));

/** 비네트(가장자리 분홍) 최대 진하기. 순위표·미니맵 아래 층에 깔고 .25 를 넘기지 않는다 */
const VIGNETTE_MAX = 0.25;
/** 역전 알림: 한 판에 최대 몇 번, 알림 사이 최소 간격(ms) */
const CALLOUT_LIMIT = 3;
const CALLOUT_GAP = 1800;

type Callout = { title: string; sub: string; hue: number; marble: Marble; t0: number };
type Burst = { x: number; y: number; t0: number; big: boolean };

export class FunLayer {
  now = 0;
  resultAt = -1e9;
  /** 0 ~ 1. 슬로모션 깊이를 부드럽게 따라간 값 */
  suspense = 0;
  /** 0 ~ 1. 지금 심장 박동 밝기 */
  env = 0;

  private last = 0;
  private beatT = 0;
  private dubPlayed = false;
  /** 심장 소리가 이어진 시간(ms). 8초가 넘으면 소리는 줄이고 화면 연출만 남긴다 */
  private loudFor = 0;
  private wasRunning = false;
  private startAt = -1e9;
  private resultRef: Marble[] | null = null;
  private prevWinners = 0;
  private bursts: Burst[] = [];
  private shownCut: Marble | null = null;
  private cand: Marble | null = null;
  private candAt = 0;
  private lastCallout = -1e9;
  private calloutCount = 0;
  private callout: Callout | null = null;
  private vignette: HTMLCanvasElement | null = null;

  update(p: RenderParameters) {
    const now = performance.now();
    const dt = this.last ? Math.min(100, now - this.last) : 16;
    this.last = now;
    this.now = now;
    const running = p.running && !p.result;

    // 출발
    if (running && !this.wasRunning) {
      this.startAt = now;
      this.shownCut = null;
      this.cand = null;
      this.calloutCount = 0;
      this.prevWinners = p.winners.length;
      this.loudFor = 0;
      sfx.go();
    }
    this.wasRunning = running;

    // 골인 (구슬은 골인 뒤 500ms 동안 물리에 남아 있어 위치를 읽을 수 있다)
    if (p.winners.length < this.prevWinners) this.prevWinners = p.winners.length;
    const finish = p.stage.finish;
    for (let i = this.prevWinners; i < p.winners.length; i++) {
      const m = p.winners[i];
      const big = i >= p.winnerRange.start && i <= p.winnerRange.end;
      const x = m.x || (finish ? (finish.x1 + finish.x2) / 2 : 0);
      this.bursts.push({ x, y: p.stage.goalY, t0: now, big });
    }
    this.prevWinners = p.winners.length;
    this.bursts = this.bursts.filter((b) => now - b.t0 < 700);

    // 결과 확정
    if (p.result !== this.resultRef) {
      this.resultRef = p.result;
      if (p.result) {
        this.resultAt = now;
        this.callout = null; // 당첨 발표가 화면을 넘겨받는다
        sfx.fanfare();
      }
    }

    // 긴장도: 슬로모션 깊이(1 → 0.2) 를 0 ~ 1 로
    const raw = running ? clamp01((1 - p.timeScale) / 0.8) : 0;
    this.suspense += (raw - this.suspense) * (1 - Math.exp(-dt / 250));
    if (this.suspense < 0.01) this.suspense = 0;

    // 심장 박동: 66 → 100 bpm. 화면 박동은 초당 2번 아래로 (광과민 안전)
    const period = 60000 / (66 + 34 * this.suspense);
    this.beatT += dt;
    const loud = this.suspense > 0.45;
    this.loudFor = loud ? this.loudFor + dt : 0;
    const vol = this.suspense * (this.loudFor < 8000 ? 1 : Math.max(0, 1 - (this.loudFor - 8000) / 2000));
    if (this.beatT >= period) {
      this.beatT %= period;
      this.dubPlayed = false;
      if (loud && vol > 0.02) sfx.beat(vol);
    }
    if (!this.dubPlayed && this.beatT >= 190) {
      this.dubPlayed = true;
      if (loud && vol > 0.02) sfx.beat(vol * 0.6);
    }
    this.env = this.suspense > 0 ? Math.min(1, pulse(this.beatT) + 0.35 * pulse(this.beatT - 190)) : 0;

    this.updateCallout(p, running, now);
  }

  /** 커트라인(당첨 경계) 구슬이 바뀌면 "역전!" 을 띄운다. 결승 직전 슬로모션 중에만, 한 판에 최대 3번 */
  private updateCallout(p: RenderParameters, running: boolean, now: number) {
    if (!running || now - this.startAt < 3000) return;
    const idx = p.winnerRange.end - p.winners.length;
    const cut = p.marbles[idx];
    if (!cut) return;
    if (!this.shownCut || !p.marbles.includes(this.shownCut)) {
      // 지켜보던 구슬이 골인했으면 자연스러운 교대라 알리지 않는다
      this.shownCut = cut;
      this.cand = null;
      return;
    }
    if (cut === this.shownCut) {
      this.cand = null;
      return;
    }
    if (cut !== this.cand) {
      this.cand = cut;
      this.candAt = now;
      return;
    }
    if (this.suspense < 0.3 || this.calloutCount >= CALLOUT_LIMIT) return;
    if (now - this.candAt < 700 || now - this.lastCallout < CALLOUT_GAP) return;

    const total = p.winners.length + p.marbles.length;
    const multi = p.winnerRange.end > p.winnerRange.start;
    let title = '역전!';
    let sub = `${cut.name} ${p.winnerRange.end + 1}등`;
    if (multi) {
      title = '커트라인 역전!';
    } else if (p.winnerRange.end === total - 1 && total > 1) {
      title = '꼴찌 교체!';
      sub = `이제 ${cut.name}`;
    }
    this.callout = { title, sub, hue: cut.hue, marble: cut, t0: now };
    this.shownCut = cut;
    this.lastCallout = now;
    this.calloutCount++;
    this.loudFor = Math.min(this.loudFor, 3000); // 역전이 나면 심장 소리를 다시 살린다
  }

  /** 카메라(월드) 좌표에서 그린다. zoom = 월드 1 이 화면 몇 px 인지 */
  renderWorld(ctx: CanvasRenderingContext2D, p: RenderParameters, zoom: number) {
    const { theme } = p;
    const px = 1 / zoom;
    const finish = p.stage.finish;

    // 결승선: 체크 무늬 두 줄. 결승 직전에는 박동에 맞춰 분홍 띠가 비친다
    if (finish) {
      const y = p.stage.goalY;
      const sq = 0.15;
      const n = Math.ceil((finish.x2 - finish.x1) / sq);
      ctx.save();
      if (this.suspense > 0.02) {
        ctx.globalAlpha = 0.35 * this.suspense * (0.4 + 0.6 * this.env);
        ctx.fillStyle = theme.accent;
        ctx.fillRect(finish.x1, y - sq * 3, finish.x2 - finish.x1, sq * 5);
        ctx.globalAlpha = 1;
      }
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < n; c++) {
          ctx.fillStyle = (r + c) % 2 ? theme.finishAlt : theme.accent;
          const x = finish.x1 + c * sq;
          ctx.fillRect(x, y - sq + r * sq, Math.min(sq, finish.x2 - x), sq);
        }
      }
      ctx.strokeStyle = theme.ink;
      ctx.lineWidth = 1.2 * px;
      ctx.strokeRect(finish.x1, y - sq, finish.x2 - finish.x1, sq * 2);
      // "결승" 글자: 이름표와 같은 크기(화면 16px)로 오른쪽에
      ctx.translate(finish.x2 + 0.2, y);
      ctx.scale(px, px);
      ctx.font = `800 17px ${FONT}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4;
      ctx.strokeStyle = theme.labelStroke;
      ctx.strokeText('결승', 0, 0);
      ctx.fillStyle = theme.accentText;
      ctx.fillText('결승', 0, 0);
      ctx.restore();
    }

    // 커트라인 구슬 둘레의 두근 링 ("지금 두근거리는 구슬")
    if (this.suspense > 0.02 && !p.result) {
      const m = p.marbles[p.winnerRange.end - p.winners.length];
      if (m) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, this.suspense * 1.4);
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = (2 + 4 * this.env) * px;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 0.46 + 0.1 * this.env, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 골인 순간 퍼지는 링. 당첨 순위면 분홍 링 + 빛살, 아니면 옅은 링
    for (const b of this.bursts) {
      const t = (this.now - b.t0) / (b.big ? 600 : 400);
      if (t >= 1) continue;
      const k = easeOutCubic(t);
      const r = 0.15 + k * (b.big ? 1.2 : 0.6);
      ctx.save();
      ctx.globalAlpha = 1 - t;
      ctx.strokeStyle = b.big ? theme.accent : theme.ringSoft;
      ctx.lineWidth = (b.big ? 7 : 3) * (1 - t * 0.7) * px;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.stroke();
      if (b.big) {
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          ctx.moveTo(b.x + Math.cos(a) * r * 0.55, b.y + Math.sin(a) * r * 0.55);
          ctx.lineTo(b.x + Math.cos(a) * r * 0.95, b.y + Math.sin(a) * r * 0.95);
        }
        ctx.lineWidth = 3 * px;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  private getVignette(w: number, h: number, color: string) {
    const W = Math.ceil(w / 2);
    const H = Math.ceil(h / 2);
    const v = this.vignette;
    if (v && v.width === W && v.height === H && v.dataset.color === color) return v;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    c.dataset.color = color;
    const g = c.getContext('2d');
    if (g) {
      const r = Math.hypot(W, H) / 2;
      const grad = g.createRadialGradient(W / 2, H / 2, r * 0.5, W / 2, H / 2, r);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, color);
      g.fillStyle = grad;
      g.fillRect(0, 0, W, H);
    }
    this.vignette = c;
    return c;
  }

  /** 화면 좌표, 순위표·미니맵·당첨 카드보다 아래 층: 두근 비네트와 발표 뒤 막 */
  renderBackdrop(ctx: CanvasRenderingContext2D, p: RenderParameters, w: number, h: number) {
    if (this.suspense > 0.01) {
      ctx.save();
      ctx.globalAlpha = Math.min(VIGNETTE_MAX, this.suspense * (0.12 + 0.2 * this.env));
      ctx.drawImage(this.getVignette(w, h, p.theme.accent), 0, 0, w, h);
      ctx.restore();
    }
    // 당첨 뒤: 아직 굴러가는 구슬들 위에 옅은 막을 덮어 발표에 눈이 가게 한다
    const tr = this.now - this.resultAt;
    if (p.result && tr > 150) {
      ctx.save();
      ctx.globalAlpha = easeOutCubic((tr - 150) / 400);
      ctx.fillStyle = p.theme.veil;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
  }

  /** 화면 좌표, 맨 위 층: 출발 도장과 역전 알림 */
  renderOverlay(
    ctx: CanvasRenderingContext2D,
    p: RenderParameters,
    w: number,
    h: number,
    getImage: (m: Marble) => CanvasImageSource | undefined
  ) {
    const { theme } = p;
    const now = this.now;

    // 출발! 도장 (물리는 누르는 즉시 출발한다. 경기 시간은 늘지 않는다)
    const ts = now - this.startAt;
    if (ts >= 0 && ts < 600) {
      const scale = ts < 200 ? 1.5 - 0.5 * easeOutBack(ts / 200) : 1;
      const fade = ts < 400 ? 0 : (ts - 400) / 200;
      this.stampText(ctx, theme, '출발!', w / 2, h * 0.3 - 10 * fade, Math.round(h * 0.09), scale, 1 - fade);
    }

    // 역전 알림
    const c = this.callout;
    if (!c) return;
    const t = now - c.t0;
    if (t > 1200 || p.result) {
      this.callout = null;
      return;
    }
    const scale = t < 220 ? 0.6 + 0.4 * easeOutBack(t / 220) : 1;
    const fade = t < 950 ? 0 : (t - 950) / 250;
    const fs = Math.round(h * 0.06);
    ctx.save();
    ctx.globalAlpha = 1 - fade;
    ctx.translate(w / 2, h * 0.12 - 12 * fade);
    ctx.scale(scale, scale);
    ctx.font = `900 ${fs}px ${FONT}`;
    const tw = ctx.measureText(c.title).width;
    const subFont = `800 ${Math.round(fs * 0.58)}px ${FONT}`;
    ctx.font = subFont;
    const sw = ctx.measureText(c.sub).width;
    const img = getImage(c.marble);
    const imgS = fs * 1.6;
    const pad = fs * 0.45;
    const boxW = (img ? imgS + pad * 0.6 : 0) + Math.max(tw, sw) + pad * 2;
    const boxH = fs * 1.95;
    ctx.save();
    ctx.shadowColor = theme.cardShadow;
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = theme.card;
    ctx.beginPath();
    ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, boxH / 2);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.stroke();
    let x = -boxW / 2 + pad;
    if (img) {
      const wob = Math.sin(t / 60) * 0.12 * (1 - clamp01(t / 600));
      ctx.save();
      ctx.translate(x + imgS / 2, 0);
      ctx.rotate(wob);
      ctx.drawImage(img, -imgS / 2, -imgS / 2, imgS, imgS);
      ctx.restore();
      x += imgS + pad * 0.6;
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${fs}px ${FONT}`;
    ctx.fillStyle = theme.accentText;
    ctx.fillText(c.title, x, -boxH * 0.02);
    ctx.font = subFont;
    ctx.fillStyle = readableHue(c.hue, theme.listText);
    ctx.fillText(c.sub, x, boxH * 0.33);
    ctx.restore();
  }

  private stampText(
    ctx: CanvasRenderingContext2D,
    theme: RenderParameters['theme'],
    text: string,
    x: number,
    y: number,
    size: number,
    scale: number,
    alpha: number
  ) {
    ctx.save();
    ctx.globalAlpha = clamp01(alpha);
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.font = `900 ${size}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size * 0.16;
    ctx.strokeStyle = theme.accent;
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }
}
