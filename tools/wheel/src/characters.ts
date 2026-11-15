// 두근두근 캐릭터 (저장소 루트 assets/mong 의 그림을 scripts/make_mong.py 로 줄인 것).
// 참가자마다 이 순서대로 하나씩 돌려 가며 입힌다. 순서는 scripts/make_mong.py 의 CHARACTERS 와 같게 둔다
export const characterUrls: string[] = [
  new URL('../assets/mong/dugeun.png', import.meta.url).toString(),
  new URL('../assets/mong/arong.png', import.meta.url).toString(),
  new URL('../assets/mong/chorong.png', import.meta.url).toString(),
  new URL('../assets/mong/doran.png', import.meta.url).toString(),
  new URL('../assets/mong/gori.png', import.meta.url).toString(),
  new URL('../assets/mong/mandu.png', import.meta.url).toString(),
  new URL('../assets/mong/mongsil.png', import.meta.url).toString(),
  new URL('../assets/mong/salang.png', import.meta.url).toString(),
  new URL('../assets/mong/ssiat.png', import.meta.url).toString(),
  new URL('../assets/mong/ttukttak.png', import.meta.url).toString(),
  new URL('../assets/mong/drum.png', import.meta.url).toString(),
];
