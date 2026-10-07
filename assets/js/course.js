/* صفحة المادة: course.html?c=<id> — المحاضرات، المواعيد، المصادر، التنقل بين المواد */
(function () {
  'use strict';
  var A = window.App, $ = A.qs, icon = A.icon, esc = A.esc, sem = A.currentSemester();
  var id = new URLSearchParams(location.search).get('c'), c = A.courseById(id), main = $('#main');

  if (!c) {
    document.title = 'مادة غير موجودة — ' + A.S.department;
    main.innerHTML = '<div class="wrap phead"><div class="empty"><h1>لم نجد هذه المادة</h1><p>الرابط غير صحيح أو أن المادة لم تُضف بعد.</p><a class="btn btn-primary" href="courses.html">كل المواد ' + icon('arrow') + '</a></div></div>';
    return;
  }
  document.title = c.name + ' — ' + A.S.department;
  var avail = A.isAvailable(c), i = A.courses.indexOf(c);
  var prev = A.courses[(i - 1 + A.courses.length) % A.courses.length], next = A.courses[(i + 1) % A.courses.length];

  var lectures = avail ? '<div class="lec">' + c.chapters.map(function (ch, k) {
    var ic = { page: 'file', pdf: 'file', video: 'play', link: 'link' }[ch.kind] || 'file';
    return '<a class="lrow spot rv" style="--d:' + (k * .07) + 's" href="' + esc(ch.href) + '"' + (/^https?:/.test(ch.href) ? ' target="_blank" rel="noopener"' : '') + '><div class="lnum"><small lang="en" aria-hidden="true">CH</small>' + String(ch.n).padStart(2, '0') + '</div>' +
      '<div>' + (ch.label ? '<span class="sub">' + esc(ch.label) + '</span>' : '') + '<h3>' + esc(ch.title) + '</h3>' +
      (ch.topics && ch.topics.length ? '<div class="topics">' + ch.topics.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
      '</div><span class="arrow">' + icon(ic === 'file' ? 'arrow' : ic) + '</span></a>';
  }).join('') + '</div>'
    : '<div class="pending"><canvas id="pendOrb" aria-hidden="true"></canvas><div><h3>المحاضرات قيد الإضافة</h3><p>لم تُرفع محاضرات هذه المادة بعد. ستظهر هنا فور إضافتها.</p></div></div>';

  var res = c.resources && c.resources.length
    ? '<div class="res">' + c.resources.map(function (r) {
      var ic = { pdf: 'file', video: 'play', link: 'link' }[r.kind] || 'link';
      return '<a href="' + esc(r.href) + '" target="_blank" rel="noopener">' + icon(ic) + '<span>' + esc(r.title) + '<span class="sr-only"> (يفتح في نافذة جديدة)</span></span></a>';
    }).join('') + '</div>'
    : '<p class="muted-p">لا توجد مصادر مضافة بعد.</p>';

  var times = c.sessions.map(function (s) {
    var d = A.dayOf(s.day);
    return '<div>' + icon('clock') + '<span><small>' + d.name + '</small><b>' + A.fmtRange(s.start, s.end) + '</b></span></div>' +
      '<div>' + icon('pin') + '<span><small>القاعة</small><b>' + esc(s.room) + '</b></span></div>';
  }).join('');

  main.innerHTML =
    '<div class="wrap phead">' +
    '<nav class="crumbs" aria-label="مسار التنقل"><a href="index.html">الرئيسية</a>' + icon('chev') + '<a href="courses.html">المواد</a>' + icon('chev') + '<span>' + esc(c.name) + '</span></nav>' +
    '<div class="chips-row"><span class="chip ' + (c.kind === 'عملي' ? 'pr' : 'th') + '">' + esc(c.kind) + '</span>' +
    (avail ? '<span class="chip ok">' + A.plural(c.chapters.length, 'محاضرة واحدة', 'محاضرتان', 'محاضرات', 'محاضرة') + '</span>' : '<span class="chip soon">قيد الإضافة</span>') + '</div>' +
    '<h1>' + esc(c.name) + '</h1><p class="lead">' + esc(c.instructor) + ' · ' + esc(sem.title) + ' ' + esc(sem.year) + '</p>' +
    '<div class="pmeta">' + c.sessions.map(function (s) { return '<div class="meta-i">' + icon('clock') + '<span>' + A.dayOf(s.day).name + ' · ' + A.fmtRange(s.start, s.end) + '</span></div><div class="meta-i">' + icon('pin') + '<span>' + esc(s.room) + '</span></div>'; }).join('') + '</div></div>' +
    '<div class="wrap"><div class="cgrid"><div class="col-stack" data-stagger>' +
    '<section class="panel"><h2>المحاضرات</h2>' + lectures + '</section>' +
    '<section class="panel"><h2>المصادر والملفات</h2>' + res + '</section></div>' +
    '<aside class="side"><div class="panel"><h2>معلومات المادة</h2><div class="kv">' +
    '<div>' + icon('user') + '<span><small>المحاضر</small><b>' + esc(c.instructor) + '</b></span></div>' + times +
    '<div>' + icon('users') + '<span><small>المجموعة</small><b>' + esc(c.group) + '</b></span></div>' +
    '<div>' + icon('book') + '<span><small>المستوى</small><b>' + esc(sem.level) + ' · ' + esc(sem.title) + '</b></span></div></div></div>' +
    '<a class="btn btn-ghost" href="schedule.html">عرض في الجدول الدراسي ' + icon('calendar') + '</a></aside></div>' +
    '<nav class="cnav" aria-label="المواد الأخرى"><a href="course.html?c=' + esc(next.id) + '"><small>المادة التالية</small><b>' + esc(next.name) + '</b></a>' +
    '<a href="course.html?c=' + esc(prev.id) + '"><small>المادة السابقة</small><b>' + esc(prev.name) + '</b></a></nav></div>';

  A.reveal(document);
  var po = $('#pendOrb'); if (po) Orb.mount(po, { mode: 'wave', size: 'small' });
})();
