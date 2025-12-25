## 2024-05-23 - Search Bar Accessibility & Usability
**Learning:** Native `input[type="search"]` elements have browser-specific "cancel" buttons (like in WebKit) that can conflict with custom "Clear" buttons. Hiding them with `[&::-webkit-search-cancel-button]:hidden` is essential when implementing a custom clear action for consistent cross-browser behavior.
**Action:** When creating custom search inputs with clear functionality, always explicitly hide the native vendor-specific controls to avoid UI duplication.
