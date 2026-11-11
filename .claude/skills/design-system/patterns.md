# Screen patterns

## Contents

- Page layout
- Reference sheet (copy actions)
- Keyword results
- Book filter
- Share flow
- Words

## Page layout

- Top: the small letter-spaced wordmark, nothing else.
- Body: the saved list ("Saved · N" with a subtle Share button).
- Bottom: the floating search bar.
- Everything secondary (a reference, results, the filter, sharing) opens in the
  one sheet. Moving between views slides the sheet's content sideways; nothing
  stacks and nothing navigates.

## Reference sheet

People use every copy format, so all stay one tap away, in this order:

1. **Header:** the reference (`1.25rem`, weight 500), then a `btn-icon` that
   copies the verse text plus the pretty link (`<verse> <a>John 3:16</a>`, as
   rich HTML with a plain-text fallback). Save and Open are `btn-icon`s on the
   right.
2. **Verse:** serif text that opens with a small inline `btn-icon` copying the
   verse text only.
3. **Link tiles:** label in `--acc`, underlined. Full pretty link and
   abbreviated pretty link side by side, then a full-width tile for the raw URL,
   truncated with an ellipsis.
4. **Text tiles:** plain `--ink` labels. Full reference and abbreviated
   reference.

- No group labels; the accent color marks the links.
- A book without an abbreviation collapses each pair to one full-width tile.
- Save toggles between bookmark-plus and bookmark-minus, with a toast.
- Saved rows and search results open this sheet. Rows have no copy buttons of
  their own.

## Keyword results

- Sheet header: "N of M matches" on the left, the filter chip on the right
  (`btn-subtle`, labelled "All books ▾", tinted when a filter is on).
- Rows: reference (sans, 500) over a serif snippet with `<mark>` highlights.
- "Show more" (`btn-subtle`) loads the next page.
- Tapping a row slides to the reference view; "‹ Results" slides back.
- No results: name the active filter and offer "Search all books" as a tinted
  subtle button.

## Book filter

- Opens from the filter chip, inside the same sheet: title "Books", back "‹
  Results".
- "Find a book" search narrows the list and expands volumes with matches.
- Five volume rows. The round check selects the whole volume (sends the volume
  ID); mixed shows a minus and "2 of 15". Tapping the row or its chevron expands
  book chips. Doctrine and Covenants has one book, so it is just a toggle.
- Footer: "Clear" (`btn-subtle`) and "Show N matches" (`btn-primary`).
- Chip label: "All books", a volume name, or "Ether +1".

## Share flow

1. **Choose** (from Saved → Share): "3 of 5 picked" with a "Select all / Select
   none" subtle button. Each row has a grip handle (drag, or arrow keys when
   focused) and a round check. Whole-book references are dimmed with the reason
   inline. Footer: "Show QR for N".
2. **QR:** a white card in both themes so phones can scan it, the chosen
   references, then the short link. Footer: "Copy link" (`btn-subtle`) and
   "Share…" (`btn-primary`, `navigator.share`, falling back to copy). "‹ Choose"
   keeps the pick and order.
3. **Recipient** (`/s/…`): "Shared with you", "N references, in the order your
   teacher picked", a full-width "Save all" that becomes a tinted "Saved N
   references". Rows open the reference sheet.

## Words

- Sentence case, no ending punctuation on labels, contractions welcome.
- Buttons start with a verb: "Save all", "Show 9 matches", "Copy link".
- Toasts in the past tense: "Saved", "Copied text", "Removed from saved".
- Empty states offer the next step, not an apology.
- Never "please", "successfully", "click here", or exclamation marks.
