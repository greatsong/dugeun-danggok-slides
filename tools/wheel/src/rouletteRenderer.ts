import type { Camera } from './camera';
import { characterUrls } from './characters';
import { closeButtonSize, drawCloseCircle } from './closeButton';
import { readableHue } from './colors';
import { canvasHeight, canvasWidth, FONT, initialZoom, Themes } from './data/constants';
import { easeOutBack, easeOutCubic, FunLayer } from './funLayer';
import type { StageDef } from './data/maps';
import type { GameObject } from './gameObject';
import type { Marble } from './marble';
import { MINIMAP_INSET, MINIMAP_WIDTH } from './minimap';
import options, { type WinnerRange } from './options';
import type { ParticleManager } from './particleManager';
import type { ColorTheme } from './types/ColorTheme';
import type { MapEntityState } from './types/MapEntity.type';
import type { Rect } from './types/rect.type';
import type { VectorLike } from './types/VectorLike';
import type { UIObject } from './UIObject';

export type RenderParameters = {
  camera: Camera;
  stage: StageDef;
  entities: MapEntityState[];
  marbles: Marble[];
  winners: Marble[];
  particleManager: ParticleManager;
  effects: GameObject[];
  winnerRange: WinnerRange;
  /** 진행 중에는 null, 당첨자가 모두 확정되면 당첨자 배열 */
  result: Marble[] | null;
  size: VectorLike;
  theme: ColorTheme;
  /** 화면 글자 배율. 휴대폰처럼 캔버스를 줄여 보여 줄 때 글자를 키운다 (1 이상) */
  uiScale: number;
  /** 경기 중인지, 이번 프레임의 슬로모션 배율 (연출용으로 읽기만 한다) */
  running: boolean;
  timeScale: number;
};

/** 기본 해상도에서 표시 캔버스 폭 상한 */
const MAX_DISPLAY_WIDTH = 1920;
/** High 해상도에서 캔버스 긴 변 상한 (물리 픽셀) */
const HIGH_MAX_LONG_SIDE = 1920;

/**
 * - default: 화면 절반 크기 씬 캔버스에 그린 뒤 표시 캔버스(폭 최대 1920)로 늘려 복사
 * - high: 캔버스 하나를 화면 픽셀 크기로 두고 바로 그린다. 긴 변 최대 1920
 * - ultra: high 와 같지만 상한 없이 창 크기 × devicePixelRatio
 *
 * 세 모드 모두 논리 좌표계(width/height)는 같다. 구도·UI 크기·입력 좌표는 그대로이고 선명도만 다르다
 */
export type RenderResolution = 'default' | 'high' | 'ultra';
const RESULT_PANEL_MAX_WIDTH_RATIO = 0.9;
const RESULT_PANEL_MAX_HEIGHT_RATIO = 0.8;
const RESULT_COLUMN_MAX_WIDTH = 260;
const PROGRESS_MAX_WIDTH_RATIO = 0.3;
/** 북 캐릭터 (characters.ts 순서의 마지막). 여러 명 발표를 '두구두구' 알린다 */
const DRUM_CHARACTER = 10;

/** canvas.width 는 정수로 잘리므로 잘린 값끼리 비교한다 */
function setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number) {
  const w = Math.floor(width);
  const h = Math.floor(height);
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
}

export class RouletteRenderer {
  protected _canvas!: HTMLCanvasElement;
  protected _sceneCanvas!: HTMLCanvasElement;
  protected ctx!: CanvasRenderingContext2D;
  private _displayCtx!: CanvasRenderingContext2D;
  private _sceneCtx!: CanvasRenderingContext2D;
  public sizeFactor = 1;

  private _resolution: RenderResolution = 'default';
  /** 논리 좌표계 크기. 모든 그리기·카메라 계산의 기준 */
  private _viewWidth = canvasWidth;
  private _viewHeight = canvasHeight;
  /** high/ultra 에서 논리 1 = 물리 픽셀 몇 개. default 에서는 씬 캔버스에 1:1 로 그리므로 1 */
  protected _pixelScale = 1;

  protected _theme: ColorTheme = Themes.cream;
  /** 결승선·두근 박동·역전 알림 등 연출 (상태를 읽기만 한다) */
  private _fun = new FunLayer();
  /** 결과가 확정된 시각. 당첨 카드 등장 연출에 쓴다 */
  private _resultAt = 0;
  /** 두근두근 캐릭터 그림 (characters.ts 순서). 글자 버전에서는 비어 있다 */
  private _characters: (HTMLImageElement | undefined)[] = [];
  private _resultCloseRect: Rect | null = null;
  private _resultPopupClosed = false;
  private _lastResult: Marble[] | null = null;

