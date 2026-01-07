# Sentinel Journal 🛡️

This journal records CRITICAL security learnings, vulnerability patterns, and architectural gaps found in the codebase.

## Format
Each entry should follow this format:
```markdown
## 2024-05-24 - [Fix Stored XSS in CommentCard]
**Vulnerability:** The `CommentCard` component used `dangerouslySetInnerHTML` to render `commentText` without sanitization. This could allow Stored XSS if the comment text contained malicious scripts.
**Learning:** Never trust data from external sources, even if it seems benign. `dangerouslySetInnerHTML` should always be paired with a sanitization library like `dompurify`.
**Prevention:** Always use `DOMPurify.sanitize()` before passing any content to `dangerouslySetInnerHTML`.
```
