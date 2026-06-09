---

-  Все UI компоненты выполены в виде **классов**, доступных в глобальной области видимости, как свойство обьекта **app** (window.app)

```
new app.Collapse(document.querySelector('.js-collapse'));
```

-  Экземпляры классов доступны в коллекции **classInstance** по ссылке на целевой DOM элемент

```
const myCollapse = app.classInstance.get(document.querySelector('.js-collapse'));
myCollapse.collapse.update();
```

-  Документация включаает в себя описание всех доступных UI компонентов, их параметров конструктора, публичных методов и кастомных событий
