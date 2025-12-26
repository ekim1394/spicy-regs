# Bolt's Journal

## 2024-05-22 - Virtualized List Optimization
**Learning:** `Virtuoso`'s `itemContent` prop is a render prop. If defined inline, it creates a new function on every render, which can cause `Virtuoso` to re-render visible items unnecessarily if the child components aren't memoized or if the prop changes.
**Action:** Memoize `itemContent` with `useCallback` and ensure child components (`CommentCard`, `DocketOrDocumentCard`) are wrapped in `React.memo` and receive stable props (especially callbacks). Passing a stable handler `(item) => void` instead of `() => handler(item)` allows `React.memo` to work effectively.
