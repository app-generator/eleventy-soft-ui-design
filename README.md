# [Soft UI Design](https://appseed.us/product/soft-ui-design/) `Eleventy` (11ty)

**Eleventy Soft UI** is an Eleventy adaptation of **[Soft UI Design System](https://appseed.us/product/soft-ui-design/)** (a user-friendly and beautiful design system based on Bootstrap 5), including a Blog system that uses Prismic CMS for content management. 
**Soft UI Design System** is built with over 70 frontend individual elements, like buttons, inputs, navbars, nav tabs, cards, or alerts, giving you the freedom of choosing and combining. All components can take variations in color, which you can easily modify using SASS files and classes.

- 👉 [Eleventy Soft UI](https://eleventy-soft-ui.appseed-srv1.com/) - LIVE Demo

<br />

> Features:

- ✅ UI: [Soft UI Design System](https://bit.ly/3v6JYIe) crafted by **Creative-Tim**
- ✅ **Prismic CMS** for blog posts
- ✅ CSS Pipeline (Sass, CleanCSS)
- ✅ JS Bundling (Webpack)
- ✅ SVG Icon Sprite Generation
- ✅ Critical CSS, HTML Minification

![Eleventy Soft UI Design - Open-source SSG starter provided by AppSeed in 11ty on top of Soft UI Design.](https://user-images.githubusercontent.com/51070104/128602712-4b38f18d-2154-4899-a796-aec0f7435329.png)

<br />

## Compile from Sources

> **Step #1** - Clone this repository

```bash
$ git clone https://github.com/app-generator/eleventy-soft-ui-design.git
$ cd eleventy-soft-ui-design 
```

<br />

> **Step #2** - Install modules via NPM or Yarn

```bash
$ npm i
// OR
$ yarn
```

<br />

> **Step #3** - Configure [Prismic](http://prismic.io/) API Node

Rename `.env.sample` to `.env` and specify the `PRISMIC_REPOSITORY_NAME`. In case you are not familiar with `Prismic`, feel free to use the `DEMO API` provided by AppSeed: `https://eleventy-soft-ui-design.prismic.io/api/v2`

```env
PRISMIC_REPOSITORY_NAME=YOUR_PRISMIC_API_URL
```

<br />

> **Step #4** - Start project in development mode

```bash
$ yarn start
```

Once the project is compiled and the content is pulled from `Prismic`, the project can be visited in the browser: `http://localhost:8080`.

<br />

## Codebase structure

```
eleventy-soft-ui-design
    ├── src/
    │ ├── assets/
    │ │ ├── css/
    │ │ ├── favicon/
    │ │ ├── fonts/
    │ │ ├── img/
    │ │ ├── js/
    │ │ ├── scripts/modules/app.js
    │ │ └── scss/app.scss
    │ ├── data/
    │ │ ├── app.json
    │ │ ├── meta.json
    │ │ └── prismicData.js
    │ ├── includes/
    │ ├── layouts/
    │ ├── pages/
    │ ├── sections/
    │ ├── 404.njk
    │ ├── feed.njk
    │ ├── index.njk
    │ ├── blog.njk
    │ ├── presentation.njk
    │ ├── robots.njk
    │ └── sitemap.njk
		├── utils/
    ├── .eleventy.js
    ├── .env.sample
    ├── .gitignore
    ├── .prettierrc
    ├──  netlify.toml
    └──  package.js
```

<br />

---
[Soft UI Design](https://appseed.us/product/soft-ui-design/) Eleventy (11ty) - Free starter provided by [AppSeed](https://appseed.us)
