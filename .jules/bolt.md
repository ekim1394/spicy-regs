## 2024-05-22 - [React.memo in Data Viewer]
**Learning:** Found that list components (`CommentCard`, `DocketOrDocumentCard`) were NOT wrapped in `React.memo` despite memory claiming they were. This caused excessive re-renders when parent state changed (e.g. loading more items).
**Action:** Always verify memory claims against actual code. Implemented `React.memo` and referentially stable callbacks to optimize rendering.
