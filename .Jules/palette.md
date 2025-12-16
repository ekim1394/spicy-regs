## 2024-05-23 - Async Action Feedback
**Learning:** Users often click buttons multiple times if they don't see immediate feedback for async actions (like signing out), leading to potential race conditions or frustration.
**Action:** Always add a loading state (spinner + text change) and disable the button for any async operation, no matter how fast it usually is.
