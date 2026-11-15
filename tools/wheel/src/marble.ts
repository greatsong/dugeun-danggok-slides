import { readableHue } from './colors';
import { FONT, Skills, STUCK_DELAY, Themes } from './data/constants';
import type { IPhysics } from './IPhysics';
import options from './options';
import type { ColorTheme } from './types/ColorTheme';
import type { VectorLike } from './types/VectorLike';
import { transformGuard } from './utils/transformGuard';
import { rad } from './utils/utils';
import { Vector } from './utils/Vector';

/** 캐릭터 그림을 물리 구슬(지름 size)보다 이만큼 크게 그린다. 그림 안에 여백이 있어서 몸통이 구슬과 비슷해진다 */
export const CHARACTER_SCALE = 1.4;
/** 출발 전 줄 서 있는 캐릭터의 숨쉬기: 위아래 폭(월드 단위, 화면에서 4px 안팎)과 주기(ms) */
const IDLE_BOB = 0.04;
const IDLE_PERIOD = 1600;
const reducedMotion = (() => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
})();

export class Marble {
  type = 'marble' as const;
  name: string = '';
  size: number = 0.5;
  color: string = 'red';
  hue: number = 0;
  impact: number = 0;
  weight: number = 1;
  skill: Skills = Skills.None;
  isActive: boolean = false;
  /** 입힐 두근두근 캐릭터 번호 (characters.ts). -1 이면 색 구슬 */
  character: number = -1;

  private _skillRate = 0.0005;
  private _coolTime = 5000;
  private _maxCoolTime = 5000;
  private _stuckTime = 0;
  private lastPosition: VectorLike = { x: 0, y: 0 };
  private theme: ColorTheme = Themes.cream;

  private physics: IPhysics;

  id: number;

  get position() {
    return this.physics.getMarblePosition(this.id) || { x: 0, y: 0, angle: 0 };
  }

  get x() {
    return this.position.x;
  }

  set x(v: number) {
    this.position.x = v;
  }

  get y() {
    return this.position.y;
  }

  set y(v: number) {
    this.position.y = v;
  }

  get angle() {
    return this.position.angle;
  }

  constructor(physics: IPhysics, order: number, max: number, name?: string, weight: number = 1) {
    this.name = name || `M${order}`;
    this.weight = weight;
    this.physics = physics;

    this._maxCoolTime = 1000 + (1 - this.weight) * 4000;
    this._coolTime = this._maxCoolTime * Math.random();
    this._skillRate = 0.2 * this.weight;

    const maxLine = Math.ceil(max / 10);
    const line = Math.floor(order / 10);
    const lineDelta = -Math.max(0, Math.ceil(maxLine - 5));
    this.hue = (360 / max) * order;
    this.color = `hsl(${this.hue} 100% 70%)`;
    this.id = order;

    physics.createMarble(order, 10.25 + (order % 10) * 0.6, maxLine - line + lineDelta);
  }

  /**
   * @param deltaTime 벽시계 기준 경과(ms). 스킬 쿨타임 등 연출 시간에 쓴다
   * @param timeScale 이 틱에서 물리가 실제로 진행된 비율(슬로모션이면 1 미만).
   *   정지 판정은 이동 거리로 하므로 물리 시간에 맞춰 문턱을 줄여야 한다. 안 그러면 슬로모션 중
   *   천천히 구르는 구슬이 멈춘 것으로 오판되어 골인 직전에 랜덤으로 튕겨진다
   */
  update(deltaTime: number, timeScale: number = 1) {
    const stuckThreshold = 0.00001 * timeScale * timeScale;
    if (this.isActive && Vector.lenSq(Vector.sub(this.lastPosition, this.position)) < stuckThreshold) {
      // 누적에는 timeScale 을 곱하지 않는다. 이건 화면이 굳는 걸 막는 워치독이라 관객 체감 시간이 기준이다.
      // 물리 시간으로 바꾸면 슬로모션이 깊을수록 발동이 늦어지는데, 타겟 구슬이 멈추면 _goalDist 가 고정되어
      // 슬로모션이 풀리지 않으므로 교착을 깨야 할 상황에서 워치독이 오히려 무뎌진다
      this._stuckTime += deltaTime;

      if (this._stuckTime > STUCK_DELAY) {
        this.physics.shakeMarble(this.id);
        this._stuckTime = 0;
      }
    } else {
      this._stuckTime = 0;
    }
    this.lastPosition = { x: this.position.x, y: this.position.y };

    this.skill = Skills.None;
    if (this.impact) {
      this.impact = Math.max(0, this.impact - deltaTime);
    }
    if (!this.isActive) return;
    if (options.useSkills) {
      this._updateSkillInformation(deltaTime);
    }
  }

