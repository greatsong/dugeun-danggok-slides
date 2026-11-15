import { readableHue } from './colors';
import { FONT } from './data/constants';
import type { Marble } from './marble';
import type { WinnerRange } from './options';
import type { RenderParameters } from './rouletteRenderer';
import type { Rect } from './types/rect.type';
import type { MouseEventArgs, UIObject } from './UIObject';
import { bound } from './utils/bound.decorator';

export class RankRenderer implements UIObject {
  private _currentY = 0;
  private _targetY = 0;
  private fontHeight = 16;
  private _userMoved = 0;
  private _currentWinner = -1;
  private maxY = 0;
  private winners: Marble[] = [];
  private marbles: Marble[] = [];
  private winnerRange: WinnerRange = { start: 0, end: 0 };
  private messageHandler?: (msg: string) => void;

  @bound
  onWheel(e: WheelEvent) {
    this._targetY += e.deltaY;
    if (this._targetY > this.maxY) {
      this._targetY = this.maxY;
    }
    this._userMoved = 2000;
  }

  @bound
  onDblClick(e?: MouseEventArgs) {
    if (e) {
      if (navigator.clipboard) {
        const tsv: string[] = [];
        let rank = 0;
        tsv.push(
          ...[...this.winners, ...this.marbles].map((m) => {
            rank++;
            return [rank.toString(), m.name, this.isWinningRank(rank - 1) ? '☆' : ''].join('\t');
          })
        );

        tsv.unshift(['순위', '이름', '당첨'].join('\t'));

        navigator.clipboard.writeText(tsv.join('\n')).then(() => {
          if (this.messageHandler) {
            this.messageHandler('The result has been copied');
          }
        });
      }
    }
  }

  private isWinningRank(rank: number) {
    return rank >= this.winnerRange.start && rank <= this.winnerRange.end;
  }

  onMessage(func: (msg: string) => void) {
    this.messageHandler = func;
  }

  render(
    ctx: CanvasRenderingContext2D,
    { winners, marbles, winnerRange, theme, uiScale }: RenderParameters,
    width: number,
    height: number
  ) {
    // 순위표: 카드 위에 [순위(보조 글자, 오른쪽 정렬)] [이름(구슬 색, 굵게)] 두 칸.
    // '13 #1' 처럼 번호 이름과 순위가 섞여 읽히지 않도록 칸과 색을 나눈다
    const s = uiScale;
    const rowH = 19 * s;
    const pad = 9 * s;
    const gap = 8 * s;
    const inset = 8 * s;
    this.fontHeight = rowH;
    const total = winners.length + marbles.length;
    this.maxY = Math.max(0, total * rowH + rowH);
    this._currentWinner = winners.length;
    this.winners = winners;
    this.marbles = marbles;
    this.winnerRange = winnerRange;
    if (total === 0) return;

    const rankFont = `600 ${11.5 * s}px ${FONT}`;
    const nameFont = `700 ${14 * s}px ${FONT}`;
    const headFont = `700 ${11.5 * s}px ${FONT}`;

    ctx.save();
    ctx.font = rankFont;
    const rankW = ctx.measureText(`${total}`).width;
    ctx.font = nameFont;
    let nameW = 0;
    for (const m of winners) nameW = Math.max(nameW, ctx.measureText(m.name).width);
    for (const m of marbles) nameW = Math.max(nameW, ctx.measureText(m.name).width);
    ctx.font = headFont;
    const headW = ctx.measureText(`도착 ${total} / ${total}`).width + gap;
    const panelW = Math.min(pad + Math.max(rankW + gap + nameW, headW) + pad, width * 0.34);
    const panelX = width - inset - panelW;
    const panelY = inset;
    const headH = rowH * 1.25;
    const listTop = panelY + headH;
    const listH = Math.min(total * rowH + pad * 0.6, height - listTop - inset * 2);
    const panelH = headH + listH;
    const radius = 12 * s;

    ctx.save();
    ctx.shadowColor = theme.cardShadow;
    ctx.shadowBlur = 16 * s;
    ctx.shadowOffsetY = 4 * s;
    ctx.fillStyle = theme.card;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, panelH, radius);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, panelH, radius);
    ctx.stroke();

    ctx.textBaseline = 'middle';
    ctx.font = headFont;
    ctx.fillStyle = theme.subInk;
    ctx.textAlign = 'left';
    ctx.fillText('도착', panelX + pad, panelY + headH / 2 + 1 * s);
    ctx.textAlign = 'right';
    ctx.fillStyle = theme.ink;
    ctx.fillText(`${winners.length} / ${total}`, panelX + panelW - pad, panelY + headH / 2 + 1 * s);

    ctx.beginPath();
    ctx.roundRect(panelX, listTop, panelW, listH, [0, 0, radius, radius]);
    ctx.clip();

    const startY = Math.max(0, this._currentY - listH / 2 - rowH);
    ctx.translate(0, listTop - startY);

    const rankX = panelX + pad + rankW;
    const nameX = rankX + gap;
    const all = [...winners, ...marbles];
    all.forEach((marble, i) => {
      const y = i * rowH;
      if (y + rowH < startY || y > startY + listH) return;
      const done = i < winners.length;
      const winning = this.isWinningRank(i);
      if (winning) {
        ctx.fillStyle = theme.accentSoft;
        ctx.fillRect(panelX, y, panelW, rowH);
        ctx.fillStyle = theme.accent;
        ctx.fillRect(panelX, y, 3 * s, rowH);
      }
      ctx.textAlign = 'right';
      ctx.font = rankFont;
      ctx.fillStyle = winning && done ? theme.accentText : theme.subInk;
      ctx.fillText(winning && done ? '♥' : `${i + 1}`, rankX, y + rowH / 2);
      ctx.textAlign = 'left';
      ctx.font = nameFont;
      ctx.fillStyle = readableHue(marble.hue, theme.listText);
      // 도착했지만 당첨이 아닌 이름은 흐리게
      ctx.globalAlpha = done && !winning ? 0.5 : 1;
      ctx.fillText(marble.name, nameX, y + rowH / 2);
      ctx.globalAlpha = 1;
    });
    ctx.restore();
  }

  update(deltaTime: number) {
    if (this._currentWinner === -1) {
      return;
    }
    if (this._userMoved > 0) {
      this._userMoved -= deltaTime;
    } else {
      this._targetY = this._currentWinner * this.fontHeight + this.fontHeight;
    }
    if (this._currentY !== this._targetY) {
      this._currentY += (this._targetY - this._currentY) * (deltaTime / 250);
    }
    if (Math.abs(this._currentY - this._targetY) < 1) {
      this._currentY = this._targetY;
    }
  }

  getBoundingBox(): Rect | null {
    return null;
  }
}
