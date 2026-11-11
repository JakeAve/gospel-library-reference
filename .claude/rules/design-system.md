---
paths:
  - "**/*.tsx"
  - "**/*.css"
  - "index.html"
---

# Design system

GospelLibrary.Link is a single-purpose tool: find a scripture, copy it the way
you need it, save it, share a list. The UI should feel like one calm page that
quietly gets out of the way. When a rule here and a habit pull in different
directions, the rule wins; when this file is silent, pick the quieter option.

## Principles

1. **Mobile first.** Design at 375px wide, then let it breathe up to a centered
   column (`max-width: 32rem`). No desktop-only features.
2. **One accent.** Ink blue is the only hue. Everything else is neutral.
3. **Simple and clear.** One job per view, at most one filled button per view.
4. **Legible.** Body text is never smaller than `1rem`; scripture is set in a
   reading serif with generous leading.
5. **Progressive disclosure.** Show the reference first; reveal copy options,
   filters, and share steps only when asked for.
6. **Single-page feel.** One page, one floating sheet. Views slide inside the
   sheet; nothing navigates away or stacks a second modal.
7. **Elegant transparency.** Glass on floating chrome only, with an opaque
   fallback. Content never sits on glass it has to fight.

## Tokens

Define these as CSS custom properties on `:root` in `assets/styles.css` and
expose them to Tailwind through `@theme`. Never hard-code a hex in a component.

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

- Follow the system theme via `prefers-color-scheme`. No theme toggle.
- Accent means "you can act on this" or "this is selected". Don't use it for
  decoration, headings, or icons that do nothing.
- No second hue. Destructive actions use neutral text plus a confirmation that
  explains the outcome; don't add red.

## Typography

- **Font sizes are `rem` only.** Never `px`, `em`, `vw`, or Tailwind's arbitrary
  `text-[13px]`. Spacing and radii may use any unit.
- Scale (use only these): `.75` meta and labels · `.8125` captions, counts, URLs
  · `.875` subtle buttons, chips · `.9375` result titles and snippets, primary
  buttons · `1` body, rows, tiles · `1.0625` scripture, search input · `1.25`
  sheet title (the reference).
- UI is the system sans stack
  (`-apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif`).
  Scripture text, verse previews, and search snippets are serif: **Literata**
  (Google Fonts, `opsz` 7..72, weights 400/500), falling back to
  `Georgia, serif`.
- Two weights: 400 and 500. Reference titles are 500; nothing is bolder.
- Scripture line-height `1.55`; UI line-height `1.2`–`1.5`.
- Sentence case everywhere. The wordmark is the only letter-spaced uppercase.
- Highlight search matches with `<mark>` in `--acc` on `--acc-bg`, never bold.

## Surfaces and glass

Two layers, nothing more:

1. **Content** (page, saved rows, tiles): solid `--bg` / `--card` / `--fill`.
2. **Floating chrome** (the search bar and the sheet): glass.

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

- Target Safari and Chrome (current and previous major). Firefox gets the
  fallback and must still look finished.
- Shadows are only for floating chrome (`0 10px 40px rgb(0 0 0 / .14)` on the
  sheet). In-flow content has no shadow and no border.
- When the sheet is open, content behind it dims (`opacity: .45`, `blur(1px)`).
- Radii: tiles `12px`, rows `14px`, sheet `22px`, search bar and pills `999px`.
- No gradients, textures, or SVG refraction effects.

## Layout

- **Search lives at the bottom**, floating in the thumb zone, `.75rem` from the
  edges plus `env(safe-area-inset-bottom)`. One field takes references _and_
  words.
- The home view is the saved list. Header is just the small wordmark.
- **One sheet.** Results, a reference, the book filter, and sharing all render
  inside the same bottom sheet that rises above the search bar. Moving between
  them slides the sheet's content sideways; the way back is a subtle button
  naming the previous view (`‹ Results`, `‹ Choose`). Tapping the dimmed
  background closes the sheet.