  private _updateSkillInformation(deltaTime: number) {
    if (this._coolTime > 0) {
      this._coolTime -= deltaTime;
    }

    if (this._coolTime <= 0) {
      this.skill = Math.random() < this._skillRate ? Skills.Impact : Skills.None;
      this._coolTime = this._maxCoolTime;
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    zoom: number,
    outline: boolean,
    isMinimap: boolean = false,
    skin: CanvasImageSource | undefined,
    viewPort: { x: number; y: number; w: number; h: number; zoom: number },
    theme: ColorTheme
  ) {
    this.theme = theme;
    const viewPortHw = viewPort.w / viewPort.zoom / 2;
    const viewPortHh = viewPort.h / viewPort.zoom / 2;
    const viewPortLeft = viewPort.x - viewPortHw;
    const viewPortRight = viewPort.x + viewPortHw;
    const viewPortTop = viewPort.y - viewPortHh;
    const viewPortBottom = viewPort.y + viewPortHh;
    const halfSize = this.size / 2;
    const isOutsideView = (
      this.x + halfSize < viewPortLeft ||
      this.x - halfSize > viewPortRight ||
      this.y + halfSize < viewPortTop ||
      this.y - halfSize > viewPortBottom
    );
    if (!isMinimap && isOutsideView) {
      return;
    }
    const transform = ctx.getTransform();
    if (isMinimap) {
      this._renderMinimap(ctx);
    } else {
      this._renderNormal(ctx, zoom, outline, skin);
    }
    ctx.setTransform(transform);
  }

  private _renderMinimap(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    this._drawMarbleBody(ctx, true);
  }

  private _drawMarbleBody(ctx: CanvasRenderingContext2D, isMinimap: boolean) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, isMinimap ? this.size : this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  private _renderNormal(ctx: CanvasRenderingContext2D, zoom: number, outline: boolean, skin?: CanvasImageSource) {
    const hs = this.size / 2;

    ctx.fillStyle = `hsl(${this.hue} 100% ${this.theme.marbleLightness + 25 * Math.min(1, this.impact / 500)}%)`;

    // 고리(당첨권 표시·쿨타임)는 눈에 보이는 몸통 바깥에 둔다. 캐릭터 얼굴을 가로지르지 않게
    let ringRadius = hs + 1 / zoom;
    if (skin) {
      // 캐릭터는 굴러도 얼굴이 보이도록 똑바로 세워 그린다. 순위표와 같은 색은 이름 글자가 맡는다.
      // 출발 전에는 줄마다 조금씩 어긋나게 숨쉬듯 오르내린다 (그림만, 물리 위치는 그대로)
      const cs = hs * CHARACTER_SCALE;
      const bob =
        !this.isActive && !reducedMotion
          ? Math.sin(((performance.now() + this.id * 200) / IDLE_PERIOD) * Math.PI * 2) * IDLE_BOB
          : 0;
      ctx.drawImage(skin, this.x - cs, this.y - cs + bob, cs * 2, cs * 2);
      ringRadius = cs * 0.85;
    } else {
      this._drawMarbleBody(ctx, false);
      // 캐릭터 그림처럼 먹선을 두르고 왼쪽 위에 반짝이를 얹어 사탕 구슬처럼 보이게 한다
      ctx.strokeStyle = this.theme.marbleOutline;
      ctx.lineWidth = 2.2 / zoom;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.ellipse(this.x - hs * 0.35, this.y - hs * 0.38, hs * 0.22, hs * 0.15, rad(-35), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowColor = '';
    ctx.shadowBlur = 0;

    if (outline) {
      this._drawOutline(ctx, 2.5 / zoom, ringRadius);
    }

    // 출발 전에는 쿨타임이 돌지 않으므로 고리를 그리지 않는다 (대기 화면이 깔끔하게)
    if (options.useSkills && this.isActive) {
      this._renderCoolTime(ctx, zoom, ringRadius + 3 / zoom);
    }
  }

  /** 이름표. 모든 구슬을 그린 뒤 한 번 더 돌며 그려서, 옆 구슬 그림에 가려지지 않게 한다 */
  renderLabel(
    ctx: CanvasRenderingContext2D,
    zoom: number,
    hasSkin: boolean,
    viewPort: { x: number; y: number; w: number; h: number; zoom: number }
  ) {
    const hw = viewPort.w / viewPort.zoom / 2 + 2;
    const hh = viewPort.h / viewPort.zoom / 2 + 2;
    if (Math.abs(this.x - viewPort.x) > hw || Math.abs(this.y - viewPort.y) > hh) return;
    const hs = this.size / 2;
    const offsetY = hasSkin ? hs * CHARACTER_SCALE * 0.9 : hs + 0.06;
    // 카메라가 멀리 있을 때(출발 직후 등)는 구슬 간격(0.6)보다 이름이 넓어 서로 겹치므로 글자를 줄인다.
    // 두 글자 이름이 구슬 간격 안에 들어가는 크기(0.3 × 확대율)로, 9px ~ 16px 사이
    const fontPx = Math.min(16, Math.max(9, zoom * 0.3));
    transformGuard(ctx, () => {
      ctx.font = `700 ${fontPx}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = this.theme.labelStroke;
      ctx.lineWidth = fontPx / 4;
      ctx.fillStyle = readableHue(this.hue, this.theme.label);
      ctx.shadowBlur = 0;
      ctx.translate(this.x, this.y + offsetY);
      ctx.scale(1 / zoom, 1 / zoom);
      ctx.strokeText(this.name, 0, 0);
      ctx.fillText(this.name, 0, 0);
    });
  }

  private _drawOutline(ctx: CanvasRenderingContext2D, lineWidth: number, radius: number) {
    ctx.beginPath();
    ctx.strokeStyle = this.theme.marbleWinningBorder;
    ctx.lineWidth = lineWidth;
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  private _renderCoolTime(ctx: CanvasRenderingContext2D, zoom: number, radius: number) {
    ctx.strokeStyle = this.theme.coolTimeIndicator;
    ctx.lineWidth = 1.5 / zoom;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, rad(270), rad(270 + (360 * this._coolTime) / this._maxCoolTime));
    ctx.stroke();
  }
}
