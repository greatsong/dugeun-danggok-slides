import type { RenderResolution } from './rouletteRenderer';

export type WinnerRange = { start: number; end: number };

const RESOLUTION_STORAGE_KEY = 'roulette.resolution';
const RESOLUTIONS: readonly string[] = ['default', 'high', 'ultra'] satisfies RenderResolution[];

export function isRenderResolution(value: unknown): value is RenderResolution {
  return typeof value === 'string' && RESOLUTIONS.includes(value);
}

function loadResolution(): RenderResolution {
  try {
    const saved = localStorage.getItem(RESOLUTION_STORAGE_KEY);
    if (isRenderResolution(saved)) return saved;
  } catch {
    // 저장소를 못 쓰는 환경(사생활 보호 모드 등)은 기본값
  }
  return 'default';
}

export function saveResolution(value: RenderResolution) {
  try {
    localStorage.setItem(RESOLUTION_STORAGE_KEY, value);
  } catch {
    // 저장에 실패하면 이번 방문에만 적용된다
  }
}

/**
 * 구슬 모양. 'mong' = 두근두근 캐릭터, 'text' = 색 구슬과 글자만.
 * 페이지가 <html data-skin> 으로 정하고(index.html = mong, text.html = text), 주소의 ?skin= 이 있으면 그걸 따른다
 */
export type Skin = 'mong' | 'text';

function loadSkin(): Skin {
  let value: string | null = null;
  try {
    value = new URLSearchParams(location.search).get('skin');
  } catch {
    // 주소를 못 읽으면 페이지 설정을 쓴다
  }
  value = value || document.documentElement.dataset.skin || 'mong';
  return value === 'text' ? 'text' : 'mong';
}

class Options {
  /** 구슬 모양. 그림을 처음에 한 번 읽으므로 실행 중에는 바꾸지 않는다 */
  readonly skin: Skin = loadSkin();
  useSkills: boolean = true;
  /** 0-based, 양끝 포함. 1명 추첨은 start === end */
  winnerRange: WinnerRange = { start: 0, end: 0 };
  autoRecording: boolean = true;
  /** 렌더링 해상도. 물리 시뮬레이션과는 무관하다 */
  resolution: RenderResolution = loadResolution();
}

const options = new Options();
export default options;
