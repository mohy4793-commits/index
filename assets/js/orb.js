/* =====================================================================
   Orb — كرة نقطية ثلاثية الأبعاد على canvas ثنائي الأبعاد (بدون WebGL)
   مقتبسة ومُعاد كتابتها بلغة JavaScript خالصة من مشروع thinking-orbs
   (MIT © Jakub Antalik — https://github.com/Jakubantalik/thinking-orbs)
   الأوضاع المنقولة: «globe» (كرة مع خط مسح يدور) و«wave» (موجة تتدحرج عبر الحلقات).
   تغييرات: ألوان زمردية تتبع سمة الموقع، وميلان خفيف يتبع المؤشر.
   يتوقف الرسم تلقائيًا خارج الشاشة أو عند إخفاء التبويب، ويعرض إطارًا ثابتًا
   عند تفعيل prefers-reduced-motion.
   ===================================================================== */
(function () {
  'use strict';
  var TAU = Math.PI * 2;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hashD(a, b) { var h = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return h - Math.floor(h); }
  function angleDelta(a, b) { return Math.atan2(Math.sin(a - b), Math.cos(a - b)); }
  function makeProj(yaw, tilt, cx, cy, scale) {
    var st = Math.sin(tilt), ct = Math.cos(tilt), sy = Math.sin(yaw), cyw = Math.cos(yaw);
    return function (x, y, z) {
      var x1 = x * cyw + z * sy, z1 = -x * sy + z * cyw;
      var y1 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      return [cx + x1 * scale, cy - y1 * scale, z2];
    };
  }

  /* ---- الأوضاع: كل واحد يُرجع قائمة نقاط { x, y, z, r, w (عمق/حبر 0..1), a, hot } ---- */
  var MODES = {
    globe: function (size, t, o, tiltAdd, yawAdd) {
      var spin = 0.5, cx = size / 2, cy = size / 2, radius = size / 2 * 0.82;
      var tilt = 0.4 + 0.06 * Math.sin(t * 0.35) + tiltAdd;
      var pt = makeProj(t * spin + yawAdd, tilt, cx, cy, radius);
      var scan = t * (spin + (1.7 - spin) * o.scanMul);
      var rs = Math.pow(size / 300, 0.6) * o.sizeMul;
      var dots = [];
      for (var li = 0; li <= o.lat; li++) {
        var lat = -Math.PI / 2 + li / o.lat * Math.PI, cl = Math.cos(lat), sl = Math.sin(lat);
        var n = Math.max(1, Math.round(Math.abs(cl) * o.lon));
        for (var lj = 0; lj < n; lj++) {
          var lon = lj / n * TAU;
          var p = pt(cl * Math.cos(lon), sl, cl * Math.sin(lon));
          var depth = (p[2] + 1) / 2;
          var d = angleDelta(lon + t * spin, scan);
          var boost = Math.exp(-(d * d) / 0.18) * Math.max(0, p[2]);
          dots.push({ x: p[0], y: p[1], z: p[2], r: (0.6 + 1.7 * depth + boost) * rs, w: depth, a: o.dim + (1 - o.dim) * Math.min(1, boost), hot: boost });
        }
      }
      return dots;
    },
    wave: function (size, t, o, tiltAdd, yawAdd) {
      var cx = size / 2, cy = size / 2, R = size / 2 * 0.874;
      var pt = makeProj(t * 0.18 + yawAdd, 0.38 + tiltAdd, cx, cy, 1);
      var rs = Math.pow(size / 300, 0.6) * o.sizeMul;
      var dots = [];
      for (var ri = 0; ri <= o.lat; ri++) {
        var lat = -Math.PI / 2 + ri / o.lat * Math.PI, cl = Math.cos(lat), sl = Math.sin(lat);
        var w = 0.62 * Math.sin(t * 2.1 - ri * 0.52) + 0.38 * Math.sin(t * 1.27 + ri * 0.83);
        var rr = R * (0.88 + 0.105 * w);
        var n = Math.max(1, Math.round(Math.abs(cl) * o.lon));
        for (var lj = 0; lj < n; lj++) {
          var lon = lj / n * TAU;
          var p = pt(cl * Math.cos(lon) * rr, sl * rr, cl * Math.sin(lon) * rr);
          var depth = (p[2] / R + 1) / 2, crest = Math.max(0, w);
          dots.push({ x: p[0], y: p[1], z: p[2], r: (0.6 + 1.7 * depth) * (1 + 0.4 * crest) * rs, w: depth, a: 1, hot: crest * 0.6 });
        }
      }
      return dots;
    }
  };

  /* قيم مضبوطة: large للعنصر الرئيسي، small للمؤشرات الصغيرة */
  var PRESETS = {
    large: { globe: { lat: 17, lon: 44, scanMul: 2.2, dim: 0.5, sizeMul: 1.05, speed: 0.75 }, wave: { lat: 15, lon: 40, sizeMul: 1, speed: 1.4 } },
    small: { globe: { lat: 11, lon: 29, scanMul: 4, dim: 0.45, sizeMul: 1.2, speed: 1.6 }, wave: { lat: 9, lon: 22, sizeMul: 1.5, speed: 2.2 } }
  };

  function rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(a, b, f) { return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }

  var PAL = {
    dark: { far: rgb('#0f4a35'), near: rgb('#b9ffe0'), hot: rgb('#5ad6ff') },
    light: { far: rgb('#bfe0d1'), near: rgb('#075a3b'), hot: rgb('#0a7fa8') }
  };

  var clock = 0, last = 0, running = new Set(), raf = 0;
  function tick(now) {
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now; clock += dt;
    running.forEach(function (o) { o.draw(clock); });
    raf = running.size ? requestAnimationFrame(tick) : 0;
  }
  function start(o) { running.add(o); if (!raf) { last = 0; raf = requestAnimationFrame(tick); } }
  function stop(o) { running.delete(o); }

  /* Orb.mount(canvas, { mode:'globe'|'wave', size:'large'|'small', interactive:true }) */
  function mount(canvas, cfg) {
    cfg = cfg || {};
    var mode = cfg.mode || 'globe', preset = PRESETS[cfg.size || 'large'][mode];
    var ctx = canvas.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var css = 0, tiltT = 0, yawT = 0, tilt = 0, yaw = 0, visible = true;
    var root = document.documentElement;

    function resize() {
      var r = canvas.getBoundingClientRect(); css = Math.max(16, r.width);
      canvas.width = Math.round(css * dpr); canvas.height = Math.round(css * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce || !visible) inst.draw(clock || 3.2);
    }
    var inst = {
      draw: function (t) {
        tilt += (tiltT - tilt) * 0.06; yaw += (yawT - yaw) * 0.06;
        var dots = MODES[mode](css, t * preset.speed, preset, tilt, yaw);
        dots.sort(function (a, b) { return a.z - b.z; });
        var pal = PAL[root.dataset.theme === 'light' ? 'light' : 'dark'];
        ctx.clearRect(0, 0, css, css);
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i], c = mix(pal.far, pal.near, Math.pow(d.w, 1.2));
          if (d.hot > 0.12) c = mix(c, pal.hot, Math.min(1, d.hot * 1.2));
          ctx.fillStyle = 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (d.a * (0.35 + 0.65 * d.w)).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(d.x, d.y, Math.max(0.3, d.r), 0, TAU); ctx.fill();
        }
      }
    };
    resize();
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(canvas); else addEventListener('resize', resize);

    if (cfg.interactive) {
      addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
        var nx = (e.clientX - (r.left + r.width / 2)) / innerWidth, ny = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        yawT = nx * 0.9; tiltT = ny * 0.5;
      }, { passive: true });
    }
    if (reduce) { inst.draw(3.2); new MutationObserver(function () { inst.draw(3.2); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] }); return inst; }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? start(inst) : stop(inst); }).observe(canvas);
    } else start(inst);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop(inst) : (visible && start(inst)); });
    return inst;
  }

  window.Orb = { mount: mount };
})();
