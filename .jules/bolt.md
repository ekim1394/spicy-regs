## 2024-05-23 - [Jules Created Bolt Journal]
**Learning:** Jules created the Bolt journal to track performance learnings.
**Action:** Use this file for future performance insights.
## 2024-05-23 - [Virtuoso Context Optimization]
**Learning:** Virtualized lists like `react-virtuoso` will re-render all visible items if the `itemContent` function reference changes, even if item data hasn't changed. To prevent this, data dependencies (like `bookmarks`) should be passed via the `context` prop, and `itemContent` should be a stable callback.
**Action:** Always use the `context` prop for dynamic data in virtualized lists and wrap item components in `React.memo`.
