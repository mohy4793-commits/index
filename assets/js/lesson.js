/* =====================================================================
   lesson.js — الأدوات التفاعلية لصفحات المحاضرات المبسّطة
   كل أداة تُفعَّل من خاصية data-widget على العنصر: conv | polar | xy | add | scale
   ===================================================================== */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var RAD = Math.PI / 180;
  function fx(n, d) { var v = Math.abs(n) < 5e-10 ? 0 : n; var s = v.toFixed(d == null ? 2 : d); return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s; }

  /* رسّام SVG بإحداثيات رياضية (y للأعلى) */
  function Plot(host, x0, x1, y0, y1, k, step) {
    var W = (x1 - x0) * k, H = (y1 - y0) * k, uid = 'm' + Math.random().toString(36).slice(2, 7);
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('role', 'img');
    host.innerHTML = ''; host.appendChild(svg);
    var sx = function (x) { return (x - x0) * k; }, sy = function (y) { return (y1 - y) * k; };
    var h = '<defs>' + ['a1', 'a2', 'a3'].map(function (c) { return '<marker id="' + uid + c + '" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto"><path class="' + c + '" d="M0,0L10,5L0,10z"/></marker>'; }).join('') + '</defs>';
    for (var gx = Math.ceil(x0 / step) * step; gx <= x1; gx += step) h += '<line class="gr" x1="' + sx(gx) + '" y1="0" x2="' + sx(gx) + '" y2="' + H + '"/>';
    for (var gy = Math.ceil(y0 / step) * step; gy <= y1; gy += step) h += '<line class="gr" x1="0" y1="' + sy(gy) + '" x2="' + W + '" y2="' + sy(gy) + '"/>';
    h += '<line class="ax" x1="0" y1="' + sy(0) + '" x2="' + W + '" y2="' + sy(0) + '"/><line class="ax" x1="' + sx(0) + '" y1="0" x2="' + sx(0) + '" y2="' + H + '"/>';
    h += '<text class="tk" x="' + (W - 12) + '" y="' + (sy(0) - 5) + '">x</text><text class="tk" x="' + (sx(0) + 6) + '" y="11">y</text>';
    var self = { svg: svg, base: h, parts: [] };
    self.arrow = function (ax, ay, bx, by, cls, label, lx, ly) {
      var s = '<line class="ln ' + cls + '" x1="' + sx(ax) + '" y1="' + sy(ay) + '" x2="' + sx(bx) + '" y2="' + sy(by) + '" marker-end="url(#' + uid + cls + ')"/>';
      if (label) s += '<text class="lb ' + cls + '" x="' + sx(lx == null ? bx : lx) + '" y="' + sy(ly == null ? by : ly) + '">' + label + '</text>';
      self.parts.push(s);
    };
    self.dash = function (ax, ay, bx, by, cls) { self.parts.push('<line class="dash ' + cls + '" x1="' + sx(ax) + '" y1="' + sy(ay) + '" x2="' + sx(bx) + '" y2="' + sy(by) + '"/>'); };
    self.text = function (x, y, t, cls) { self.parts.push('<text class="lb ' + (cls || 'a3') + '" x="' + sx(x) + '" y="' + sy(y) + '">' + t + '</text>'); };
    self.arc = function (r, a0, a1) {
      var p0 = [sx(r * Math.cos(a0 * RAD)), sy(r * Math.sin(a0 * RAD))], p1 = [sx(r * Math.cos(a1 * RAD)), sy(r * Math.sin(a1 * RAD))];
      var large = Math.abs(a1 - a0) > 180 ? 1 : 0;
      self.parts.push('<path class="arc" d="M' + p0[0] + ',' + p0[1] + ' A' + r * k + ',' + r * k + ' 0 ' + large + ' 0 ' + p1[0] + ',' + p1[1] + '"/>');
    };
    self.ticks = function (vals) { vals.forEach(function (v) { self.parts.push('<text class="tk" x="' + (sx(v) - 5) + '" y="' + (sy(0) + 13) + '">' + v + '</text>'); if (v) self.parts.push('<text class="tk" x="' + (sx(0) + 4) + '" y="' + (sy(v) + 4) + '">' + v + '</text>'); }); };
    self.flush = function () { svg.innerHTML = h + self.parts.join(''); self.parts = []; };
    return self;
  }
  function quadrant(x, y) {
    if (x === 0 && y === 0) return 'نقطة الأصل';
    if (x > 0 && y >= 0) return 'الربع الأول ' + M('(x+ , y+)');
    if (x <= 0 && y > 0) return 'الربع الثاني ' + M('(x− , y+)');
    if (x < 0 && y <= 0) return 'الربع الثالث ' + M('(x− , y−)');
    return 'الربع الرابع ' + M('(x+ , y−)');
  }
  function angleFrom(x, y) { var a = Math.atan2(y, x) / RAD; return a < 0 ? a + 360 : a; }

  function M(t) { return '<bdi dir="ltr">' + t + '</bdi>'; }
  function lines(arr) { return arr.map(function (l) { return typeof l === 'string' ? '<div dir="ltr">' + l + '</div>' : '<div>' + l[0] + '</div>'; }).join(''); }
  /* ---------- 1) محوّل الوحدات (المحاضرة 1) ---------- */
  var PRE = [['E', 'إكسا', 18], ['P', 'بيتا', 15], ['T', 'تيرا', 12], ['G', 'غيغا', 9], ['M', 'ميغا', 6], ['k', 'كيلو', 3], ['', 'بلا بادئة', 0], ['m', 'ميلي', -3], ['μ', 'مايكرو', -6], ['n', 'نانو', -9], ['p', 'بيكو', -12], ['f', 'فيمتو', -15]];
  function sci(n) {
    if (n === 0) return '0';
    var e = Math.floor(Math.log10(Math.abs(n))), m = n / Math.pow(10, e);
    if (e >= -3 && e <= 6) { var s = Number(n.toPrecision(10)).toString(); return s.indexOf('e') >= 0 ? m.toPrecision(6).replace(/\.?0+$/, '') + ' × 10^' + e : s; }
    return Number(m.toPrecision(8)).toString() + ' × 10^' + e;
  }
  function conv(root) {
    var v = $('[data-r=val]', root), a = $('[data-r=from]', root), b = $('[data-r=to]', root), u = $('[data-r=unit]', root), o = $('[data-r=out]', root);
    var opts = PRE.map(function (p, i) { return '<option value="' + i + '">' + (p[0] || '—') + (p[0] ? ' · ' + p[1] : ' · ' + p[1]) + '</option>'; }).join('');
    a.innerHTML = opts; b.innerHTML = opts; a.value = 5; b.value = 6; v.value = 2.5; u.value = 'm';
    function go() {
      var x = parseFloat(v.value), pa = PRE[a.value], pb = PRE[b.value], un = u.value;
      if (isNaN(x)) { o.textContent = 'اكتب رقمًا'; return; }
      var ex = pa[2] - pb[2], res = x * Math.pow(10, ex);
      o.innerHTML = lines([fx(x, 6) + ' ' + pa[0] + un + ' × (10^' + pa[2] + ' ' + un + ' / 10^' + pb[2] + ' ' + pb[0] + un + ')', '= ' + fx(x, 6) + ' × 10^' + ex + ' ' + pb[0] + un, '<span class="r">= ' + sci(res) + ' ' + pb[0] + un + '</span>']);
    }
    [v, a, b, u].forEach(function (e) { e.addEventListener('input', go); });
    go();
  }

  /* ---------- 2) من المقدار والزاوية إلى المركبات ---------- */
  function polar(root) {
    var R = $('[data-r=r]', root), T = $('[data-r=t]', root), vr = $('[data-r=vr]', root), vt = $('[data-r=vt]', root), o = $('[data-r=out]', root);
    var p = Plot($('[data-r=plot]', root), -10, 10, -10, 10, 16, 2);
    function go() {
      var r = parseFloat(R.value), t = parseFloat(T.value), x = r * Math.cos(t * RAD), y = r * Math.sin(t * RAD);
      vr.textContent = fx(r, 1); vt.textContent = fx(t, 0) + '°';
      p.dash(0, 0, x, 0, 'a2'); p.dash(x, 0, x, y, 'a3');
      p.arrow(0, 0, x, y, 'a1', 'r', x * 1.08, y * 1.08);
      if (r > 1.2) p.arc(1.2, 0, t);
      p.text(x / 2 - 0.3, -0.9 * (y < 0 ? -1 : 1) * (y === 0 ? 0 : 1) - 0.6, 'x', 'a2'); p.text(x + (x >= 0 ? 0.4 : -0.9), y / 2, 'y', 'a3');
      p.ticks([-8, -4, 4, 8]); p.flush();
      o.innerHTML = lines(['x = r·cos(θ) = ' + fx(r, 1) + ' × cos(' + fx(t, 0) + '°) = <span class="r">' + fx(x, 2) + '</span>', 'y = r·sin(θ) = ' + fx(r, 1) + ' × sin(' + fx(t, 0) + '°) = <span class="r">' + fx(y, 2) + '</span>', [quadrant(x, y)]]);
    }
    R.addEventListener('input', go); T.addEventListener('input', go); go();
  }

  /* ---------- 3) من الإحداثيات إلى المقدار والزاوية (مع تصحيح الربع) ---------- */
  function xy(root) {
    var X = $('[data-r=x]', root), Y = $('[data-r=y]', root), o = $('[data-r=out]', root);
    var p = Plot($('[data-r=plot]', root), -6, 6, -6, 6, 26, 1);
    X.value = -3.5; Y.value = -2.5;
    function go() {
      var x = parseFloat(X.value), y = parseFloat(Y.value);
      if (isNaN(x) || isNaN(y)) { o.textContent = 'اكتب رقمين'; return; }
      var r = Math.sqrt(x * x + y * y), raw = x === 0 ? (y >= 0 ? 90 : -90) : Math.atan(y / x) / RAD, th = angleFrom(x, y);
      var add = (x < 0) ? ' + 180°' : (y < 0 ? ' + 360°' : '');
      p.dash(x, 0, x, y, 'a3'); p.dash(0, 0, x, 0, 'a2');
      p.arrow(0, 0, x, y, 'a1');
      p.text(x + (x >= 0 ? 0.2 : -1.6), y + (y >= 0 ? 0.35 : -0.6), '(' + fx(x, 1) + ', ' + fx(y, 1) + ')', 'a1');
      p.ticks([-4, -2, 2, 4]); p.flush();
      var rows = ['r = √(x² + y²) = √(' + fx(x * x, 2) + ' + ' + fx(y * y, 2) + ') = <span class="r">' + fx(r, 2) + '</span>',
        ['الآلة الحاسبة: ' + M('tan⁻¹(y/x) = ' + fx(raw, 1) + '°')], [quadrant(x, y)]];
      rows.push(add ? ['<span class="w">تصحيح الربع: ' + M(fx(raw, 1) + '°' + add) + '</span>'] : ['لا تصحيح (الربع الأول)']);
      rows.push('θ = <span class="r">' + fx(th, 1) + '°</span>');
      o.innerHTML = lines(rows);
    }
    X.addEventListener('input', go); Y.addEventListener('input', go); go();
  }

  /* ---------- 4) جمع وطرح المتجهات (الرأس إلى الذيل) ---------- */
  function add(root) {
    var A = $('[data-r=a]', root), B = $('[data-r=b]', root), T = $('[data-r=t]', root), o = $('[data-r=out]', root);
    var va = $('[data-r=va]', root), vb = $('[data-r=vb]', root), vt = $('[data-r=vt]', root), btns = root.querySelectorAll('[data-m]'), mode = 'add';
    var p = Plot($('[data-r=plot]', root), -2, 21, -11, 11, 14, 2);
    btns.forEach(function (b) { b.addEventListener('click', function () { mode = b.dataset.m; btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); go(); }); });
    function go() {
      var a = +A.value, b = +B.value, t = +T.value, c = Math.cos(t * RAD), s = Math.sin(t * RAD);
      va.textContent = fx(a, 0); vb.textContent = fx(b, 0); vt.textContent = fx(t, 0) + '°';
      var sg = mode === 'add' ? 1 : -1, bx = sg * b * c, by = sg * b * s, ex = a + bx, ey = by;
      p.arrow(0, 0, a, 0, 'a1', 'A', a / 2, -1.1);
      p.dash(0, 0, b * c, b * s, 'a2');
      p.arrow(a, 0, ex, ey, 'a2', mode === 'add' ? 'B' : '−B', a + bx / 2 + 0.4, ey / 2 + (sg > 0 ? 0.6 : -1));
      p.arrow(0, 0, ex, ey, 'a3', mode === 'add' ? 'R' : 'C', ex / 2 - 1.3, ey / 2 + (ey >= 0 ? 0.7 : -1.1));
      p.arc(2.2, 0, t); p.flush();
      var R2 = a * a + b * b + sg * 2 * a * b * c, R = Math.sqrt(Math.max(R2, 0)), chk = Math.sqrt(ex * ex + ey * ey);
      var nm = mode === 'add' ? 'R' : 'C', sgn = mode === 'add' ? '+' : '−', lo = Math.abs(a - b), hi = a + b;
      o.innerHTML = lines([nm + '² = A² + B² ' + sgn + ' 2AB·cos(θ)', '= ' + a + '² + ' + b + '² ' + sgn + ' 2(' + a + ')(' + b + ')·cos(' + fx(t, 0) + '°)', '= ' + fx(R2, 2),
        nm + ' = <span class="r">' + fx(R, 2) + '</span>',
        ['المجموع ' + M('A + B = ' + hi) + ' ، والفرق ' + M('|A − B| = ' + lo)],
        [(mode === 'add' ? 'المحصلة' : 'الناتج') + ' بين ' + M(String(lo)) + ' و ' + M(String(hi)) + ' ✓']]);
      void chk;
    }
    [A, B, T].forEach(function (e) { e.addEventListener('input', go); }); go();
  }

  /* ---------- 5) ضرب متجه في عدد ثابت ---------- */
  function scale(root) {
    var C = $('[data-r=c]', root), vc = $('[data-r=vc]', root), o = $('[data-r=out]', root);
    var p = Plot($('[data-r=plot]', root), -13, 13, -9, 9, 14, 2), ax = 3 * Math.cos(30 * RAD), ay = 3 * Math.sin(30 * RAD);
    function go() {
      var c = parseFloat(C.value); vc.textContent = fx(c, 1);
      p.arrow(0, 0, ax, ay, 'a2', 'A', ax + 0.3, ay + 0.6);
      if (c !== 0) p.arrow(0, 0, c * ax, c * ay, 'a3', c + 'A', c * ax + (c > 0 ? 0.3 : -1.6), c * ay + (c > 0 ? 0.6 : -0.8));
      p.flush();
      var msg = c > 0 ? (c === 1 ? 'نفس المتجه' : 'نفس الاتجاه، ' + (c > 1 ? 'أطول ' + M(fx(c, 1)) + ' مرة' : 'أقصر')) : c < 0 ? 'الاتجاه <span class="w">معكوس</span>، ' + (Math.abs(c) > 1 ? 'أطول' : Math.abs(c) < 1 ? 'أقصر' : 'بنفس الطول') : 'متجه صفري (مقداره 0)';
      o.innerHTML = lines(['|A| = 3', '|' + fx(c, 1) + 'A| = ' + fx(Math.abs(c), 1) + ' × 3 = <span class="r">' + fx(Math.abs(c) * 3, 1) + '</span>', [msg]]);
    }
    C.addEventListener('input', go); go();
  }

  var W = { conv: conv, polar: polar, xy: xy, add: add, scale: scale };
  document.querySelectorAll('[data-widget]').forEach(function (el) { var fn = W[el.dataset.widget]; if (fn) { try { fn(el); } catch (e) { if (window.console) console.error(e); } } });
})();
