// VPyLab 교사 연수 · 슬라이드 내용과 진행 메모
// 실행 화면은 VPyLab의 "도구 → HTML 내려받기"로 받은 파일(demos/)이다. 서버나 DB 없이 이 페이지 안에서 돈다.
// 내려받은 파일에서는 클릭, 키보드, 버튼, 슬라이더가 동작하지 않는다. 그런 예제는 ext 로 표시하고 VPyLab 새 탭으로 연다.
(function () {
  var P = ["", "왜 만들었나", "무엇이 되나", "직접 해 보기", "수업으로"];
  function ex(id) { return "/sandbox?example=" + id; }

  window.DECK = { site: "https://vpylab.vercel.app", parts: P, slides: [

  { type: "cover", toc: "표지",
    title: '빛과 소리로 코딩하는<br><span class="grad">3D 파이썬, VPyLab</span>',
    by: "교사 연수 · 당곡고등학교 수리정보교육부 석리송",
    hint: "오른쪽 화면을 한 번 눌러 보세요. 음악이 나와요.",
    demo: "lightshow-galaxy-disco",
    note: "인사 전에 오른쪽 화면을 눌러 음악을 틀어 둔다. 이것도 파이썬 100줄 남짓." },

  // ───────── 왜 만들었나 ─────────
  { type: "visual", part: 1, chip: ["doran", "출발점"], title: "글자와 숫자만 다루는 파이썬 수업, 수학 수업 같다",
    ratio: "half", flip: true,
    termTitle: "흔히 보는 파이썬 수업 화면",
    term: ">>> a = 3\n>>> b = 4\n>>> print(a + b)\n7\n>>> for i in range(1, 6):\n...     print(i, i * i)\n...\n1 1\n2 4\n3 9\n4 16\n5 25",
    quotes: [
      ["chorong", "결과는 글자와 숫자뿐", ""],
      ["mongsil", "학생이 바꿔 볼 수 있는 것도 숫자뿐", ""],
      ["ttukttak", "코딩보다는 계산 문제 풀이에 가까움", ""]
    ],
    note: "텍스트로만 하는 파이썬 수업의 한계. 학생들한테 '이거 수학이에요?' 소리 들어 본 적 있는지 선생님들께 물어보며 시작." },

  { type: "menu", part: 1, chip: ["sallang", "GlowScript 원본"], title: "VPython 수업에서 학생들이 만든 작품",
    toc: "VPython 시절 학생 작품 (GlowScript 원본)",
    legend: "GlowScript(웹 VPython)로 만든 학생 작품. 버튼을 누르면 glowscript.org 원본이 이 자리에서 열림",
    items: [
      { label: "바운스볼 게임", sub: "2021 서울고", mong: "gori", head: "바운스볼 게임", gs: "gs2021-02", chips: [["green", "학생 작품", "게임 규칙과 충돌 조건을 학생이 직접 짬"]] },
      { label: "화살 게임", sub: "2021 서울고", mong: "sallang", head: "화살 게임", gs: "gs2021-03", chips: [["green", "학생 작품", "화살이 과녁에 맞았는지 코드로 판정"]] },
      { label: "뉴턴의 사고 실험", sub: "2021 서울고", mong: "doran", head: "뉴턴의 사고 실험", gs: "gs2021-04", chips: [["green", "학생 작품", "산꼭대기에서 포탄을 세게 쏘면 지구를 한 바퀴 돌까?"]] },
      { label: "태양계 시뮬레이션", sub: "2021 서울고", mong: "mongsil", head: "태양계 시뮬레이션", gs: "gs2021-06", chips: [["green", "학생 작품", "행성마다 궤도 반지름과 속도를 다르게 줌"]] },
      { label: "알록달록 공", sub: "2021 서울고", mong: "arong", head: "벽에 부딪히는 알록달록 공", gs: "gs2021-01", chips: [["green", "학생 작품", "벽에 닿으면 튕겨 나오는 공 여러 개"]] },
      { label: "스윙바이", sub: "2018 한성과학고", mong: "chorong", head: "스윙바이", gs: "gs2024-14", chips: [["green", "학생 작품", "행성 중력을 받아 탐사선이 빨라지는 모습"]] }
    ],
    note: "3D가 보이니 학생들이 머릿속에 있던 걸 만들기 시작함. 한두 개만 틀어 보기. 원본이 안 뜨면 '새 탭에서 열기'." },

  { type: "cards", part: 1, chip: ["chorong", "쓰다 보니"], title: "몇 년 쓰면서 아쉬웠던 점",
    cols: 3,
    cards: [
      { mong: "mongsil", tone: "orange", head: "화면이 투박함", body: "원래 대학 물리 수업용이라 화면이 딱딱하고 예제도 물리 위주" },
      { mong: "doran", tone: "orange", head: "소리가 안 남", body: "공이 튀어도, 점수를 따도 아무 소리가 안 남. 소리를 넣을 방법이 없었음" },
      { mong: "dugeun", tone: "blue", head: "캐릭터 만들기가 힘듦", body: "학생들은 캐릭터 만들기를 제일 좋아하는데, 도형을 하나하나 코드로 쌓느라 시간이 오래 걸림" }
    ],
    note: "VPython 흉보는 장 아님. 좋아서 계속 썼고, 쓰다 보니 우리 교실에 맞게 고치고 싶은 데가 생겼다는 얘기." },

  { type: "cards", part: 1, chip: ["dugeun", "VPyLab"], title: "그래서 VPyLab에 더한 것",
    cols: 4,
    cards: [
      { mong: "chorong", tone: "blue", head: "빛과 소리", body: "<code>음표(\"도\")</code> 한 줄로 소리가 남. 스스로 빛나는 물체, 조명" },
      { mong: "ttukttak", tone: "pink", head: "캐릭터 대장간", body: "슬라이더로 캐릭터를 만들고, 그 코드를 작품에 가져다 씀" },
      { mong: "gori", tone: "purple", head: "GitHub 팀 프로젝트", body: "저장할 때마다 커밋이 쌓여 누가 언제 무엇을 했는지 남음. 이 기록을 AI가 읽어 올 수 있음" },
      { mong: "sallang", tone: "green", head: "오픈소스", body: "누구나 가져다 쓰고 고칠 수 있도록 소스를 공개" }
    ],
    note: "뒤에서 하나씩 실제로 돌려 봄. 설치 없이 브라우저에서 돈다는 건 여기서 한마디만." },

  { type: "table", part: 1, chip: ["arong", "한 장 요약"], title: "셋을 나란히 놓고 보면",
    hi: true,
    head: ["", "텍스트 파이썬", "VPython", "VPyLab"],
    rows: [
      ["화면에 나오는 것", "글자, 숫자", "3D", "3D, 빛, 소리"],
      ["학생이 바꿔 보는 것", "숫자", "모양, 색, 움직임", "모양, 색, 움직임, 빛, 음"],
      ["첫인상", "검은 글자 창", "물리 실험 도구", "캐릭터가 있는 화면"],
      ["팀 과제", "파일 주고받기", "파일 주고받기", "GitHub 저장소 하나에 커밋"],
      ["함께 엮을 교과", "수학", "수학, 물리", "수학, 물리, 음악, 미술"]
    ],
    note: "수업하면서 느낀 차이를 줄여 쓴 표. 세세하게 따지면 다를 수 있음." },

  // ───────── 무엇이 되나 ─────────
  { type: "menu", part: 2, chip: ["chorong", "빛과 소리로 코딩"], title: "빛과 소리를 코드로",
    toc: "빛과 소리로 코딩 (실행 5개)",
    legend: "화면을 한 번 누르면 시작. 소리가 나니 스피커를 켜 두세요. ↑↓로 예제 바꾸기",
    items: [
      { label: "갤럭시 디스코", sub: "박자에 맞춰 도는 행성", mong: "chorong", head: "갤럭시 디스코", demo: "lightshow-galaxy-disco", sound: true, open: ex("lightshow-galaxy-disco"),
        chips: [["blue", "빛", "<code>emissive=True</code>로 빛나고 <code>local_light</code>로 비춤"], ["purple", "소리", "박자마다 음과 조명이 같이 바뀜"]] },
      { label: "오로라 심포니", sub: "화음 따라 바뀌는 빛", mong: "sallang", head: "오로라 심포니", demo: "lightshow-aurora-symphony", sound: true, open: ex("lightshow-aurora-symphony"),
        chips: [["purple", "소리", "화음이 차례로 바뀜"], ["blue", "빛", "화음에 따라 구슬의 색과 높이가 바뀜"]] },
      { label: "피아노 분수", sub: "음마다 솟는 빛 기둥", mong: "arong", head: "피아노 분수", demo: "lightshow-piano-fountain", sound: true, open: ex("lightshow-piano-fountain"),
        chips: [["purple", "소리", "멜로디를 리스트 하나에 담음"], ["blue", "빛", "음이 날 때마다 빛 기둥이 솟음"]] },
      { label: "오로라 베일", sub: "흘러가는 빛 커튼", mong: "mongsil", head: "오로라 베일", demo: "cosmic-aurora-veil", sound: true, open: ex("cosmic-aurora-veil"),
        chips: [["green", "수학", "사인 함수로 만든 물결"]] },
      { label: "반딧불이 합창단", sub: "100마리가 제각각 깜빡임", mong: "dugeun", head: "반딧불이 합창단", demo: "cosmic-firefly-choir", sound: true, open: ex("cosmic-firefly-choir"),
        chips: [["green", "코드", "리스트와 난수"], ["blue", "빛", "반딧불이마다 깜빡이는 순간이 다름"]] }
    ],
    note: "하나 골라 30초쯤 틀어 두기. '여기 숫자 하나 바꾸면 박자가 달라져요' 정도만 말하고 넘어감. 고쳐 보고 싶으면 오른쪽 위 버튼으로 VPyLab에서 열기." },

  { type: "menu", part: 2, chip: ["doran", "음악"], title: "음악 수업과도 연결",
    toc: "음악과 연결 (6개)",
    legend: "멜로디는 리스트로, 박자는 반복문으로. 음악 예제 13개",
    items: [
      { label: "주파수 탑", sub: "음높이와 Hz", mong: "ttukttak", head: "주파수 탑", demo: "music-frequency-tower", sound: true, open: ex("music-frequency-tower"),
        chips: [["blue", "볼 것", "높은 음일수록 탑이 높음"], ["green", "과학", "도 262Hz, 한 옥타브 위 도 523Hz"]] },
      { label: "행성 합주단", sub: "행성마다 음 하나", mong: "mongsil", head: "행성 합주단", demo: "music-planet-orchestra", sound: true, open: ex("music-planet-orchestra"),
        chips: [["blue", "볼 것", "행성이 맨 위를 지날 때마다 자기 음을 냄"], ["green", "수학", "공전 속도의 비가 곧 리듬"]] },
      { label: "파동 간섭", sub: "두 음을 함께 내면", mong: "sallang", head: "파동 간섭", demo: "music-wave-interference", sound: true, open: ex("music-wave-interference"),
        chips: [["green", "과학", "두 사인파를 더하면 새 파형이 생김"], ["purple", "들어 보기", "두 음이 겹치면 소리가 울렁거림"]] },
      { label: "피보나치 리듬", sub: "1, 1, 2, 3, 5, 8", mong: "gori", head: "피보나치 리듬", demo: "music-fibonacci-rhythm", sound: true, open: ex("music-fibonacci-rhythm"),
        chips: [["green", "수학", "피보나치 수가 박자가 됨"]] },
      { label: "끝없는 우주 멜로디", sub: "저절로 이어지는 곡", mong: "chorong", head: "끝없는 우주 멜로디", demo: "music-endless-cosmos", sound: true, open: ex("music-endless-cosmos"),
        chips: [["purple", "소리", "규칙에 따라 멜로디를 계속 만들어 냄"], ["blue", "빛", "음이 하나 날 때마다 별이 하나 생김"]] },
      { label: "무지개 피아노", sub: "눌러서 연주", mong: "arong", head: "무지개 피아노", demo: "music-rainbow-piano", ext: "상자를 눌러 학교종을 쳐 보세요", open: ex("music-rainbow-piano"),
        chips: [["purple", "해 보기", "도레미파솔라시 상자를 눌러 연주"], ["green", "코드", "클릭할 때마다 음이 하나 남"]] }
    ],
    note: "무지개 피아노는 연수 오신 분 한 명 나와서 쳐 보게 하기. 음악 선생님과 같이 수업 짜기 좋은 대목." },

  { type: "menu", part: 2, chip: ["ttukttak", "물리 시뮬레이션"], title: "물리 시뮬레이션, VPython이 원래 잘하던 일",
    toc: "물리 시뮬레이션 (실행 6개)",
    legend: "<code>속도 += 가속도 * dt</code><br><code>위치 += 속도 * dt</code><br>대부분 이 두 줄로 움직임",
    items: [
      { label: "진자 운동", sub: "줄에 매달린 공", mong: "ttukttak", head: "진자 운동", demo: "pendulum", open: ex("pendulum"),
        chips: [["orange", "바꿔 볼 값", "줄 길이, 처음 각도"], ["blue", "물어보기", "줄이 길어지면 주기는?"]] },
      { label: "포물선 대포", sub: "각도와 속도", mong: "gori", head: "포물선 대포", demo: "cannon", open: ex("cannon"),
        chips: [["orange", "바꿔 볼 값", "발사 각도, 처음 속도"], ["blue", "물어보기", "제일 멀리 가는 각도는?"]] },
      { label: "바운스 볼", sub: "부딪히면 소리", mong: "arong", head: "바운스 볼", demo: "bounce-ball", sound: true, open: ex("bounce-ball"),
        chips: [["blue", "볼 것", "벽에 닿으면 색이 바뀌고 소리가 남"], ["green", "코드", "벽에서 튕기는 건 <code>if</code> 한 줄"]] },
      { label: "파동", sub: "출렁이는 격자", mong: "sallang", head: "파동 시뮬레이션", demo: "wave-sim", open: ex("wave-sim"),
        chips: [["green", "수학", "거리와 시간에 따라 높이가 바뀌는 사인 함수"], ["orange", "바꿔 볼 값", "파장, 속도"]] },
      { label: "행성 충돌", sub: "서로 끌려와 쾅", mong: "chorong", head: "행성 충돌", demo: "planet-collision", sound: true, open: ex("planet-collision"),
        chips: [["blue", "볼 것", "서로 끌어당기며 가까워지다 부딪힘"], ["orange", "바꿔 볼 값", "질량, 처음 거리"]] },
      { label: "도플러 효과", sub: "지나가는 자동차", mong: "doran", head: "도플러 효과", demo: "music-doppler", sound: true, open: ex("music-doppler"),
        chips: [["purple", "들어 보기", "다가올 땐 높은 소리, 멀어질 땐 낮은 소리"], ["blue", "물어보기", "구급차 소리는 왜 바뀔까?"]] }
    ],
    note: "VPython이 원래 잘하던 일이고 그대로 됨. 바운스 볼, 도플러는 물리에 소리가 붙은 예. 과학 선생님께 어느 단원에 쓸지 물어보기." },

  { type: "mosaic", part: 2, chip: ["dugeun", "캐릭터"], title: "첫 화면부터 캐릭터",
    cols: 3, light: true,
    btn: ["▶ 홈에서 움직여 보기", "/"],
    items: [["hero-mandu", "만두", "만두 빚기"], ["hero-toolbox", "공구상자", "뚜껑 달그락"], ["hero-friends", "프렌즈", "넷이 따로 통통"]],
    band: ["pink", "전부 구, 타원체, 상자 같은 기본 도형으로 만든 것. '이 친구, 내 코드로 만들기'를 누르면 그 코드가 열림"],
    note: "홈 열어서 친구 바꿔 가며 움직임 틀어 주기. 이것도 다 코드라는 것만 짚으면 됨." },

  { type: "visual", part: 2, chip: ["gori", "대장간"], title: "대장간: 슬라이더로 캐릭터 만들기",
    stack: true, img: "forge", cap: "대장간 작업대",
    btn: ["▶ 대장간 열기", "/forge"],
    list: [
      ["1", "blue", "<b>모양 고르기</b><br>캐릭터 4종, 소품 6종, 기본 모양 5종, 종"],
      ["2", "blue", "<b>다듬기</b><br>크기, 얼굴, 팔다리, 색"],
      ["3", "purple", "<b>보관함에 넣기</b><br>이름을 붙여 저장"],
      ["4", "orange", "<b>코드 복사</b><br>내 작품에 붙여 넣기"]
    ],
    note: "슬라이더 밀면 오른쪽 아래 body_width = 1.72 같은 코드가 같이 바뀜. 실제로 열어서 한 번 밀어 보기." },

  { type: "flow", part: 2, chip: ["mongsil", "저장"], title: "서버 DB는 없앴고, 코드는 학생이 가짐",
    steps: [
      ["chorong", "혼자 만들기", "로그인 없이 바로 시작. 쓰던 코드는 브라우저에 14일 동안 남고, 링크나 HTML 파일로 보관", "먼저"],
      ["arong", "구글 드라이브", "다른 컴퓨터에서 이어 하려면 저장을 누름. 내 드라이브의 VPyLab 폴더에 저장됨", "저장이 필요하면"],
      ["gori", "GitHub 팀 프로젝트", "프로젝트 하나가 저장소 하나. 팀원은 초대 코드로 들어오고, 저장하면 커밋이 남음", "같이 만들 때"]
    ],
    bands: [
      ["blue", "학생 코드를 서버에 모아 두지 않음. 구글 드라이브에서도 VPyLab은 자기가 만든 파일만 열 수 있음"],
      ["green", "셋을 한꺼번에 할 필요는 없음. 첫 시간엔 로그인 없이 만들기만 해도 충분"]
    ],
    note: "예전엔 서버 DB(Supabase)에 저장했는데 지금은 없앰. 학교에서 걱정하는 개인정보 문제가 많이 줄어듦. GitHub 계정은 만 13세 이상이라 원하는 팀만." },

  { type: "cards", part: 2, chip: ["gori", "팀 프로젝트"], title: "팀 과제, 누가 뭘 했는지 남는다",
    cols: 4,
    cards: [
      { mong: "gori", tone: "purple", head: "저장하면 커밋", body: "누가, 언제, 무엇을 바꿨는지 GitHub에 남음" },
      { mong: "arong", tone: "blue", head: "기록 남기기", body: "한 일, 막힌 점, 다음에 할 일을 학생이 직접 적음" },
      { mong: "doran", tone: "green", head: "예전 버전 열기", body: "저장 이력에서 지난 코드를 불러와 다시 돌려 봄" },
      { mong: "chorong", tone: "orange", head: "AI가 읽는 기록", body: "쌓인 커밋과 기록을 AI가 읽어 와 과정을 돌아볼 때 씀" }
    ],
    band: ["blue", "학생 기록 예: “공이 바닥을 뚫고 내려가서, 중심 좌표만 보지 않고 반지름까지 더해 충돌을 판단했다. 다음엔 공이 빠를 때도 되는지 확인할 것.”"],
    note: "결과물만 봐서는 누가 했는지 모름. 커밋이랑 기록이 있으니 과정을 놓고 얘기할 수 있음. AI는 정리만 도와줌. 평가는 교사가." },

  { type: "cards", part: 2, chip: ["doran", "처음인 학생"], title: "영어가 낯선 학생을 위해",
    cols: 3,
    cards: [
      { mong: "arong", tone: "blue", head: "한글로 써도 됨", body: "<code>색상['하늘']</code>, <code>음표(\"도\")</code>, <code>무지개[i]</code>. 변수 이름도 <code>공</code>, <code>곡</code>" },
      { mong: "doran", tone: "purple", head: "단어 뜻이 옆에 뜸", body: "<code>radius</code>를 치면 그림과 뜻이 잠깐 나옴. 같은 단어는 두 번까지만" },
      { mong: "ttukttak", tone: "green", head: "자동 완성", body: "<code>sp</code>까지 치면 <code>sphere</code>를 제안. AI를 쓰지 않아 학생 코드가 밖으로 나가지 않음" }
    ],
    band: ["orange", "영어 화면도 있음: 더 보기 → 언어 → English"],
    note: "소리 명령이랑 한글 이름은 VPyLab에만 있음. 다른 VPython으로 옮길 땐 문서의 'VPyLab 확장' 표시 확인." },

  // ───────── 직접 해 보기 ─────────
  { type: "url", part: 3, chip: ["chorong", "같이 해 보기"], title: "이제 직접 해 봅시다",
    url: "vpylab.vercel.app", sub: "크롬이나 엣지에서. 설치도 로그인도 필요 없음",
    cards: [
      { mong: "ttukttak", head: "처음 실행은 10초쯤", body: "파이썬 엔진을 받아 오는 시간. '준비됨'이 뜨면 실행" },
      { mong: "arong", head: "소리가 안 나면", body: "<b>도구 → 소리 켜기</b>를 누르고 기기 음량을 확인하세요." },
      { mong: "doran", head: "튜토리얼부터", body: "위 메뉴 <b>튜토리얼</b>에서 '체험하기'를 누르면 코드가 든 화면이 열림" }
    ],
    btn: ["▶ 튜토리얼 열기", "/tutorials"],
    note: "다 들어오셨는지 확인. 와이파이가 느리면 실행 버튼을 미리 눌러 두게." },

  { type: "menu", part: 3, chip: ["dugeun", "튜토리얼"], title: "하나만 바꿔 보고, 왜 그런지 말해 보기",
    toc: "튜토리얼 실습 (5개)",
    legend: "하나에 8분쯤. 오른쪽은 지금 실행 중인 결과. 코드는 'VPyLab에서 열어 고치기'를 눌러 각자 화면에서 고치기",
    items: [
      { label: "3D를 바로 만들기", sub: "공 하나", mong: "dugeun", head: "3D를 바로 만들기", demo: "shape", open: "/tutorials/shape",
        code: "from vpython import *\nsphere(radius=0.5, color=색상['하늘'])", cs: 26,
        tasks: [["chg", null, "<code>radius=0.5</code>를 <code>radius=1</code>로"], ["ask", null, "반지름을 두 배로 하면 공은 얼마나 커질까?"], ["tip", null, "<code>sphere</code>를 <code>box</code>로, <code>'하늘'</code>을 <code>'분홍'</code>으로"]] },
      { label: "빛과 소리 연결", sub: "빛나면서 '도' 소리", mong: "chorong", head: "빛과 소리 연결하기", demo: "light-sound", sound: true, open: "/tutorials/light-sound",
        code: "from vpython import *\n공 = sphere(radius=0.4, color=색상['민트'])\nsleep(0.5)\n공.emissive = True\n공.radius = 0.8\n음표(\"도\")", cs: 24,
        tasks: [["chg", null, "<code>음표(\"도\")</code>를 <code>음표(\"솔\")</code>로"], ["ask", null, "음만 바꿨는데 화면도 달라질까? 빛을 켜는 줄은 어디일까?"]] },
      { label: "움직임 보기", sub: "조금씩 60번", mong: "sallang", head: "움직임 눈으로 보기", demo: "motion", open: "/tutorials/motion",
        code: "from vpython import *\n공 = sphere(radius=0.3, color=색상['분홍'],\n            make_trail=True)\nfor i in range(60):\n    rate(30)\n    공.pos = 공.pos + vector(0.03, 0, 0)", cs: 23,
        tasks: [["chg", null, "<code>0.03</code>을 <code>-0.03</code>으로"], ["ask", null, "부호를 바꾸면 어느 쪽으로 갈까?"], ["tip", null, "<code>vector(0.03, 0.02, 0)</code>이나 <code>rate(120)</code>으로도 바꿔 보기"]] },
      { label: "버튼으로 색 바꾸기", sub: "누를 때마다 실행", mong: "gori", head: "버튼을 누르면 색이 바뀌게", demo: "interaction", ext: "버튼을 눌러 색을 바꿔 보세요", open: "/tutorials/interaction",
        code: "from vpython import *\n공 = sphere(color=색상['하늘'])\ndef 바꾸기(b):\n    공.color = 색상['노랑']\nbutton(text=\"색 바꾸기\", bind=바꾸기)", cs: 24,
        tasks: [["chg", null, "<code>'노랑'</code>을 <code>'보라'</code>로 바꾸고, 다시 실행해서 버튼 누르기"], ["tip", null, "함수 안에 <code>음표(\"미\")</code>를 넣으면 버튼이 소리도 냄"]] },
      { label: "키보드 우주 악기", sub: "A S D F로 연주", mong: "doran", head: "키보드 우주 악기", demo: "space-instrument", ext: "화면을 누르고 A S D F를 쳐 보세요", open: "/tutorials/space-instrument",
        chips: [["purple", "해 보기", "A S D F를 누르면 행성이 커지면서 음이 남"], ["green", "코드", "리스트 3개(음, 키, 색)와 함수 하나"], ["orange", "빨리 끝나면", "음을 다른 계이름으로 바꿔 보기"]] }
    ],
    note: "예상 → 실행 → 하나만 수정 → 설명. 실행 누르기 전에 옆 사람한테 무슨 일이 생길지 먼저 말하게. 점수도 정답도 없음." },

  { type: "cards", part: 3, chip: ["dugeun", "15분 과제"], title: "움직이고 소리 나는 내 캐릭터",
    cols: 4,
    cards: [
      { mong: "gori", tone: "blue", head: "1. 가져오기", body: "대장간에서 캐릭터를 다듬고 코드를 복사해 <b>만들기</b>에 붙여 넣기" },
      { mong: "sallang", tone: "green", head: "2. 움직이기", body: "<code>for</code>와 <code>rate()</code>로 <code>obj.pos</code>를 조금씩 옮기기. 앞의 '움직임 보기' 코드를 그대로 씀" },
      { mong: "doran", tone: "orange", head: "3. 소리 넣기", body: "움직이는 중간에 <code>음표(\"도\")</code> 넣기" },
      { mong: "arong", tone: "purple", head: "4. 보여 주기", body: "<b>도구 → 공유</b>로 링크를 만들고 QR로 옆 사람에게 보여 주기" }
    ],
    band: ["blue", "다 됐으면 옆 사람 작품 코드를 열어 보고, 바꿔 보고 싶은 값 하나를 말해 주세요."],
    btn: ["▶ 대장간 열기", "/forge"],
    note: "완성 안 해도 됨. 공유 링크 한 번 만들어 보는 데까지. 두세 분 작품 앞 화면에 띄우기." },

  // ───────── 수업으로 ─────────
  { type: "table", part: 4, chip: ["ttukttak", "수업 짜기"], title: "7차시로 짜 보면",
    head: ["차시", "하는 일", "쓰는 메뉴, 남는 것"],
    rows: [
      ["1", "3D와 소리 맛보기", "튜토리얼 4개. 바꿔 본 값과 그 까닭을 한 줄로"],
      ["2~3", "변수, 반복, 조건, 리스트", "트레이닝 6단계. 단계마다 되돌아보기 질문에 답"],
      ["4", "내 캐릭터 만들기", "대장간. 보관함에 저장한 내 캐릭터"],
      ["5~6", "팀 프로젝트", "만들기와 GitHub. 커밋과 작업 기록"],
      ["7", "발표", "공유 링크와 QR. 친구 코드를 읽고 한 가지 제안"]
    ],
    foot: "코딩이 처음인 반은 2~3차시 대신 트레이닝 '처음 만드는 빛과 소리'(8차시)로 해도 됨",
    note: "제가 짜 본 예시. 옆 선생님과 '우리 학교면 어느 과목에서 몇 차시?' 2분 얘기하기." },

  { type: "cards", part: 4, chip: ["sallang", "오픈소스"], title: "누구나 쓰도록 공개",
    cols: 3,
    cards: [
      { mong: "sallang", tone: "green", head: "소스 공개", body: "AGPL v3. 가져다 쓰고, 고치고, 고친 걸 다시 나눌 수 있음" },
      { mong: "doran", tone: "blue", head: "한국어와 영어", body: "메뉴, 안내, 기초 교재가 영어로도 있어 외국 교실에서도 쓸 수 있음" },
      { mong: "mongsil", tone: "purple", head: "같이 고쳐 가기", body: "써 보시고 불편한 점이나 넣고 싶은 예제를 알려 주시면 다음 판에 반영" }
    ],
    band: ["green", "우리 학교 수업에 쓰려고 만들었지만, 다른 학교와 다른 나라의 컴퓨팅 사고력 수업에도 쓰였으면 하는 바람"],
    note: "오늘 나온 의견도 그대로 반영. 소스는 github.com/greatsong/vpylab-classroom." },

  { type: "end", toc: "마무리", title: "질문 받아요", sub: "오늘 본 예제는 모두 이 페이지에서 다시 실행해 볼 수 있어요",
    links: [["VPyLab", "/", "vpylab.vercel.app"], ["사용 안내", "/guide", "/guide"], ["교사용 교재", "https://greatsong.github.io/vpylab-textbook/", "greatsong.github.io/vpylab-textbook"], ["소스 코드", "https://github.com/greatsong/vpylab-classroom", "github.com/greatsong/vpylab-classroom"]],
    note: "이 슬라이드 주소를 연수 자료로 나눠 드림." }
  ] };
})();
