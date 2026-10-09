# mgl-common-ui

Traditional Mongolian (`mn-Mong`) **vertical-lr** primitives for the web: CSS layout conventions plus a small scroll runtime.

Small set of vertical-lr primitives — not a general component kit. It does not include IME (`mgl-web-ime`) or the rich-text editor (`mongolian-editor.js`).

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

Serve a Traditional Mongolian font at `/fonts/OyunQaganTig.ttf`. Override `--mn-font-script` if you host it elsewhere.

```bash
npm run demo   # http://localhost:5174/demo/
```

## Markup

```html
<div class="mn-shell">
  <aside class="mn-rail">
    <a class="mn-rail-link" href="/">Home</a>
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
| `.mn-input` / `.mn-textarea` / `.mn-select` | Native fields — writing-mode is re-asserted |
| `.mn-input-latin` | Same field, Latin typeface (email / password) |
| `enhanceSelect(el)` / `<mn-select>` | Custom listbox that stays `vertical-lr` (native popups do not) |
| `.mn-doc` `.mn-h1` `.mn-p` `.mn-quote` … | Reading blocks |
| `[data-mn-drag]` | Touch/pointer drag → `scrollLeft` (link-dense feeds) |
| `[data-mn-scroll-y]` | Nested vertical scroller; wheel is not remapped |

`.mn-surface` uses `overscroll-behavior-x: none`. `install()` also swallows leftover horizontal pans so Chromium/Safari do not treat them as Back/Forward (`historySwipe: false` to opt out).

### JS

```js
install({ selector: ".mn-surface", wheel: true, keyboard: true, drag: true, historySwipe: true })
bindSurface(el, { drag: true })
portal(node)                 // append to body as .mn-overlay
wrapEmoji("hello 😀")        // → hello <span class="mn-emoji">😀</span>
initVisualViewport()         // writes --mn-vh
enhanceSelect(selectEl)      // vertical-lr listbox over a native <select>
```

Native `<select>` menus ignore `writing-mode`. Prefer `enhanceSelect(select)` (keeps the
`<select>` for form/LiveView) or `<mn-select>` with light-DOM `<option>` children.

Tokens live on `:root` (`--mn-font-script`, `--mn-vh`, `--mn-field-extent`, `--mn-rail`, colors). Override them in the host app.

IME and the block editor stay separate packages.

## What this is not

- Not a full form / design system (only primitives that break under vertical-lr, e.g. select)
- Not buttons, feeds, chat bubbles, or posters
- Not Phoenix LiveView hooks (wrap `install` / `enhanceSelect` in ~20 lines if needed)
- Not a global `writing-mode` on `html`
