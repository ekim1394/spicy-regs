## 2024-01-08 - [Search Input Accessibility Pattern]
**Learning:** Native search inputs often lack accessible labels and clear buttons, leading to inconsistent behavior and poor accessibility. Implementing a custom clear button can conflict with browser-native search clear buttons (like in WebKit).
**Action:** Always couple custom search inputs with: 1) Explicit `aria-label` or visible label, 2) `role="search"`, 3) A custom clear button that manages focus, and 4) CSS to hide the native `::-webkit-search-cancel-button` to prevent UI duplication.
