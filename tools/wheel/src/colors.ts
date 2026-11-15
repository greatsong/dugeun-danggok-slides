import type { TextColorRule } from './types/ColorTheme';

// 구슬 색(hue)으로 글자를 쓰되 바탕과 대비가 모자라지 않게 밝기를 맞춘다.
// 노랑·초록·청록은 같은 밝기라도 훨씬 밝아 보여서, 밝은 바탕에서는 더 어둡게 내려야 읽힌다.

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function luminance([r, g, b]: [number, number, number]): number {
  const c = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return [1, 1, 1];
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
}

export function contrast(l1: number, l2: number): number {
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const cache = new Map<string, string>();

/** 규칙(rule)에 맞춰 hue 글자색을 고른다. 결과는 hue 별로 저장해 두고 다시 쓴다 */
export function readableHue(hue: number, rule: TextColorRule): string {
  const h = Math.round(hue) % 360;
  const key = `${h}|${rule.saturation}|${rule.lightness}|${rule.against}|${rule.min}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const bg = luminance(hexToRgb(rule.against));
  // 바탕이 밝으면 어둡게, 어두우면 밝게 옮긴다
  const step = bg > 0.18 ? -1 : 1;
  let l = rule.lightness;
  while (l > 5 && l < 95 && contrast(luminance(hslToRgb(h, rule.saturation, l)), bg) < rule.min) {
    l += step;
  }
  const color = `hsl(${h} ${rule.saturation}% ${l}%)`;
  cache.set(key, color);
  return color;
}
