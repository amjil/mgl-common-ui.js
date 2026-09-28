# mgl-common-ui

Traditional Mongolian (`mn-Mong`) **vertical-lr** primitives for the web: CSS layout conventions plus a small scroll runtime.

This is not a component kit. It does not include IME (`mgl-web-ime`) or the rich-text editor (`mongolian-editor.js`).

Extracted from the shared kernel of three HTML apps — Nomio (reader), Xamt (chat), Mongol Zangila (feed) — without taking their product chrome.

## Model

`html` / `body` stay `horizontal-tb`. Only `.mn-surface` flips to `vertical-lr`.

```
.mn-shell          horizontal frame
  .mn-rail         left chrome (labels may be vertical)
  .mn-surface      reading surface — columns run left → right, scroll is horizontal
  .mn-overlay      toasts, tab bars, FABs — never inside the surface
```

Inside `.mn-surface`:

| CSS | Physical |
|---|---|
| `inline-size` | height |
| `block-size` | width |
| `.mn-columns` (`flex-direction: column`) | left → right |
| `.mn-stack` (`flex-direction: row`) | top → bottom |

Do **not** set `writing-mode` on `html`/`body`. Every overlay then has to opt back out.

## Install

```html
<link rel="stylesheet" href="./styles/mgl-common-ui.css" />
<script type="module">
  import { install, wrapEmoji, portal, initVisualViewport } from "./src/index.js"

  initVisualViewport()
  install() // wheel + keyboard on .mn-surface; drag on [data-mn-drag]
</script>
```

Serve a Traditional Mongolian font at `/fonts/OyunQaganTig.ttf` (same path Nomio / Xamt / Zangila already use). Override `--mn-font-script` if you host it elsewhere.

```bash
npm run demo   # http://localhost:5174/demo/
```

## Markup

```html
<div class="mn-shell">
  <aside class="mn-rail">
    <a class="mn-rail-link" href="/">Nomio</a>
  </aside>

  <main class="mn-surface" data-mn-drag>
    <div class="mn-surface-inner mn-columns">
      <article class="mn-doc">
        <h1 class="mn-h1">ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ</h1>
        <p class="mn-p">
          <span class="mn-lead-word">ᠮᠣᠩᠭᠣᠯ</span>
          ᠪᠢᠴᠢᠭ 12:34
        </p>
      </article>
      <textarea class="mn-textarea"></textarea>
    </div>
  </main>
</div>
```

### Classes

| Class | Role |
|---|---|
| `.mn-text` | Mongolian run (`vertical-lr`) |
| `.mn-latin` | Horizontal island for chrome that must not rotate (player, toast) |
| `.mn-upright` | Optional tate-chu-yoko; **do not** use for time, `@handle`, or CSS terms in a column |
| `.mn-upright-combine` | `text-combine-upright` for 1–2 digits |
| `.mn-emoji` | Color emoji that must not rotate (desktop Chromium) |
| `.mn-input` / `.mn-textarea` | Native fields — writing-mode is re-asserted |
| `.mn-input-latin` | Same field, Latin typeface (email / password) |
| `.mn-doc` `.mn-h1` `.mn-p` `.mn-quote` … | Reading blocks |
| `[data-mn-drag]` | Touch/pointer drag → `scrollLeft` (link-dense feeds) |
| `[data-mn-scroll-y]` | Nested vertical scroller; wheel is not remapped |

### JS

```js
install({ selector: ".mn-surface", wheel: true, keyboard: true, drag: true })
bindSurface(el, { drag: true })
portal(node)                 // append to body as .mn-overlay
wrapEmoji("hello 😀")        // → hello <span class="mn-emoji">😀</span>
initVisualViewport()         // writes --mn-vh
```

Tokens live on `:root` (`--mn-font-script`, `--mn-vh`, `--mn-field-extent`, `--mn-rail`, colors). Override them in the host app.

## Mapping from existing apps

Do not rename in-place. When a host adopts this package:

| Here | Nomio | Xamt | Zangila |
|---|---|---|---|
| `.mn-shell` | `.app-shell` | `.xamt-app` | `.app-shell` |
| `.mn-surface` | `.page.mongol-layout` | reading pane | `.page` |
| `.mn-text` | (inherited) | `.mongol-text` | `.mongol-text` |
| `.mn-latin` | ad-hoc `horizontal-tb` | `.latin-text` | `.latin` / `.horizontal-tb` |
| `.mn-upright` | `.like-btn .count` | `.xamt-upright` | (handle stays rotated) |
| `.mn-input` | editor host | `.mongol-input` | `.input-v` |
| `install()` | wheel + keys | `mongolian-scroll.js` | `PageScroll` hook |

IME and the block editor stay separate packages.

## What this is not

- Not buttons, feeds, chat bubbles, or posters
- Not Phoenix LiveView hooks (wrap `install` / `bindSurface` in 20 lines if needed)
- Not a global `writing-mode` on `html`
