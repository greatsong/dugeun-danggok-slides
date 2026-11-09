// 두근두근 당곡 5분 소개 · 슬라이드 동작
(function () {
  var MENUS = window.MENUS || {}, NOTES = window.NOTES || [];
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var WHO = { hr: "hr", pr: "pr", sc: "sc", st: "st" };

  // ---- 학교 차원(8장) 판 ----
  var NATIVE = {
    plan: '<div class="phead">2026 학교교육계획에서 시작해 2027 계획서로 돌아옵니다</div>' +
      '<div class="cycle"><span>2026 학교교육계획 행사</span><i>→</i><span>설계 · 기안</span><i>→</i><span>모집 · 운영</span><i>→</i><span>기록 · 결과 보고</span><i>→</i><span class="back">2027 계획서 원고</span></div>' +
      '<div class="big3">' +
      '<div class="bcard"><div class="ic" style="background:var(--purple-s)">📘</div><b>계획서 행사에서 바로 시작</b><p>프로그램 이름 · 운영 부서 · 대상 학년 · 계획 근거가 채워지고, 계획서 내용으로 설계 초안이 들어갑니다.</p></div>' +
      '<div class="bcard"><div class="ic" style="background:var(--green-s)">📊</div><b>운영 결과가 숫자로 남음</b><p>참여 확정 · 출석 확인 · 결과 보고 수치는 서버가 계산합니다. AI가 숫자를 만들지 않습니다.</p></div>' +
      '<div class="bcard"><div class="ic" style="background:var(--blue-s)">📝</div><b>부서별 2027 원고 초안</b><p>꼭지마다 목표 · 방침 · 추진 계획 · 운영 결과와 환류를 갖춘 원고를 부서가 고쳐 씁니다.</p></div></div>',
    loop: '<div class="phead">짧은 피드백이 다음 해 계획을 바꿉니다</div>' +
      '<div class="big3">' +
      '<div class="bcard" style="background:var(--green-s);border-color:#bfe3c9"><div class="ic" style="background:#fff">💬</div><b>학생 후기 한 줄 · 선생님 관찰 한 줄</b><p>Google 후기 설문의 운영 개선 의견과 활동 후 정리의 선생님 의견이면 충분합니다.</p></div>' +
      '<div class="bcard" style="background:var(--purple-s);border-color:#d6cbfb"><div class="ic" style="background:#fff">✨</div><b>AI가 개선안 초안, 선생님이 승인</b><p>유지할 점 · 바꿀 점 · 확인할 점으로 정리합니다. 승인한 개선안만 다음 단계로 갑니다.</p></div>' +
      '<div class="bcard" style="background:var(--blue-s);border-color:#c9d6fb"><div class="ic" style="background:#fff">🔁</div><b>내년 설계와 계획서에 반영</b><p>‘내년 설계로 가져오기’와 교육계획서 원고에 들어갑니다. 담당자가 바뀌어도 개선안이 남습니다.</p></div></div>',
    work: '<div class="phead">따로 하던 일을 이렇게 덜어 냅니다</div>' +
      '<table class="ba"><tr><th>누가</th><th>지금은</th><th></th><th>이제는</th></tr>' +
      '<tr><td>프로그램 담당</td><td class="old">계획서 · 안내문 · 기록을 따로 작성</td><td class="arr">→</td><td>설계 내용이 모집 · 기록 · 결과 보고로 이어짐</td></tr>' +
      '<tr><td>담임</td><td class="old">관심에 맞는 프로그램 찾기, 활동 선택과 분량 고민</td><td class="arr">→</td><td>상담하며 담고, 고르면 바이트까지 계산</td></tr>' +
      '<tr><td>생기부 담당</td><td class="old">반별 복사와 학번 · 이름 대조</td><td class="arr">→</td><td>명단 대조와 반별 파일 ZIP</td></tr>' +
      '<tr><td>학교</td><td class="old">좋은 프로그램도 해마다 처음부터</td><td class="arr">→</td><td>승인한 개선안이 내년 설계와 계획서로</td></tr></table>',
    safe: '<div class="phead">학교 계정, 학교 서버, 학급 기록은 교사 PC 안에서</div>' +
      '<div class="big3" style="grid-template-columns:repeat(2,1fr)">' +
      '<div class="bcard"><div class="ic" style="background:var(--blue-s)">🔐</div><b>danggok.hs.kr 학교 계정만 로그인</b><p>관리자가 교사 권한을 정합니다. 학생은 프로그램 앱에 로그인하지 않습니다.</p></div>' +
      '<div class="bcard"><div class="ic" style="background:var(--purple-s)">🏫</div><b>학교에 둔 맥미니 서버</b><p>운영 원본은 학교 계정의 비공개 Google 시트입니다.</p></div>' +
      '<div class="bcard"><div class="ic" style="background:var(--orange-s)">💻</div><b>학급 기록은 교사 PC 안에서만</b><p>여러 프로그램을 합친 학급 기록과 담임 최종 문장은 웹에 모으지 않습니다.</p></div>' +
      '<div class="bcard"><div class="ic" style="background:var(--green-s)">🛡️</div><b>AI는 이름 · 학번을 가린 문장만</b><p>분량 조정 서버는 문장을 저장하지 않습니다. 생기부 초안의 확인은 선생님이 합니다.</p></div></div>'
  };

  function chips(list) {
    return '<div class="chips">' + (list || []).map(function (c) { return '<div class="who ' + WHO[c[0]] + '"><b>' + esc(c[1]) + '</b>' + esc(c[2]) + '</div>'; }).join("") + '</div>';
  }
  function wow(it) {
    if (!it.wow) return "";
    return '<div class="wow"><span class="was">지금은</span><s>' + esc(it.wow[0]) + '</s><i>→</i><span class="now">이제는</span><b>' + esc(it.wow[1]) + '</b></div>';
  }
  function head(it) {
    var tag = it.tag ? '<span class="tag">' + esc(it.tag) + '</span>' : (it.live ? '<span class="tag live">운영 중</span>' : '');
    return wow(it) + '<div class="phead">' + esc(it.head || "") + tag + '</div>';
  }
  function paneHTML(it) {
    if (it.type === "shot") return head(it) + '<div class="shotbox" data-lb="' + it.img + '" data-cap="' + esc(it.head) + '"><img src="' + it.img + '" alt="' + esc(it.head) + '"></div>' + chips(it.chips);
    if (it.type === "doc") return head(it) + '<div class="docbox" data-lb="' + it.img + '" data-cap="' + esc(it.head) + '" style="--dw:' + (it.dw || 820) + 'px"><img src="' + it.img + '" alt=""></div>' + chips(it.chips);
    if (it.type === "text") return head(it) + '<div class="textbox"><div class="lab">' + esc(it.lab) + '<small>' + esc(it.labsmall) + '</small></div><p' + (it.text2 ? ' style="font-size:24px"' : '') + '>' + it.text + '</p>' +
      (it.text2 ? '<div class="lab" style="margin-top:18px;color:var(--green)">' + esc(it.lab2) + '<small>' + esc(it.lab2small) + '</small></div><p style="font-size:24px">' + esc(it.text2) + '</p>' : '') + '</div>' + chips(it.chips);
    if (it.type === "q") return head(it) + '<div class="qbox"><div class="qcard"><small>' + esc(it.q.small) + '</small>' + esc(it.q.text) + '<span class="k">' + esc(it.q.k) + '</span></div><div class="bubbles">' +
      it.bubbles.map(function (b) {
        if (Array.isArray(b)) return '<div class="bub ' + b[0] + '"><i>' + (b[0] === "fix" ? "개선할 점" : "좋았던 점") + '</i>' + esc(b[1]) + '</div>';
        return '<div class="bub">' + esc(b) + '</div>'; }).join("") + '</div><div style="font-size:18px;color:var(--mute);font-weight:700">' + esc(it.note) + '</div></div>' + chips(it.chips);
    if (it.type === "native") return NATIVE[it.key];
    if (it.type === "chain") {
      var p = it.plan;
      return wow(it) + '<div class="phead">' + esc(it.title) + '<span class="tag">후기 · 결과는 모의</span></div>' +
        '<div class="chainrow"><div style="display:flex;flex-direction:column;gap:14px;min-height:0">' +
        '<div class="chain"><div class="col">' +
        '<div class="ccard st"><h4>💬 학생 후기 · 운영 개선 의견</h4>' + it.students.map(function (s) { return '<q>' + esc(s) + '</q>'; }).join("") + '</div>' +
        '<div class="ccard tc"><h4>📝 선생님 의견</h4><p>' + esc(it.teacher) + '</p></div></div>' +
        '<div class="arrow">→</div>' +
        '<div class="col"><div class="ccard ai" style="flex:1"><h4>✨ AI 개선안 · 선생님 승인</h4><ul>' + it.change.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join("") + '</ul></div></div></div>' +
        '<div class="ccard pl"><h4>📘 2027 교육계획서 원고 · 다. 추진 계획</h4><div class="pline">' + esc(p.task) + ' · ' + esc(p.name) + '</div>' +
        (p.chg ? '<div class="pline" style="margin-top:6px;color:#5b3fd0"><span>개선 반영</span>' + esc(p.chg) + '</div>' : '') + '<div class="ptime">시기 ' + esc(p.timing) + '</div></div>' +
        '</div><div class="minidoc" data-lb="' + it.doc + '" data-cap="' + esc(it.label + ' 2027 교육계획서 원고(계획서 양식 예시)') + '"><img src="' + it.doc + '" alt=""><span class="lbl">원고 전체 보기</span></div></div>';
    }
    return "";
  }

  // ---- 메뉴 만들기 ----
  var menuState = {};
  document.querySelectorAll("section[data-menu]").forEach(function (sec) {
    var key = sec.dataset.menu, m = MENUS[key]; if (!m) return;
    var list = sec.querySelector(".mlist"), panel = sec.querySelector(".mpanel");
    m.items.forEach(function (it, i) {
      var b = document.createElement("button"); b.className = "mi"; b.style.setProperty("--dur", (m.dur || 7) + "s");
      b.innerHTML = '<span class="no">' + (i + 1) + '</span><img src="assets/mong/' + it.mong + '.png" alt=""><div><b>' + esc(it.label) + '</b><span>' + esc(it.sub || "") + '</span></div>' +
        (it.tag ? '<em>' + esc(it.tag) + '</em>' : '') + '<i class="bar"></i>';
      list.appendChild(b);
      var pane = document.createElement("div"); pane.className = "pane"; pane.innerHTML = paneHTML(it); panel.appendChild(pane);
    });
    if (m.legend) { var lg = document.createElement("div"); lg.className = "legend"; lg.textContent = m.legend; list.appendChild(lg); }
    var st = menuState[sec.id] = { i: 0, n: m.items.length, timer: null, dur: (m.dur || 7) * 1000, sec: sec, key: key };
    [].slice.call(list.querySelectorAll(".mi")).forEach(function (b, i) { b.addEventListener("click", function (e) { e.stopPropagation(); select(sec.id, i); restart(sec.id); }); });
  });
  function select(id, i) {
    var st = menuState[id]; if (!st) return; st.i = i;
    var btns = st.sec.querySelectorAll(".mi"), panes = st.sec.querySelectorAll(".pane");
    btns.forEach(function (b, k) { b.classList.remove("on"); if (k === i) { void b.offsetWidth; b.classList.add("on"); } });
    panes.forEach(function (p, k) {
      p.classList.remove("on");
      if (k === i) {
        // 문서 이동 거리 계산
        p.querySelectorAll(".docbox img, .minidoc img").forEach(function (im) {
          var box = im.parentElement, w = box.classList.contains("minidoc") ? box.clientWidth - 20 : (parseFloat(getComputedStyle(box).getPropertyValue("--dw")) || 820);
          var h = im.naturalHeight ? w * im.naturalHeight / im.naturalWidth : w * 1.45;
          im.style.setProperty("--pan", Math.min(0, -(h - box.clientHeight + 40)) + "px");
        });
        void p.offsetWidth; p.classList.add("on");
      }
    });
    var item = MENUS[st.key].items[i];
    // 비공개 공유 링크에는 HWPX 파일을 올릴 수 없어 버튼을 숨긴다. 로컬과 깃허브 페이지에서는 보인다.
    var local = /^(localhost|127\.0\.0\.1)$|\.github\.io$/.test(location.hostname) || location.protocol === "file:";
    if (!local) { var hx = document.getElementById("pwHwpx"); if (hx) hx.style.display = "none"; }
    if (local && item && item.hwpx) { var hb = document.getElementById("pwHwpx"); if (hb) { hb.href = item.hwpx; hb.textContent = "HWPX 받기 · " + item.label; } }
  }
  // 자동으로 넘어가지 않는다. 메뉴를 누르거나 ↑↓ 키로만 바꾼다.
  function restart(id) { var st = menuState[id]; if (st) clearInterval(st.timer); }

  // ---- 크게 보기 ----
  var lb = document.getElementById("lightbox");
  function openLb(src, cap) { lb.querySelector("img").src = src; lb.querySelector("p").textContent = cap || ""; lb.classList.add("show"); }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-lb]"); if (!t) return; e.stopPropagation(); openLb(t.dataset.lb, t.dataset.cap);
  }, true);
  lb.addEventListener("click", function (e) { e.stopPropagation(); lb.classList.remove("show"); });

  // ---- 링크(프로그램 앱 주소는 접속 위치에 따라) ----
  var BASE = { school: "https://danggok-macmini.ddnsfree.com:8443/", outside: "https://macmini.anaconda-menkent.ts.net/" };
  var loc = "school"; try { loc = localStorage.getItem("dg-loc") || "school"; } catch (e) {}
  function applyLinks() {
    document.querySelectorAll("a[data-href]").forEach(function (a) { a.href = a.dataset.href; });
    document.querySelectorAll("a[data-pro]").forEach(function (a) { a.href = BASE[loc] + a.dataset.pro; var s = a.querySelector("small.pu"); if (s) s.textContent = BASE[loc].replace("https://", "") + a.dataset.pro; });
    document.querySelectorAll("#locSwitch button").forEach(function (b) { b.classList.toggle("on", b.dataset.loc === loc); });
  }
  document.querySelectorAll("#locSwitch button").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); loc = b.dataset.loc; try { localStorage.setItem("dg-loc", loc); } catch (_) {} applyLinks(); }); });
  applyLinks();
  document.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function (e) { e.stopPropagation(); }); });

  // ---- 무대 크기 ----
  var stage = document.getElementById("stage");
  function fit() { var s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = "translate(-50%,-50%) scale(" + s + ")"; }
  addEventListener("resize", fit); fit();

  // ---- 넘기기 ----
  var slides = [].slice.call(document.querySelectorAll(".slide")), cur = 0, t0 = 0, settle = null;
  var notes = document.getElementById("notes"), count = document.getElementById("count"), bar = document.querySelector("#hud i"), timer = document.getElementById("timer");
  var plan = [], acc = 0; slides.forEach(function (s) { acc += +s.dataset.sec; plan.push(acc); });
  slides.forEach(function (s, i) { if (i > 0 && i < slides.length - 1) { var f = document.createElement("div"); f.className = "foot"; f.innerHTML = '<img src="assets/mong/dugeun.png" alt="">두근두근 당곡 · ' + (i + 1) + ' / ' + slides.length; s.appendChild(f); } });
  function fmt(t) { t = Math.max(0, Math.round(t)); return Math.floor(t / 60) + ":" + ("0" + t % 60).slice(-2); }
  function show(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, k) { s.classList.toggle("active", k === i); s.classList.remove("settled"); });
    clearTimeout(settle); var target = slides[i]; settle = setTimeout(function () { target.classList.add("settled"); }, 1600);
    cur = i; count.textContent = (i + 1) + " / " + slides.length; bar.style.width = ((i + 1) / slides.length * 100) + "%";
    notes.innerHTML = "<h4>" + (i + 1) + "장 · 목표 " + slides[i].dataset.sec + "초 · 이 장까지 " + fmt(plan[i]) + "</h4>" + (NOTES[i] || "");
    try { history.replaceState(null, "", "#" + (i + 1)); } catch (e) {}
    if (!t0 && i > 0) t0 = Date.now();
    if (menuState[target.id]) { select(target.id, 0); restart(target.id); }
  }
  function go(d) { show(cur + d); }
  document.querySelectorAll("#nav [data-go]").forEach(function (el) { el.addEventListener("click", function () { go(+el.dataset.go); }); });
  addEventListener("keydown", function (e) {
    if (lb.classList.contains("show")) { if (e.key === "Escape" || e.key === " " || e.key === "Enter") lb.classList.remove("show"); return; }
    var k = e.key, st = menuState[slides[cur].id];
    if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "Enter") { e.preventDefault(); go(1); }
    else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace") { e.preventDefault(); go(-1); }
    else if ((k === "ArrowDown" || k === "ArrowUp") && st) { e.preventDefault(); select(slides[cur].id, (st.i + (k === "ArrowDown" ? 1 : st.n - 1)) % st.n); restart(slides[cur].id); }
    else if (k === "Home") show(0); else if (k === "End") show(slides.length - 1);
    else if (k === "f" || k === "F") { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {}); else document.exitFullscreen(); }
    else if (k === "n" || k === "N") notes.classList.toggle("show");
    else if (k === "t" || k === "T") t0 = Date.now();
  });
  var sx = null; addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); sx = null; });
  setInterval(function () { var el = t0 ? (Date.now() - t0) / 1000 : 0; timer.textContent = fmt(el) + " / 5:00"; timer.classList.toggle("over", el > 300); }, 500);
  var start = parseInt((location.hash || "").slice(1), 10); show(isNaN(start) ? 0 : start - 1);
})();
