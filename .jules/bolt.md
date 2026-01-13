## 2026-01-13 - Virtuoso Callback Stability
**Learning:** React Virtuoso's `itemContent` prop is called on every render. Inline functions passed to child components inside `itemContent` break `React.memo` even if the data hasn't changed.
**Action:** Use `useRef` to access changing state inside a stable `useCallback` handler, and pass that stable handler to memoized list items.
