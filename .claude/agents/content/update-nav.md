---
description: "Modify navigation links — add, remove, reorder, or rename nav items."
---

Update the site navigation.

## Required inputs

The user should specify: what navigation change to make (add link, remove link, reorder, rename).

## Procedure

1. **Read** `src/data/nav.json` to see the current navigation.

2. **Make the requested change**:
   - **Add a link**: Add a new object with `label`, `href`, and `order`. Use the next available order number, or insert at a specific position and renumber.
   - **Remove a link**: Delete the entry. Renumber remaining items to keep order sequential.
   - **Reorder**: Change `order` values. Header sorts by this field (lower = first).
   - **Rename**: Change the `label` field.

3. **Ensure consistency**:
   - `href` must match an existing route (check `src/pages/`)
   - `order` values should be sequential (1, 2, 3...) with no gaps
   - No duplicate `href` values

4. **Validate**: Run `npm run validate` and report results.

## What the user said

$ARGUMENTS
