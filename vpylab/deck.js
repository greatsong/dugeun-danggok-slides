// VPyLab 교사 연수 · 슬라이드 동작
(function () {
  var D = window.DECK, SITE = D.site, MONG = "../assets/mong/";
  var stage = document.getElementById("stage");
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function url(p) { return /^https?:/.test(p) ? p : SITE + p; }
  function mong(name, cls) { return '<img class="mong ' + (cls || "") + '" src="' + MONG + name + '.png" alt="">'; }

  // ---- 파이썬 코드 색 입히기 ----
  var KW = /^(from|import|def|return|for|in|while|if|else|elif|True|False|None|lambda|and|or|not)$/;
  function hl(code) {
    return code.replace(/(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_가-힣][A-Za-z_0-9가-힣]*)(?=\()|([A-Za-z_]+)|([&<>])/g,
      function (m, c, s, n, f, w, x) {
        if (c) return '<span class="c">' + esc(c) + '</span>';
        if (s) return '<span class="s">' + esc(s) + '</span>';
        if (n) return '<span class="n">' + n + '</span>';
        if (f) return KW.test(f) ? '<span class="k">' + f + '</span>' : '<span class="f">' + f + '</span>';
        if (w) return KW.test(w) ? '<span class="k">' + w + '</span>' : w;
        return esc(x);
      });
  }
  function codebox(code, cs, label) {
    return '<div class="codebox" style="--cs:' + (cs || 25) + 'px"><div class="cl"><span>' + esc(label || "Python") + '</span><button data-copy="' + esc(code) + '">복사</button></div><pre>' + hl(code) + '</pre></div>';
  }
  function tasks(list) {
    var H = { chg: "✏️ 바꿔 보기", ask: "💬 생각해 보기", tip: "💡 도움말" };
    return (list || []).map(function (t) { return '<div class="task ' + t[0] + '"><h4>' + esc(t[1] || H[t[0]]) + '</h4><p>' + t[2] + '</p></div>'; }).join("");
  }
  function chips(list) {
    return '<div class="chips">' + (list || []).map(function (c) { return '<div class="who t-' + c[0] + '"><b>' + esc(c[1]) + '</b>' + esc(c[2]) + '</div>'; }).join("") + '</div>';
  }
  function band(b) { return b ? '<div class="note-band t-' + b[0] + '">' + b[1] + '</div>' : ""; }
  function cards(list, cols) {
    return '<div class="cards" style="grid-template-columns:repeat(' + (cols || list.length) + ',1fr)">' + list.map(function (c, i) {
      return '<div class="bcard rise t-' + (c.tone || "") + '" style="--d:' + (0.15 + i * 0.1) + '">' + (c.mong ? '<div class="ic">' + mong(c.mong) + '</div>' : '') + '<b>' + c.head + '</b><p>' + c.body + '</p></div>';
    }).join("") + '</div>';
  }
  function live(id, label, poster) {
    return '<div class="livebox" data-embed="' + id + '">' + (poster ? '<img class="poster" src="shots/' + poster + '.jpg" alt="">' : '') + '<div class="wait">' + mong("dugeun", "bob") + '<div>파이썬을 불러오는 중입니다.<br>10초쯤 걸립니다.</div></div><span class="badge">● 실행 중 · ' + esc(label) + '</span></div>';
  }
  function frame(name, cap, fit) { return '<div class="frame rise ' + (fit || "") + '" style="--d:.2" data-lb="shots/' + name + '.jpg" data-cap="' + esc(cap || "") + '"><img src="shots/' + name + '.jpg" alt="' + esc(cap || "") + '">' + (cap ? '<span class="lbl">' + esc(cap) + '</span>' : '') + '</div>'; }
  function shot(name, cap) { return '<div class="shotbox" data-lb="shots/' + name + '.jpg" data-cap="' + esc(cap || "") + '"><img src="shots/' + name + '.jpg" alt="' + esc(cap || "") + '" loading="lazy"></div>'; }
  var TONES = ["", "", "t-green", "t-orange", "t-pink", "t-purple"];
  function top(s) {
    var chip = s.chip ? '<span class="role-chip rise ' + (TONES[s.part || 0] || "") + '">' + mong(s.chip[0]) + esc(s.chip[1]) + (s.time ? '<span class="tm">' + esc(s.time) + '</span>' : '') + '</span>' : '';
    var btn = s.btn ? '<div class="demo-btns rise" style="--d:.2"><a class="go" href="' + url(s.btn[1]) + '" target="_blank" rel="noopener">' + esc(s.btn[0]) + ' ↗</a></div>' : '';
    return '<div class="top"><div>' + chip + '<h2 class="rise" style="--d:.1">' + s.title + '</h2></div>' + btn + '</div>';
  }

  // ---- 장 종류별 본문 ----
  var R = {
    cover: function () {
      return '<div class="text"><img class="logo rise" src="vpylab-logo.svg" alt="VPyLab">' +
        '<h1 class="rise" style="--d:.15">빛과 소리로 만드는<br><span class="grad">3D 파이썬 교실</span><span class="l2">왜 만들었고, 무엇이 되고, 어떻게 쓰는가</span></h1>' +
        '<div class="date rise" style="--d:.6">교사 연수 · 당곡고등학교 수리정보교육부 석리송</div></div>' +
        '<div class="heroshot pop" style="--d:.4"><img src="shots/hero-friends.jpg" alt="VPyLab 홈의 코드 친구들"></div><div class="hero" style="display:none"><svg viewBox="0 0 820 840"><path d="M 30 720 C 190 660, 210 490, 370 490 S 590 580, 660 420 S 720 170, 810 120" fill="none" stroke="#3b63e0" stroke-width="7" class="march"/></svg>' +
        '<img class="mong pop" style="--d:.5;left:240px;top:300px;height:340px" src="' + MONG + 'mandu.png" alt="">' +
        '<img class="mong pop" style="--d:.7;left:0;top:590px;height:150px" src="' + MONG + 'chorong.png" alt="">' +
        '<img class="mong pop" style="--d:.85;left:580px;top:450px;height:140px" src="' + MONG + 'ttukttak.png" alt="">' +
        '<img class="mong pop" style="--d:1;left:650px;top:230px;height:125px" src="' + MONG + 'doran.png" alt="">' +
        '<img class="mong pop" style="--d:1.15;left:700px;top:30px;height:120px" src="' + MONG + 'dugeun.png" alt=""></div>';
    },
    section: function (s) {
      return mong(s.mong, "pop bob") + '<div class="pt rise" style="--d:.1">' + s.part + '부</div><h1 class="rise" style="--d:.2">' + s.title + '</h1><p class="rise" style="--d:.35">' + s.sub + '</p><span class="tm rise" style="--d:.5">' + s.time + '</span>';
    },
    bubbles: function (s) {
      return top(s) + '<div class="body"><div class="roles">' + s.items.map(function (it, i) {
        return '<div class="card role r' + (i + 1) + ' rise" style="--d:' + (0.2 + i * 0.12) + '"><div class="bubble">' + esc(it[1]).replace(/\n/g, "<br>") + '</div>' + mong(it[0], "bob") + '<div class="who2">' + esc(it[2]) + '</div></div>';
      }).join("") + '</div></div>';
    },
    cards: function (s) { return top(s) + '<div class="body" style="gap:22px">' + cards(s.cards, s.cols) + band(s.band) + '</div>'; },
    url: function (s) {
      return top(s) + '<div class="body"><div class="urlbig rise" style="--d:.15">' + esc(s.url) + '</div><div class="urlsub rise" style="--d:.25">' + esc(s.sub) + '</div><div style="height:34px"></div>' + cards(s.cards, 3) + '</div>';
    },
    flow: function (s) {
      return top(s) + '<div class="body"><div class="flow">' + s.steps.map(function (st, i) {
        return (i ? '<div class="ar">→</div>' : '') + '<div class="st rise" style="--d:' + (0.2 + i * 0.12) + '">' + mong(st[0]) + '<span class="n">' + (i + 1) + '단계</span><b>' + esc(st[1]) + '</b><p>' + esc(st[2]) + '</p></div>';
      }).join("") + '</div><div class="below">' + (s.bands || []).map(band).join("") + '</div></div>';
    },
    table: function (s) {
      return top(s) + '<div class="body"><table class="ba ' + (s.hi ? "cmp" : "") + '"><tr>' + s.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join("") + '</tr>' +
        s.rows.map(function (r) { var n = s.head.length; return '<tr class="' + (r[n] || "") + '">' + r.slice(0, n).map(function (c, k) { return '<td' + (k === n - 1 && s.hi ? ' class="hi"' : '') + '>' + c + '</td>'; }).join("") + '</tr>'; }).join("") + '</table>' +
        (s.foot ? '<div class="note-band t-orange" style="margin-top:14px;font-size:24px">' + esc(s.foot) + '</div>' : '') + '</div>';
    },
    visual: function (s) {
      var pts = '<div class="pt-list">' + (s.lead ? '<div class="lead2 rise">' + s.lead + '</div>' : '') + (s.list || []).map(function (l, i) {
        return '<div class="li rise t-' + l[1] + '" style="--d:' + (0.2 + i * 0.1) + '"><i>' + esc(l[0]) + '</i><div>' + l[2] + '</div></div>';
      }).join("") + (s.code ? codebox(s.code, s.cs) : '') + band(s.band) + '</div>';
      var vis = s.term ? '<div class="term rise" style="--d:.2"><div class="tb"><span></span><span></span><span></span><em>' + esc(s.termTitle || "Python") + '</em></div><pre>' + esc(s.term) + '</pre></div>'
        : s.imgs ? '<div class="duo">' + s.imgs.map(function (m) { return frame(m[0], m[1], s.fit); }).join("") + '</div>' : frame(s.img, s.cap, s.fit);
      if (s.stack) return top(s) + '<div class="body stack">' + vis + '<div class="row4">' + s.list.map(function (l, i) { return '<div class="li rise t-' + l[1] + '" style="--d:' + (0.3 + i * 0.1) + '"><i>' + esc(l[0]) + '</i><div>' + l[2] + '</div></div>'; }).join("") + '</div></div>';
      return top(s) + '<div class="body"><div class="split ' + (s.ratio || "") + '">' + (s.flip ? vis + pts : pts + vis) + '</div></div>';
    },
    mosaic: function (s) {
      return top(s) + '<div class="body" style="gap:18px"><div class="mosaic ' + (s.light ? "light" : "") + '" style="grid-template-columns:repeat(' + s.cols + ',1fr)">' + s.items.map(function (m, i) {
        return '<figure class="rise" style="--d:' + (0.15 + i * 0.08) + '" data-lb="shots/' + m[0] + '.jpg" data-cap="' + esc(m[1]) + '"><img src="shots/' + m[0] + '.jpg" alt="' + esc(m[1]) + '"><figcaption><b>' + esc(m[1]) + '</b>' + (m[2] ? '<span>' + esc(m[2]) + '</span>' : '') + '</figcaption></figure>';
      }).join("") + '</div>' + band(s.band) + '</div>';
    },
    live: function (s) {
      return top(s) + '<div class="body"><div class="split">' + live(s.embed, s.label, s.poster) + '<div class="side">' + codebox(s.code, s.cs, s.label) + tasks(s.tasks) + '</div></div></div>';
    },
    practice: function (s) {
      var t = { chip: [s.mong, "실습 " + s.no + " / 4"], part: 3, time: s.time, title: s.title, btn: ["이 튜토리얼 열기", s.link] };
      return top(t) + '<div class="body"><div class="split even"><div class="side">' +
        '<div class="note-band" style="font-size:30px">' + esc(s.desc) + '</div>' + codebox(s.code, s.cs || 30, "실행해 보기") +
        '<div class="pguide"><img class="mong bob" src="' + MONG + s.mong + '.png" alt=""><div><b>예상</b><i>→</i><b>실행</b><i>→</i><b>수정</b><i>→</i><b>설명</b><p>실행하기 전에, 무슨 일이 일어날지 옆 사람에게 먼저 말해 보세요.</p></div></div>' +
        '</div><div class="side">' +
        tasks([["chg", null, s.change], ["ask", null, s.reflect], ["tip", "더 나아가기", s.tip]]) + '</div></div></div>';
    },
    shotlist: function (s) {
      return top(s) + '<div class="body"><div class="split">' + shot(s.shot, s.cap) + '<div class="pt-list">' + s.list.map(function (l, i) {
        return '<div class="li rise t-' + l[1] + '" style="--d:' + (0.2 + i * 0.1) + '"><i>' + esc(l[0]) + '</i><div>' + l[2] + '</div></div>';
      }).join("") + '</div></div></div>';
    },
    code: function (s) { return top(s) + '<div class="body" style="gap:22px">' + codebox(s.code, s.cs) + cards(s.cards, s.cards.length) + '</div>'; },
    menu: function (s) {
      return top(s) + '<div class="body"><div class="mwrap"><div class="mlist">' + s.items.map(function (it, i) {
        return '<button class="mi"><span class="no">' + (i + 1) + '</span>' + mong(it.mong) + '<div><b>' + esc(it.label) + '</b><span>' + esc(it.sub || "") + '</span></div></button>';
      }).join("") + (s.legend ? '<div class="legend">' + esc(s.legend) + '</div>' : '') + '</div><div class="mpanel">' + s.items.map(function (it) {
        var link = it.link ? '<a class="go ghost" href="' + url(it.link[1]) + '" target="_blank" rel="noopener">' + esc(it.link[0]) + ' ↗</a>' : '';
        var inner = it.code ? codebox(it.code, it.cs) + tasks(it.tasks) : shot(it.shot, it.cap) + chips(it.chips);
        return '<div class="pane"><div class="phead">' + esc(it.head) + link + '</div>' + inner + '</div>';
      }).join("") + '</div></div></div>';
    },
    links: function (s) {
      return top(s) + '<div class="body"><div class="groups">' + s.groups.map(function (g, i) {
        return '<div class="card grp rise" style="--d:' + (0.2 + i * 0.1) + '"><h3>' + mong(g.mong) + esc(g.head) + '</h3>' + g.links.map(function (l) {
          return '<a href="' + url(l[2]) + '" target="_blank" rel="noopener"><span><b>' + esc(l[0]) + '</b><small>' + esc(l[1]) + '</small></span><span class="arr">↗</span></a>';
        }).join("") + '</div>';
      }).join("") + '</div></div>';
    },
    "break": function (s) { return '<img class="big pop" src="' + MONG + s.mong + '.png" alt=""><div class="t1 rise" style="--d:.2">' + esc(s.title) + '</div><div class="t2 rise" style="--d:.35">' + esc(s.sub) + '</div>'; },
    end: function (s) {
      return '<div class="friends" style="margin:0 0 10px">' + ["chorong", "ttukttak", "mandu", "doran", "mongsil", "salang", "gori", "dugeun"].map(function (m, k) { return '<img src="' + MONG + m + '.png" alt="" style="--w:-' + (k * 0.3) + 's">'; }).join("") + '</div>' +
        '<div class="t1 rise" style="--d:.2">' + esc(s.title) + '</div><div class="t2 rise" style="--d:.35">' + esc(s.sub) + '</div>' +
        '<div class="endlinks rise" style="--d:.5">' + (s.links || []).map(function (l) { return '<a href="' + url(l[1]) + '" target="_blank" rel="noopener"><b>' + esc(l[0]) + '</b><span>' + esc(l[2]) + '</span></a>'; }).join("") + '</div>';
    }
  };
  var CLS = { cover: "cover", section: "section", "break": "center", end: "center" };

  // ---- 장 만들기 ----
  var N = D.slides.length;
  D.slides.forEach(function (s, i) {
    var sec = document.createElement("section");
    sec.className = "slide " + (CLS[s.type] || "");
    sec.innerHTML = R[s.type](s);
    if (i > 0 && s.type !== "section" && s.type !== "end") {
      var f = document.createElement("div"); f.className = "foot";
      f.innerHTML = '<img src="' + MONG + 'dugeun.png" alt="">VPyLab 교사 연수 · ' + (i + 1) + ' / ' + N + (s.part ? '<span class="part">· ' + esc(D.parts[s.part]) + '</span>' : '');
      sec.appendChild(f);
    }
    stage.appendChild(sec);
  });
  var PRINT = /[?&]print/.test(location.search); if (PRINT) document.body.classList.add("print");
  var slides = [].slice.call(stage.querySelectorAll(".slide")), cur = 0, settle = null, t0 = 0;

  // ---- 메뉴 판 ----
  function panes(i) { return [].slice.call(slides[i].querySelectorAll(".pane")); }
  function paneIndex(i) { var p = panes(i); for (var k = 0; k < p.length; k++) if (p[k].classList.contains("on")) return k; return -1; }
  function select(i, k) {
    panes(i).forEach(function (p, j) { p.classList.toggle("on", j === k); });
    [].slice.call(slides[i].querySelectorAll(".mi")).forEach(function (b, j) { b.classList.toggle("on", j === k); });
  }
  slides.forEach(function (sec, i) {
    [].slice.call(sec.querySelectorAll(".mi")).forEach(function (b, k) { b.addEventListener("click", function () { select(i, k); b.blur(); }); });
  });

  // ---- 실시간 화면: 보이는 장에서만 iframe을 넣고, 떠나면 뺀다(파이썬이 여러 개 돌지 않게) ----
  function syncLive() {
    if (PRINT) return;
    slides.forEach(function (sec, i) {
      [].slice.call(sec.querySelectorAll(".livebox")).forEach(function (box) {
        var fr = box.querySelector("iframe");
        if (i === cur && !fr) {
          fr = document.createElement("iframe");
          fr.src = SITE + "/embed/" + box.dataset.embed; fr.title = "VPyLab 실행 화면";
          fr.allow = "autoplay; fullscreen"; fr.setAttribute("allowfullscreen", "");
          box.appendChild(fr);
        } else if (i !== cur && fr) box.removeChild(fr);
      });
    });
  }

  // ---- 넘기기 ----
  var count = document.getElementById("count"), bar = document.querySelector("#hud i"), notes = document.getElementById("notes"), timer = document.getElementById("timer");
  function show(i, lastPane) {
    i = Math.max(0, Math.min(N - 1, i));
    slides.forEach(function (s, k) { s.classList.toggle("active", k === i); s.classList.remove("settled"); });
    clearTimeout(settle); var target = slides[i]; settle = setTimeout(function () { target.classList.add("settled"); }, PRINT ? 0 : 1700);
    cur = i; count.textContent = (i + 1) + " / " + N; bar.style.width = ((i + 1) / N * 100) + "%";
    var s = D.slides[i];
    notes.innerHTML = "<h4>" + (i + 1) + "장" + (s.part ? " · " + esc(D.parts[s.part]) : "") + "</h4>" + esc(s.note || "");
    if (panes(i).length) select(i, lastPane ? panes(i).length - 1 : 0);
    try { history.replaceState(null, "", "#" + (i + 1)); } catch (e) {}
    if (!t0 && i > 0) t0 = Date.now();
    syncLive(); markToc();
  }
  // → 는 메뉴 판을 먼저 차례로 넘기고, 마지막 판에서 다음 장으로 간다(리모컨만으로 진행 가능).
  function go(d) {
    var p = panes(cur), k = paneIndex(cur);
    if (p.length && k + d >= 0 && k + d < p.length) { select(cur, k + d); return; }
    if (cur + d < 0 || cur + d >= N) return;
    show(cur + d, d < 0);
  }
  [].slice.call(document.querySelectorAll("#meta [data-go]")).forEach(function (el) { el.addEventListener("click", function () { go(+el.dataset.go); el.blur(); }); });

  // ---- 목차 ----
  var toc = document.getElementById("toc"), tocList = toc.querySelector("ol");
  D.slides.forEach(function (s, i) {
    var li = document.createElement("li");
    var name = s.type === "cover" ? "표지" : s.type === "practice" ? "실습 " + s.no + " · " + s.title : s.type === "section" ? s.part + "부 · " + s.title : s.title;
    li.textContent = (i + 1) + ". " + String(name).replace(/<[^>]+>/g, " ");
    if (s.type === "section") li.className = "sec";
    li.addEventListener("click", function (e) { e.stopPropagation(); toc.classList.remove("show"); show(i); });
    tocList.appendChild(li);
  });
  function markToc() { [].slice.call(tocList.children).forEach(function (li, i) { li.classList.toggle("cur", i === cur); }); }
  toc.addEventListener("click", function () { toc.classList.remove("show"); });
  document.getElementById("tocBtn").addEventListener("click", function () { toc.classList.toggle("show"); this.blur(); });

  // ---- 크게 보기 · 복사 ----
  var lb = document.getElementById("lightbox");
  document.addEventListener("click", function (e) {
    var c = e.target.closest("[data-copy]");
    if (c) {
      var done = function () { c.textContent = "복사됨"; setTimeout(function () { c.textContent = "복사"; }, 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(c.dataset.copy).then(done, function () {}); return;
    }
    var t = e.target.closest("[data-lb]");
    if (t) { lb.querySelector("img").src = t.dataset.lb; lb.querySelector("p").textContent = t.dataset.cap || ""; lb.classList.add("show"); }
  });
  lb.addEventListener("click", function () { lb.classList.remove("show"); });

  // ---- 무대 크기 ----
  function fit() { var k = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = "translate(-50%,-50%) scale(" + k + ")"; }
  addEventListener("resize", fit); fit();

  // ---- 키보드 · 터치 ----
  addEventListener("keydown", function (e) {
    var k = e.key;
    if (lb.classList.contains("show")) { if (k === "Escape" || k === " " || k === "Enter") { e.preventDefault(); lb.classList.remove("show"); } return; }
    if (toc.classList.contains("show")) { if (k === "Escape" || k === "g" || k === "G") toc.classList.remove("show"); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "Enter") { e.preventDefault(); go(1); }
    else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace") { e.preventDefault(); go(-1); }
    else if ((k === "ArrowDown" || k === "ArrowUp") && panes(cur).length) { e.preventDefault(); var n = panes(cur).length; select(cur, (paneIndex(cur) + (k === "ArrowDown" ? 1 : n - 1)) % n); }
    else if (k === "Home") show(0); else if (k === "End") show(N - 1);
    else if (k === "g" || k === "G") toc.classList.add("show");
    else if (k === "f" || k === "F") { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () {}); else document.exitFullscreen(); }
    else if (k === "n" || k === "N") notes.classList.toggle("show");
    else if (k === "t" || k === "T") t0 = Date.now();
  });
  var sx = null;
  addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1); sx = null; });
  setInterval(function () { var el = t0 ? Math.round((Date.now() - t0) / 1000) : 0, h = Math.floor(el / 3600), m = Math.floor(el % 3600 / 60); timer.textContent = h + ":" + ("0" + m).slice(-2) + ":" + ("0" + el % 60).slice(-2); }, 1000);

  var start = parseInt((location.hash || "").slice(1), 10); show(isNaN(start) ? 0 : start - 1);
})();
