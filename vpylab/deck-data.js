// VPyLab 교사 연수 · 슬라이드 내용과 진행 메모 (30장)
// 실시간 화면은 VPyLab의 /embed/<id> 만 iframe으로 넣을 수 있다(그 밖의 페이지는 X-Frame-Options: DENY).
(function () {
  var SITE = "https://vpylab.vercel.app";
  var EMBED = {
    rainbow: "bbbbbbbb-2222-2222-2222-222222222222",  // 무지개 구슬
    doremi: "d3a14e97-016c-489c-81ab-cfd58ff4591c"    // 도레미파솔라시도
  };
  var P = ["", "1부 · 왜 만들었나", "2부 · 주요 기능", "3부 · 튜토리얼 실습", "4부 · 수업과 내일"];

  window.DECK = { site: SITE, title: "VPyLab 교사 연수", parts: P, slides: [

  // ───────── 오프닝 ─────────
  { type: "cover",
    note: "인사와 함께 오늘의 목표를 말합니다. 왜 만들었는지 듣고, 무엇이 되는지 보고, 직접 실행해 본 뒤 수업으로 가져가는 것이 목표입니다." },

  { type: "table", chip: ["dugeun", "오늘의 흐름"], title: "듣고, 보고, 직접 해 보고, 수업으로 가져갑니다",
    head: ["순서", "무엇을", "어떻게"],
    rows: [
      ["1부 · 30분", "왜 VPyLab을 만들었나", "텍스트 파이썬 수업의 한계, VPython의 가능성과 아쉬움"],
      ["2부 · 50분", "주요 기능", "빛과 소리로 코딩 · 음악과 물리 시뮬레이션 · 캐릭터 · GitHub 팀 프로젝트"],
      ["쉬는 시간 · 10분", "", "", "brk"],
      ["3부 · 45분", "튜토리얼 실습", "실행하고, 한 가지만 바꾸고, 설명하기"],
      ["4부 · 15분", "수업과 내일", "차시 구성 예시, 오픈소스로 함께 만들기"]
    ],
    note: "시간은 권장값입니다. 실습이 길어지면 4부의 수업 구성 예시는 자료로 대신합니다." },

  // ───────── 1부 · 왜 만들었나 ─────────
  { type: "section", part: 1, mong: "dugeun-band", title: "왜 VPyLab을 만들었나", sub: "교실에서 느낀 아쉬움에서 시작했습니다", time: "30분" },

  { type: "visual", part: 1, chip: ["doran", "출발점"], title: "파이썬 수업이 수학 시간처럼 느껴졌습니다",
    ratio: "half",
    lead: "화면에는 글자와 숫자만 나옵니다.<br>학생이 바꿔 볼 수 있는 것도 <b>숫자뿐</b>입니다.",
    list: [
      ["1", "orange", "결과가 <b>글자와 숫자</b>로만 나옵니다."],
      ["2", "orange", "값을 바꿔도 달라지는 것은 <b>또 다른 숫자</b>입니다."],
      ["3", "orange", "상상한 것을 만들어 볼 <b>자리가 좁습니다.</b>"]
    ],
    termTitle: "텍스트로 배우는 파이썬",
    term: ">>> a = 3\n>>> b = 4\n>>> print(a + b)\n7\n>>> for i in range(1, 6):\n...     print(i, i * i)\n...\n1 1\n2 4\n3 9\n4 16\n5 25",
    note: "‘코딩 수업인데 수학 문제 풀이 같다’는 학생 반응을 소개합니다. 선생님들의 경험도 한두 분께 듣습니다." },

  { type: "mosaic", part: 1, chip: ["salang", "가능성"], title: "VPython을 만났습니다. 코드가 3D 세상이 됩니다",
    cols: 3,
    items: [["ex-solar", "태양계", "반복문과 삼각함수"], ["ex-fireworks", "불꽃놀이", "리스트와 난수"], ["ex-tree", "크리스마스트리", "도형 쌓기"]],
    band: ["blue", "눈앞에 3D가 보이면 학생은 ‘이걸 이렇게 바꾸면?’ 하고 묻기 시작합니다. 상상력과 창의적 문제 해결을 기르기에 좋은 도구였습니다."],
    note: "VPython은 공 · 상자 같은 3D 물체를 파이썬 몇 줄로 만드는 도구입니다. 위 화면은 모두 VPyLab에서 실행한 예제입니다." },

  { type: "cards", part: 1, chip: ["chorong", "아쉬움"], title: "그런데 교실에 그대로 쓰기에는 아쉬웠습니다",
    cols: 3,
    cards: [
      { mong: "mongsil", tone: "orange", head: "대학 물리 교육용으로 출발", body: "원래 대학 물리 수업을 위해 만들어진 도구입니다. 중 · 고등학생이 처음 만나기에는 화면과 예제가 투박했습니다." },
      { mong: "drum", tone: "orange", head: "소리가 없었습니다", body: "보이는 것은 만들 수 있지만 들리는 것은 만들 수 없었습니다. 음악과 리듬으로 이어 갈 길이 막혀 있었습니다." },
      { mong: "gori", tone: "orange", head: "함께 만든 과정이 남지 않았습니다", body: "팀 프로젝트에서 누가 무엇을 시도하고 어디서 막혔는지, 결과물만으로는 알기 어려웠습니다." }
    ],
    note: "VPython 자체를 낮추어 말하는 자리가 아닙니다. 좋은 도구였기에 교실에 맞게 넓히고 싶었다는 흐름으로 말합니다." },

  { type: "cards", part: 1, chip: ["dugeun", "그래서"], title: "그래서 VPyLab을 만들었습니다",
    cols: 4,
    cards: [
      { mong: "chorong", tone: "blue", head: "빛과 소리로 코딩", body: "빛나는 물체와 조명, 음표와 배경음을 파이썬 한 줄로 만듭니다. 음악 수업과 물리 시뮬레이션으로 이어집니다." },
      { mong: "mandu", tone: "pink", head: "예쁜 화면과 캐릭터", body: "학생 눈높이의 화면, 그리고 학생들이 좋아하는 캐릭터 만들기를 크게 늘렸습니다." },
      { mong: "gori", tone: "purple", head: "GitHub 팀 프로젝트", body: "함께 만든 과정이 기록으로 남고, 그 기록을 AI가 읽어 올 수 있습니다." },
      { mong: "salang", tone: "green", head: "모두의 오픈소스", body: "누구나 쓰고 고칠 수 있게 공개했습니다. 세계 여러 교실의 컴퓨팅 사고력 교육에 쓰이기를 바랍니다." }
    ],
    note: "이 네 가지가 2부의 차례입니다. 설치 없이 브라우저에서 바로 실행된다는 점도 함께 말합니다." },

  { type: "table", part: 1, chip: ["arong", "한눈에"], title: "무엇이 달라졌는지 한 장으로 보면",
    hi: true,
    head: ["", "텍스트 파이썬", "VPython", "VPyLab"],
    rows: [
      ["결과물", "글자와 숫자", "3D 장면", "3D 장면 + 빛 + 소리"],
      ["바꿔 볼 것", "숫자", "모양 · 색 · 움직임", "모양 · 색 · 움직임 · 빛 · 음"],
      ["화면", "검은 글자 창", "대학 물리 교육용", "학생 눈높이의 화면과 캐릭터"],
      ["소리", "없음", "없음", "음표 · 효과음 · 배경음"],
      ["팀 프로젝트", "각자 파일로", "각자 파일로", "초대 코드 · 저장 이력 · GitHub 연동"],
      ["교과 연결", "수학", "수학 · 과학(물리)", "수학 · 과학(물리 시뮬레이션) · 음악 · 미술"],
      ["첫걸음", "영어 명령", "영어 명령", "한글 명령 · 단어 안내 · 로그인 없이 실행"]
    ],
    note: "표는 일반적인 수업 장면을 기준으로 단순하게 정리한 것입니다. 세부 차이는 2부에서 실제 화면으로 봅니다." },

  // ───────── 2부 · 주요 기능 ─────────
  { type: "section", part: 2, mong: "chorong", title: "주요 기능", sub: "빛과 소리로 코딩, 음악과 물리, 캐릭터, 함께 만들기", time: "50분" },

  { type: "mosaic", part: 2, chip: ["chorong", "예제 57개"], title: "파이썬 코드가 이런 화면이 됩니다",
    cols: 3,
    btn: ["▶ 예제 열기", "/examples"],
    items: [
      ["ex-aurora-veil", "오로라 베일", "흐르는 빛의 커튼"], ["ex-disco", "갤럭시 디스코", "우주 한복판 댄스 클럽"], ["ex-symphony", "오로라 심포니", "화음에 맞춰 춤추는 빛"],
      ["ex-piano", "무지개 피아노", "클릭으로 연주"], ["ex-fireworks", "불꽃놀이", "터지는 순간의 난수"], ["ex-solar", "태양계", "궤도를 그리는 행성"]
    ],
    note: "모두 VPyLab에 들어 있는 예제를 실행해 찍은 화면입니다. 그림을 누르면 크게 보입니다. 한두 개는 실제로 열어 소리와 함께 보여 줍니다." },

  { type: "live", part: 2, chip: ["mandu", "지금 실행 중"], title: "설치 없이, 브라우저에서 파이썬이 바로 돕니다",
    embed: EMBED.rainbow, label: "무지개 구슬", poster: "em-rainbow",
    code: 'from vpython import *\nimport math\n\nballs = []\nfor i in range(7):\n    b = sphere(pos=vector(-3+i, 0, 0), radius=0.4,\n               color=무지개[i], make_trail=True)\n    balls.append(b)\n\nt = 0\nwhile True:\n    rate(30)\n    t += 1\n    for i, b in enumerate(balls):\n        b.pos = vector(-3+i, math.sin(t*0.08+i*0.4)*1.5, 0)',
    cs: 19,
    tasks: [["ask", "함께 생각하기", "<code>i*0.4</code>를 0으로 바꾸면 물결은 어떻게 될까요?"]],
    btn: ["VPyLab에서 열어 고치기", "/gallery/" + EMBED.rainbow],
    note: "왼쪽은 캡처가 아니라 실행 중인 파이썬입니다. 마우스로 돌려 보입니다. 리스트 · 반복 · 사인 함수가 한 화면에 있습니다." },

  { type: "live", part: 2, chip: ["drum", "빛과 소리"], title: "빛과 소리로 코딩합니다. 한 줄이 한 음입니다",
    embed: EMBED.doremi, label: "도레미파솔라시도", poster: "em-doremi",
    code: 'from vpython import *\n\nscene_background(색상[\'검정\'])\n\n곡 = ["도4", "레4", "미4", "파4", "솔4", "라4", "시4", "도5"]\n\nfor i in range(len(곡)):\n    높이 = 0.3 + i * 0.25\n    box(pos=vector(i - 3.5, 높이 / 2, 0),\n        size=vector(0.6, 높이, 0.6),\n        color=무지개[i % 7])\n    음표(곡[i], 0.45)',
    cs: 19,
    tasks: [["tip", "소리 듣기", "화면 위의 <b>소리 켜기</b>를 누른 뒤 <b>실행</b>을 다시 누르세요."], ["chg", "바꿔 보기", "<code>곡</code>의 순서를 바꾸면 소리와 막대는 각각 어떻게 될까요?"]],
    btn: ["VPyLab에서 열어 고치기", "/gallery/" + EMBED.doremi],
    note: "브라우저 정책 때문에 소리는 버튼을 누른 뒤에만 납니다. 음악 교과와의 연결, 리스트와 반복의 쓰임을 함께 이야기합니다." },

  { type: "visual", part: 2, chip: ["chorong", "빛 + 소리 + 움직임"], title: "빛과 소리와 움직임이 한 작품에 모입니다",
    ratio: "wide", img: "sb-disco", cap: "만들기 · 갤럭시 디스코 실행 화면",
    btn: ["▶ 이 예제 열기", "/sandbox?example=lightshow-galaxy-disco"],
    list: [
      ["빛", "blue", "<code>emissive=True</code>로 스스로 빛나는 물체, <code>local_light</code>로 조명을 만듭니다."],
      ["음", "purple", "<code>음표(\"도\")</code> 한 줄이 한 음입니다. 효과음과 배경음도 있습니다."],
      ["3D", "green", "왼쪽에 코드, 오른쪽에 결과. 끌어서 돌려 보고 전체 화면으로 띄웁니다."],
      ["▶", "orange", "<b>정지</b>를 누르면 움직임과 소리가 함께 멈춥니다."]
    ],
    note: "실제로 열어 실행하고 소리를 들려줍니다. 소리 명령은 VPyLab이 더한 기능이며 문서에 ‘VPyLab 확장’으로 표시되어 있습니다." },

  { type: "mosaic", part: 2, chip: ["drum", "음악과 만나다"], title: "음악 시간과 이어집니다. 음표가 곧 데이터입니다",
    cols: 3,
    btn: ["▶ 음악 예제 열기", "/examples"],
    items: [["mu-tower", "주파수 탑", "음높이의 비밀"], ["mu-planets", "행성 합주단", "행성마다 자기 음을 연주"], ["mu-sine", "사인파 멜로디", "슬라이더로 그리고 듣기"]],
    band: ["purple", "멜로디는 <b>리스트</b>, 박자는 <b>반복</b>, 화음은 <b>함수</b>가 됩니다. 동요 모음, 무지개 피아노, 도플러 효과까지 음악 예제 13개가 들어 있습니다."],
    note: "음악을 좋아하는 학생에게는 코딩이, 코딩을 좋아하는 학생에게는 음악이 가까워집니다. 주파수 탑으로 음높이와 주파수(Hz)의 관계를 보여 주고, 동요 모음을 한 곡 들려줍니다." },

  { type: "mosaic", part: 2, chip: ["ttukttak", "물리 시뮬레이션"], title: "물리 법칙을 코드로 쓰면 눈앞에서 움직입니다",
    cols: 3,
    btn: ["▶ 예제 열기", "/examples"],
    items: [["ph-pendulum", "진자 운동", "줄 길이와 주기"], ["ph-wave", "파동 시뮬레이션", "퍼져 나가는 물결"], ["ph-cannon", "포물선 대포", "각도와 속도 바꾸기"]],
    band: ["green", "<code>속도 = 속도 + 중력 * dt</code>, <code>위치 = 위치 + 속도 * dt</code>. 이 두 줄이 낙하와 포물선, 진자가 됩니다. 값을 바꿔 가설을 세우고 바로 확인합니다."],
    note: "물리 시뮬레이션은 VPython이 원래 잘하던 일이고 VPyLab도 그대로 이어받았습니다. 중력을 달의 값으로 바꾸거나 반발 계수를 바꾸는 식으로 과학 탐구와 잇습니다. 행성 충돌, 바운스 볼, 도플러 효과 예제도 있습니다." },

  { type: "mosaic", part: 2, chip: ["mandu", "캐릭터"], title: "학생들은 캐릭터 만들기를 좋아합니다",
    cols: 3, light: true,
    btn: ["▶ 홈에서 만나기", "/"],
    items: [["hero-mandu", "만두", "만두 빚기"], ["hero-toolbox", "공구상자", "뚜껑 달그락"], ["hero-friends", "프렌즈", "넷이 서로 다른 박자로"]],
    band: ["pink", "첫 화면부터 코드 친구들이 맞이합니다. 구 · 타원체 · 상자 같은 기본 도형만으로 만들었고, ‘이 친구, 내 코드로 만들기’를 누르면 그 코드가 열립니다."],
    note: "홈에서 친구를 바꿔 가며 움직임을 재생해 보입니다. ‘이것도 파이썬 도형 몇 개로 만든 것’이라는 점이 학생의 동기가 됩니다." },

  { type: "visual", part: 2, chip: ["gori", "대장간"], title: "대장간 · 슬라이더를 밀면 모양과 코드가 함께 바뀝니다",
    stack: true, img: "forge", cap: "대장간 작업대",
    btn: ["▶ 대장간 열기", "/forge"],
    list: [
      ["1", "blue", "<b>시작 모양 고르기</b><br>캐릭터 4종, 프로젝트 에셋 6종, 기본 모양 5종, 종"],
      ["2", "blue", "<b>내 취향대로 다듬기</b><br>크기 · 얼굴 · 팔다리 · 색"],
      ["3", "purple", "<b>보관함에 등록</b><br>이름을 붙여 내 부품으로"],
      ["4", "orange", "<b>코드 복사</b><br>내 프로젝트에 붙여 넣기"]
    ],
    note: "슬라이더 값이 오른쪽 아래에 body_width = 1.72 같은 코드로 보이는 것을 짚습니다. 조작이 곧 코드라는 연결이 핵심입니다." },

  { type: "flow", part: 2, chip: ["gori", "팀 프로젝트"], title: "팀 프로젝트 · 초대 코드 하나로 함께 만듭니다",
    steps: [
      ["mongsil", "프로젝트 만들기", "만들기에서 팀 프로젝트를 만들면 초대 코드가 나옵니다"],
      ["doran", "초대 코드로 합류", "팀원이 코드를 입력해 들어오고, 맡을 부분을 나눕니다"],
      ["arong", "저장하고 기록하기", "저장할 때마다 누가 언제 바꿨는지 이력이 쌓입니다"],
      ["salang", "발행하고 나누기", "갤러리에 올리고 링크와 QR로 공유합니다"]
    ],
    bands: [
      ["purple", "GitHub에 로그인해 프로젝트를 만들면 저장소가 함께 만들어지고, 저장이 GitHub 커밋으로도 남습니다."],
      ["blue", "GitHub 연결은 선택입니다. 연결하지 않아도 VPyLab 안에서 초대 코드 · 저장 이력 · 이전 버전 복원을 쓸 수 있습니다."]
    ],
    note: "움직임 · 충돌 · 소리처럼 역할을 나누게 합니다. 팀원이 저장하면 다른 팀원에게 알림이 가고, 충돌이 나면 두 버전을 비교해 고릅니다." },

  { type: "cards", part: 2, chip: ["arong", "과정의 기록"], title: "결과물뿐 아니라 만든 과정이 남습니다",
    cols: 4,
    cards: [
      { mong: "arong", tone: "blue", head: "저장 이력", body: "누가, 언제, 무엇을 바꿨는지 저장할 때마다 남습니다. 이전 버전으로 되돌릴 수 있습니다." },
      { mong: "doran", tone: "green", head: "기록 남기기", body: "시도한 것, 막힌 점, 다음에 할 일을 학생이 직접 적습니다." },
      { mong: "gori", tone: "purple", head: "GitHub에 쌓이는 기록", body: "저장이 커밋으로 남아 팀의 작업 과정이 저장소 한곳에 모입니다." },
      { mong: "chorong", tone: "orange", head: "AI가 읽어 오는 과정", body: "저장소에 모인 과정 기록을 AI가 읽어 올 수 있어, 되돌아보기와 피드백의 재료가 됩니다." }
    ],
    band: ["blue", "교사는 저장 이력의 작성자 분포로 팀원 각자의 기여를 확인합니다. 과정 중심 평가의 근거가 됩니다."],
    note: "AI는 평가를 대신하지 않습니다. 과정 기록을 읽어 정리하는 데 쓰고, 판단은 교사가 합니다. 기본 학습(자동 완성, 단어 안내)은 AI 없이 동작합니다." },

  { type: "cards", part: 2, chip: ["doran", "처음 배우는 학생을 위해"], title: "영어와 문법의 문턱을 낮췄습니다",
    cols: 3,
    cards: [
      { mong: "arong", tone: "blue", head: "한글 이름과 한글 명령", body: "<code>색상['하늘']</code>, <code>음표(\"도\")</code>, <code>무지개[i]</code>처럼 한글로 씁니다. 변수 이름도 <code>공</code>, <code>곡</code>처럼 한글이 됩니다." },
      { mong: "doran", tone: "purple", head: "코드 속 작은 영어 사전", body: "<code>radius</code>, <code>opacity</code> 같은 낯선 단어를 입력하면 그림 · 뜻 · 예시 카드가 잠깐 나타납니다." },
      { mong: "ttukttak", tone: "green", head: "AI 없는 자동 완성", body: "<code>sp</code> → <code>sphere</code>, <code>ball.</code> → 도형 속성. Ctrl+Space로 열고 Tab으로 넣습니다. 학생 코드를 외부로 보내지 않습니다." }
    ],
    band: ["orange", "영문판도 있습니다. 더 보기 → 언어 → English. 영어 실습은 같은 기능의 영문 명령을 씁니다."],
    note: "소리 명령과 한글 별칭은 VPyLab 확장입니다. 표준 VPython으로 옮길 때는 문서의 ‘VPython 기본 기능 / VPyLab 확장’ 구분을 확인하게 합니다." },

  // ───────── 3부 · 실습 ─────────
  { type: "section", part: 3, mong: "mandu", title: "튜토리얼 실습", sub: "실행하고, 한 가지만 바꾸고, 설명합니다", time: "45분" },

  { type: "url", part: 3, chip: ["chorong", "준비"], title: "지금 함께 접속해 주세요",
    url: "vpylab.vercel.app", sub: "크롬이나 엣지에서 엽니다. 설치도 로그인도 필요 없습니다.",
    cards: [
      { mong: "ttukttak", head: "설치 없음", body: "파이썬이 브라우저 안에서 실행됩니다. 처음 한 번만 엔진을 받아 오느라 10초쯤 걸립니다." },
      { mong: "doran", head: "로그인 없음", body: "튜토리얼 · 트레이닝 · 만들기 실행은 로그인 없이 됩니다. 저장과 팀 프로젝트에만 필요합니다." },
      { mong: "arong", head: "소리 켜기", body: "기기 음량을 확인하고, 실습 화면의 <b>도구 → 소리 켜기</b>를 눌러 주세요." }
    ],
    btn: ["▶ 튜토리얼 열기", "/tutorials"],
    note: "모두 접속했는지 확인합니다. 튜토리얼 메뉴에서 ‘체험하기 →’를 누르면 코드가 들어 있는 만들기 화면이 열립니다." },

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
    tip: "소리가 안 나면 실습 화면의 <b>도구 → 소리 켜기</b>와 기기 음량을 확인하세요.",
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
    note: "반복문은 ‘조금씩 60번’입니다. 애니메이션이 반복의 결과라는 점을 짚고, 좌표와 벡터로 잇습니다." },

  { type: "practice", part: 3, no: 4, mong: "gori", title: "버튼으로 반응 만들기", time: "8분",
    desc: "버튼을 누르면 공의 색이 바뀝니다.",
    code: "from vpython import *\n공 = sphere(color=색상['하늘'])\ndef 바꾸기(b):\n    공.color = 색상['노랑']\nbutton(text=\"색 바꾸기\", bind=바꾸기)",
    change: "함수 안의 <code>색상['노랑']</code>을 <code>색상['보라']</code>로 바꾸고, 다시 실행한 뒤 버튼을 누르세요.",
    reflect: "실행만 했을 때와 버튼을 눌렀을 때의 차이는 무엇인가요?",
    tip: "함수 안에 <code>음표(\"미\")</code> 한 줄을 넣으면 버튼이 소리도 냅니다.",
    link: "/tutorials/interaction",
    note: "함수는 ‘나중에 실행할 일을 미리 적어 둔 것’입니다. 이벤트 개념을 여기서 처음 만납니다." },

  { type: "cards", part: 3, chip: ["dugeun", "미니 프로젝트"], title: "15분 · 움직이고 소리 나는 내 캐릭터",
    cols: 4,
    cards: [
      { mong: "gori", tone: "blue", head: "① 캐릭터 가져오기", body: "<b>대장간</b>에서 캐릭터를 다듬고 코드를 복사해 <b>만들기</b>에 붙여 넣습니다." },
      { mong: "salang", tone: "green", head: "② 움직이기", body: "<code>for</code>와 <code>rate()</code>로 <code>obj.pos</code>를 조금씩 바꿉니다. 실습 3의 코드를 가져옵니다." },
      { mong: "drum", tone: "orange", head: "③ 소리 넣기", body: "움직임 사이에 <code>음표(\"도\")</code>를 넣거나, 버튼을 누르면 소리가 나게 합니다." },
      { mong: "doran", tone: "purple", head: "④ 공유하기", body: "<b>공유</b>를 눌러 링크를 만들고, <b>QR 보기</b>로 옆 사람에게 보여 줍니다." }
    ],
    band: ["blue", "다 만든 분은 옆 사람의 QR을 열어 코드를 읽고, 바꿔 보고 싶은 값 한 가지를 말해 주세요."],
    btn: ["▶ 대장간 열기", "/forge"],
    note: "완성보다 공유 링크를 한 번 만들어 보는 것이 목표입니다. 두세 분의 작품을 프로젝터로 함께 봅니다." },

  // ───────── 4부 · 수업과 내일 ─────────
  { type: "table", part: 4, chip: ["ttukttak", "수업 설계 예시"], title: "7차시로 묶으면 이렇게 됩니다",
    head: ["차시", "활동", "VPyLab 메뉴 · 남는 것"],
    rows: [
      ["1", "3D와 소리 맛보기", "튜토리얼 4종 · 바꿔 본 값과 까닭 한 줄"],
      ["2~3", "변수 · 반복 · 조건 · 리스트", "트레이닝 핵심 연습 6단계 · 단계별 되돌아보기 답"],
      ["4", "내 캐릭터 만들기", "대장간, 캐릭터 튜토리얼 · 보관함의 내 모듈"],
      ["5~6", "팀 프로젝트", "만들기, 팀 프로젝트 · 저장 이력과 작업 기록"],
      ["7", "발표와 감상", "공유 링크 · QR · 갤러리 · 서로의 코드 읽고 한 가지 제안"]
    ],
    foot: "연수용으로 만든 예시입니다. 코딩이 처음인 학급은 2~3차시 자리에 트레이닝의 ‘처음 만드는 빛과 소리’ 8차시를 씁니다.",
    note: "옆 선생님과 2분 동안 ‘우리 학교라면 어느 교과, 몇 차시로?’를 이야기하게 합니다." },

  { type: "cards", part: 4, chip: ["salang", "오픈소스"], title: "모두의 것으로 자라기를 바랍니다",
    cols: 4,
    cards: [
      { mong: "salang", tone: "green", head: "열린 소스", body: "AGPL v3로 공개했습니다. 누구나 쓰고, 고치고, 다시 나눌 수 있습니다." },
      { mong: "ttukttak", tone: "blue", head: "학교가 직접 운영", body: "Vercel · Render · Supabase의 무료 한도로 학교가 직접 배포할 수 있습니다." },
      { mong: "doran", tone: "purple", head: "한국어와 영어", body: "메뉴 · 안내 · 대장간과 기초 교재를 영어로도 제공합니다." },
      { mong: "mongsil", tone: "pink", head: "함께 만들기", body: "예제와 교재, 번역과 기능 제안까지. 선생님의 수업이 다음 버전이 됩니다." }
    ],
    band: ["green", "한 학교의 수업 도구에서 출발했지만, 세계 여러 교실의 컴퓨팅 사고력 교육에 쓰이는 오픈소스로 자라기를 기대합니다."],
    note: "연수에서 나온 불편과 아이디어를 모아 달라고 부탁합니다. 소스 코드는 github.com/greatsong/vpylab-classroom 에 있습니다." },

  { type: "end", title: "코드가 눈앞의 작품으로", sub: "질문을 받겠습니다. 감사합니다!",
    links: [["VPyLab", "/", "vpylab.vercel.app"], ["사용 안내", "/guide", "/guide"], ["교사용 교재 7권", "https://greatsong.github.io/vpylab-textbook/", "greatsong.github.io/vpylab-textbook"], ["소스 코드", "https://github.com/greatsong/vpylab-classroom", "github.com/greatsong/vpylab-classroom"]],
    note: "남은 시간에 질문을 받습니다." }
  ] };
})();
