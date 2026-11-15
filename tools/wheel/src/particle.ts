import type { ColorTheme } from './types/ColorTheme';
import type { VectorLike } from './types/VectorLike';

// 당첨 색종이: 화면 양쪽 아래 구석에서 쏘아 올려 팔랑이며 떨어진다. 세 개 중 하나는 하트(두근두근).
// 색은 두근두근 캐릭터 그림에서 뽑은 파스텔이다.
const lifetime = 2600;
const PASTEL = ['#fc9c9c', '#fcd89c', '#ccf06c', '#c0f0cc', '#bcd4fc', '#c0b4f0', '#fc786c', '#fce4a8', '#ffb3c7'];

export class Particle {
  private _elapsed: number = 0;
  position: VectorLike = { x: 0, y: 0 };
  private v: VectorLike;
  color: string;
  isDestroy: boolean = false;
  private rot = Math.random() * Math.PI * 2;
  private spin = (Math.random() * 2 - 1) * 0.012;
  private flutter = 0.006 + Math.random() * 0.01;
  private heart = Math.random() < 1 / 3;
  private size = 7 + Math.random() * 4;
  private outline: string;

  /** dir: 1 이면 오른쪽 위로, -1 이면 왼쪽 위로 쏜다. scale = 화면 높이 / 450 */
  constructor(
    x: number,
    y: number,
    dir: number,
    private scale: number,
    theme: ColorTheme
  ) {
    this.position = { x, y };
    const a = ((55 + Math.random() * 32) * Math.PI) / 180;
    const sp = (0.75 + Math.random() * 0.6) * scale;
    this.v = { x: Math.cos(a) * sp * dir, y: -Math.sin(a) * sp };
    this.color = PASTEL[(Math.random() * PASTEL.length) | 0];
    this.outline = theme.confettiOutline;
  }

  /** deltaTime: ms */
  update(deltaTime: number) {
    this._elapsed += deltaTime;
    this.v.y += 0.0016 * this.scale * deltaTime;
    this.v.x *= 0.992 ** (deltaTime / 10);
    // 꼭대기를 지나면 천천히 팔랑이며 내려온다
    const fall = 0.12 * this.scale;
    if (this.v.y > fall) this.v.y = fall + (this.v.y - fall) * 0.9;
    this.position.x += this.v.x * deltaTime + Math.sin(this._elapsed * this.flutter) * 0.15;
    this.position.y += this.v.y * deltaTime;
    this.rot += this.spin * deltaTime;
    if (this._elapsed > lifetime) this.isDestroy = true;
  }

  render(ctx: CanvasRenderingContext2D) {
    const t = this._elapsed;
    const s = this.size * this.scale;
    ctx.save();
    ctx.globalAlpha = t > lifetime - 600 ? (lifetime - t) / 600 : 1;
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rot);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    if (this.heart) {
      const w = s * 1.3;
      const h = w * 0.95;
      ctx.moveTo(0, -h * 0.2);
      ctx.bezierCurveTo(0, -h * 0.5, -w * 0.5, -h * 0.5, -w * 0.5, -h * 0.15);
      ctx.bezierCurveTo(-w * 0.5, h * 0.15, 0, h * 0.3, 0, h * 0.5);
      ctx.bezierCurveTo(0, h * 0.3, w * 0.5, h * 0.15, w * 0.5, -h * 0.15);
      ctx.bezierCurveTo(w * 0.5, -h * 0.5, 0, -h * 0.5, 0, -h * 0.2);
      ctx.closePath();
    } else {
      // 종이 띠가 뒤집히듯 폭이 바뀐다
      ctx.scale(Math.cos(t * this.flutter * 1.7), 1);
      ctx.rect(-s / 2, -s * 0.8, s, s * 1.6);
    }
    ctx.fill();
    if (this.outline) {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = this.outline;
      ctx.stroke();
    }
    ctx.restore();
  }
}
