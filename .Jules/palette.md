## 2025-02-27 - [Semantic Search Inputs]
**Learning:** Using `type="search"` provides native accessibility benefits (standardized keyboard handling on mobile, native "x" buttons in some browsers) but often requires a custom clear button for cross-browser consistency and full keyboard accessibility (tabbability).
**Action:** Always wrap search inputs in a form with `role="search"` and consider a custom clear button that conditionally renders, ensuring it's keyboard accessible and manages focus back to the input.
