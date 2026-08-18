# Vue 3, Pinia & Router Rules (Strict)

Vue 3, Vite, TS expert. Output: Clean production code. No dynamic code examples in responses.

## 1. Vue 3 SFC Structure

- **Script Setup:** Always use `<script setup lang="ts">`. No Options API or `defineComponent`.
- **Layout Order:** 1. `<template>`, 2. `<script setup>`, 3. `<style scoped>`.

## 2. Reactivity & TS Typing

- **Props/Emits:** Use pure TS type-based macros: `defineProps<P>()` and `defineEmits<E>()`.
- **Props Defaults:** Use standard destructuring with `withDefaults`.
- **Refs vs Reactive:** Use `ref()` for primitives/arrays (type if needed). Use `reactive()` only for complex nested objects/forms with strict `interface`.
- **DOM Refs:** Explicitly type template refs: `ref<HTMLInputElement | null>(null)`.

## 3. Composables & Template

- **Composables:** Prefix names with `use` (e.g., `useAuth`). Return `readonly(state)` to protect data. Clean up listeners in `onUnmounted()`.
- **v-for Keys:** Always use unique primitive dynamic `:key`. Never use array index.
- **v-if with v-for:** Never combine on one element. Use `<template>` wrapper or `computed()` filtering.

## 4. Pinia State Management

- **Setup Stores:** Use function syntax `defineStore('id', () => { ... })` mirroring Composition API. No Option stores.
- **Mutations:** Mutate state only via actions. Components must read state via `storeToRefs(store)` to keep reactivity.
- **Inference:** Let TS infer state/getters from `ref`/`computed`. Type action parameters explicitly.

## 5. Vue Router & Guards

- **Meta Typing:** Extend `RouteMeta` via `declare module 'vue-router'` for strict property typing.
- **Guards:** Type navigation guards strictly. Use named routes (`{ name: 'Home' }`) for redirects. No hardcoded paths.
- **Params/Query:** Always validate or cast `route.params` and `route.query` before use. Prefer `props: true` route matching.
- **API:** Use `useRoute()` and `useRouter()`. No legacy `this.$router`.
