# Components

## Buttons

No button has a visible border. Use only these kinds:

| Class             | Looks like                                                 | Use                                                              |
| ----------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| `btn-primary`     | Filled `--acc` pill, `--on-acc` text, weight 500           | The one main action of a view (Show matches, Share…, Save all)   |
| `btn-subtle`      | `--acc` text, transparent; `--acc-bg` on hover             | Secondary actions, back links, Show more, Clear, the filter chip |
| `btn-subtle tint` | Same, with `--acc-bg` always on                            | Active filter, a completed state, an empty-state next step       |
| `btn-icon`        | Icon only, about `1.75rem`, `--acc` (`--ink-2` if neutral) | Inline actions: copy, save, open, expand                         |
| `tile`            | `--fill` block, label left, copy icon right                | Copy targets in the reference sheet                              |

- Hit area at least 44px even when the button draws smaller (padding or a
  pseudo-element).
- Icon-only buttons: `aria-label` plus a matching `title`, no visible text.
- Focus: `outline: 2px solid var(--acc); outline-offset: 2px` on
  `:focus-visible`.
- Avoid disabled buttons. Keep them tappable and explain why nothing happened
  (toast or inline text); use `aria-disabled` if you must.
- Icons: one outline icon set, `1rem`–`1.15rem`, no filled variants.

## Selection

- **Round check** for picking items (filter volumes, share rows): a circle with
  an `--ink-2` outline; selected is `--acc` fill with a check, mixed is `--acc`
  fill with a minus. `role="checkbox"` with `aria-checked` (`true`, `false`,
  `mixed`).
- **Toggle chip** for picking books: `--fill` pill; on is `--acc-bg` with
  `--acc` text. Uses `aria-pressed`.

## Search bar

- Glass pill fixed at the bottom: `.75rem` from the sides, `.9rem` plus
  `env(safe-area-inset-bottom)` from the bottom, about `3.1rem` tall.
- Placeholder "Reference or words". A leading search icon becomes a clear (×)
  button once there is input.
- One field handles both references and keyword searches.

## Sheet

- Glass, rises above the search bar, radius `22px`, grab handle at the top
  (`2.2rem` × `.3rem`, `--line`).
- Sizes to its content up to near full height, then scrolls inside. A footer
  with the view's primary action stays pinned, separated by a `--line` rule.
- Header pattern: back link (`btn-subtle`, "‹ Previous view") on the left, view
  title centered, actions on the right.
- Tapping the dimmed background or pressing Escape closes it; focus returns to
  whatever opened it.
- Prefer `<dialog>` or `popover` with `commandfor` over hand-rolled state.

## Rows

- Saved rows: `--card`, radius `14px`, reference on top, one-line serif verse
  preview in `--ink-2`, chevron on the right. The whole row is the button.
- Result rows: no background until hover (`--fill`), no dividers.

## Toast

- `--ink` pill with `--bg` text, `.8125rem`, from the top of the viewport.
- Past tense, says what happened: `Copied link "Jn 3:16"`, "Saved".
- `role="status"`.
