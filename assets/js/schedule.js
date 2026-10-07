/* الجدول الدراسي التفاعلي: شبكة أسبوعية + قائمة، تصفية، تفاصيل، تصدير .ics */
(function () {
  'use strict';
  var A = window.App, S = A.S, $ = A.qs, $$ = A.qsa, icon = A.icon, esc = A.esc;
  var sem = A.currentSemester(), off = sem.official;
  var state = { view: matchMedia('(max-width:820px)').matches ? 'list' : 'grid', kind: '' };
  var sessions = A.allSessions();

  $('#cr1').innerHTML = icon('chev');
  $('#lead').textContent = 'مواعيد المحاضرات والقاعات والمدرّسين لـ' + sem.level + ' — ' + sem.title + ' ' + sem.year + '. اضغط على أي محاضرة لعرض تفاصيلها.';
  $('#meta').innerHTML = [['البرنامج', sem.program], ['المستوى', sem.level], ['الفصل الدراسي', sem.title + ' ' + sem.year], ['النظام الدراسي', sem.system]]
    .map(function (m) { return '<div><small>' + m[0] + '</small><b>' + esc(m[1]) + '</b></div>'; }).join('');
  $('#vGrid').innerHTML = icon('grid') + 'الأسبوع';
  $('#vList').innerHTML = icon('list') + 'القائمة';
  $('#btnIcs').innerHTML = icon('calendar') + 'إضافة للتقويم';
  $('#btnImg').innerHTML = icon('image') + 'الجدول الرسمي';
  $('#btnPrint').innerHTML = icon('print') + 'طباعة';
  $('#imgClose').innerHTML = icon('x');
  $('#official').innerHTML = '<div class="note"><span><b>' + esc(off.title) + '</b> · ' + esc(off.status) + ' · ' + esc(off.part) + '</span>' +
    '<span class="mono">' + esc(off.version) + ' · تاريخ التصدير: <span class="ltr">' + esc(off.exportedAt) + '</span></span>' +
    '<span class="sm">اكتمال التغطية وفق الجدول الرسمي: ' + esc(off.coverage) + '</span></div>';

  /* ---------- نطاق الساعات ---------- */
  var minH = Math.min.apply(null, sessions.map(function (x) { return x.s.start; }));
  var maxH = Math.max.apply(null, sessions.map(function (x) { return x.s.end; }));
  var today = new Date().getDay();
  function match(x) { return !state.kind || x.c.kind === state.kind; }

  /* ---------- عرض الشبكة ---------- */
  function gridHTML() {
    var rows = maxH - minH, h = '<div class="tt"><div class="tt-scroll"><div class="tt-grid">';
    h += '<div class="tt-corner"></div>';
    S.days.forEach(function (d) { h += '<div class="tt-dayh' + (d.idx === today ? ' today' : '') + '">' + d.name + '<small lang="en" aria-hidden="true">' + (d.idx === today ? 'TODAY' : d.key.toUpperCase()) + '</small></div>'; });
    h += '<div class="tt-times" style="grid-template-rows:repeat(' + rows + ',var(--hh))">';
    for (var t = minH; t < maxH; t++) { var f = A.fmtH(t); h += '<span>' + f.t + ' ' + f.s + '</span>'; }
    h += '</div>';
    S.days.forEach(function (d) {
      var list = sessions.filter(function (x) { return x.day.key === d.key; });
      h += '<div class="tt-col' + (d.idx === today ? ' today' : '') + (list.length ? '' : ' off') + '" data-day="' + d.idx + '" style="height:calc(var(--hh)*' + rows + ')">';
      list.forEach(function (x) {
        h += '<button class="blk' + (match(x) ? '' : ' dim') + '" ' + (match(x) ? '' : 'inert aria-hidden="true" ') + 'type="button" data-c="' + esc(x.c.id) + '" data-d="' + d.key + '" style="--h:' + A.hue(x.c) + ';top:calc(var(--hh)*' + (x.s.start - minH) + ' + 2px);height:calc(var(--hh)*' + (x.s.end - x.s.start) + ' - 4px)">' +
          '<b>' + esc(x.c.name) + '</b><span class="t">' + A.fmtRange(x.s.start, x.s.end) + '</span><span class="r">' + icon('pin') + esc(x.s.room) + '</span></button>';
      });
      h += '</div>';
    });
    return h + '</div></div></div>';
  }

  /* ---------- عرض القائمة ---------- */
  function listHTML() {
    var empties = [];
    var html = S.days.map(function (d) {
      var list = sessions.filter(function (x) { return x.day.key === d.key; }).sort(function (a, b) { return a.s.start - b.s.start; });
      var isToday = d.idx === today;
      if (!list.length && !isToday) { empties.push(d.name); return ''; }
      var vis = list.filter(match);
      var body = list.length ? list.map(function (x) {
        var f = A.fmtH(x.s.start), g = A.fmtH(x.s.end);
        return '<button class="ag-item' + (match(x) ? '' : ' dim') + '" ' + (match(x) ? '' : 'inert aria-hidden="true" ') + 'type="button" style="--h:' + A.hue(x.c) + '" data-c="' + esc(x.c.id) + '" data-d="' + d.key + '">' +
          '<span class="ag-t"><b>' + f.t + ' ' + f.s + '</b>حتى ' + g.t + ' ' + g.s + '</span>' +
          '<span><span class="ag-name">' + esc(x.c.name) + '</span><span class="ag-meta"><span>' + icon('user') + esc(x.c.instructor) + '</span><span>' + icon('pin') + esc(x.s.room) + '</span></span></span>' +
          '<span class="chip ' + (x.c.kind === 'عملي' ? 'pr' : 'th') + '">' + esc(x.c.kind) + '</span></button>';
      }).join('') : '<div class="ag-empty">لا توجد محاضرات اليوم.</div>';
      if (list.length && !vis.length) body += '<div class="ag-empty">لا محاضرات من هذا النوع في هذا اليوم.</div>';
      return '<section class="ag-day' + (isToday ? ' today' : '') + '"><h3>' + d.name + (isToday ? ' <span class="chip ok">اليوم</span>' : '') + '</h3>' + body + '</section>';
    }).join('');
    if (empties.length) html += '<p class="ag-empty">لا توجد محاضرات أيام: ' + empties.join('، ') + '.</p>';
    return '<div class="agenda">' + html + '</div>';
  }

  /* ---------- خط «الآن» وتمييز المحاضرة الجارية ---------- */
  function nowMarks() {
    $$('.nowline').forEach(function (n) { n.remove(); });
    $$('.blk.now').forEach(function (n) { n.classList.remove('now'); });
    var d = new Date(), h = d.getHours() + d.getMinutes() / 60;
    var col = $('.tt-col[data-day="' + d.getDay() + '"]');
    if (!col || h < minH || h > maxH) return;
    var line = document.createElement('div'); line.className = 'nowline';
    line.style.top = 'calc(var(--hh)*' + (h - minH).toFixed(3) + ')';
    line.innerHTML = '<span>' + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0') + '</span>';
    col.appendChild(line);
    sessions.forEach(function (x) {
      if (x.day.idx === d.getDay() && h >= x.s.start && h < x.s.end) { var b = $('.blk[data-c="' + x.c.id + '"][data-d="' + x.day.key + '"]'); if (b) b.classList.add('now'); }
    });
  }

  function render() {
    $('#view').innerHTML = state.view === 'grid' ? gridHTML() : listHTML();
    $$('#viewSeg button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === state.view); });
    $$('#kindSeg button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.k === state.kind); });
    if (state.view === 'grid') nowMarks();
  }

  /* ---------- التفاصيل ---------- */
  var dlg = $('#detail'), sheet = $('#sheet');
  function openDetail(cid, dkey) {
    var c = A.courseById(cid), s = c.sessions.filter(function (z) { return z.day === dkey; })[0], d = A.dayOf(dkey);
    sheet.innerHTML = '<button class="iconbtn x" type="button" id="dClose" aria-label="إغلاق">' + icon('x') + '</button>' +
      '<span class="chip ' + (c.kind === 'عملي' ? 'pr' : 'th') + '">' + esc(c.kind) + '</span>' +
      '<h3>' + esc(c.name) + '</h3><p class="who">' + esc(c.instructor) + '</p>' +
      '<dl><div><dt>اليوم</dt><dd>' + d.name + '</dd></div><div><dt>الوقت</dt><dd>' + A.fmtRange(s.start, s.end) + '</dd></div>' +
      '<div><dt>القاعة</dt><dd>' + esc(s.room) + '</dd></div><div><dt>المجموعة</dt><dd>' + esc(c.group) + '</dd></div></dl>' +
      '<div class="row"><a class="btn btn-primary btn-sm" href="course.html?c=' + esc(c.id) + '">صفحة المادة ' + icon('arrow') + '</a>' +
      (A.isAvailable(c) ? '<span class="chip ok">' + A.plural(c.chapters.length, 'محاضرة واحدة متاحة', 'محاضرتان متاحتان', 'محاضرات متاحة', 'محاضرة متاحة') + '</span>' : '<span class="chip soon">المحتوى قيد الإضافة</span>') + '</div>';
    dlg.showModal();
    $('#dClose').addEventListener('click', function () { dlg.close(); });
  }
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  $('#view').addEventListener('click', function (e) {
    var b = e.target.closest('[data-c]'); if (b) openDetail(b.dataset.c, b.dataset.d);
  });

  /* ---------- أزرار التحكم ---------- */
  $('#viewSeg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { state.view = b.dataset.v; render(); } });
  $('#kindSeg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { state.kind = b.dataset.k; render(); } });
  $('#btnPrint').addEventListener('click', function () { window.print(); });
  var imgDlg = $('#imgDlg');
  $('#btnImg').addEventListener('click', function () { $('#officialImg').src = off.image; imgDlg.showModal(); });
  $('#imgClose').addEventListener('click', function () { imgDlg.close(); });
  imgDlg.addEventListener('click', function (e) { if (e.target === imgDlg) imgDlg.close(); });

  /* ---------- تصدير iCalendar (تكرار أسبوعي، توقيت عدن UTC+3) ---------- */
  var BYDAY = { 0: 'SU', 1: 'MO', 2: 'TU', 3: 'WE', 4: 'TH', 5: 'FR', 6: 'SA' };
  function ics() {
    var pad = function (n) { return String(n).padStart(2, '0'); }, now = new Date();
    var stamp = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate()) + 'T' + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + '00Z';
    var esc2 = function (s) { return String(s).replace(/([,;\\])/g, '\\$1'); };
    var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AI Department//Timetable//AR', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:' + esc2('جدول ' + S.department),
      'BEGIN:VTIMEZONE', 'TZID:Asia/Aden', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0300', 'TZOFFSETTO:+0300', 'TZNAME:AST', 'END:STANDARD', 'END:VTIMEZONE'];
    sessions.forEach(function (x, i) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      while (d.getDay() !== x.day.idx) d.setDate(d.getDate() + 1);
      var ds = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
      L.push('BEGIN:VEVENT', 'UID:' + x.c.id + '-' + x.day.key + '-' + i + '@ai-dept', 'DTSTAMP:' + stamp,
        'DTSTART;TZID=Asia/Aden:' + ds + 'T' + pad(x.s.start) + '0000', 'DTEND;TZID=Asia/Aden:' + ds + 'T' + pad(x.s.end) + '0000',
        'RRULE:FREQ=WEEKLY;BYDAY=' + BYDAY[x.day.idx], 'SUMMARY:' + esc2(x.c.name), 'LOCATION:' + esc2(x.s.room),
        'DESCRIPTION:' + esc2(x.c.instructor + ' — ' + x.c.kind + ' — ' + x.c.group), 'END:VEVENT');
    });
    L.push('END:VCALENDAR');
    var blob = new Blob([L.join('\r\n')], { type: 'text/calendar;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'ai-department-timetable.ics'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  $('#btnIcs').addEventListener('click', ics);

  render(); setInterval(function () { if (state.view === 'grid') nowMarks(); }, 60000);
})();
