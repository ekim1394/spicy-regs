# Bolt's Journal

## 2024-05-22 - Optimized DataViewer Rendering
**Learning:** `Virtuoso`'s `itemContent` prop is called frequently. Passing inline functions to `itemContent` or inline callbacks to children components within `itemContent` breaks memoization, causing O(N) re-renders of heavy list items (e.g. `CommentCard`) when parent state (like `loadingMore`) changes.
**Action:** Always memoize `itemContent` with `useCallback`. Ensure children components are wrapped in `React.memo` and accept stable callback references (e.g. `onToggle(item)` instead of `() => onToggle(item)` defined inline).
**Note:** When using `React.memo` on list items, ensure that callback props are stable. If the callback depends on the item, define the prop as `(item: T) => void` and pass a stable parent handler, rather than creating a closure `() => handler(item)` inside the render loop.
