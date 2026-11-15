# 두근두근 룰렛 소스

`wheel/` 폴더에 올라가는 광고 없는 구슬 추첨기 "두근두근 룰렛"의 소스입니다. lazygyu의 [Marble Roulette](https://github.com/lazygyu/roulette) 소스(커밋 `87298bf`, 2026-11-14)를 가져와 고쳤습니다. 빌드하면 두 버전이 나옵니다.

- `wheel/index.html` 캐릭터 버전: 구슬마다 두근두근 캐릭터가 하나씩 붙습니다. 참가자(입력한 이름) 순서대로 캐릭터 11종을 돌려 가며 입히고, 같은 이름*3 은 같은 캐릭터입니다.
- `wheel/text.html` 글자 버전: 색 구슬과 이름·번호만 나옵니다.

두 페이지는 같은 번들을 쓰고 `<html data-skin>`(mong / text)만 다릅니다. `text.html` 은 빌드 스크립트가 `index.html` 을 복사해 만듭니다. 개발 서버에서는 주소에 `?skin=text` 를 붙여 글자 버전을 봅니다.

## 저작권

- 원본 소스는 MIT 라이선스입니다(Copyright (c) 2022 LazyGyu). 수정·재배포가 허용되며, 라이선스 원문(`LICENSE.txt`)을 함께 둡니다. 빌드할 때 `wheel/LICENSE.txt`로도 나갑니다.
- "마블 룰렛"·"Marble Roulette"은 lazygyu의 상표(출원 중)이고 MIT 범위가 아닙니다. 그래서 이 판은 "두근두근 룰렛"이라는 이름을 쓰고("룰렛"은 일반 낱말이라 쓰되 "마블"은 넣지 않음), 화면 아래에 원본 출처만 적습니다.
- 아이콘은 Font Awesome Free(CC BY 4.0)입니다. 각 SVG 안에 출처 주석이 들어 있습니다.
- 두근두근 캐릭터(`assets/mong/`)는 이 저장소의 `assets/mong/` 그림을 `scripts/make_mong.py` 로 정사각형 200px 로 줄인 것입니다. `peek.png` 는 '낭만당곡' 머리띠 두근몽을 폭 160px 로 줄인 것입니다.
- 글꼴은 Pretendard(Copyright (c) 2021 Kil Hyung-jin, SIL OFL 1.1)를 고치지 않고 `assets/fonts/` 에 싣습니다. 빌드할 때 `wheel/Pretendard-OFL.txt` 로 라이선스 원문을 함께 내놓습니다. OFL 의 예약 글꼴명 조항 때문에 일부만 잘라 쓰지(서브셋) 않습니다.
- 소리·바탕 아이콘(`sound-on.svg`, `sound-off.svg`, `palette.svg`)은 이 저장소에서 새로 그린 것입니다.

## 원본에서 바꾼 것

- 뺀 것: 시작 전·결과 화면 광고, 결승선 광고판, 광고 서버 호출, 방문 통계(Google Analytics·umami), 상점·광고문의 링크, 맵 공유마당, 키워드 그림 서버 호출, 공지 창, PWA 설정
- 뺀 그림: 특정 이름의 구슬에 입히던 인물 그림 5장(원작자 것이 아닐 수 있어 넣지 않음)과 원본 앱 아이콘
- 맵: '운명의 수레바퀴'(Wheel of fortune) 하나만 남김
- 더한 것: 두근두근 캐릭터 버전, 글자 버전으로 바꾸는 버튼, `1~30` 같은 번호 범위 입력(200개까지), 사용법 창, 한국어 화면
- 디자인 회의(`DESIGN-MEETING.md`)로 바꾼 것: 바탕 '밝게(크림, 기본)/어둡게(남보라)', 기본 해상도 '선명', Pretendard, 순위표 카드, 이름표, 결승선·두근 박동·역전 알림·출발 도장, 당첨 카드와 하트 색종이, 효과음(기본 켬·작게, M 키로 끄면 기억), 새 설정 패널
- 녹화 파일 이름: `dugeun_roulette_날짜.mp4`
- 그 밖의 추첨 방식(물리 엔진, 순위, 당첨 범위, 스킬, 녹화, 해상도)은 원본과 같습니다.

빌드 결과에는 외부 서버로 나가는 요청이 없습니다(화면 아래 원본 소스 링크 하나만 있음).

## 색과 연출을 고칠 때

- 캔버스 색은 `src/data/constants.ts` 의 `Themes.cream` / `Themes.night`, 페이지 색은 `assets/style.scss` 의 `:root[data-theme]` 변수에 같은 값으로 둡니다. 새 색을 코드에 바로 쓰지 말고 테마에 더합니다.
- 연출(`src/funLayer.ts`)은 게임 상태를 읽기만 합니다. 물리·판정 코드(`roulette.ts`, `physics-box2d.ts`)에 값을 쓰지 않습니다.
- 바꾼 뒤에는 캐릭터·글자 버전 × 밝게·어둡게 네 가지와 휴대폰 화면을 확인합니다.

## 빌드

Node.js 18 이상과 yarn이 필요합니다.

```sh
cd tools/wheel
yarn install --frozen-lockfile
npm run build      # 저장소 루트의 wheel/ 를 비우고 다시 만든다
npm run dev        # http://localhost:1235 에서 바로 고쳐 보기
npm run typecheck
python3 scripts/make_mong.py   # 캐릭터 그림을 바꿨을 때만 (Pillow 필요)
```

`wheel/` 안의 파일은 빌드 결과이므로 직접 고치지 않습니다.