- The sheet sizes to its content up to near full height, then scrolls inside.
  The footer (when a view has a primary action) stays pinned.
- Prefer `<dialog>`/`popover` plus `commandfor` over hand-rolled open/close
  state. Use the View Transitions API for view changes where available.

## Buttons and controls

No button has a visible border. Five kinds, and only these:

| Class             | Looks like                                                 | Use                                                               |
| ----------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| `btn-primary`     | Filled `--acc` pill, `--on-acc` text, weight 500           | The single main action of a view (Show matches, Share…, Save all) |
| `btn-subtle`      | `--acc` text, transparent; `--acc-bg` on hover             | Secondary actions, back links, Show more, Clear, filter chip      |
| `btn-subtle tint` | Same with `--acc-bg` always on                             | An active filter, a completed state, an empty-state next step     |
| `btn-icon`        | Icon only, `--acc` (or `--ink-2` when neutral), `~1.75rem` | Inline actions: copy, save, open, expand                          |
| `tile`            | `--fill` block, label left, copy icon right                | Copy targets in the reference sheet                               |

- Every button gets a hit area of at least 44px, even when it draws smaller (pad
  it or use a pseudo-element).
- Icon-only buttons have `aria-label` and a matching `title`, and no visible
  text.
- Press feedback: `transform: scale(.97)`. Focus:
  `outline: 2px solid
  var(--acc); outline-offset: 2px` on `:focus-visible`.
- Avoid disabled buttons. Keep them tappable and explain (toast or inline text)
  why nothing happened; use `aria-disabled` if you must.
- Selection uses a round check (`--acc` fill with a check, or a minus for mixed)
  with `role="checkbox"` and `aria-checked` (`mixed` included). Toggle chips use
  `aria-pressed` and turn `--acc-bg` / `--acc` when on.
- Icons: one outline icon set, `1rem`–`1.15rem`, never filled variants.

## Reference sheet: copy actions

People use every copy format, so all of them stay one tap away. The order is
fixed:

1. **Header:** the reference (`1.25rem`, 500) followed by a `btn-icon` that
   copies **verse text + pretty link** (`<verse> <a>John 3:16</a>`, rich HTML
   with plain-text fallback). Save and Open sit as `btn-icon`s on the right.
2. **Verse:** serif text opening with a small inline `btn-icon` that copies the
   verse text only.
3. **Link tiles** (text in `--acc`, underlined): full pretty link, abbreviated
   pretty link. Below them, a full-width tile for the raw URL, truncated with an
   ellipsis.
4. **Text tiles** (plain `--ink`): full reference, abbreviated reference.

- No group labels. The accent color tells you it's a link.
- If a book has no abbreviation, each pair collapses to one full-width tile.
- Every copy confirms with a toast in the past tense: `Copied link "Jn 3:16"`.
- Tapping a saved row or a search result opens this sheet. Rows don't carry
  their own copy buttons.

## Motion

- The sheet rises with `transform`, `0.35s cubic-bezier(.2,.9,.3,1.05)`.
- View changes inside the sheet: slide 20% plus a fade, about 0.3s.
- Toasts drop in from the top, stay about 1.4s, and use `--ink` on `--bg`.
- `prefers-reduced-motion: reduce` swaps every slide or scale for an instant
  change or a plain fade.
- No bounce-ins, spinners longer than they need to be, or decorative motion.

## Words

- Sentence case, no ending punctuation on labels, contractions are fine.
- Verbs on buttons: "Save all", "Show 9 matches", "Copy link".
- Toasts in the past tense: "Saved", "Copied text", "Removed from saved".
- Empty states name the next step ("Search all books"), not an apology.
- Never "please", "successfully", "click here", or exclamation marks.

## Accessibility checklist

- Text contrast is at least 4.5:1 against every surface, including glass over
  the busiest content it can float above.
- Everything works with the keyboard: arrows reorder in Share, Escape closes the
  sheet, focus returns to whatever opened it.
- Live feedback (toasts) goes through `role="status"`.
- Never put meaning in color alone: links are underlined as well as colored.
