// VPyLab 교사 연수 · 슬라이드 동작
(function () {
  var D = window.DECK, GS = window.GS || {}, SITE = D.site, MONG = "mong/";
  var PRINT = /[?&]print/.test(location.search); if (PRINT) document.body.classList.add("print");
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
    var H = { chg: "바꿔 보기", ask: "물어보기", tip: "더 해 보기" };
    return (list || []).map(function (t) { return '<div class="task ' + t[0] + '"><h4>' + esc(t[1] || H[t[0]]) + '</h4><p>' + t[2] + '</p></div>'; }).join("");
  }
  function chips(list) {
    return '<div class="chips">' + (list || []).map(function (c) { return '<div class="who t-' + c[0] + '"><b>' + esc(c[1]) + '</b><span>' + c[2] + '</span></div>'; }).join("") + '</div>';
  }
  function band(b) { return b ? '<div class="note-band t-' + b[0] + '">' + b[1] + '</div>' : ""; }
  function cards(list, cols) {
    return '<div class="cards" style="grid-template-columns:repeat(' + (cols || list.length) + ',1fr)">' + list.map(function (c, i) {
      return '<div class="bcard rise t-' + (c.tone || "") + '" style="--d:' + (0.15 + i * 0.1) + '">' + (c.mong ? '<div class="ic">' + mong(c.mong) + '</div>' : '') + '<b>' + c.head + '</b><p>' + c.body + '</p></div>';
    }).join("") + '</div>';
  }
  function frame(name, cap, fit) { return '<div class="frame rise ' + (fit || "") + '" style="--d:.2" data-lb="shots/' + name + '.jpg" data-cap="' + esc(cap || "") + '"><img src="shots/' + name + '.jpg" alt="' + esc(cap || "") + '">' + (cap ? '<span class="lbl">' + esc(cap) + '</span>' : '') + '</div>'; }

  // ---- 실행 상자 ----
  // demo: VPyLab의 "HTML 내려받기"로 받은 파일(demos/)을 그대로 넣는다. 서버나 DB 없이 이 페이지 안에서 돈다.
  function demoBox(id, opt) {
    opt = opt || {};
    if (opt.ext) return '<div class="livebox ext"><img class="poster" src="shots/d-' + id + '.jpg" alt=""><a class="extgo" href="' + url(opt.open) + '" target="_blank" rel="noopener"><b>▶ VPyLab에서 직접 눌러 보기 ↗</b><span>' + esc(opt.ext) + '</span></a></div>';
    return '<div class="livebox" data-src="demos/' + id + '.html"' + (opt.keys ? ' data-keys="1"' : '') + '><img class="poster" src="shots/d-' + id + '.jpg" alt="">' +
      '<div class="tools"><button data-act="reload" title="처음부터 다시">↻ 다시</button><button data-act="full" title="크게 보기">⛶ 크게</button></div></div>';
  }
  // gs: glowscript.org의 원본. 누르면 그 자리에서 원본을 불러온다.
  function gsBox(id) {
    var g = GS[id] || {};
    return '<div class="livebox gs" data-src="' + esc(g.url || "") + '" data-click="1"><div class="gscard"><img src="shots/' + id + '.jpg" alt=""><div><small>GlowScript 원본</small><b>' + esc(g.title || "") + '</b>' +
      '<button class="gsrun" data-act="load">▶ 여기서 원본 실행</button><a href="' + esc(g.url || "#") + '" target="_blank" rel="noopener">새 탭에서 열기 ↗</a></div></div>' +
      '<div class="tools"><button data-act="reload">↻ 다시</button><button data-act="full">⛶ 크게</button></div></div>';
  }

  var TONES = ["", "", "t-green", "t-orange", "t-purple"];
  function top(s) {
    var chip = s.chip ? '<span class="role-chip rise ' + (TONES[s.part || 0] || "") + '">' + mong(s.chip[0]) + esc(s.chip[1]) + (s.time ? '<span class="tm">' + esc(s.time) + '</span>' : '') + '</span>' : '';
    var btn = s.btn ? '<div class="demo-btns rise" style="--d:.2"><a class="go" href="' + url(s.btn[1]) + '" target="_blank" rel="noopener">' + esc(s.btn[0]) + ' ↗</a></div>' : '';
    return '<div class="top"><div>' + chip + '<h2 class="rise" style="--d:.1">' + s.title + '</h2></div>' + btn + '</div>';
  }

  // ---- 장 종류 ----
  var R = {
    cover: function (s) {
      return '<div class="text"><img class="logo rise" src="vpylab-logo.svg" alt="VPyLab"><h1 class="rise" style="--d:.15">' + s.title + '</h1>' +
        '<div class="date rise" style="--d:.5">' + esc(s.by) + '</div><div class="hint rise" style="--d:.8">' + mong("dugeun") + '<span>' + esc(s.hint) + '</span></div></div>' +
        '<div class="coverlive pop" style="--d:.4">' + demoBox(s.demo) + '</div>';
    },
    cards: function (s) { return top(s) + '<div class="body" style="gap:22px">' + cards(s.cards, s.cols) + band(s.band) + '</div>'; },
    url: function (s) {
      return top(s) + '<div class="body"><div class="urlbig rise" style="--d:.15">' + esc(s.url) + '</div><div class="urlsub rise" style="--d:.25">' + esc(s.sub) + '</div><div style="height:34px"></div>' + cards(s.cards, 3) + '</div>';
    },
    flow: function (s) {
      return top(s) + '<div class="body"><div class="flow">' + s.steps.map(function (st, i) {
        return (i ? '<div class="ar">→</div>' : '') + '<div class="st rise" style="--d:' + (0.2 + i * 0.12) + '">' + mong(st[0]) + '<span class="n">' + esc(st[3] || "") + '</span><b>' + esc(st[1]) + '</b><p>' + st[2] + '</p></div>';
      }).join("") + '</div><div class="below">' + (s.bands || []).map(band).join("") + '</div></div>';
    },
    table: function (s) {
      var n = s.head.length;
      return top(s) + '<div class="body"><table class="ba ' + (s.hi ? "cmp" : "") + '"><tr>' + s.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join("") + '</tr>' +
        s.rows.map(function (r) { return '<tr>' + r.slice(0, n).map(function (c, k) { return '<td' + (k === n - 1 && s.hi ? ' class="hi"' : '') + '>' + c + '</td>'; }).join("") + '</tr>'; }).join("") + '</table>' +
        (s.foot ? '<div class="note-band t-orange" style="margin-top:14px;font-size:24px">' + s.foot + '</div>' : '') + '</div>';
    },
    visual: function (s) {
      var pts = '<div class="pt-list">' + (s.quotes || []).map(function (q, i) {
        return '<div class="quote rise" style="--d:' + (0.2 + i * 0.12) + '">' + mong(q[0]) + '<div><p>' + esc(q[1]) + '</p>' + (q[2] ? '<small>' + esc(q[2]) + '</small>' : '') + '</div></div>';
      }).join("") + (s.list || []).map(function (l, i) {
        return '<div class="li rise t-' + l[1] + '" style="--d:' + (0.2 + i * 0.1) + '"><i>' + esc(l[0]) + '</i><div>' + l[2] + '</div></div>';
      }).join("") + band(s.band) + '</div>';
      var vis = s.term ? '<div class="term rise" style="--d:.2"><div class="tb"><span></span><span></span><span></span><em>' + esc(s.termTitle || "Python") + '</em></div><pre>' + esc(s.term) + '</pre></div>' : frame(s.img, s.cap, s.fit);
      if (s.stack) return top(s) + '<div class="body stack">' + vis + '<div class="row4">' + s.list.map(function (l, i) { return '<div class="li rise t-' + l[1] + '" style="--d:' + (0.3 + i * 0.1) + '"><i>' + esc(l[0]) + '</i><div>' + l[2] + '</div></div>'; }).join("") + '</div></div>';
      return top(s) + '<div class="body"><div class="split ' + (s.ratio || "") + '">' + (s.flip ? vis + pts : pts + vis) + '</div></div>';
    },
    mosaic: function (s) {
      return top(s) + '<div class="body" style="gap:18px"><div class="mosaic ' + (s.light ? "light" : "") + '" style="grid-template-columns:repeat(' + s.cols + ',1fr)">' + s.items.map(function (m, i) {
        return '<figure class="rise" style="--d:' + (0.15 + i * 0.08) + '" data-lb="shots/' + m[0] + '.jpg" data-cap="' + esc(m[1]) + '"><img src="shots/' + m[0] + '.jpg" alt="' + esc(m[1]) + '"><figcaption><b>' + esc(m[1]) + '</b>' + (m[2] ? '<span>' + esc(m[2]) + '</span>' : '') + '</figcaption></figure>';
      }).join("") + '</div>' + band(s.band) + '</div>';
    },
    // 왼쪽 메뉴에서 골라 오른쪽에서 바로 실행하는 장
    menu: function (s) {
      return top(s) + '<div class="body"><div class="mwrap"><div class="mlist">' + s.items.map(function (it, i) {
        return '<button class="mi"><span class="no">' + (i + 1) + '</span>' + mong(it.mong) + '<div><b>' + esc(it.label) + '</b><span>' + esc(it.sub || "") + '</span></div></button>';
      }).join("") + (s.legend ? '<div class="legend">' + s.legend + '</div>' : '') + '</div><div class="mpanel">' + s.items.map(function (it) {
        var open = it.open ? '<a class="go ghost" href="' + url(it.open) + '" target="_blank" rel="noopener">VPyLab에서 열어 고치기 ↗</a>' : '';
        var inner;
        if (it.code) inner = '<div class="split even prac"><div class="side">' + codebox(it.code, it.cs || 24, it.ext ? "VPyLab에서 열리는 코드" : "오른쪽에서 돌고 있는 코드") + tasks(it.tasks) + '</div>' + demoBox(it.demo, it) + '</div>';
        else if (it.gs) inner = gsBox(it.gs) + chips(it.chips);
        else inner = demoBox(it.demo, it) + chips(it.chips);
        return '<div class="pane"><div class="phead"><span>' + esc(it.head) + '</span>' + (it.sound ? '<span class="tag snd">소리 남</span>' : '') + (it.ext ? '<span class="tag">눌러서 하는 예제</span>' : '') + open + '</div>' + inner + '</div>';
      }).join("") + '</div></div></div>';
    },
    end: function (s) {
      return '<div class="friends" style="margin:0 0 10px">' + ["chorong", "ttukttak", "arong", "doran", "mongsil", "sallang", "gori", "dugeun"].map(function (m, k) { return '<img src="' + MONG + m + '.png" alt="" style="--w:-' + (k * 0.3) + 's">'; }).join("") + '</div>' +
        '<div class="t1 rise" style="--d:.2">' + esc(s.title) + '</div><div class="t2 rise" style="--d:.35">' + esc(s.sub) + '</div>' +
        '<div class="endlinks rise" style="--d:.5">' + (s.links || []).map(function (l) { return '<a href="' + url(l[1]) + '" target="_blank" rel="noopener"><b>' + esc(l[0]) + '</b><span>' + esc(l[2]) + '</span></a>'; }).join("") + '</div>';
    }
  };
  var CLS = { cover: "cover", end: "center" };

  // ---- 장 만들기 ----
  var N = D.slides.length;
  D.slides.forEach(function (s, i) {
    var sec = document.createElement("section");
    sec.className = "slide " + (CLS[s.type] || "");
    sec.innerHTML = R[s.type](s);
    if (i > 0 && s.type !== "end") {
      var f = document.createElement("div"); f.className = "foot";
      f.innerHTML = '<img src="' + MONG + 'dugeun.png" alt="">VPyLab 교사 연수 · ' + (i + 1) + ' / ' + N + (s.part ? '<span class="part">· ' + esc(D.parts[s.part]) + '</span>' : '');
      sec.appendChild(f);
    }
    stage.appendChild(sec);
  });
  var slides = [].slice.call(stage.querySelectorAll(".slide")), cur = 0, settle = null, t0 = 0;

  // ---- 메뉴 판 ----
  function panes(i) { return [].slice.call(slides[i].querySelectorAll(".pane")); }
  function paneIndex(i) { var p = panes(i); for (var k = 0; k < p.length; k++) if (p[k].classList.contains("on")) return k; return -1; }
  function select(i, k) {
    panes(i).forEach(function (p, j) { p.classList.toggle("on", j === k); });
    [].slice.call(slides[i].querySelectorAll(".mi")).forEach(function (b, j) { b.classList.toggle("on", j === k); });
    syncLive();
  }
  slides.forEach(function (sec, i) {
    [].slice.call(sec.querySelectorAll(".mi")).forEach(function (b, k) { b.addEventListener("click", function () { select(i, k); b.blur(); }); });
  });

  // ---- 실행 상자: 지금 보이는 것 하나만 돌린다(파이썬 엔진이 여러 개 돌지 않게) ----
  function visible(box) {
    if (!box.closest(".slide").classList.contains("active")) return false;
    var p = box.closest(".pane"); return !p || p.classList.contains("on");
  }
  function load(box) {
    if (box.querySelector("iframe")) return;
    var fr = document.createElement("iframe");
    fr.src = box.dataset.src; fr.title = "실행 화면"; fr.allow = "autoplay; fullscreen"; fr.setAttribute("allowfullscreen", "");
    // 같은 사이트의 실행 화면 안에서 누른 넘김 키도 슬라이드가 받는다. 방향키를 쓰는 예제(data-keys)는 PageUp/PageDown만 넘긴다.
    fr.addEventListener("load", function () {
      try {
        fr.contentWindow.addEventListener("keydown", function (e) {
          var nav = e.key === "PageDown" || e.key === "PageUp" || (!box.dataset.keys && /^Arrow/.test(e.key));
          if (nav) { e.preventDefault(); e.stopPropagation(); onKey(e.key, e); }
        }, true);
      } catch (err) { /* 다른 사이트(GlowScript)는 키를 넘겨받을 수 없다 */ }
    });
    box.appendChild(fr); box.classList.add("running");
  }
  function unload(box) { var fr = box.querySelector("iframe"); if (fr) box.removeChild(fr); box.classList.remove("running"); }
  function syncLive() {
    if (PRINT) return;
    [].slice.call(stage.querySelectorAll(".livebox")).forEach(function (box) {
      if (!visible(box)) unload(box); else if (!box.dataset.click) load(box);
    });
  }
  stage.addEventListener("click", function (e) {
    var a = e.target.closest("[data-act]"); if (!a) return;
    var box = a.closest(".livebox");
    if (a.dataset.act === "load") load(box);
    else if (a.dataset.act === "reload") { unload(box); load(box); }
    else if (a.dataset.act === "full") { if (document.fullscreenElement) document.exitFullscreen(); else if (box.requestFullscreen) box.requestFullscreen().catch(function () {}); }
    a.blur();
  });

  // ---- 넘기기 ----
  var count = document.getElementById("count"), bar = document.querySelector("#hud i"), notes = document.getElementById("notes"), timer = document.getElementById("timer");
  function show(i, lastPane) {
    i = Math.max(0, Math.min(N - 1, i));
    slides.forEach(function (s, k) { s.classList.toggle("active", k === i); s.classList.remove("settled"); });
    clearTimeout(settle); var target = slides[i]; settle = setTimeout(function () { target.classList.add("settled"); }, PRINT ? 0 : 1700);
    cur = i; count.textContent = (i + 1) + " / " + N; bar.style.width = ((i + 1) / N * 100) + "%";
    var s = D.slides[i];
    notes.innerHTML = "<h4>" + (i + 1) + "장" + (s.part ? " · " + esc(D.parts[s.part]) : "") + "</h4>" + esc(s.note || "");
    try { history.replaceState(null, "", location.search + "#" + (i + 1)); } catch (e) {}
    if (!t0 && i > 0) t0 = Date.now();
    if (panes(i).length) select(i, lastPane ? panes(i).length - 1 : 0); else syncLive();
    markToc();
  }
  // → 는 메뉴 판을 먼저 차례로 넘기고, 마지막 판에서 다음 장으로 간다.
  function go(d) {
    var p = panes(cur), k = paneIndex(cur);
    if (p.length && k + d >= 0 && k + d < p.length) { select(cur, k + d); return true; }
    if (cur + d < 0 || cur + d >= N) return false;
    show(cur + d, d < 0); return true;
  }
  window.deckGo = go;
  [].slice.call(document.querySelectorAll("#meta [data-go]")).forEach(function (el) { el.addEventListener("click", function () { go(+el.dataset.go); el.blur(); }); });

  // ---- 목차 ----
  var toc = document.getElementById("toc"), tocList = toc.querySelector("ol");
  D.slides.forEach(function (s, i) {
    var li = document.createElement("li");
    li.textContent = (i + 1) + ". " + String(s.toc || s.title).replace(/<[^>]+>/g, " ");
    if (s.type === "menu") li.className = "sec";
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
  function onKey(k, e) {
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
  }
  addEventListener("keydown", function (e) { onKey(e.key, e); });
  var sx = null;
  addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1); sx = null; });
  setInterval(function () { var el = t0 ? Math.round((Date.now() - t0) / 1000) : 0, h = Math.floor(el / 3600), m = Math.floor(el % 3600 / 60); timer.textContent = h + ":" + ("0" + m).slice(-2) + ":" + ("0" + el % 60).slice(-2); }, 1000);

  var start = parseInt((location.hash || "").slice(1), 10); show(isNaN(start) ? 0 : start - 1);
})();
