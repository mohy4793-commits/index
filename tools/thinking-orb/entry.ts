// نسخة جافاسكربت خالصة (بلا React) من مكوّن <ThinkingOrb /> في مكتبة thinking-orbs.
// المنطق منقول من packages/thinking-orbs/src/ThinkingOrb.tsx + theme.ts؛ والرسم والإعدادات المضبوطة
// تُستورد مباشرة من مصدر المكتبة نفسها (MIT © Jakub Antalik).
//
// الاستخدام في الصفحة:
//   ThinkingOrb.mount(element, { state: 'connecting', size: 64 })
//
// طريقة إعادة البناء: انظر tools/thinking-orb/README.md
import { paintFrame } from 'LIB/engine/core';
import { MODE_FRAMES } from 'LIB/engine/registry';
import { resolvePreset } from 'LIB/presets';

type State = 'working' | 'searching' | 'solving' | 'listening' | 'connecting' | 'weaving' | 'composing' | 'breathing' | 'shaping';
interface Props { state?: State; size?: 64 | 32 | 20; theme?: 'auto' | 'dark' | 'light'; speed?: number; paused?: boolean; displaySize?: number; label?: string }

const LABELS: Record<string, string> = { working: 'Working…', searching: 'Searching…', solving: 'Solving…', listening: 'Listening…', connecting: 'Connecting…', weaving: 'Weaving…', composing: 'Composing…', breathing: 'Thinking…', shaping: 'Shaping…' };

function ancestorDark(el: Element | null): boolean | null {
  for (let n: Element | null = el; n; n = n.parentElement) {
    const a = n.getAttribute('data-theme');
    if (a === 'dark') return true;
    if (a === 'light') return false;
    if (n.classList.contains('dark')) return true;
    if (n.classList.contains('light')) return false;
  }
  return null;
}
const systemDark = () => typeof matchMedia === 'undefined' || matchMedia('(prefers-color-scheme: dark)').matches;

function mount(host: Element, props: Props = {}) {
  const state = props.state || 'working', size = props.size || 64, theme = props.theme || 'auto', speed = props.speed || 1;
  const canvas = document.createElement('canvas');
  const shown = props.displaySize || size;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', props.label || LABELS[state]);
  canvas.style.cssText = 'width:' + shown + 'px;height:' + shown + 'px;display:block';
  host.appendChild(canvas);

  const dpr = Math.min(2, (typeof devicePixelRatio !== 'undefined' && devicePixelRatio) || 1) * (shown < size ? Math.min(2, size / shown) : 1);
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  const ctx = canvas.getContext('2d')!;
  const { mode, speed: baseSpeed, opts } = resolvePreset(state, size);
  const frameFn = MODE_FRAMES[mode];
  const effSpeed = baseSpeed * speed;
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  let dark = theme === 'dark' ? true : theme === 'light' ? false : (ancestorDark(canvas) ?? systemDark());
  const resolve = () => { if (theme === 'auto') dark = ancestorDark(canvas) ?? systemDark(); if (reduced || !running) draw(); };
  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    paintFrame(ctx, frameFn(size, reduced ? 0.6 : (performance.now() / 1000) * effSpeed, opts), dark, undefined);
  };

  let raf = 0, running = false, visible = true, paused = !!props.paused;
  const loop = () => { draw(); if (running) raf = requestAnimationFrame(loop); };
  const start = () => { if (running || paused || reduced) return; running = true; raf = requestAnimationFrame(loop); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  draw();

  const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && document.visibilityState !== 'hidden') start(); else stop(); }) : null;
  io?.observe(canvas);
  const onVis = () => { if (document.visibilityState === 'hidden') stop(); else if (visible) start(); };
  document.addEventListener('visibilitychange', onVis);
  if (!io) start();

  let mo: MutationObserver | null = null, mq: MediaQueryList | null = null;
  if (theme === 'auto') {
    mq = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-color-scheme: dark)') : null;
    mq?.addEventListener('change', resolve);
    if (typeof MutationObserver !== 'undefined') { mo = new MutationObserver(resolve); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'], subtree: true }); }
  }

  return {
    canvas,
    pause() { paused = true; stop(); },
    play() { paused = false; if (visible) start(); },
    destroy() { stop(); io?.disconnect(); mo?.disconnect(); mq?.removeEventListener('change', resolve); document.removeEventListener('visibilitychange', onVis); canvas.remove(); }
  };
}

(window as any).ThinkingOrb = { mount };
