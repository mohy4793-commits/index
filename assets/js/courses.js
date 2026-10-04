/* صفحة المواد: بحث + تصفية بالنوع والحالة. تُقرأ المواد من data/data.js */
(function () {
  'use strict';
  var A = window.App, $ = A.qs, sem = A.currentSemester(), st = { q: '', k: '', s: '' };
  $('#cr1').innerHTML = A.icon('chev');
  $('#sIco').innerHTML = A.icon('search');
  $('#lead').textContent = sem.level + ' — ' + sem.title + ' ' + sem.year + ' · ' + sem.program + '.';

  var hay = {};
  A.courses.forEach(function (c) {
    var s = c.sessions[0], d = s && A.dayOf(s.day);
    hay[c.id] = A.norm([c.name, c.instructor, c.kind, c.group, d && d.name, s && s.room].join(' '));
  });

  function render() {
    var words = A.norm(st.q).split(' ').filter(Boolean);
    var list = A.courses.filter(function (c) {
      if (st.k && c.kind !== st.k) return false;
      if (st.s === 'a' && !A.isAvailable(c)) return false;
      if (st.s === 'p' && A.isAvailable(c)) return false;
      return words.every(function (w) { return hay[c.id].indexOf(w) !== -1; });
    });
    $('#grid').innerHTML = list.map(function (c, i) { return A.courseCard(c, (i % 3) * .06); }).join('');
    $('#empty').hidden = list.length > 0;
    A.reveal(document);
  }
  function seg(id, key) {
    $(id).addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      st[key] = b.dataset[key]; A.qsa('button', $(id)).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); render();
    });
  }
  seg('#kindSeg', 'k'); seg('#stSeg', 's');
  $('#q').addEventListener('input', function (e) { st.q = e.target.value; render(); });
  render();
})();
