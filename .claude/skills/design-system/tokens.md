# Tokens

Define these as CSS custom properties on `:root` in `assets/styles.css` and
expose them to Tailwind through `@theme`. Follow the system theme with
`prefers-color-scheme`; there is no theme toggle.

## Color

| Token      | Light                   | Dark                     | Use                                   |
| ---------- | ----------------------- | ------------------------ | ------------------------------------- |
| `--bg`     | `#f6f5f2`               | `#151514`                | Page canvas                           |
| `--card`   | `#ffffff`               | `#232321`                | Saved rows, in-flow cards             |
| `--ink`    | `#1d1d1b`               | `#ecebe6`                | Primary text                          |
| `--ink-2`  | `#5f5e5a`               | `#a3a29c`                | Secondary text, idle icons            |
| `--line`   | `rgb(0 0 0 / .09)`      | `rgb(255 255 255 / .09)` | Hairlines (sheet edge, footer rule)   |
| `--fill`   | `rgb(0 0 0 / .045)`     | `rgb(255 255 255 / .06)` | Tiles, chips, hover rows              |
| `--glass`  | `rgb(255 255 255 / .7)` | `rgb(40 40 38 / .66)`    | Search bar and sheet                  |
| `--acc`    | `#2b4c9b`               | `#9db3f2`                | The accent: links, actions, selection |
| `--on-acc` | `#ffffff`               | `#151514`                | Text on a filled accent               |
| `--acc-bg` | `rgb(43 76 155 / .1)`   | `rgb(157 179 242 / .14)` | Hover tint, active chip, `<mark>`     |

- Don't use the accent for decoration, headings, or icons that do nothing.
- Destructive actions use neutral text plus a confirmation or undo, not red.

## Type

- Font sizes are `rem` only: never `px`, `em`, `vw`, or Tailwind arbitrary
  values like `text-[13px]`. Spacing and radii may use any unit.

| Size        | Use                                         |
| ----------- | ------------------------------------------- |
| `.75rem`    | Meta, labels, wordmark                      |
| `.8125rem`  | Captions, counts, URLs, row previews        |
| `.875rem`   | Subtle buttons, chips                       |
| `.9375rem`  | Result titles and snippets, primary buttons |
| `1rem`      | Body, rows, tiles                           |
| `1.0625rem` | Scripture, search input                     |
| `1.25rem`   | Sheet title (the reference)                 |

- UI font: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- Scripture, verse previews, and search snippets: **Literata** (Google Fonts,
  `opsz` 7..72, weights 400 and 500), falling back to `Georgia, serif`.
- Weights 400 and 500 only. Reference titles are 500.
- Line height: scripture `1.55`, UI `1.2`–`1.5`.
- Sentence case. The wordmark is the only letter-spaced uppercase text.
- Search matches use `<mark>`: `--acc` text on `--acc-bg`, never bold.

## Glass

Only the search bar and the sheet are glass. Everything else is solid.

```css
.glass {
  background: var(--glass);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 0.5px solid var(--line);
}
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter:
  blur(1px))) {
  .glass {
    background: var(--card);
  }
}
@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: var(--card);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

- The search bar uses `blur(20px)`; the sheet `blur(24px)`.
- Target Safari and Chrome (current and previous major). Firefox gets the
  fallback and must still look finished.
- No gradients, textures, or SVG refraction effects.

## Shape and depth

- Radii: tiles `12px`, rows `14px`, sheet `22px`, search bar and pills `999px`.
- Shadows only on floating chrome: sheet `0 10px 40px rgb(0 0 0 / .14)`. In-flow
  content has no shadow and no border.
- Content behind an open sheet dims: `opacity: .45; filter: blur(1px)`.

## Motion

- Sheet rises with `transform`, `0.35s cubic-bezier(.2, .9, .3, 1.05)`.
- View change inside the sheet: slide 20% plus fade, about `0.3s`. Use the View
  Transitions API where available.
- Press: `transform: scale(.97)`.
- Toasts drop in from the top and stay about `1.4s`.
- `prefers-reduced-motion: reduce` turns slides and scales into an instant
  change or a plain fade.
- No bounce-ins or decorative motion.