  get width() {
    return this._viewWidth;
  }

  get height() {
    return this._viewHeight;
  }

  get resolution(): RenderResolution {
    return this._resolution;
  }

  set resolution(value: RenderResolution) {
    if (this._resolution === value) return;
    this._resolution = value;
    if (this._canvas) this.refreshSize();
  }

  private get _isDirect() {
    return this._resolution !== 'default';
  }

  get canvas() {
    return this._canvas;
  }

  set theme(value: ColorTheme) {
    this._theme = value;
  }

  async init() {
    await this._load();

    this._canvas = document.createElement('canvas');
    this._canvas.width = canvasWidth;
    this._canvas.height = canvasHeight;
    this._displayCtx = this._canvas.getContext('2d', {
      alpha: false,
    }) as CanvasRenderingContext2D;

    this._sceneCanvas = document.createElement('canvas');
    this._sceneCanvas.width = canvasWidth;
    this._sceneCanvas.height = canvasHeight;
    this._sceneCtx = this._sceneCanvas.getContext('2d', {
      alpha: false,
    }) as CanvasRenderingContext2D;
    this.ctx = this._sceneCtx;

    document.body.appendChild(this._canvas);

    const resizeObserver = new ResizeObserver(() => this.refreshSize());
    resizeObserver.observe(this._canvas);
    // 모니터를 옮겨 devicePixelRatio 만 바뀌는 경우는 ResizeObserver 가 잡지 못한다
    window.addEventListener('resize', () => this.refreshSize());
    this.refreshSize();
  }

  /** 화면 크기·dpr·해상도 모드가 바뀐 뒤 캔버스 크기를 다시 맞춘다 */
  refreshSize() {
    const rect = this._canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    // 논리 크기는 모드와 무관하게 원래 계산 그대로
    const width = Math.max(rect.width / 2, 640);
    const height = (width / rect.width) * rect.height;
    this._viewWidth = width;
    this._viewHeight = height;
    this.sizeFactor = width / rect.width;

    const defaultDisplayWidth = Math.min(rect.width, MAX_DISPLAY_WIDTH);

    if (!this._isDirect) {
      // 같은 값을 다시 넣어도 캔버스가 지워지므로 바뀔 때만 넣는다 (resize·ResizeObserver 가 같이 불린다)
      setCanvasSize(this._sceneCanvas, width, height);
      setCanvasSize(this._canvas, defaultDisplayWidth, (defaultDisplayWidth / rect.width) * rect.height);
      this._pixelScale = 1;
      this.ctx = this._sceneCtx;
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    let scale = (rect.width * dpr) / width;
    if (this._resolution === 'high') {
      scale = Math.min(scale, HIGH_MAX_LONG_SIDE / Math.max(width, height));
    }
    // 작은 창에서도 기본 해상도보다 흐려지지는 않게
    scale = Math.max(1, scale);

    const physW = Math.max(1, Math.round(width * scale));
    const physH = Math.max(1, Math.round(height * scale));
    setCanvasSize(this._canvas, physW, physH);
    this._pixelScale = physW / width;

    // 씬 캔버스는 쓰지 않으므로 메모리만 돌려준다
    setCanvasSize(this._sceneCanvas, 1, 1);
    this.ctx = this._displayCtx;
  }

  private async _loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((rs) => {
      const img = new Image();
      img.addEventListener('load', () => {
        rs(img);
      });
      // 그림 하나를 못 읽어도 추첨기는 떠야 한다. 그 구슬은 색 구슬로 그린다
      img.addEventListener('error', () => {
        console.error('그림을 읽지 못했습니다', url);
        rs(img);
      });
      img.src = url;
    });
  }

