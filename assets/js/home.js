/* الصفحة الرئيسية: المحاضرة القادمة، المحاضرات المتاحة، المواد، الأسبوع */
(function () {
  'use strict';
  var A = window.App, S = A.S, $ = A.qs, icon = A.icon, esc = A.esc;

  $('#ctaIco').innerHTML = icon('arrow');
  $('#moreWeek').insertAdjacentHTML('beforeend', icon('arrow'));
  $('#moreCourses').insertAdjacentHTML('beforeend', icon('arrow'));

  /* ---- بطاقة المحاضرة القادمة ---- */
  var nextEl = $('#next');
  function renderNext() {
    var n = A.nextSession(new Date());
    if (!n) { nextEl.innerHTML = '<div class="next-top"><span class="next-state later">لا توجد محاضرات مجدولة</span></div>'; return; }
    var c = n.x.c, s = n.x.s, d = n.x.day;
    var when = n.live ? '' : n.off === 0 ? 'اليوم' : n.off === 1 ? 'غدًا' : d.name;
    var state = n.live
      ? '<span class="next-state"><span class="dot live"></span>جارية الآن</span>'
      : '<span class="next-state later"><span class="dot"></span>المحاضرة القادمة · ' + when + '</span>';
    var count = n.live
      ? 'تنتهي بعد <b>' + A.dur(n.left) + '</b>'
      : 'تبدأ بعد <b>' + A.dur(n.until) + '</b>';
    nextEl.innerHTML =
      '<div class="next-top">' + state + '<span class="chip ' + (c.kind === 'عملي' ? 'pr' : 'th') + '">' + esc(c.kind) + '</span></div>' +
      '<h3>' + esc(c.name) + '</h3><p class="who">' + esc(c.instructor) + '</p>' +
      '<div class="next-meta"><div class="meta-i">' + icon('clock') + '<span>' + esc(d.name) + ' · ' + A.fmtRange(s.start, s.end) + '</span></div>' +
      '<div class="meta-i">' + icon('pin') + '<span>' + esc(s.room) + '</span></div></div>' +
      '<div class="count"><span>' + count + '</span><a class="more" href="course.html?c=' + esc(c.id) + '">المادة ' + icon('arrow') + '</a></div>' +
      (n.live ? '<div class="bar"><i style="width:' + Math.round(n.progress * 100) + '%"></i></div>' : '');
  }
  renderNext(); setInterval(renderNext, 30000);

  /* ---- الأسبوع ---- */
  var today = new Date().getDay(), sessions = A.allSessions();
  $('#weekGrid').innerHTML = S.days.map(function (d, i) {
    var list = sessions.filter(function (x) { return x.day.key === d.key; }).sort(function (a, b) { return a.s.start - b.s.start; });
    var body = list.length ? list.map(function (x) {
      return '<a class="mini" style="--h:' + A.hue(x.c) + '" href="course.html?c=' + esc(x.c.id) + '"><b>' + esc(x.c.name) + '</b><span>' + A.fmtRange(x.s.start, x.s.end) + '</span><em>' + esc(x.s.room) + '</em></a>';
    }).join('') : '<span class="day-empty">لا محاضرات</span>';
    return '<div class="day rv' + (d.idx === today ? ' today' : '') + (list.length ? '' : ' off') + '" style="--d:' + (i * .05) + 's"><div class="day-h"><span>' + d.name + '</span>' + (d.idx === today ? '<small>TODAY</small>' : '') + '</div>' + body + '</div>';
  }).join('');

  /* ---- المواد ---- */
  $('#cardGrid').innerHTML = A.courses.map(function (c, i) { return A.courseCard(c, (i % 3) * .07); }).join('');

  /* ---- المحاضرات المتاحة ---- */
  var rows = [];
  A.courses.forEach(function (c) { c.chapters.forEach(function (ch) { rows.push({ c: c, ch: ch }); }); });
  $('#lecList').innerHTML = rows.length ? rows.map(function (r, i) {
    var ch = r.ch;
    return '<a class="lrow spot rv" style="--d:' + (i * .07) + 's" href="' + esc(ch.href) + '"><div class="lnum"><small>CH</small>' + String(ch.n).padStart(2, '0') + '</div>' +
      '<div><span class="sub">' + esc(r.c.name) + (ch.label ? ' · ' + esc(ch.label) : '') + '</span><h3>' + esc(ch.title) + '</h3>' +
      (ch.topics && ch.topics.length ? '<div class="topics">' + ch.topics.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
      '</div><span class="arrow">' + icon('arrow') + '</span></a>';
  }).join('') : '<div class="pending"><div><h3>قيد الإضافة</h3><p>لم تُرفع محاضرات بعد.</p></div></div>';

  A.reveal(document);
  Orb.mount($('#orb'), { mode: 'globe', size: 'large', interactive: true });
})();
