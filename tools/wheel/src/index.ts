import './localization';
import options from './options';
import { Roulette } from './roulette';
import { sfx } from './sfx';

// 원본(lazygyu/roulette)의 index.ts 에서 광고(AdService·프리롤·결과 광고),
// 방문 통계(umami), 맵 공유마당 서버 연결을 뺐다. 외부 서버로 나가는 요청이 없다.

const roulette = new Roulette();

(window as any).roulette = roulette;
(window as any).options = options;
(window as any).sfx = sfx;

// 소리가 멈춰 있으면 사용자가 페이지를 누르거나 키를 칠 때, 탭이 다시 보일 때 깨운다 (아이패드·사파리 대비)
for (const ev of ['pointerdown', 'keydown', 'touchend']) {
  document.addEventListener(ev, () => sfx.wake(), { capture: true, passive: true });
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) sfx.wake();
});
window.addEventListener('storage', (e) => {
  if (e.key === null || e.key.startsWith('wheel_sound')) sfx.syncFromStorage();
});
