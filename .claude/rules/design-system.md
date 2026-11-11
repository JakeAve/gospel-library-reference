---
paths:
  - "**/*.tsx"
  - "**/*.css"
  - "index.html"
---

# Design system

Before changing UI, load the `design-system` skill. It has the tokens,
components, and screen patterns. These rules hold without it:

- Mobile first: design at 375px, then a centered `32rem` column.
- Ink blue (`--acc`) is the only hue. No red, no second accent.
- Font sizes are `rem` only, from the skill's scale.
- Glass only on floating chrome (search bar, sheet), always with an opaque
  fallback. Content surfaces stay solid.
- One bottom sheet for every secondary view; views slide inside it. No second
  modal, no page navigation.
- At most one filled button per view. No button has a visible border.
- Icon-only buttons have `aria-label` and a matching `title`, and every button
  has a hit area of at least 44px.
- Colors, sizes, and radii come from tokens, never hard-coded values.
