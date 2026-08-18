# Frontend builder for multipage hybrid project

## Basic commands

- `npm i` - установить зависимости
- `npm run dev` - запустить режим разработки
- `npm run build` - создать build для продакшена
- `npm run build:empty` - создать build для продакшена c очисткой директории билда
- `npm run preview` - предпросмотр build для продакшена

## Additional commands

- `npm run docs` - cгенерировать документацию для компонентов
- `npm run eslint` - запустить линтер скриптов
- `npm run stylelint` - запустить линтер стилей

## Getting started

- установить зависимости `npm i`
- запустить режим разработки `npm run dev`

## Specification

> Vite - Rollup - ES module

> TypeScript - Pug - PostCSS

> Vue 3 - Pinia

> JS Docs

### VS Code Advisable Plugins

---

- [**EditorConfig**](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [**Prettier**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [**Stylelint**](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [**PostCSS Intellisense and Highlighting**](https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-postcss)
- [**Vue (Official)**](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Structure

---

```
root
| - email
| - plugins
| - public
| - src
```

- **email** - шаблоны email рассылок
- **plugins** - кастомные плагины vite
- **public** - статичные ресурсы, при сборке на продакшен все содержимое, с сохранением структуры папок, переноситься в директорию с билдом
- **src** - исходники проекта

---

```
src
|- api
|- assets
|- common
|- components
|- layout
|- pages
|- templates
```

- **api** - интерфейсы взаимодействия с внешними сервисами
- **assets** - svg _иконки_ (при билде генерируется спрайт) и _картинки_ (при билде оптимизируются и генерируется дубликат в формате webp для jpg и png)
- **common** - файлы базовой конфигурации проекта
- **components** - компоненты
- **layout** - layout и его компоненты
- **pages** - html страницы, точками входа для Vite
- **templates** - сборка компонентов, для подключения к html странице

```
src/components
| - features
| - shared
| - vendor
```

- **features** - компоненты бизнес логики
- **shared** - общие компоненты UI
- **vendor** - переопределение стилей сторонних плагинов

---
