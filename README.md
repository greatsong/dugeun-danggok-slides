# 두근두근 당곡 5분 소개 슬라이드

2026. 11. 11. AI중점학교 당곡고등학교 수리정보교육부 발표용 슬라이드입니다.

- 바로가기: https://greatsong.github.io/dugeun-danggok-slides/
- 원본 작업 폴더: danggok-program-v3/output/intro-5min-20261111
- 화면 속 학생·교사·운영 수치는 모의 자료입니다.

## 두근두근 룰렛 (광고 없는 구슬 추첨기)

- 캐릭터 버전: https://greatsong.github.io/dugeun-danggok-slides/wheel/ (구슬마다 두근두근 캐릭터)
- 글자 버전: https://greatsong.github.io/dugeun-danggok-slides/wheel/text.html (색 구슬과 이름·번호만)
- 이름 미리 넣기: 주소 끝에 `?names=가,나,다`. 번호는 `1~30`처럼 범위로 넣을 수 있습니다.
- lazygyu의 Marble Roulette 소스(MIT)에서 광고·통계·상점 연결을 빼고 '운명의 수레바퀴' 맵 하나만 남겼습니다. 상표인 "마블 룰렛" 이름은 쓰지 않습니다.
- 바탕은 설정에서 밝게(기본)·어둡게를 고릅니다. 효과음은 스피커 버튼이나 M 키로 끕니다. 디자인 회의 기록: `tools/wheel/DESIGN-MEETING.md`
- 소스와 빌드 방법: `tools/wheel/README.md`. `wheel/`은 빌드 결과입니다.

## VPyLab 교사 연수 슬라이드

- 바로가기: https://greatsong.github.io/dugeun-danggok-slides/vpylab/
- PDF: `vpylab/VPyLab-교사연수-슬라이드.pdf` (메뉴 장은 예제마다 한 쪽씩 펼쳐서 실음)
- 파일: `vpylab/deck-data.js`(내용과 진행 메모), `vpylab/deck.js`(동작), `vpylab/index.html`(모양), `vpylab/gs-data.js`(GlowScript 원본 목록)
- `vpylab/demos/`: VPyLab의 "도구 → HTML 내려받기"로 받은 예제 파일. 서버나 DB 없이 페이지 안에서 바로 실행됩니다.
  - 내려받은 파일에서는 클릭, 키보드, 버튼, 슬라이더가 동작하지 않습니다. 그런 예제(무지개 피아노, 버튼 튜토리얼, 키보드 우주 악기)는 VPyLab 새 탭으로 엽니다.
  - 예제를 바꾸려면 VPyLab에서 HTML을 내려받아 `demos/`에 넣고, `shots/d-<이름>.jpg`에 대표 화면을 넣은 뒤 `deck-data.js`에 항목을 더합니다.
- GlowScript 원본은 누르면 glowscript.org 페이지를 그 자리에 불러옵니다. 안 뜨면 '새 탭에서 열기'를 씁니다.
- 캐릭터 그림(`vpylab/mong/`)은 vpylab.vercel.app 사용 안내에 쓰이는 그림입니다.
- 주소 끝에 `?print=1`을 붙이면 인쇄용 화면이 됩니다. PDF는 이 화면을 쪽마다 찍어 묶은 것입니다.
