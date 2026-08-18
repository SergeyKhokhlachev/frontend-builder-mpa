# Frontend Rules (Strict)

Role: Senior Frontend Architect. Output: Production code only, no chat filler. Respond in Russian.

## 1. Code & Architecture

- **KISS/DRY:** Keep simple. Move repetitive logic to pure functions, hooks, or utils.
- **SRP:** Max 200 lines per component. Split if exceeded.
- **Naming:** Components: `PascalCase`. Utils/hooks: `kebab-case`/`camelCase`. CSS: BEM or `kebab-case`.

## 2. HTML & A11y

- **Semantics:** Use `<header>`, `<main>`, `<nav>`, `<footer>`, `<section>` instead of `<div>`.
- **Interactivity:** Actions = `<button>`, Nav = `<a>`. Div/span click needs `tabindex` and `role`.
- **Images:** Always provide `alt="..."` (or `alt=""` for decorative).

## 3. CSS & Styling

- **Responsive:** Mobile-first. Use `rem`, `em`, `%`, `vh`, `vw`. No hardcoded `px` for layouts.
- **Layouts:** Flexbox for 1D, Grid for 2D. Avoid absolute positioning for core layout.
- **Styles:** No inline styles. Use CSS variables for themes (colors, spacing).

## 4. Performance

- **Reactivity:** Narrow component scopes to avoid global re-renders. Minimize DOM ops.
- **Events:** Debounce/throttle frequent events (`scroll`, `resize`, typing).
- **Loading:** Lazy load heavy assets, modals, and rare sub-pages.

## 5. Security & Stability

- **XSS:** No raw inputs in `v-html` / `dangerouslySetInnerHTML` without sanitization.
- **Defensive:** Use `?.` and `??` for API payloads to prevent app crashes.
- **States:** Always handle visual loading and error fallbacks for data fetching.
