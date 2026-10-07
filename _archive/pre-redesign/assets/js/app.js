/* =====================================================================
   app.js — القلب المشترك لكل صفحات الموقع
   يبني الرأس والتذييل وشريط الهاتف ولوحة البحث، ويوفّر دوال البيانات والوقت.
   يعتمد على data/data.js (window.SITE). لا يحتاج أي مكتبة خارجية.
   ===================================================================== */
(function () {
  'use strict';
  var S = window.SITE;

  /* ---------------- أيقونات (خطوط 24px) ---------------- */
  var P = {
    terminal: '<rect x="2.5" y="4" width="19" height="16" rx="3.5"/><path d="M7 9.5l3 2.5-3 2.5M13 15h4"/>',
    pen: '<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z"/><path d="M14 7l3 3"/>',
    atom: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="9.5" ry="3.9"/><ellipse cx="12" cy="12" rx="9.5" ry="3.9" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.9" transform="rotate(120 12 12)"/>',
    sigma: '<path d="M18 5H6.5l6 7-6 7H18"/>',
    aa: '<path d="M2.8 18l4.4-11.5L11.6 18M4.5 14h5.4"/><path d="M14.2 18v-6a2.6 2.6 0 015.2 0v6m-5.2-3h5.2"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2.5"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.6-3.4 3-5 6-5s5.4 1.6 6 5"/><path d="M16 5.6a3.2 3.2 0 010 5.8M18 14.8c1.8.6 2.8 2.2 3.2 4.7"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20.5 20.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z"/>',
    home: '<path d="M3.5 11L12 3.8l8.5 7.2V20a1 1 0 01-1 1H15v-6H9v6H4.5a1 1 0 01-1-1z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 20.5A2.5 2.5 0 006.5 18H20v3H6.5"/>',
    arrow: '<path d="M19 12H5m6-6l-6 6 6 6"/>',
    chev: '<path d="M15 6l-6 6 6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    file: '<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="M10.5 8.5l5 3.5-5 3.5z"/>',
    link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
    download: '<path d="M12 4v11m-5-4.5l5 5 5-5M5 20h14"/>',
    print: '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14h10v6.5H7z"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.7"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>'; }

  /* ---------------- مساعدات ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function norm(s) {
    return String(s || '').toLowerCase().replace(/[ً-ٰٟـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/\s+/g, ' ').trim();
  }

  var courses = S.courses;
  var theoryHues = [160, 178, 196, 144, 210, 126];
  var hueMap = {};
  (function () { var ti = 0; courses.forEach(function (c) { hueMap[c.id] = c.kind === 'عملي' ? 38 : theoryHues[ti++ % theoryHues.length]; }); })();
  function hue(c) { return hueMap[c.id]; }
  function courseById(id) { return courses.filter(function (c) { return c.id === id; })[0]; }
  function dayOf(key) { return S.days.filter(function (d) { return d.key === key; })[0]; }
  function currentSemester() { return S.semesters.filter(function (s) { return s.current; })[0] || S.semesters[0]; }
  function isAvailable(c) { return c.chapters && c.chapters.length > 0; }

  /* 12 ساعة بالعربية: 14 → 2:00 م */
  function fmtH(h) { var s = h % 24 >= 12 ? 'م' : 'ص', x = h % 12 || 12; return { t: x + ':00', s: s }; }
  function fmtRange(a, b) {
    var x = fmtH(a), y = fmtH(b);
    return '<span class="tm">' + (x.s === y.s ? x.t + ' – ' + y.t + ' ' + y.s : x.t + ' ' + x.s + ' – ' + y.t + ' ' + y.s) + '</span>';
  }
  function plural(n, one, two, few, many) { return n === 1 ? one : n === 2 ? two : n <= 10 ? n + ' ' + few : n + ' ' + many; }
  /* مدة بالعربية الفصحى مع المثنى والجمع */
  function dur(mins) {
    mins = Math.max(0, Math.round(mins));
    var d = Math.floor(mins / 1440), h = Math.floor(mins % 1440 / 60), m = mins % 60, out = [];
    if (d) { out.push(plural(d, 'يوم', 'يومين', 'أيام', 'يومًا')); if (d >= 1 && h) out.push(plural(h, 'ساعة', 'ساعتين', 'ساعات', 'ساعة')); }
    else {
      if (h) out.push(plural(h, 'ساعة', 'ساعتين', 'ساعات', 'ساعة'));
      if (m) out.push(plural(m, 'دقيقة', 'دقيقتين', 'دقائق', 'دقيقة'));
    }
    return out.length ? out.join(' و') : 'أقل من دقيقة';
  }

  /* كل الحصص كقائمة مسطّحة مرتبطة بمادتها */
  function allSessions() {
    var out = [];
    courses.forEach(function (c) { c.sessions.forEach(function (s) { out.push({ c: c, s: s, day: dayOf(s.day) }); }); });
    return out;
  }
  /* أقرب حصة (جارية أو قادمة) بالنسبة لوقت الجهاز */
  function nextSession(now) {
    now = now || new Date();
    var cur = now.getDay(), mins = now.getHours() * 60 + now.getMinutes(), list = allSessions();
    for (var off = 0; off < 8; off++) {
      var di = (cur + off) % 7;
      var todays = list.filter(function (x) { return x.day.idx === di; }).sort(function (a, b) { return a.s.start - b.s.start; });
      for (var i = 0; i < todays.length; i++) {
        var x = todays[i], st = x.s.start * 60, en = x.s.end * 60;
        if (off === 0 && mins >= en) continue;
        if (off === 0 && mins >= st) return { x: x, live: true, left: en - mins, progress: (mins - st) / (en - st), off: 0 };
        return { x: x, live: false, until: off * 1440 + st - mins, off: off };
      }
    }
    return null;
  }

  /* ---------------- بطاقة مادة (تُستخدم في أكثر من صفحة) ---------------- */
  function courseCard(c, delay) {
    var avail = isAvailable(c), s0 = c.sessions[0], d0 = s0 && dayOf(s0.day);
    var chips = '<span class="chip ' + (c.kind === 'عملي' ? 'pr' : 'th') + '">' + esc(c.kind) + '</span>';
    return '<a class="cc spot rv' + (avail ? '' : ' soon') + '" style="--h:' + hue(c) + ';--d:' + (delay || 0) + 's" href="course.html?c=' + encodeURIComponent(c.id) + '">' +
      '<div class="cc-top"><span class="cc-ico">' + icon(c.icon) + '</span>' + chips + '</div>' +
      '<h3>' + esc(c.name) + '</h3>' +
      '<div class="cc-who">' + icon('user') + '<span>' + esc(c.instructor) + '</span></div>' +
      '<div class="cc-rows">' +
      (s0 ? '<div>' + icon('clock') + '<span>' + esc(d0.name) + ' · ' + fmtRange(s0.start, s0.end) + '</span></div><div>' + icon('pin') + '<span>' + esc(s0.room) + '</span></div>' : '') +
      '</div>' +
      '<div class="cc-foot">' + (avail
        ? '<span class="chip ok">' + icon('check').replace('<svg', '<svg width="13" height="13"') + plural(c.chapters.length, 'محاضرة واحدة', 'محاضرتان', 'محاضرات', 'محاضرة') + '</span>'
        : '<span class="chip soon">قيد الإضافة</span>') +
      '<span class="go">' + (avail ? 'فتح المادة' : 'التفاصيل') + icon('arrow') + '</span></div></a>';
  }

  /* ---------------- الهيكل المشترك ---------------- */
  var PAGES = [
    { key: 'home', href: 'index.html', label: 'الرئيسية', icon: 'home' },
    { key: 'courses', href: 'courses.html', label: 'المواد', icon: 'book' },
    { key: 'schedule', href: 'schedule.html', label: 'الجدول', icon: 'calendar' }
  ];
  var logoFallback = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><circle cx="16" cy="16" r="3.2"/><circle cx="16" cy="5" r="1.7"/><circle cx="26" cy="11" r="1.5"/><circle cx="26" cy="21.5" r="1.7"/><circle cx="16" cy="27" r="1.5"/><circle cx="6" cy="21.5" r="1.7"/><circle cx="6" cy="11" r="1.5"/><g stroke="currentColor" stroke-width="1" opacity=".5"><path d="M16 16V5M16 16l10-5M16 16l10 5.5M16 16v11M16 16L6 21.5M16 16L6 11"/></g></svg>';

  function build() {
    var page = document.body.dataset.page, nav = PAGES.map(function (p) {
      return '<a href="' + p.href + '"' + (p.key === page ? ' aria-current="page"' : '') + '>' + p.label + '</a>';
    }).join('');
    var head = '<header class="topbar"><div class="wrap">' +
      '<a class="brand" href="index.html" aria-label="' + esc(S.department) + '"><span class="brand-mark" id="brandMark">' + logoFallback + '</span>' +
      '<span class="brand-t"><b>' + esc(S.department) + '</b><small>' + esc(S.college) + ' · ' + esc(S.university) + '</small></span></a>' +
      '<nav class="nav" aria-label="التنقل الرئيسي">' + nav + '</nav>' +
      '<div class="actions"><button class="kbd-search" id="openSearch" type="button" aria-label="بحث">' + icon('search') + '<span>ابحث عن مادة أو محاضرة</span><kbd>Ctrl K</kbd></button>' +
      '<button class="iconbtn" id="themeBtn" type="button" aria-label="تبديل السمة"><span class="theme-ico-sun">' + icon('sun') + '</span><span class="theme-ico-moon">' + icon('moon') + '</span></button></div>' +
      '</div></header>';
    var tabs = '<nav class="tabbar" aria-label="تنقل سريع">' + PAGES.map(function (p) {
      return '<a href="' + p.href + '"' + (p.key === page || (page === 'course' && p.key === 'courses') ? ' aria-current="page"' : '') + '>' + icon(p.icon) + '<span>' + p.label + '</span></a>';
    }).join('') + '<button type="button" id="openSearch2">' + icon('search') + '<span>بحث</span></button></nav>';
    var sem = currentSemester(), off = sem.official;
    var foot = '<footer class="foot"><div class="wrap"><div class="foot-grid">' +
      '<div><h4>ABOUT</h4><p><b>' + esc(S.department) + '</b><br>' + esc(S.college) + ' — ' + esc(S.university) + '. مرجع الطلاب للمواد والمحاضرات والجداول والمصادر.</p></div>' +
      '<div><h4>LINKS</h4><ul><li><a href="index.html">الرئيسية</a></li><li><a href="courses.html">المواد</a></li><li><a href="schedule.html">الجدول الدراسي</a></li></ul></div>' +
      '<div><h4>SEMESTER</h4><ul><li>' + esc(sem.title) + ' ' + esc(sem.year) + ' · ' + esc(sem.level) + '</li><li>' + esc(sem.system) + '</li>' +
      '<li class="mono" style="font-size:12.5px;color:var(--muted)">' + esc(off.version) + ' · <span class="ltr">' + esc(off.exportedAt.split(' ')[0]) + '</span></li></ul></div>' +
      '</div></div></footer>';
    var dlg = '<dialog id="palette" aria-label="بحث"><div class="pal" role="search"><div class="pal-in">' + icon('search') + '<input id="palInput" type="search" autocomplete="off" placeholder="ابحث: مادة، مدرّس، قاعة، محاضرة…" aria-label="بحث"><button class="iconbtn" type="button" id="palClose" aria-label="إغلاق">' + icon('x') + '</button></div>' +
      '<div class="pal-list" id="palList" role="listbox"></div><div class="pal-foot"><span><kbd>↑↓</kbd>تنقّل</span><span><kbd>Enter</kbd>فتح</span><span><kbd>Esc</kbd>إغلاق</span></div></div></dialog>';

    var h = qs('#app-header'), f = qs('#app-footer');
    if (h) h.outerHTML = head; else document.body.insertAdjacentHTML('afterbegin', head);
    if (f) f.outerHTML = foot + tabs + dlg; else document.body.insertAdjacentHTML('beforeend', foot + tabs + dlg);

    /* رمز القسم: <ThinkingOrb state="connecting" size={64} /> من مكتبة thinking-orbs (assets/js/thinking-orb.js)؛ يبقى الرمز البديل إن لم يُحمَّل */
    if (window.ThinkingOrb) {
      var bm = qs('#brandMark'); bm.innerHTML = ''; bm.classList.add('has-orb');
      window.ThinkingOrb.mount(bm, { state: 'connecting', size: 64, displaySize: 44, label: S.department });
    }
    /* الشعار: يُحمَّل من S.logo إن وُجد الملف، وإلا يبقى الرمز البديل */
    if (S.logo) {
      var im = new Image(); im.alt = 'شعار ' + S.university;
      im.onload = function () { var m = qs('#brandMark'); m.innerHTML = ''; m.appendChild(im); };
      im.src = S.logo;
    }
  }

  /* ---------------- السمة ---------------- */
  function theme() {
    var root = document.documentElement;
    qs('#themeBtn').addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next; try { localStorage.setItem('theme', next); } catch (e) { }
    });
  }

  /* ---------------- لوحة البحث ---------------- */
  function search() {
    var dlg = qs('#palette'), input = qs('#palInput'), list = qs('#palList'), sel = 0, items = [];
    var index = [
      { g: 'صفحات', t: 'الجدول الدراسي', s: 'الأسبوع كاملًا · مواعيد · قاعات', href: 'schedule.html', i: 'calendar', k: 'جدول مواعيد اسبوع' },
      { g: 'صفحات', t: 'كل المواد', s: S.courses.length + ' مواد في الفصل الحالي', href: 'courses.html', i: 'book', k: 'مواد مقررات' }
    ];
    courses.forEach(function (c) {
      var d = c.sessions[0] && dayOf(c.sessions[0].day);
      index.push({ g: 'المواد', t: c.name, s: c.instructor + (c.sessions[0] ? ' · ' + d.name + ' · ' + c.sessions[0].room : ''), href: 'course.html?c=' + c.id, i: c.icon, k: [c.name, c.instructor, c.kind, c.group, d && d.name, c.sessions[0] && c.sessions[0].room].join(' ') });
      (c.chapters || []).forEach(function (ch) {
        index.push({ g: 'المحاضرات', t: ch.label ? 'الفصل ' + ch.n + ' — ' + ch.label : ch.title, s: c.name + ' · ' + ch.title, href: ch.href, i: 'file', k: [ch.title, ch.label, c.name].concat(ch.topics || []).join(' ') });
      });
    });
    index.forEach(function (x) { x.n = norm(x.k + ' ' + x.t); });

    function render() {
      var q = norm(input.value), words = q.split(' ').filter(Boolean);
      items = index.filter(function (x) { return !words.length ? x.g !== 'المحاضرات' : words.every(function (w) { return x.n.indexOf(w) !== -1; }); }).slice(0, 14);
      sel = 0;
      if (!items.length) { list.innerHTML = '<div class="pal-empty">لا نتائج لـ «' + esc(input.value) + '»</div>'; return; }
      var html = '', g = '';
      items.forEach(function (x, i) {
        if (x.g !== g) { g = x.g; html += '<div class="pal-grp">' + g + '</div>'; }
        html += '<a class="pal-it" role="option" href="' + esc(x.href) + '" data-i="' + i + '" aria-selected="' + (i === 0) + '">' + icon(x.i) + '<div><b>' + esc(x.t) + '</b><small>' + esc(x.s) + '</small></div></a>';
      });
      list.innerHTML = html;
    }
    function mark(n) {
      sel = (n + items.length) % items.length;
      qsa('.pal-it', list).forEach(function (a) { a.setAttribute('aria-selected', +a.dataset.i === sel); });
      var cur = qs('.pal-it[aria-selected=true]', list); if (cur) cur.scrollIntoView({ block: 'nearest' });
    }
    function open() { if (dlg.open) return; dlg.showModal(); input.value = ''; render(); setTimeout(function () { input.focus(); }, 30); }
    ['openSearch', 'openSearch2'].forEach(function (id) { var b = qs('#' + id); if (b) b.addEventListener('click', open); });
    qs('#palClose').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); mark(sel + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); mark(sel - 1); }
      else if (e.key === 'Enter' && items[sel]) { location.href = items[sel].href; }
    });
    addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); open(); }
      else if (e.key === '/' && tag !== 'input' && tag !== 'textarea') { e.preventDefault(); open(); }
    });
  }

  /* ---------------- ظهور تدريجي + توهّج البطاقات ---------------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 }) : null;
  /* يُستدعى من الصفحات بعد حقن عناصر .rv ديناميكيًا */
  function reveal(root) {
    qsa('.rv:not(.in)', root).forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });
  }
  function fx() {
    reveal(document);
    document.addEventListener('pointermove', function (e) {
      var t = e.target.closest && e.target.closest('.spot'); if (!t) return;
      var r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------------- تشغيل ---------------- */
  build(); theme(); search(); fx();
  window.App = { S: S, icon: icon, esc: esc, qs: qs, qsa: qsa, norm: norm, courses: courses, hue: hue, courseById: courseById, dayOf: dayOf, currentSemester: currentSemester, isAvailable: isAvailable, fmtRange: fmtRange, fmtH: fmtH, plural: plural, dur: dur, allSessions: allSessions, nextSession: nextSession, courseCard: courseCard, reveal: reveal };
  document.dispatchEvent(new Event('app:ready'));
})();
