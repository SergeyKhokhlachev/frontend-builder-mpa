# Frontend builder for multipage hybrid project

## Basic commands

-  `npm i` - установить зависимости
-  `npm run dev` - запустить режим разработки
-  `npm run build` - создать build для продакшена
-  `npm run build:empty` - создать build для продакшена c очисткой директории билда
-  `npm run preview` - предпросмотр build для продакшена

## Additional commands

-  `npm run docs` - cгенерировать документацию для компонентов
-  `npm run eslint` - запустить линтер скриптов
-  `npm run stylelint` - запустить линтер стилей

## Specification

> Vite 4 - Rollup - ES module

> TypeScript - Pug - PostCSS

> Vue 3 - Pinia

> JS Docs

### VS Code Advisable Plugins

---

-  [**EditorConfig**](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
-  [**Prettier**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
-  [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
-  [**Stylelint**](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
-  [**CSS Variable Autocomplete**](https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-css-variables)
-  [**PostCSS Intellisense and Highlighting**](https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-postcss)
-  [**Vetur**](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
-  [**Vue Language Features**](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
-  [**TypeScript Vue Plugin**](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

### Structure

---

```
root
| - pages
| - public
| - assets
| - source
```

-  **pages** - html страницы, каждая страница автоматически добавляется в сборку как отдельная точка входа
-  **public** - статичные ресурсы, при сборке на продакшен все содержимое, с сохранением структуры папок, переноситься в директорию с билдом
-  **assets** - svg _иконки_ (при билде генерируется спрайт) и _картинки_ (при билде оптимизируются и генерируется дубликат в формате webp для jpg и png)
-  **source** - исходники проекта

---

```
source
|- api
|- app
|- pages
|- layouts
|- shared
|- entities
|- features
|- widgets
```

-  **api** - интерфейсы взаимодействия с внешними сервисами
-  **app** - файлы базовой конфигурации, сборка ядра проекта
-  **pages** - сборка компонентов, подключаемых на страницах
-  **layouts** - шаблоны страниц
-  **shared** - базовые элементы UI, не обладающие бизнес логикой
-  **entities** - компоненты реализующие часть логики фичи
-  **features** - компоненты реализующие логику отдельной фичи
-  **widgets** - составные компоненты, включающие в себя реализацию нескольких фич

### Development

---

-  [**Создание страницы**](#)
-  [**Создание компонента**](#)
-  [**Работа с иконками и картинками**](#)
