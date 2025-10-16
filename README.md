# AIJ (AI Insight Journal) (виконав студент групи КІ-32, Риженко Нікіта)

## Опис
AIJ — це вебзастосунок для створення, публікації та читання статей з елементами аналітики на основі ШІ. Фронтенд побудовано на React (Vite), бекенд — на Node.js/Express з рендерингом статей через EJS.

Основна мета проєкту — зробити роботу з контентом швидкою та зручною, поєднавши генерацію/підказки ШІ з класичним редакторським потоком.

## Структура проєкту

```text
AIJ/
  backend/
    app.js
    index.js
    package-lock.json
    package.json
    post_sample_articles.js
    routes/
      articles.js
    server.js
    views/
      article.ejs
  eslint.config.js
  index.html
  package-lock.json
  package.json
  public/
    vite.svg
  README.md
  src/
    About.jsx
    Analitycs.jsx
    App.css
    App.jsx
    assets/
      react.svg
      web-logo.jpg
    Contact.jsx
    Home.jsx
    index.css
    main.jsx
    News.jsx
    Writer.jsx
  vite.config.js
```

- **backend/**: серверна частина на Node.js/Express, роути і рендер через EJS.
- **backend/server.js**: завантаження бази даних (MongoDB)
- **backend/routes/article.js**: API для взаємодії з базою даних (MongoDB)
- **backend/views/article.ejs**: шаблон для динамічної сторінки новин
- **src/**: фронтенд на React (Vite): сторінки/компоненти, стилі, активи.
- **public/**: публічні статичні файли, що віддаються як є.
- **vite.config.js**: конфігурація Vite для фронтенду.
- **index.html**: кореневий HTML-шаблон для Vite-додатку.