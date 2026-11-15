import type { Rect } from './types/rect.type';

// 원본 adRenderer.ts 에서 여러 명 결과 팝업의 닫기 버튼에 쓰는 부분만 옮겨 왔다

const CLOSE_HIT_PADDING = 8;

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function closeButtonSize(h: number): number {
  return clamp(h * 0.045, 20, 34);
}

/**
 * 원형 닫기 버튼(동그라미 + X)을 중심 좌표에 그리고 누를 수 있는 영역을 돌려준다.
 * 무언가에 걸쳐놓을 때는 뒤가 비치지 않게 불투명한 색을 넘긴다.
 */
export function drawCloseCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  fill: string = 'rgba(0, 0, 0, 0.5)'
): Rect {
  const arm = size * 0.22;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = Math.max(1.5, size * 0.07);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - arm, cy - arm);
  ctx.lineTo(cx + arm, cy + arm);
  ctx.moveTo(cx + arm, cy - arm);
  ctx.lineTo(cx - arm, cy + arm);
  ctx.stroke();
  ctx.restore();

  return {
    x: cx - size / 2 - CLOSE_HIT_PADDING,
    y: cy - size / 2 - CLOSE_HIT_PADDING,
    w: size + CLOSE_HIT_PADDING * 2,
    h: size + CLOSE_HIT_PADDING * 2,
  };
}
