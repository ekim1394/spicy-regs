# Bolt's Journal

## 2025-02-18 - [React List Virtualization and Memoization]
**Learning:** Even with `react-virtuoso`, inline arrow functions for callback props in the `itemContent` render prop break referential equality for child components. This forces all rows to re-render whenever the parent state (like `bookmarks`) changes, defeating the purpose of virtualization optimization for updates.
**Action:** Use `useRef` to hold the latest state needed by callbacks to allow the callback itself to be referentially stable (via `useCallback` with empty deps). Then, wrap list items in `React.memo` and pass the stable callback directly, allowing the child to call it with its specific data.