  private async _load(): Promise<void> {
    // 원본은 특정 이름(방송인 등)의 구슬에 얼굴 그림을 입혔고, 광고 서버에서 키워드 그림도 받아 왔다.
    // 이 판에는 남의 그림과 외부 서버 호출을 넣지 않으므로 빨리감기 아이콘만 미리 읽어 둔다
    const loads: Promise<unknown>[] = [this._loadImage(new URL('../assets/images/ff.svg', import.meta.url).toString())];
    // 캔버스 글자는 글꼴을 미리 읽어 두어야 첫 화면부터 Pretendard 로 그려진다. 못 읽어도 시스템 글꼴로 뜬다
    if (document.fonts) {
      loads.push(
        Promise.all(['700', '800', '900'].map((w) => document.fonts.load(`${w} 16px Pretendard`))).catch(() => undefined)
      );
    }
    if (options.skin === 'mong') {
      loads.push(
        Promise.all(characterUrls.map((url) => this._loadImage(url))).then((images) => {
          this._characters = images.map((img) => (img.naturalWidth > 0 ? img : undefined));
        })
      );
    }
    await Promise.all(loads);
  }

  /** 그 구슬에 입힐 캐릭터 그림. 글자 버전이거나 그림이 없으면 undefined (색 구슬) */
  getMarbleImage(marble: Marble): CanvasImageSource | undefined {
    return marble.character >= 0 ? this._characters[marble.character] : undefined;
  }

  protected onBeforeEntities(): void {}
  /** 장애물 아래에 월드 좌표로 덧그리는 그림 (테스트 플레이의 진행도 지도) */
  public debugDraw: ((ctx: CanvasRenderingContext2D) => void) | null = null;
  protected onAfterScene(): void {}

  render(renderParameters: RenderParameters, uiObjects: UIObject[]) {
    this._theme = renderParameters.theme;
    this._fun.update(renderParameters);
    // 이후 모든 그리기는 논리 좌표 기준 (default 에서는 배율 1)
    this.ctx.setTransform(this._pixelScale, 0, 0, this._pixelScale, 0, 0);
    this.ctx.fillStyle = this._theme.background;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.save();
    this.ctx.scale(initialZoom, initialZoom);
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.font = `0.4pt ${FONT}`;
    this.ctx.lineWidth = 3 / (renderParameters.camera.zoom + initialZoom);
    const zoom = renderParameters.camera.zoom * initialZoom;
    renderParameters.camera.renderScene(this.ctx, { x: this.width, y: this.height }, () => {
      this.onBeforeEntities();
      this.debugDraw?.(this.ctx);
      this.renderEntities(renderParameters.entities);
      this._fun.renderWorld(this.ctx, renderParameters, zoom);
      this.renderEffects(renderParameters);
      this.renderMarbles(renderParameters);
    });
    this.ctx.restore();
    this.onAfterScene();

    // 층 순서: 경기 화면 → 두근 비네트·발표 뒤 막 → 색종이 → 순위표·미니맵 → 당첨 표시 → 출발·역전 알림
    this._fun.renderBackdrop(this.ctx, renderParameters, this.width, this.height);
    renderParameters.particleManager.render(this.ctx);
    uiObjects.forEach((obj) => obj.render(this.ctx, renderParameters, this.width, this.height));
    this.renderWinnerProgress(renderParameters);
    this.renderResult(renderParameters);
    this._fun.renderOverlay(this.ctx, renderParameters, this.width, this.height, (m) => this.getMarbleImage(m));

    if (!this._isDirect) {
      this._displayCtx.drawImage(this._sceneCanvas, 0, 0, this._canvas.width, this._canvas.height);
    }
  }

  private renderEntities(entities: MapEntityState[]) {
    this.ctx.save();
    // 벽은 굵고 끝이 둥근 선, 장애물은 모서리가 둥근 사탕 막대 (그림만 바뀌고 충돌 모양은 그대로)
    const baseLineWidth = this.ctx.lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    entities.forEach((entity) => {
      const transform = this.ctx.getTransform();
      this.ctx.translate(entity.x, entity.y);
      this.ctx.rotate(entity.angle);
      const colors = this._theme.entity[entity.shape.type];
      this.ctx.fillStyle = entity.shape.color ?? colors.fill;
      this.ctx.strokeStyle = entity.shape.color ?? colors.outline;
      // shadowBlur 는 변환 행렬을 따르지 않는 물리 픽셀 값이라 배율을 직접 곱한다
      this.ctx.shadowBlur = colors.bloomRadius * this._pixelScale;
      this.ctx.shadowColor = entity.shape.bloomColor ?? entity.shape.color ?? colors.bloom;
      this.ctx.lineWidth = entity.shape.type === 'polyline' ? baseLineWidth * this._theme.wallWidth : baseLineWidth;
      const shape = entity.shape;
      switch (shape.type) {
        case 'polyline':
          if (shape.points.length > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(shape.points[0][0], shape.points[0][1]);
            for (let i = 1; i < shape.points.length; i++) {
              this.ctx.lineTo(shape.points[i][0], shape.points[i][1]);
            }
            this.ctx.stroke();
          }
          break;
        case 'box': {
          const w = shape.width * 2;
          const h = shape.height * 2;
          this.ctx.rotate(shape.rotation);
          this.ctx.beginPath();
          this.ctx.roundRect(-w / 2, -h / 2, w, h, Math.min(w, h) * 0.3);
          this.ctx.fill();
          this.ctx.stroke();
          break;
        }
        case 'circle':
          this.ctx.beginPath();
          this.ctx.arc(0, 0, shape.radius, 0, Math.PI * 2, false);
          this.ctx.stroke();
          break;
      }

      this.ctx.setTransform(transform);
    });
    this.ctx.restore();
  }

