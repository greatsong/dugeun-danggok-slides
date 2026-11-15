import type { ColorTheme } from '../types/ColorTheme';

export const initialZoom = 30;
export const canvasWidth = 1600;
export const canvasHeight = 900;
export const zoomThreshold = 5;
export const STUCK_DELAY = 5000;
export const winnerAreaHeight = 168;

export enum Skills {
  None,
  Impact,
}

/** 캔버스·페이지 공통 글꼴. Pretendard 는 assets/fonts 에 고치지 않고 함께 싣는다 (SIL OFL 1.1) */
export const FONT = 'Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';

export type ThemeName = 'cream' | 'night';

/**
 * 밝게(cream): 두근두근 슬라이드와 캐릭터 원화처럼 밝은 바탕. 교실 프로젝터에서 검정이 회색으로 뜨는 문제가 없다.
 * 어둡게(night): 원작의 검은 무대 대신 짙은 남보라. 캐릭터 몸통과 대비가 크다.
 * 이름·순위 글자색은 readableHue() 가 바탕과 4.5:1 이상이 되게 맞춘다.
 */
export const Themes: Record<ThemeName, ColorTheme> = {
  cream: {
    name: 'cream',
    background: '#fffaf2',
    ink: '#2d2a3e',
    subInk: '#6b6880',
    card: '#ffffff',
    cardBorder: '#ece6f7',
    cardShadow: 'rgba(70, 50, 130, 0.18)',
    accent: '#cf3a6c',
    onAccent: '#ffffff',
    accentSoft: '#ffe4ec',
    accentText: '#c8336a',
    marbleLightness: 74,
    marbleOutline: '#3b3355',
    marbleWinningBorder: '#cf3a6c',
    skillColor: '#ff8fab',
    coolTimeIndicator: 'rgba(45, 42, 62, 0.22)',
    entity: {
      box: { fill: '#ffa8bf', outline: '#3b3355', bloom: 'transparent', bloomRadius: 0 },
      circle: { fill: '#fce4a8', outline: '#3b3355', bloom: 'transparent', bloomRadius: 0 },
      polyline: { fill: '#5b6fd6', outline: '#5b6fd6', bloom: 'transparent', bloomRadius: 0 },
    },
    wallWidth: 1.5,
    label: { saturation: 80, lightness: 34, against: '#ffffff', min: 4.5 },
    labelStroke: '#ffffff',
    listText: { saturation: 80, lightness: 34, against: '#ffffff', min: 4.5 },
    minimapBackground: '#ffffff',
    minimapViewport: '#cf3a6c',
    veil: 'rgba(255, 250, 242, 0.6)',
    ringSoft: '#5b6fd6',
    confettiOutline: '#3b3355',
    finishAlt: '#ffffff',
  },
  night: {
    name: 'night',
    background: '#1e1b2e',
    ink: '#f4f1ff',
    subInk: '#b7b2d0',
    card: '#2a2640',
    cardBorder: '#433d63',
    cardShadow: 'rgba(0, 0, 0, 0.35)',
    accent: '#cf3a6c',
    onAccent: '#ffffff',
    accentSoft: '#4a2440',
    accentText: '#ff9fbf',
    marbleLightness: 72,
    marbleOutline: '#120f1f',
    marbleWinningBorder: '#ffffff',
    skillColor: '#ff9fb5',
    coolTimeIndicator: 'rgba(255, 255, 255, 0.35)',
    entity: {
      box: { fill: '#ff9fb5', outline: '#ffc4d2', bloom: 'transparent', bloomRadius: 0 },
      circle: { fill: '#fce4a8', outline: '#fce4a8', bloom: 'transparent', bloomRadius: 0 },
      polyline: { fill: '#a8b4fc', outline: '#a8b4fc', bloom: 'transparent', bloomRadius: 0 },
    },
    wallWidth: 1.5,
    label: { saturation: 90, lightness: 72, against: '#120f1f', min: 4.5 },
    labelStroke: '#120f1f',
    listText: { saturation: 90, lightness: 72, against: '#2a2640', min: 4.5 },
    minimapBackground: '#2a2640',
    minimapViewport: '#ff9fb5',
    veil: 'rgba(30, 27, 46, 0.55)',
    ringSoft: 'rgba(255, 255, 255, 0.7)',
    confettiOutline: '',
    finishAlt: '#f4f1ff',
  },
};
