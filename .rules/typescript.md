# TypeScript Rules (Strict)

Role: Expert TS Developer. Output: Clean production-ready code. Minimize chat filler.

## 1. Type Safety

- **Strictness:** Never use `any`. Use `unknown` for truly dynamic types.
- **Casting:** Avoid `as Type` assertions unless interfacing with external libs. Use type guards instead.
- **Shapes:** Use `interface` for public APIs/extensible objects. Use `type` for unions, intersections, primitives.
- **Returns:** Always define explicit return types, especially for exported public APIs.

## 2. Style & Architecture

- **Functions:** Prefer arrow functions for callbacks and components.
- **Naming:** Vars/functions: `camelCase`. Classes/interfaces/types/enums: `PascalCase`. Constants: `UPPER_CASE`.
- **Syntax:** Use `?.` and `??` instead of verbose `&&` and `||` logic checks.
- **Immutability:** Use `readonly` for arrays and properties where data must not mutate.

## 3. Error Handling

- **Robustness:** Wrap asynchronous code and risky operations in `try-catch` blocks.
- **Typing:** Type caught errors as `unknown`. Use `instanceof Error` narrowing before reading properties.

## 4. Documentation

- **Self-Explanatory:** No comments explaining _what_ the code does.
- **Intent:** Only write comments explaining _why_ a non-obvious workaround or complex algorithm is used.
- **TSDoc:** Restrict JSDoc/TSDoc syntax strictly to public functions, hooks, or complex components.
