/* =====================================================================
   lecture-shell.js — غلاف الموقع حول صفحات المحاضرات
   يضيف: الشريط العلوي العام، التنقل (السابق/التالي/العودة للمادة)، روابط التذييل،
   وزر السمة. يقرأ ترتيب الفصول من data/data.js (window.SITE) ويدعم العربية والإنجليزية.
   ===================================================================== */
(function () {
  'use strict';
  var S = window.SITE, root = document.documentElement;
  var L = function () { return root.lang === 'en' ? 'en' : 'ar'; };
  var T = {
    ar: { dept: S.department, sub: S.college + ' · ' + S.university, home: 'الرئيسية', courses: 'المواد', schedule: 'الجدول', course: '', chapter: 'الفصل', prev: 'الفصل السابق', next: 'الفصل التالي', more: 'تابع الدراسة', back: 'العودة إلى صفحة المادة', theme: 'تبديل السمة' },
    en: { dept: 'Department of Artificial Intelligence', sub: 'Faculty of Science and Technology · Saba Region University', home: 'Home', courses: 'Courses', schedule: 'Timetable', course: '', chapter: 'Chapter', prev: 'Previous chapter', next: 'Next chapter', more: 'Keep going', back: 'Back to the course page', theme: 'Toggle theme' }
  };
  var ICON = {
    mark: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><circle cx="16" cy="16" r="3.2"/><circle cx="16" cy="5" r="1.7"/><circle cx="26" cy="11" r="1.5"/><circle cx="26" cy="21.5" r="1.7"/><circle cx="16" cy="27" r="1.5"/><circle cx="6" cy="21.5" r="1.7"/><circle cx="6" cy="11" r="1.5"/><g stroke="currentColor" stroke-width="1" opacity=".5"><path d="M16 16V5M16 16l10-5M16 16l10 5.5M16 16v11M16 16L6 21.5M16 16L6 11"/></g></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z"/></svg>',
    cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2.5"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/></svg>'
  };
  /* المادة تُستنتج من المجلد: courses/<id>/صفحة.html */
  var seg = location.pathname.split('/'), cid = seg[seg.indexOf('courses') + 1];
  var course = S.courses.filter(function (c) { return c.id === cid; })[0] || S.courses.filter(function (c) { return c.id === 'intro-computing'; })[0];
  T.ar.course = course.name; T.en.course = course.nameEn || course.name;
  var here = location.pathname.split('/').pop();
  var idx = course.chapters.map(function (c) { return c.href.split('/').pop(); }).indexOf(here);

  /* الشريط العلوي */
  var top = document.createElement('nav');
  top.className = 'gtop'; top.setAttribute('aria-label', 'Site');
  top.innerHTML = '<a class="gt-brand" href="../../index.html"><span class="gt-mark" id="gtMark">' + ICON.mark + '</span><span class="gt-t"><b data-gk="dept"></b><small data-gk="sub"></small></span></a>' +
    '<div class="gt-nav"><a href="../../index.html" data-gk="home"></a><a href="../../courses.html" data-gk="courses"></a><a href="../../schedule.html" data-gk="schedule"></a></div>' +
    '<button class="gt-theme" type="button" id="gtTheme"><span class="gt-sun">' + ICON.sun + '</span><span class="gt-moon">' + ICON.moon + '</span></button>';
  document.body.insertBefore(top, document.body.firstChild);
  document.getElementById('gtTheme').addEventListener('click', function () {
    var n = root.dataset.theme === 'light' ? 'dark' : 'light'; root.dataset.theme = n; try { localStorage.setItem('theme', n); } catch (e) { }
  });
  if (S.logo) { var im = new Image(); im.alt = ''; im.onload = function () { var m = document.getElementById('gtMark'); m.innerHTML = ''; m.appendChild(im); }; im.src = '../../' + S.logo; }

  /* شعار رأس المحاضرة: أيقونة + اسم المادة بدل «CompuBasics» */
  var bl = document.querySelector('.brand-logo'), bn = document.querySelector('.brand-name');
  if (bl) bl.innerHTML = ICON.cpu;
  if (bn) bn.setAttribute('data-gk', 'course');

  /* التنقل بين الفصول */
  var foot = document.querySelector('.site-footer'), nav = document.createElement('section');
  nav.className = 'lnav'; nav.setAttribute('aria-label', 'Chapters');
  function chapterBlock(ch, dir) {
    var l = L(), label = l === 'ar' ? (ch.label || ch.title) : T.en.chapter + ' ' + ch.n;
    return '<a class="' + dir + '" href="' + ch.href.split('/').pop() + '?lang=' + l + '"><small>' + T[l][dir === 'prev' ? 'prev' : 'next'] + '</small><b>' + (l === 'ar' ? T.ar.chapter + ' ' + ch.n + ' — ' + label : T.en.chapter + ' ' + ch.n) + '</b></a>';
  }
  function renderNav() {
    var l = L(), p = course.chapters[idx - 1], n = course.chapters[idx + 1], h = '<div class="lnav-h"><span data-gk="more"></span></div><div class="lnav-grid">';
    if (idx >= 0) {
      if (n) h += chapterBlock(n, 'next');
      if (p) h += chapterBlock(p, 'prev');
      if (!p || !n) h = h.replace(/class="(next|prev)"/, 'class="$1 solo"');
    }
    h += '</div><div class="back"><a href="../../course.html?c=' + course.id + '" data-gk="back"></a></div>';
    nav.innerHTML = h; apply(nav);
  }
  if (foot) foot.parentNode.insertBefore(nav, foot);

  /* روابط تحت التذييل */
  var gf = document.createElement('div'); gf.className = 'gfoot';
  gf.innerHTML = '<a href="../../index.html" data-gk="home"></a><a href="../../courses.html" data-gk="courses"></a><a href="../../schedule.html" data-gk="schedule"></a>';
  if (foot) foot.parentNode.insertBefore(gf, foot.nextSibling);

  function apply(scope) {
    var l = L(), d = T[l];
    (scope || document).querySelectorAll('[data-gk]').forEach(function (n) { n.textContent = d[n.dataset.gk]; });
  }
  function update() {
    var l = L(); top.dir = l === 'en' ? 'ltr' : 'rtl'; gf.dir = top.dir; nav.dir = top.dir;
    apply(document); renderNav();
    document.getElementById('gtTheme').setAttribute('aria-label', T[l].theme);
    var fc = course.chapters; // تحديث رابط التبديل بين الفصول مع اللغة
  }
  new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['lang'] });
  update();
})();
