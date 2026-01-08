# Palette's Journal

This journal tracks critical UX and accessibility learnings. It is not a changelog.

## 2024-05-20 - [Accessibility] Search Input Landmarks
**Learning:** Users relying on screen readers often navigate by landmarks. A simple `<input>` without a clear role or label can be missed or ambiguous. Explicitly using `role="search"` on the form or `type="search"` on the input significantly improves discoverability.
**Action:** Ensure all global search inputs use `type="search"` and are wrapped in a form with `role="search"` (or have the role directly if no form is present, though form is preferred).
