## 2024-05-23 - Optimistic Updates & useRef
**Learning:** When using `useRef` to keep an event handler stable (to avoid re-renders), be careful with optimistic update rollbacks. If you rollback using `ref.current` inside a `catch` block, you might be setting state to the *optimistically updated* value (which is wrong) because the ref might have been updated by a render that happened during the async operation.
**Action:** Always capture the "before" state in a local variable at the start of the handler and use that local variable for rollbacks in the `catch` block.
