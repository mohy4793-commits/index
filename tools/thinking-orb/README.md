# ThinkingOrb (نسخة جافاسكربت خالصة)

الموقع ثابت بلا React ولا أداة بناء، فاستُخرج مكوّن `<ThinkingOrb />` من مكتبة
[thinking-orbs](https://github.com/Jakubantalik/Libraries.dev) (MIT © Jakub Antalik) في ملف واحد جاهز:
`assets/js/thinking-orb.js` (≈16KB). الرسم والإعدادات المضبوطة مأخوذة من مصدر المكتبة نفسه.

المكافئ في React:

```tsx
<ThinkingOrb state="connecting" size={64} />
```

المكافئ في هذا الموقع:

```js
ThinkingOrb.mount(element, { state: 'connecting', size: 64 });   // اختياري: displaySize, theme, speed, paused, label
```

يتبع الوضع الصباحي/الليلي تلقائيًا (`data-theme` على `<html>`)، ويتوقف خارج الشاشة وفي التبويب المخفي،
ويعرض إطارًا ثابتًا لمن فعّل «تقليل الحركة».

## إعادة البناء
```bash
git clone --depth 1 https://github.com/Jakubantalik/Libraries.dev.git /tmp/libs
sed "s#'LIB/#'/tmp/libs/packages/thinking-orbs/src/#g" tools/thinking-orb/entry.ts > /tmp/entry.ts
npx esbuild /tmp/entry.ts --bundle --minify --format=iife --target=es2018 --legal-comments=none --outfile=/tmp/out.js
{ head -1 assets/js/thinking-orb.js; cat /tmp/out.js; } > /tmp/new.js && mv /tmp/new.js assets/js/thinking-orb.js
```
