interface ShapeColor {
  outline: string;
  fill: string;
  bloom: string;
  bloomRadius: number;
}

/** 이름·순위처럼 구슬 색으로 쓰는 글자. 바탕(against)과 대비가 min 이상이 되도록 밝기를 자동으로 맞춘다 */
export interface TextColorRule {
  saturation: number;
  /** 시작 밝기(%). 대비가 모자라면 바탕 반대쪽으로 밝기를 옮긴다 */
  lightness: number;
  against: string;
  min: number;
}

/**
 * 두근두근 룰렛의 색. 모든 그리기 색은 여기서 가져온다 (밝게 = cream, 어둡게 = night).
 * 페이지(설정 패널 등)의 색은 style.scss 의 html[data-theme] 변수에 같은 값으로 둔다.
 */
export interface ColorTheme {
  name: 'cream' | 'night';
  background: string;
  /** 글자·외곽선 먹색과 보조 글자 */
  ink: string;
  subInk: string;
  /** 카드(순위표·당첨 카드) 바탕과 테두리, 카드 그림자 */
  card: string;
  cardBorder: string;
  cardShadow: string;
  /** 강조색(두근 분홍)과 그 위에 얹는 글자, 연한 강조 바탕 */
  accent: string;
  onAccent: string;
  accentSoft: string;
  /** 연한 강조 바탕(accentSoft) 위에 쓰는 강조 글자 */
  accentText: string;
  /** 구슬 몸통 밝기(%) */
  marbleLightness: number;
  /** 글자 버전 구슬 외곽선 */
  marbleOutline: string;
  marbleWinningBorder: string;
  skillColor: string;
  coolTimeIndicator: string;
  entity: {
    box: ShapeColor;
    circle: ShapeColor;
    polyline: ShapeColor;
  };
  /** 벽 두께 배율 */
  wallWidth: number;
  /** 구슬 이름표: 글자색 규칙과 테두리색 */
  label: TextColorRule;
  labelStroke: string;
  /** 순위표·당첨 목록 이름 글자색 규칙 (카드 위) */
  listText: TextColorRule;
  minimapBackground: string;
  minimapViewport: string;
  /** 당첨 발표 뒤 경기 화면에 덮는 막 */
  veil: string;
  /** 골인 링 (당첨이 아닌 구슬) */
  ringSoft: string;
  /** 색종이 테두리. 빈 문자열이면 테두리 없음 */
  confettiOutline: string;
  /** 결승선 체크 무늬의 두 번째 칸 */
  finishAlt: string;
}
