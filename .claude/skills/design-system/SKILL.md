---
name: design-system
description: GospelLibrary.Link's design system — color and type tokens, glass recipe, button kinds, the bottom sheet, and the layout of the reference, results, filter, and share screens. Use when building, restyling, or reviewing any UI in this app (components, CSS, index.html), adding a screen or control, or choosing colors, font sizes, spacing, motion, or UI copy.
---

# Design system

GospelLibrary.Link does one thing: find a scripture, copy it the way you need,
save it, share a list. The UI should feel like one calm page that gets out of
the way. When this skill is silent, pick the quieter option.

## Principles

1. **Mobile first.** 375px first; wider screens get a centered `32rem` column.
2. **One accent.** Ink blue means "you can act on this" or "selected".
3. **Simple and clear.** One job per view, one filled button at most.
4. **Legible.** Body text `1rem` or larger; scripture in a reading serif.
5. **Progressive disclosure.** Show the reference first; copy options, filters,
   and share steps appear when asked for.
6. **Single-page feel.** One page, one floating sheet; views slide inside it.
7. **Elegant transparency.** Glass on floating chrome only, never under text
   that has to compete with it.

## Where the details are

- [tokens.md](tokens.md): colors (light and dark), type scale and fonts, glass
  recipe, radii, shadows, motion values.
- [components.md](components.md): `btn-primary`, `btn-subtle`, `btn-icon`,
  `tile`, checks and chips, search bar, sheet, toast.
- [patterns.md](patterns.md): page layout, the reference sheet's copy actions,
  keyword results, book filter, share flow, and UI wording.

Read the file that matches the task; most changes need only one.

## Before you finish

- Light and dark both checked; contrast at least 4.5:1, including over glass.
- Works at 375px with no horizontal scroll, and with the keyboard (Escape closes
  the sheet, focus returns to the opener).
- `prefers-reduced-motion` and `prefers-reduced-transparency` respected.
- Toasts announce through `role="status"`.
- Links are underlined as well as colored.