  private renderEffects({ effects, camera }: RenderParameters) {
    effects.forEach((effect) => effect.render(this.ctx, camera.zoom * initialZoom, this._theme));
  }

  private renderMarbles({ marbles, camera, winnerRange, winners, size }: RenderParameters) {
    const firstIndex = winnerRange.start - winners.length;
    const lastIndex = winnerRange.end - winners.length;
    const zoom = camera.zoom * initialZoom;

    const viewPort = { x: camera.x, y: camera.y, w: size.x, h: size.y, zoom };
    marbles.forEach((marble, i) => {
      marble.render(
        this.ctx,
        zoom,
        i >= firstIndex && i <= lastIndex,
        false,
        this.getMarbleImage(marble),
        viewPort,
        this._theme
      );
    });
    // 이름표는 구슬을 다 그린 뒤에 한 번 더 돌며 그린다. 그래야 옆 구슬 그림이 이름을 덮지 않는다
    marbles.forEach((marble) => {
      marble.renderLabel(this.ctx, zoom, !!this.getMarbleImage(marble), viewPort);
    });
  }

  private renderResult(params: RenderParameters) {
    const result = params.result;
    // 새 결과가 나오면(또는 리셋되면) 닫힘 상태를 푼다. _result는 확정될 때마다 새 배열이다
    if (result !== this._lastResult) {
      this._lastResult = result;
      this._resultPopupClosed = false;
      this._resultAt = performance.now();
    }
    this._resultCloseRect = null;
    if (!result) return;
    // 1명이면 오른쪽 아래 당첨 카드, 여러명이면 화면 가운데 당첨자 목록 카드
    if (result.length === 1) {
      this.renderWinner(result[0], params);
    } else if (!this._resultPopupClosed) {
      this.renderWinnerList(result, params);
    }
  }

