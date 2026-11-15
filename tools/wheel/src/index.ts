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
