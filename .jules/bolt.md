## 2025-05-23 - Virtualized List Optimization with Virtuoso
**Learning:** `Virtuoso`'s `itemContent` prop is called frequently. Passing unstable callbacks (like inline arrow functions `() => toggle(item)`) or unstable components causes excessive re-renders of list items, even if they are memoized.
**Action:** Always:
1. Wrap list item components in `React.memo`.
2. Ensure callbacks passed to items are stable or use a pattern where the item component calls the callback with its own data (e.g. `onToggle(item)`).
3. If the callback depends on changing state (like `bookmarks`), use a `useRef` to access the latest state inside the callback without changing the callback reference.