  /** 결과 팝업 닫기 버튼을 눌렀는지 */
  getResultCloseHitAt(x: number, y: number): boolean {
    const rect = this._resultCloseRect;
    return !!rect && x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  closeResultPopup(): void {
    this._resultPopupClosed = true;
  }

  /** 둥근 카드. 그림자는 카드 바탕에만 준다 */
  private drawCard(x: number, y: number, w: number, h: number, r: number, border: string, borderWidth = 2) {
    const ctx = this.ctx;
    ctx.save();
    ctx.shadowColor = this._theme.cardShadow;
    ctx.shadowBlur = 24 * this._pixelScale;
    ctx.shadowOffsetY = 8 * this._pixelScale;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = this._theme.card;
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = border;
    ctx.stroke();
    ctx.restore();
  }

  /** 알약 모양 표(♥ 당첨!, N등). 그린 폭을 돌려준다 */
  private drawPill(x: number, y: number, text: string, font: string, h: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = font;
    const w = ctx.measureText(text).width + h * 0.9;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h / 2);
    ctx.fillStyle = this._theme.accentSoft;
    ctx.fill();
    ctx.fillStyle = this._theme.accentText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2 + h * 0.04);
    ctx.restore();
    return w;
  }

  /** 글자 버전 구슬 (먹선 + 반짝이) */
  private drawTextMarble(cx: number, cy: number, r: number, hue: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${hue} 100% ${this._theme.marbleLightness}%)`;
    ctx.fill();
    ctx.lineWidth = Math.max(2, r * 0.08);
    ctx.strokeStyle = this._theme.marbleOutline;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.35, cy - r * 0.38, r * 0.22, r * 0.15, -0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fill();
    ctx.restore();
  }

  /**
   * 여러명 모드에서 확정된 당첨자를 좌측 상단에 상시 표시한다.
   * 우측은 순위표가 구슬 수만큼 내려오므로 겹친다. 좌측은 미니맵이 세로로 긴
   * 스트립이라 그 오른쪽에 붙인다.
   */
  private renderWinnerProgress({ winners, winnerRange, result, theme, uiScale }: RenderParameters) {
    const { start, end } = winnerRange;
    if (end <= start) return; // 1명 추첨은 당첨 카드를 쓴다

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    const lineHeight = Math.min(24, Math.max(15, h * 0.042)) * Math.min(uiScale, 1.4);
    const pad = lineHeight * 0.6;
    const rankWidth = lineHeight * 2;
    const headerFont = `800 ${lineHeight * 0.7}px ${FONT}`;
    const rankFont = `600 ${lineHeight * 0.6}px ${FONT}`;
    const nameFont = `800 ${lineHeight * 0.72}px ${FONT}`;

    // 확정 전에는 골인한 당첨자만, 확정 후에는 최종 명단(조기 확정분 포함)을 쓴다
    const confirmed = result ?? winners.slice(start, end + 1);
    const header = `♥ 당첨 ${confirmed.length} / ${end - start + 1}`;

    // 화면을 넘기면 오래된 쪽을 접는다. 전체 명단은 어차피 가운데 카드에서 보여준다
    const maxRows = Math.max(1, Math.floor((h * 0.55) / lineHeight) - 2);
    const hidden = Math.max(0, confirmed.length - maxRows);
    const shown = confirmed.slice(hidden);
    const foldLabel = `+${hidden}명 더`;

    ctx.save();

    ctx.font = headerFont;
    let contentW = ctx.measureText(header).width;
    ctx.font = nameFont;
    for (const marble of shown) {
      contentW = Math.max(contentW, rankWidth + ctx.measureText(marble.name).width);
    }
    if (hidden > 0) {
      ctx.font = rankFont;
      contentW = Math.max(contentW, ctx.measureText(foldLabel).width);
    }

    const panelW = Math.min(contentW + pad * 2, w * PROGRESS_MAX_WIDTH_RATIO);
    const rows = shown.length + (hidden > 0 ? 1 : 0);
    // 헤더와 목록 사이 간격은 목록이 있을 때만 준다
    const headerGap = rows > 0 ? lineHeight * 0.35 : 0;
    const panelH = pad * 2 + lineHeight + headerGap + rows * lineHeight;
    const panelX = MINIMAP_INSET + MINIMAP_WIDTH + pad;
    const panelY = MINIMAP_INSET; // 미니맵 상단과 맞춘다

    this.drawCard(panelX, panelY, panelW, panelH, 14, theme.accent, 2);

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.font = headerFont;
    ctx.fillStyle = theme.accentText;
    ctx.fillText(header, panelX + pad, panelY + pad + lineHeight / 2);

    let y = panelY + pad + lineHeight + headerGap + lineHeight / 2;
    if (hidden > 0) {
      ctx.font = rankFont;
      ctx.fillStyle = theme.subInk;
      ctx.fillText(foldLabel, panelX + pad, y);
      y += lineHeight;
    }

    shown.forEach((marble, i) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(panelX, y - lineHeight / 2, panelW, lineHeight);
      ctx.clip();

      ctx.font = rankFont;
      ctx.fillStyle = theme.subInk;
      ctx.fillText(`${start + hidden + i + 1}등`, panelX + pad, y);

      ctx.font = nameFont;
      ctx.fillStyle = readableHue(marble.hue, theme.listText);
      ctx.fillText(marble.name, panelX + pad + rankWidth, y);
      ctx.restore();
      y += lineHeight;
    });

    ctx.restore();
  }

  /** 당첨자가 여러명일 때 화면 가운데 목록 카드. 줄마다 70ms 간격으로 나타나고, 캐릭터 버전에서는 북 캐릭터가 알린다 */
  private renderWinnerList(winners: Marble[], { theme, winnerRange }: RenderParameters) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const t = performance.now() - this._resultAt;

    const lineHeight = Math.min(40, Math.max(20, h * 0.065));
    const padding = lineHeight * 0.9;
    const titleHeight = lineHeight * 2.3;
    const maxRows = Math.max(
      1,
      Math.floor((h * RESULT_PANEL_MAX_HEIGHT_RATIO - titleHeight - padding * 2) / lineHeight)
    );
    const cols = Math.max(1, Math.ceil(winners.length / maxRows));
    const rows = Math.ceil(winners.length / cols);

    // 열 폭은 실제 이름 폭에 맞춘다 (빈 공간이 넓게 남지 않게)
    const chipFont = `800 ${lineHeight * 0.44}px ${FONT}`;
    const nameFont = `800 ${lineHeight * 0.72}px ${FONT}`;
    const iconSize = lineHeight * 1.05;
    ctx.save();
    ctx.font = chipFont;
    const chipW = ctx.measureText(`${winnerRange.start + winners.length}등`).width + lineHeight * 0.72 * 0.9;
    ctx.font = nameFont;
    let nameW = 0;
    for (const m of winners) nameW = Math.max(nameW, ctx.measureText(m.name).width);
    const colWidth = Math.min(
      Math.max(RESULT_COLUMN_MAX_WIDTH * 0.6, chipW + 8 + iconSize + 8 + nameW + 16),
      (w * RESULT_PANEL_MAX_WIDTH_RATIO - padding * 2) / cols
    );
    const panelW = Math.max(lineHeight * 9, colWidth * cols + padding * 2);
    const panelH = titleHeight + rows * lineHeight + padding;
    const panelX = (w - panelW) / 2;
    const appear = easeOutBack(t / 300, 1.2);
    const panelY = (h - panelH) / 2 + 10 + (1 - appear) * 24;

    ctx.globalAlpha = Math.min(1, t / 200);
    this.drawCard(panelX, panelY, panelW, panelH, 26, theme.accent, 3);

    // 머리: 북 캐릭터가 '두구두구' 들썩이며 알린다 (캐릭터 버전만)
    const drum = this._characters[DRUM_CHARACTER];
    const title = `당첨자 ${winners.length}명`;
    ctx.font = `900 ${lineHeight * 1.05}px ${FONT}`;
    const titleW = ctx.measureText(title).width;
    const drumSize = lineHeight * 2.5;
    const titleX = w / 2 + (drum ? drumSize * 0.3 : 0);
    if (drum) {
      const bump = Math.abs(Math.sin(performance.now() / 180)) * 4 * (t < 3000 ? 1 : 0);
      ctx.drawImage(drum, titleX - titleW / 2 - drumSize * 0.95, panelY - drumSize * 0.4 - bump, drumSize, drumSize);
    }
    ctx.fillStyle = theme.ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, titleX, panelY + titleHeight * 0.48);

    // 닫기 버튼 중심을 카드 오른쪽 위 모서리에 걸쳐 놓는다
    this._resultCloseRect = drawCloseCircle(ctx, panelX + panelW - 6, panelY + 6, closeButtonSize(h), theme.card, theme.ink);

    winners.forEach((marble, i) => {
      const rowT = t - 200 - i * 70;
      if (rowT <= 0) return;
      const col = Math.floor(i / rows);
      const row = i % rows;
      const x = panelX + padding + col * colWidth;
      const y = panelY + titleHeight + row * lineHeight + lineHeight / 2 - lineHeight * 0.3;
      ctx.save();
      ctx.globalAlpha = Math.min(1, rowT / 180);
      ctx.translate((1 - easeOutCubic(rowT / 250)) * 14, 0);
      ctx.beginPath();
      ctx.rect(x, y - lineHeight / 2, colWidth, lineHeight);
      ctx.clip();
      const chipH = lineHeight * 0.72;
      const cw = this.drawPill(x, y - chipH / 2, `${winnerRange.start + i + 1}등`, chipFont, chipH);
      const ix = x + cw + 8 + iconSize / 2;
      const img = this.getMarbleImage(marble);
      if (img) {
        ctx.drawImage(img, ix - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
      } else {
        this.drawTextMarble(ix, y, iconSize * 0.32, marble.hue);
      }
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = readableHue(marble.hue, theme.listText);
      ctx.font = nameFont;
      ctx.fillText(marble.name, ix + iconSize / 2 + 8, y + 1);
      ctx.restore();
    });
    ctx.restore();
  }

  /**
   * 1명 당첨 카드 (오른쪽 아래). 카드가 오른쪽에서 들어오고(300ms), 캐릭터가 튀어나오며(80ms 뒤 450ms),
   * 이름이 도장처럼 찍힌다(220ms 뒤 280ms). 600ms 안에 다 읽힌다.
   * 캐릭터는 세 번 깡충 뛴 뒤 작게 숨쉬기만 한다 (수업 중 오래 떠 있어도 산만하지 않게).
   */
  private renderWinner(winner: Marble, { theme, uiScale }: RenderParameters) {
    const ctx = this.ctx;
    const t = performance.now() - this._resultAt;
    const s = Math.min(uiScale, 1.3);
    const margin = 16;
    const mascot = 132 * s;
    const padL = 26 * s;
    const chipH = 30 * s;
    ctx.save();

    // 이름: 논리 76px (1080p 에서 150px 안팎). 길면 줄이되 34px 아래로는 줄이지 않는다
    let nameSize = 76 * s;
    ctx.font = `900 ${nameSize}px ${FONT}`;
    let nameW = ctx.measureText(winner.name).width;
    const maxNameW = this.width - margin * 2 - padL - mascot - 34;
    if (nameW > maxNameW) {
      nameSize = Math.max(34, (nameSize * maxNameW) / nameW);
      ctx.font = `900 ${nameSize}px ${FONT}`;
      nameW = ctx.measureText(winner.name).width;
    }
    const cardH = 18 * s + chipH + 10 * s + nameSize * 1.05 + 16 * s;
    const cardW = Math.max(300 * s, padL + nameW + 26 * s + mascot + 10);
    const slide = 1 - easeOutCubic(t / 300);
    const cardX = this.width - cardW - margin + slide * (cardW + margin);
    const cardY = this.height - cardH - margin;
    this.drawCard(cardX, cardY, cardW, cardH, 28, theme.accent, 3);

    this.drawPill(cardX + padL, cardY + 18 * s, '♥ 당첨!', `800 ${17 * s}px ${FONT}`, chipH);

    // 이름은 형광펜 위에 도장처럼 찍힌다
    const nameY = cardY + 18 * s + chipH + 10 * s + nameSize * 0.52;
    const stampT = (t - 220) / 280;
    if (stampT > 0) {
      const k = stampT < 1 ? 1.8 - 0.8 * easeOutCubic(stampT) : 1;
      ctx.save();
      ctx.globalAlpha = Math.min(1, stampT * 2);
      // 형광펜: 밝게는 연한 파스텔, 어둡게는 비치는 색 (짙은 단색은 탁해 보인다)
      ctx.fillStyle = theme.name === 'cream' ? `hsl(${winner.hue} 95% 86%)` : `hsl(${winner.hue} 85% 55% / 0.38)`;
      ctx.beginPath();
      ctx.roundRect(cardX + padL - 4, nameY + nameSize * 0.02, nameW + 8, nameSize * 0.42, 6);
      ctx.fill();
      ctx.translate(cardX + padL + nameW / 2, nameY);
      ctx.scale(k, k);
      ctx.font = `900 ${nameSize}px ${FONT}`;
      ctx.fillStyle = theme.ink;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(winner.name, 0, 0);
      ctx.restore();
    }

    // 캐릭터: 카드 위로 튀어나와 세 번 깡충 뛰고, 그다음엔 숨쉬기만
    const popT = (t - 80) / 450;
    if (popT > 0) {
      const pop = popT < 1 ? easeOutBack(popT, 2.2) : 1;
      const hopT = t - 600;
      const hops = 3;
      const hopPeriod = 1100;
      let lift = 0;
      let tilt = 0;
      if (hopT > 0 && hopT < hops * hopPeriod) {
        const ph = (hopT % hopPeriod) / hopPeriod;
        lift = Math.sin(Math.min(1, ph * 2) * Math.PI) * 14 * s;
        tilt = Math.sin(ph * Math.PI * 2) * 0.08;
      } else if (hopT >= hops * hopPeriod) {
        lift = (Math.sin((hopT / 2600) * Math.PI * 2) * 0.5 + 0.5) * 2;
      }
      const mx = cardX + cardW - mascot / 2 - 10;
      const my = cardY + cardH / 2 - 26 * s - lift;
      ctx.save();
      ctx.translate(mx, my + mascot / 2);
      ctx.rotate(tilt);
      ctx.scale(pop, pop);
      const img = this.getMarbleImage(winner);
      if (img) {
        ctx.drawImage(img, -mascot / 2, -mascot, mascot, mascot);
      } else {
        this.drawTextMarble(0, -mascot / 2 + 10, mascot * 0.34, winner.hue);
      }
      ctx.restore();
    }
    ctx.restore();
  }
}
