// VPyLab 교사 연수 · 슬라이드 내용과 진행 메모
// 실시간 화면은 VPyLab의 /embed/<id> 만 iframe으로 넣을 수 있다(그 밖의 페이지는 X-Frame-Options: DENY).
(function () {
  var SITE = "https://vpylab.vercel.app";
  var EMBED = {
    bounce: "aaaaaaaa-1111-1111-1111-111111111111",   // 반사하는 공
    rainbow: "bbbbbbbb-2222-2222-2222-222222222222",  // 무지개 구슬
    gravity: "cccccccc-3333-3333-3333-333333333333",  // 자유 낙하 + 바운스
    doremi: "d3a14e97-016c-489c-81ab-cfd58ff4591c"    // 도레미파솔라시도
  };
  var P = ["", "1부 · 왜 VPyLab인가", "2부 · 둘러보기", "3부 · 실습 ① 튜토리얼", "4부 · 실습 ② 캐릭터와 대장간", "5부 · 수업에 적용하기"];

  window.DECK = { site: SITE, title: "VPyLab 교사 연수", slides: [

  // ───────── 오프닝 ─────────
  { type: "cover",
    note: "인사와 함께 오늘의 목표를 말합니다. ‘끝날 때 내 캐릭터가 움직이고 소리 나는 작품 하나를 링크로 공유한다’가 목표입니다." },

  { type: "table", chip: ["dugeun", "오늘의 흐름"], title: "2시간 30분, 보고 · 따라 하고 · 수업으로 가져갑니다",
    head: ["시간", "무엇을", "어떻게"],
    rows: [
      ["0:00 · 20분", "1부 · 왜 VPyLab인가", "교실의 고민과 VPyLab의 답, 실제 작품 보기"],
      ["0:20 · 25분", "2부 · 둘러보기", "메뉴 7개와 만들기 화면 구조"],
      ["0:45 · 40분", "3부 · 실습 ① 튜토리얼 4종", "실행하고, 한 가지만 바꾸고, 설명하기"],
      ["1:25 · 10분", "쉬는 시간", "", "brk"],
      ["1:35 · 35분", "4부 · 실습 ② 캐릭터와 대장간", "내 캐릭터를 만들고 움직여 공유하기"],
      ["2:10 · 20분", "5부 · 수업에 적용하기", "트레이닝 코스, 팀 프로젝트, 공유와 평가"]
    ],
    note: "시간은 권장값입니다. 실습이 길어지면 5부의 ‘공유와 평가’를 줄이고 링크 모음으로 대신합니다." },

  { type: "url", chip: ["chorong", "준비"], title: "지금 함께 접속해 주세요",
    url: "vpylab.vercel.app", sub: "크롬이나 엣지에서 엽니다. 설치도 로그인도 필요 없습니다.",
    cards: [
      { mong: "ttukttak", head: "설치 없음", body: "파이썬이 브라우저 안에서 실행됩니다. 처음 한 번만 엔진을 받아 오느라 10초쯤 걸립니다." },
      { mong: "doran", head: "로그인 없음", body: "튜토리얼 · 트레이닝 · 만들기 실행은 로그인 없이 됩니다. 저장과 팀 프로젝트에만 로그인이 필요합니다." },
      { mong: "arong", head: "소리 켜기", body: "소리 실습이 있습니다. 기기 음량을 확인하고, 실습 화면의 <b>도구 → 소리 켜기</b>를 눌러 주세요." }
    ],
    btn: ["▶ VPyLab 열기", "/"],
    note: "모두 접속했는지 확인합니다. 학교 와이파이에서 첫 실행이 느리면 ‘실행’을 한 번 눌러 두고 기다리게 합니다." },

  // ───────── 1부 ─────────
  { type: "section", part: 1, mong: "dugeun-band", title: "왜 VPyLab인가", sub: "교실의 고민에서 시작합니다", time: "20분" },

  { type: "bubbles", part: 1, title: "파이썬 수업, 이런 장면이 익숙하지 않으신가요",
    items: [
      ["ttukttak", "설치와 환경 설정에\n수업 절반이\n지나가요", "첫 시간"],
      ["doran", "print 결과만으로는\n아이들이 금방\n흥미를 잃어요", "문법 수업"],
      ["chorong", "어디가 틀렸는지\n눈에 보이지 않아\n손을 못 대요", "오류 앞에서"],
      ["mongsil", "작품을 모으고\n함께 보는 일이\n번거로워요", "발표와 평가"]
    ],
    note: "선생님들의 경험을 한두 분께 물어봅니다. 네 가지 고민이 각각 다음 장의 답과 짝을 이룹니다." },

  { type: "cards", part: 1, chip: ["dugeun", "한 줄 소개"], title: "파이썬 코드가 눈앞의 3D와 소리가 되는 교실",
    cols: 4,
    cards: [
      { mong: "ttukttak", tone: "orange", head: "브라우저만 있으면", body: "설치 없이 주소 하나로 시작합니다. 크롬북 · 태블릿에서도 됩니다." },
      { mong: "doran", tone: "blue", head: "코드가 3D와 소리로", body: "<code>sphere()</code> 한 줄이 공이 되고, <code>음표(\"도\")</code> 한 줄이 소리가 됩니다." },
      { mong: "chorong", tone: "purple", head: "바꾸면 바로 보임", body: "값 하나를 바꾸고 실행하면 결과가 달라집니다. 원인과 결과를 눈으로 잇습니다." },
      { mong: "mongsil", tone: "green", head: "링크 하나로 공유", body: "공유 링크 · QR · 갤러리로 작품을 모으고 함께 봅니다." }
    ],
    note: "기술 구성은 Pyodide(브라우저 속 파이썬) + Three.js(3D) + Web Audio(소리)입니다. 질문이 나오면 답하고, 먼저 설명하지는 않습니다." },

  { type: "live", part: 1, chip: ["mandu", "지금 실행 중"], title: "아래 화면은 캡처가 아니라, 실행 중인 파이썬입니다",
    embed: EMBED.bounce, label: "반사하는 공",
    code: 'from vpython import *\n\nball = sphere(pos=vector(0, 0, 0), radius=0.5, color=color.cyan)\nball.velocity = vector(1, 0, 0)\n\ndt = 0.01\nwhile True:\n    rate(100)\n    ball.pos = ball.pos + ball.velocity * dt\n    if abs(ball.pos.x) > 5:\n        ball.velocity.x = -ball.velocity.x',
    cs: 21,
    tasks: [["ask", "함께 생각하기", "공이 벽에서 되돌아오게 하는 줄은 어느 줄일까요?"]],
    btn: ["VPyLab에서 열어 고치기", "/gallery/" + EMBED.bounce],
    note: "마우스로 장면을 돌려 보입니다. ‘조건문 한 줄이 반사를 만든다’는 것을 확인합니다. 화면이 안 뜨면 오른쪽 위 버튼으로 새 탭에서 엽니다." },

  { type: "flow", part: 1, chip: ["salang", "학습 원칙"], title: "예상하고, 실행하고, 고치고, 설명합니다",
    steps: [
      ["doran", "예상", "실행하기 전에 무슨 일이 일어날지 말해 봅니다"],
      ["chorong", "실행", "결과를 3D와 소리로 확인합니다"],
      ["ttukttak", "수정", "한 번에 한 가지 값만 바꿉니다"],
      ["arong", "설명", "달라진 까닭을 친구에게 말합니다"]
    ],
    bands: [
      ["blue", "기본 학습은 AI 없이 진행합니다. 자동 완성과 단어 안내도 정해진 규칙으로 동작하며, 학생 코드를 AI나 외부 서버로 보내지 않습니다."],
      ["green", "튜토리얼에는 점수도 정답도 없습니다. ‘바꿔 보기’ 한 가지와 ‘생각해 보기’ 질문 한 가지가 있습니다."]
    ],
    note: "이 네 단계가 오늘 실습의 진행 방식이기도 합니다. 3부에서 그대로 따라 합니다." },

  { type: "cards", part: 1, chip: ["arong", "처음 배우는 학생을 위해"], title: "영어와 문법의 문턱을 낮췄습니다",
    cols: 3,
    cards: [
      { mong: "arong", tone: "blue", head: "한글 이름과 한글 명령", body: "<code>색상['하늘']</code>, <code>음표(\"도\")</code>, <code>무지개[i]</code>처럼 한글로 쓸 수 있습니다. 변수 이름도 <code>공</code>, <code>곡</code>처럼 한글이 됩니다." },
      { mong: "doran", tone: "purple", head: "코드 속 작은 영어 사전", body: "<code>radius</code>, <code>opacity</code> 같은 낯선 단어를 입력하면 그림 · 뜻 · 예시 카드가 잠깐 나타납니다. 같은 단어는 두 번까지만 안내합니다." },
      { mong: "gori", tone: "green", head: "AI 없는 자동 완성", body: "<code>sp</code> → <code>sphere</code>, <code>ball.</code> → 도형 속성. Ctrl+Space로 열고 Tab으로 넣습니다." }
    ],
    band: ["orange", "소리 명령과 한글 별칭은 VPyLab 확장입니다. 표준 VPython으로 옮길 때는 문서의 ‘VPython 기본 기능 / VPyLab 확장’ 구분을 확인하세요."],
    note: "영문판도 있습니다(더 보기 → 언어 → English). 영어 실습은 play_note_and_wait(\"C4\", 0.4)처럼 같은 기능의 영문 명령을 씁니다." },

  // ───────── 2부 ─────────
  { type: "section", part: 2, mong: "doran", title: "둘러보기", sub: "메뉴 일곱 개, 그리고 만들기 화면", time: "25분" },

  { type: "menu", part: 2, chip: ["doran", "메뉴 한 바퀴"], title: "위쪽 메뉴 순서대로 살펴봅니다",
    btn: ["▶ VPyLab 열기", "/"],
    items: [
      { label: "홈", sub: "코드 친구들", mong: "mandu", head: "첫 화면에서 코드 친구를 만납니다", shot: "home", cap: "VPyLab 홈",
        link: ["열기", "/"],
        chips: [["blue", "학생", "만두 · 손전등 · 공구상자 · 분홍 친구를 돌려 보고 움직임 재생"], ["purple", "연결", "‘이 친구, 내 코드로 만들기’로 바로 실습"]] },
      { label: "튜토리얼", sub: "3~5분 체험", mong: "chorong", head: "기능마다 3~5분, 실행하고 한 가지만 바꿉니다", shot: "tutorials", cap: "튜토리얼",
        link: ["열기", "/tutorials"],
        chips: [["blue", "체험 4종", "3D · 빛과 소리 · 움직임 · 버튼"], ["green", "탐구", "키보드 우주 악기 등 10~20분 활동"]] },
      { label: "트레이닝", sub: "단계별 코스", mong: "ttukttak", head: "기초 8차시와 핵심 연습 6단계", shot: "missions", cap: "트레이닝",
        link: ["열기", "/missions"],
        chips: [["blue", "기초", "처음 만드는 빛과 소리 · 8차시"], ["purple", "연습", "변수 · 반복 · 조건 · 리스트 · 내 작품"]] },
      { label: "만들기", sub: "편집기 + 3D", mong: "arong", head: "코드를 쓰고 바로 실행하는 작업 공간", shot: "sandbox", cap: "만들기",
        link: ["열기", "/sandbox"],
        chips: [["blue", "실행", "왼쪽 코드, 오른쪽 3D와 콘솔"], ["orange", "협업", "저장 · 팀 프로젝트 · 공유 링크"]] },
      { label: "대장간", sub: "3D 모듈 만들기", mong: "gori", head: "슬라이더로 캐릭터와 부품을 빚습니다", shot: "forge", cap: "대장간",
        link: ["열기", "/forge"],
        chips: [["blue", "시작 모양", "캐릭터 4종 · 프로젝트 에셋 6종 · 기본 모양 5종 · 종"], ["green", "결과", "값을 바꾸면 모양과 코드가 함께 바뀜"]] },
      { label: "갤러리", sub: "학생 작품", mong: "salang", head: "학생 작품을 실행하고 코드를 열어 이어 만듭니다", shot: "gallery", cap: "갤러리",
        link: ["열기", "/gallery"],
        chips: [["blue", "작품", "학생 프로젝트와 교사 · 참고 작품"], ["purple", "리믹스", "원본 실행, 코드 열기, 내 실험으로"]] },
      { label: "문서 · 사용 안내", sub: "참고 자료", mong: "mongsil", head: "명령 설명과 예제, 학생 · 교사용 안내", shot: "docs", cap: "문서",
        link: ["열기", "/docs"],
        chips: [["blue", "문서", "VPython 기본 · VPyLab 확장 · 제공 함수 구분"], ["green", "사용 안내", "시작 순서와 팀 작업 방법"]] }
    ],
    note: "화면을 누르면 크게 보입니다. 각 항목의 ‘열기’로 실제 페이지를 새 탭에 띄워 30초씩만 보여 줍니다. 자세한 것은 실습에서 다룹니다." },

  { type: "flow", part: 2, chip: ["dugeun", "학생의 길"], title: "처음 코딩하는 학생은 이 순서로 걷습니다",
    steps: [
      ["chorong", "튜토리얼", "빛 · 소리 · 클릭을 짧게 체험"],
      ["ttukttak", "트레이닝", "기본 문법을 단계별로 연습"],
      ["gori", "대장간", "다시 쓸 오브젝트 하나 만들기"],
      ["arong", "만들기", "코드를 고쳐 내 작품으로"],
      ["salang", "갤러리", "작품을 보고 아이디어 나누기"]
    ],
    bands: [["blue", "오늘 연수도 같은 순서입니다. 3부에서 튜토리얼, 4부에서 캐릭터와 대장간, 마지막에 공유까지 해 봅니다."]],
    note: "순서는 권장입니다. 어느 메뉴든 바로 들어갈 수 있다는 점도 말합니다." },

  { type: "shotlist", part: 2, chip: ["arong", "만들기 화면"], title: "화면은 세 칸입니다: 코드, 3D, 콘솔",
    shot: "sb-motion", cap: "만들기 · 움직임 눈으로 보기",
    btn: ["▶ 만들기 열기", "/sandbox"],
    list: [
      ["1", "blue", "<b>실행</b> · 초록 버튼. 실행 중에는 <b>정지</b>로 바뀌고 소리도 함께 멈춥니다."],
      ["2", "blue", "<b>왼쪽 편집기</b> · 자동 완성은 Ctrl+Space, 적용은 Tab."],
      ["3", "purple", "<b>오른쪽 3D</b> · 끌어서 돌리고, 전체 화면 · 화면에 맞추기 · XYZ 축 표시."],
      ["4", "purple", "<b>콘솔 출력</b> · print 결과와 오류 안내가 여기 나옵니다."],
      ["5", "orange", "<b>저장 · 팀 프로젝트 · 도구</b> · 로그인 뒤 저장, 초대 코드로 팀 작업, 공유 링크 만들기."]
    ],
    note: "실제 만들기 화면을 열어 실행 → 정지 → 3D 돌리기를 한 번 보여 줍니다." },

  { type: "live", part: 2, chip: ["mandu", "지금 실행 중"], title: "반복문 하나가 일곱 개의 구슬을 움직입니다",
    embed: EMBED.rainbow, label: "무지개 구슬",
    code: 'from vpython import *\nimport math\n\nballs = []\nfor i in range(7):\n    b = sphere(pos=vector(-3+i, 0, 0), radius=0.4,\n               color=무지개[i], make_trail=True)\n    balls.append(b)\n\nt = 0\nwhile True:\n    rate(30)\n    t += 1\n    for i, b in enumerate(balls):\n        b.pos = vector(-3+i, math.sin(t*0.08+i*0.4)*1.5, 0)',
    cs: 19,
    tasks: [["ask", "수학 시간과 잇기", "<code>i*0.4</code>를 0으로 바꾸면 물결은 어떻게 될까요? 사인 함수의 위상을 눈으로 봅니다."]],
    btn: ["VPyLab에서 열어 고치기", "/gallery/" + EMBED.rainbow],
    note: "리스트 · 반복 · 사인 함수가 한 화면에 있습니다. 수학 · 과학 선생님께 융합 수업 아이디어를 물어봅니다." },

  // ───────── 3부 ─────────
  { type: "section", part: 3, mong: "chorong", title: "실습 ① 튜토리얼 4종", sub: "실행하고, 한 가지만 바꾸고, 설명합니다", time: "40분" },

  { type: "cards", part: 3, chip: ["chorong", "실습 방법"], title: "튜토리얼 하나에 8분, 이렇게 진행합니다",
    cols: 3,
    cards: [
      { mong: "doran", tone: "blue", head: "① 예상하고 실행 · 2분", body: "코드를 읽고 무슨 일이 일어날지 옆 사람과 말한 뒤 <b>실행</b>을 누릅니다." },
      { mong: "ttukttak", tone: "orange", head: "② 한 가지만 바꾸기 · 3분", body: "슬라이드의 ‘바꿔 보기’대로 값 하나만 고쳐 다시 실행합니다." },
      { mong: "arong", tone: "purple", head: "③ 설명하기 · 3분", body: "‘생각해 보기’ 질문에 답합니다. 더 바꿔 보고 싶은 값을 하나 골라 실험합니다." }
    ],
    band: ["blue", "튜토리얼 메뉴에서 ‘체험하기 →’를 누르면 코드가 들어 있는 만들기 화면이 열립니다. 슬라이드의 버튼으로도 바로 열 수 있습니다."],
    btn: ["▶ 튜토리얼 열기", "/tutorials"],
    note: "빨리 끝난 분은 ‘만들며 탐구하기’의 키보드 우주 악기를 해 보시게 합니다." },

  { type: "practice", part: 3, no: 1, mong: "mandu", title: "3D를 바로 만들기", time: "8분",
    desc: "한 줄로 공을 만들고 크기를 바꿉니다.",
    code: "from vpython import *\nsphere(radius=0.5, color=색상['하늘'])",
    change: "<code>radius=0.5</code>를 <code>radius=1</code>로 바꾸세요.",
    reflect: "반지름을 두 배로 하면 공은 어떻게 달라지나요?",
    tip: "<code>색상['하늘']</code>을 <code>색상['분홍']</code>으로, <code>sphere</code>를 <code>box</code>로 바꿔 보세요.",
    link: "/tutorials/shape",
    note: "첫 실행은 파이썬 엔진을 받아 오느라 조금 걸립니다. ‘준비됨’이 뜬 뒤 실행을 누르게 합니다." },

  { type: "practice", part: 3, no: 2, mong: "chorong", title: "빛과 소리 연결하기", time: "8분",
    desc: "소리가 나는 순간 공의 빛과 크기가 바뀝니다.",
    code: "from vpython import *\n공 = sphere(radius=0.4, color=색상['민트'])\nsleep(0.5)\n공.emissive = True\n공.radius = 0.8\n음표(\"도\")",
    change: "<code>음표(\"도\")</code>를 <code>음표(\"솔\")</code>로 바꾸세요.",
    reflect: "소리만 바꾸면 화면도 달라지나요? 빛이 바뀌는 줄을 찾아보세요.",
    tip: "소리가 안 나면 · 실습 화면의 <b>도구 → 소리 켜기</b>와 기기 음량을 확인하세요.",
    link: "/tutorials/light-sound",
    note: "코드는 위에서 아래로 한 줄씩 실행된다는 것(순차)을 sleep(0.5)로 확인합니다." },

  { type: "practice", part: 3, no: 3, mong: "salang", title: "움직임 눈으로 보기", time: "8분",
    desc: "같은 공을 조금씩 옮겨 움직임을 만듭니다.",
    code: "from vpython import *\n공 = sphere(radius=0.3, color=색상['분홍'], make_trail=True)\nfor i in range(60):\n    rate(30)\n    공.pos = 공.pos + vector(0.03, 0, 0)",
    cs: 23,
    change: "<code>vector(0.03, 0, 0)</code>의 0.03을 <code>-0.03</code>으로 바꾸세요.",
    reflect: "부호를 바꾸니 어느 방향으로 움직이나요?",
    tip: "<code>vector(0.03, 0.02, 0)</code>처럼 y 값도 넣어 보세요. <code>rate(30)</code>을 <code>rate(120)</code>으로 바꾸면?",
    link: "/tutorials/motion",
    note: "반복문 = ‘조금씩 60번’. 애니메이션이 반복의 결과라는 점을 짚습니다. 좌표와 벡터 개념으로 이어집니다." },

  { type: "practice", part: 3, no: 4, mong: "gori", title: "버튼으로 반응 만들기", time: "8분",
    desc: "버튼을 누르면 공의 색이 바뀝니다.",
    code: "from vpython import *\n공 = sphere(color=색상['하늘'])\ndef 바꾸기(b):\n    공.color = 색상['노랑']\nbutton(text=\"색 바꾸기\", bind=바꾸기)",
    change: "함수 안의 <code>색상['노랑']</code>을 <code>색상['보라']</code>로 바꾸고, 다시 실행한 뒤 버튼을 누르세요.",
    reflect: "실행만 했을 때와 버튼을 눌렀을 때의 차이는 무엇인가요?",
    tip: "함수 안에 <code>음표(\"미\")</code> 한 줄을 넣으면 버튼이 소리도 냅니다.",
    link: "/tutorials/interaction",
    note: "함수는 ‘나중에 실행할 일을 미리 적어 둔 것’입니다. 이벤트 개념을 여기서 처음 만납니다." },

  { type: "live", part: 3, chip: ["drum", "지금 실행 중"], title: "리스트와 반복이 만나면 음계가 됩니다",
    embed: EMBED.doremi, label: "도레미파솔라시도",
    code: 'from vpython import *\n\nscene_background(색상[\'검정\'])\n\n곡 = ["도4", "레4", "미4", "파4", "솔4", "라4", "시4", "도5"]\n\nfor i in range(len(곡)):\n    높이 = 0.3 + i * 0.25\n    box(pos=vector(i - 3.5, 높이 / 2, 0),\n        size=vector(0.6, 높이, 0.6),\n        color=무지개[i % 7])\n    음표(곡[i], 0.45)',
    cs: 19,
    tasks: [["tip", "소리 듣기", "화면 위의 <b>소리 켜기</b>를 누른 뒤 <b>실행</b>을 다시 누르세요."], ["chg", "바꿔 보기", "<code>곡</code>의 순서를 바꾸면 소리와 막대는 각각 어떻게 될까요?"]],
    btn: ["VPyLab에서 열어 고치기", "/gallery/" + EMBED.doremi],
    note: "브라우저 정책 때문에 소리는 사용자가 버튼을 누른 뒤에만 납니다. 음악 교과와의 연결을 이야기합니다." },

  { type: "live", part: 3, chip: ["ttukttak", "도전"], title: "도전 · 떨어지고 튀는 공을 내 것으로",
    embed: EMBED.gravity, label: "자유 낙하 + 바운스",
    code: 'from vpython import *\n\nball = sphere(pos=vector(0, 5, 0), radius=0.5,\n              color=color.orange, make_trail=True,\n              trail_color=color.cyan)\nball.velocity = vector(0, 0, 0)\ng = vector(0, -9.8, 0)\n\ndt = 0.01\nwhile True:\n    rate(100)\n    ball.velocity = ball.velocity + g * dt\n    ball.pos = ball.pos + ball.velocity * dt\n    if ball.pos.y < -3:\n        ball.velocity.y = -ball.velocity.y * 0.9',
    cs: 18,
    tasks: [["chg", "도전 1", "<code>0.9</code>를 <code>0.5</code>와 <code>1.0</code>으로 바꿔 비교하세요. 이 숫자의 뜻은?"], ["chg", "도전 2", "<code>g</code>를 달의 중력 <code>-1.6</code>으로 바꾸면?"]],
    btn: ["VPyLab에서 열어 고치기", "/gallery/" + EMBED.gravity],
    note: "과학(역학)과 잇는 예시입니다. 시간이 부족하면 시범만 보이고 넘어갑니다. 이 장이 끝나면 쉬는 시간입니다." },

  { type: "break", mong: "sleep", title: "쉬는 시간", sub: "10분 뒤에 내 캐릭터를 만들러 갑니다",
    note: "쉬는 동안 대장간(/forge)을 미리 열어 두면 좋습니다." },

  // ───────── 4부 ─────────
  { type: "section", part: 4, mong: "mandu", title: "실습 ② 캐릭터와 대장간", sub: "도형을 모아 친구를 만들고, 움직이고, 공유합니다", time: "35분" },

  { type: "menu", part: 4, chip: ["mandu", "캐릭터 튜토리얼"], title: "세 단계로 내 캐릭터가 아이템을 먹습니다",
    btn: ["▶ 캐릭터 튜토리얼 열기", "/tutorials/forge-character"],
    legend: "튜토리얼 화면 위쪽의 1 · 2 · 3 버튼으로 단계를 바꿉니다. 한 단계 10분쯤입니다.",
    items: [
      { label: "부품을 compound로", sub: "1단계 · 만들기", mong: "gori", head: "구와 타원체를 모아 한 덩어리로 묶습니다",
        code: "def make_friend(where, tint):\n    parts = [\n        sphere(pos=where, radius=0.55, color=color.white),\n        ellipsoid(pos=where+vector(-0.28,-0.45,0.12),\n                  size=vector(0.42,0.24,0.5), color=color.white),\n        # … 손, 발, 검은 눈\n    ]\n    friend = compound(parts)\n    friend.color = tint\n    return friend\n\nplayer = make_friend(vector(0,0,0), vector(0.4,0.75,1))",
        cs: 22,
        tasks: [["ask", "생각해 보기", "부품을 흰색으로 만든 까닭은? 전체 색을 곱해도 검은 눈은 왜 그대로일까요?"]] },
      { label: "직접 움직이기", sub: "2단계 · 조작", mong: "salang", head: "방향키 · WASD · 화면 버튼으로 움직입니다",
        code: "def move_character(dx, dy):\n    player.pos += vector(dx, dy, 0)\n    player.pos.x = max(-3, min(3, player.pos.x))\n    player.pos.y = max(-1.7, min(1.7, player.pos.y))\n\n# 버튼은 터치 화면에서도 쓸 수 있습니다.\nbutton(text=\"←\", bind=lambda b: move_character(-0.2, 0))\nbutton(text=\"→\", bind=lambda b: move_character(0.2, 0))",
        cs: 22,
        tasks: [["chg", "바꿔 보기", "<code>0.2</code>를 <code>0.5</code>로 바꾸면 움직임이 어떻게 달라지나요? <code>max</code>와 <code>min</code>은 무슨 일을 하나요?"]] },
      { label: "먹으면 내 색 바꾸기", sub: "3단계 · 조건", mong: "chorong", head: "아이템에 닿으면 조작한 캐릭터의 색만 바뀝니다",
        shot: "tut-forge", cap: "캐릭터 튜토리얼",
        chips: [["blue", "조건", "캐릭터와 아이템 사이의 거리로 ‘닿았다’를 판단"], ["green", "관찰", "옆 캐릭터와 검은 눈은 그대로"]] }
    ],
    note: "팀 수업에서는 몸통 · 표정 · 움직임 · 소리를 나누어 맡게 합니다. 한 번에 한 가지 값만 바꾸는 원칙을 다시 말합니다." },

  { type: "shotlist", part: 4, chip: ["gori", "대장간"], title: "대장간 · 슬라이더를 밀면 모양과 코드가 함께 바뀝니다",
    shot: "forge", cap: "대장간 작업대",
    btn: ["▶ 대장간 열기", "/forge"],
    list: [
      ["1", "blue", "<b>시작 모양 고르기</b> · 캐릭터 4종(분홍 · 만두 · 손전등 · 공구상자), 프로젝트 에셋 6종, 기본 모양 5종, 종."],
      ["2", "blue", "<b>내 취향대로 다듬기</b> · 너비 · 높이 · 두께, 얼굴과 팔다리, 색을 조절합니다. 되돌리기도 됩니다."],
      ["3", "purple", "<b>이름 붙여 보관함에 등록</b> · 초안과 보관함은 이 브라우저에 저장됩니다."],
      ["4", "orange", "<b>완성 모듈 코드 복사</b> · 내 프로젝트에 붙여 넣거나 .py 파일로 내려받습니다."]
    ],
    note: "5분 동안 각자 캐릭터 하나를 다듬어 보관함에 등록하게 합니다. 슬라이더 값이 오른쪽 아래 코드(body_width = 1.72)로 보이는 것을 짚습니다." },

  { type: "code", part: 4, chip: ["ttukttak", "가져다 쓰기"], title: "만든 캐릭터는 평범한 VPython 오브젝트입니다",
    code: "# 복사한 코드 아래의 my_module이 만들어진 모듈입니다.\nobj = my_module.object\n\nobj.pos.x += 0.1                  # 조금 옮기기\nobj.pos = vector(2, 0, 0)         # 자리 정하기\nobj.color = vector(0.5, 1, 0.7)   # 전체 색 바꾸기\nobj.opacity = 0.6                 # 반투명하게",
    cs: 28,
    cards: [
      { tone: "blue", head: "위치 · 색 · 투명도", body: "<code>pos</code>, <code>color</code>, <code>opacity</code>를 그대로 씁니다. 전체 색은 부품 색에 곱해져, 흰 부품은 바뀌고 검은 눈은 남습니다." },
      { tone: "green", head: "여러 개 만들기", body: "생성 함수의 <code>pos</code>와 <code>scale</code>을 바꿔 여러 번 부릅니다. 함수 이름은 복사한 코드의 실제 이름을 쓰세요." },
      { tone: "purple", head: "포크와 출처", body: "‘모두의 모듈’에서 포크해 고치고 다시 공개할 수 있습니다. 원본 제목과 제작자는 기록에 남습니다." }
    ],
    note: "공개 등록은 로그인이 필요합니다. 공개 이름과 설명에 개인정보를 적지 않도록 지도합니다." },

  { type: "cards", part: 4, chip: ["dugeun", "미니 프로젝트"], title: "15분 · 움직이고 소리 나는 내 캐릭터",
    cols: 4,
    cards: [
      { mong: "gori", tone: "blue", head: "① 붙여 넣기", body: "대장간에서 복사한 캐릭터 코드를 <b>만들기</b>에 붙여 넣고 실행합니다." },
      { mong: "salang", tone: "green", head: "② 움직이기", body: "<code>for</code>와 <code>rate()</code>로 <code>obj.pos</code>를 조금씩 바꿉니다. 3부의 ‘움직임’ 코드를 가져옵니다." },
      { mong: "drum", tone: "orange", head: "③ 소리 넣기", body: "움직임 사이에 <code>음표(\"도\")</code>를 넣거나, 버튼을 눌렀을 때 소리가 나게 합니다." },
      { mong: "doran", tone: "purple", head: "④ 공유하기", body: "<b>공유</b>를 눌러 링크를 만들고, <b>QR 보기</b>로 옆 사람에게 보여 줍니다." }
    ],
    band: ["blue", "다 만든 분은 옆 사람의 QR을 열어 코드를 읽고, 바꿔 보고 싶은 값 한 가지를 말해 주세요."],
    btn: ["▶ 만들기 열기", "/sandbox"],
    note: "완성보다 ‘공유 링크를 한 번 만들어 보는 것’이 목표입니다. 두세 분의 작품을 프로젝터로 함께 봅니다." },

  // ───────── 5부 ─────────
  { type: "section", part: 5, mong: "ttukttak", title: "수업에 적용하기", sub: "코스, 팀 프로젝트, 공유와 평가", time: "20분" },

  { type: "shotlist", part: 5, chip: ["ttukttak", "트레이닝"], title: "차시가 준비되어 있습니다",
    shot: "missions", cap: "트레이닝",
    btn: ["▶ 트레이닝 열기", "/missions"],
    list: [
      ["8", "blue", "<b>처음 만드는 빛과 소리 · 8차시</b><br>한 차시는 45~50분 수업 한 번. 예상하고, 실행하고, 한 가지씩 바꾸며 나만의 알림 작품을 만듭니다."],
      ["6", "purple", "<b>배운 것을 내 힘으로 · 6단계</b><br>변수 → 반복 → 조건 → 리스트 → 빛과 소리 결합 → 내 작품. 도움을 조금씩 줄여 갑니다."],
      ["4", "green", "<b>작품 저장과 공유 · 4차시</b><br>작품을 보관하고, 이전 시도로 돌아가고, 친구와 공유합니다. GitHub 연결은 나중에 해도 됩니다."]
    ],
    note: "핵심 연습의 각 단계에는 ‘점수를 59, 60으로 바꿔 실행해 보세요’ 같은 되돌아보기 질문이 있습니다. 교사용 이론 교재 7권은 링크 모음에 있습니다." },

  { type: "cards", part: 5, chip: ["mongsil", "학급 운영"], title: "초대 코드 하나로 학급과 팀을 엽니다",
    cols: 3,
    cards: [
      { mong: "mongsil", tone: "blue", head: "교사 대시보드", body: "로그인 뒤 <b>새 학급 만들기</b> → 초대 코드를 학생에게 알려 줍니다. 학생별 완료 미션과 점수, 학급의 팀 프로젝트를 봅니다." },
      { mong: "gori", tone: "purple", head: "팀 프로젝트", body: "만들기에서 프로젝트를 만들고 초대 코드를 공유합니다. 움직임 · 충돌 · 소리처럼 맡을 부분을 나눕니다." },
      { mong: "arong", tone: "green", head: "저장 이력과 기록", body: "<b>코드 저장</b>과 <b>기록 남기기</b>(시도 · 막힌 점 · 다음 할 일). 저장 이력에서 이전 버전을 복원하고, 충돌이 나면 두 버전을 비교합니다." }
    ],
    band: ["orange", "교사 권한은 관리자가 계정에 부여합니다. VPyLab 안의 협업에 GitHub 연결은 필수가 아닙니다."],
    btn: ["▶ 대시보드 열기", "/dashboard"],
    note: "저장 이력과 기록은 과정 중심 평가의 근거로 쓸 수 있습니다. 대시보드는 로그인이 필요하므로 미리 로그인해 둔 창으로 보여 줍니다." },

  { type: "cards", part: 5, chip: ["salang", "공유와 발표"], title: "작품을 모으고 함께 보는 다섯 가지 방법",
    cols: 5,
    cards: [
      { tone: "blue", head: "공유 링크", body: "<b>공유</b> 버튼 한 번으로 짧은 주소가 만들어집니다." },
      { tone: "purple", head: "QR", body: "프로젝터에 띄우면 휴대폰 카메라로 바로 엽니다." },
      { tone: "green", head: "갤러리", body: "공개한 작품을 모아 보고, 코드를 열어 이어 만듭니다." },
      { tone: "orange", head: "임베드", body: "학급 누리집이나 발표 자료에 iframe으로 넣습니다. 이 슬라이드가 그 예입니다." },
      { tone: "pink", head: "전체 화면 · 앱 설치", body: "3D만 크게 띄우거나, 크롬 · 엣지에서 앱으로 설치합니다." }
    ],
    band: ["blue", "임베드는 공개한 작품과 공유 링크만 됩니다. 비공개 초안은 다른 사이트에 나오지 않습니다."],
    note: "갤러리 상세나 공유 대화상자의 ‘임베드 코드 복사’를 보여 줍니다. 구글 클래스룸 · 카카오톡에 링크를 붙이면 미리보기 카드가 뜹니다." },

  { type: "table", part: 5, chip: ["dugeun", "수업 설계 예시"], title: "7차시로 묶으면 이렇게 됩니다",
    head: ["차시", "활동", "VPyLab 메뉴 · 남는 것"],
    rows: [
      ["1", "3D와 소리 맛보기", "튜토리얼 4종 · 바꿔 본 값과 까닭 한 줄"],
      ["2~3", "변수 · 반복 · 조건 · 리스트", "트레이닝 핵심 연습 · 단계별 되돌아보기 답"],
      ["4", "내 캐릭터 만들기", "대장간, 캐릭터 튜토리얼 · 보관함의 내 모듈"],
      ["5~6", "팀 프로젝트", "만들기, 팀 프로젝트 · 저장 이력과 작업 기록"],
      ["7", "발표와 감상", "공유 링크 · QR · 갤러리 · 서로의 코드 읽고 한 가지 제안"]
    ],
    foot: "연수용으로 만든 예시입니다. 학교와 학년에 맞게 차시 수를 조정하세요. 기초가 처음인 학급은 2~3차시 자리에 ‘처음 만드는 빛과 소리’ 8차시를 씁니다.",
    note: "옆 선생님과 2분 동안 ‘우리 학교라면 어느 교과, 몇 차시로?’를 이야기하게 합니다." },

  { type: "cards", part: 5, chip: ["chorong", "안심하고 쓰기"], title: "학생 정보와 운영, 이것만 기억하세요",
    cols: 3,
    cards: [
      { mong: "chorong", tone: "green", head: "로그인 없이 실행", body: "실습은 계정 없이 됩니다. 저장 · 팀 프로젝트 · 공개 등록에만 로그인이 필요합니다." },
      { mong: "doran", tone: "blue", head: "코드를 AI에 보내지 않음", body: "자동 완성과 단어 안내는 정해진 규칙으로 동작합니다. 기본 학습에 AI 호출이 없습니다." },
      { mong: "ttukttak", tone: "purple", head: "오픈소스 · 직접 배포", body: "AGPL v3로 공개되어 있습니다. 학교가 Vercel · Render · Supabase의 무료 한도로 직접 운영할 수도 있습니다." }
    ],
    band: ["orange", "브라우저에만 저장되는 것(대장간 초안, 내 메인 설정)은 다른 기기와 동기화되지 않습니다. 중요한 코드는 프로젝트에 저장하도록 안내하세요."],
    note: "공개 작품의 코드는 누구나 열어 볼 수 있습니다. 공개 이름과 설명에 개인정보를 쓰지 않도록 첫 시간에 알려 줍니다." },

  { type: "links", chip: ["dugeun", "링크 모음"], title: "연수 뒤에 다시 찾아볼 곳",
    groups: [
      { mong: "chorong", head: "학생과 시작하기", links: [
        ["VPyLab 홈", "vpylab.vercel.app", "/"], ["튜토리얼", "/tutorials", "/tutorials"], ["트레이닝", "/missions", "/missions"], ["만들기", "/sandbox", "/sandbox"] ] },
      { mong: "gori", head: "만들고 나누기", links: [
        ["대장간", "/forge", "/forge"], ["캐릭터 튜토리얼", "/tutorials/forge-character", "/tutorials/forge-character"], ["갤러리", "/gallery", "/gallery"], ["교사 대시보드", "/dashboard · 로그인 필요", "/dashboard"] ] },
      { mong: "mongsil", head: "교사용 자료", links: [
        ["사용 안내", "/guide", "/guide"], ["문서", "/docs", "/docs"], ["교사용 이론 교재 7권", "greatsong.github.io/vpylab-textbook", "https://greatsong.github.io/vpylab-textbook/"], ["소스 코드", "github.com/greatsong/vpylab-classroom", "https://github.com/greatsong/vpylab-classroom"] ] }
    ],
    note: "이 슬라이드 주소를 연수 자료로 공유하면 링크가 그대로 동작합니다." },

  { type: "end", title: "코드가 눈앞의 작품으로", sub: "질문을 받겠습니다. 감사합니다!",
    note: "남은 시간에 질문을 받습니다. 연수 뒤 문의처를 말로 안내합니다." }
  ], parts: P };
})();
