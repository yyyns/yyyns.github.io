# proper-photon 使用与改造指南

> 本文件说明这个工程的结构、如何修改各个页面、如何添加博客文章，以及如何部署。
> 工程基于 **Astro 官方 Blog Starter（Bear Blog 风格）**。

---

## 一、工程总览

### 技术栈

| 项目 | 版本 / 说明 |
| --- | --- |
| Astro | `7.3.4`（`package.json` 声明 `^7.3.4`） |
| Node | 要求 `>=22.12.0`（本机为 v24.15.0） |
| 集成 | `@astrojs/mdx`（MDX 支持）、`@astrojs/sitemap`（站点地图）、`@astrojs/rss`（RSS） |
| 图片处理 | `sharp`（构建时把 jpg 转成 webp 并生成多尺寸） |
| 字体 | 本地 Atkinson（`src/assets/fonts/*.woff`），通过 `astro.config.mjs` 的 `fonts` 配置注入 |
| 渲染模式 | 默认静态（SSG），`dist/` 输出纯静态 HTML |
| 样式 | 原生 CSS，无 Tailwind / 无 UI 框架 |

### 目录结构

```
proper-photon/
├── astro.config.mjs          # 站点总配置（site URL、集成、字体）★常改
├── package.json              # 依赖与脚本
├── tsconfig.json             # TS 严格模式
├── public/                   # 原样拷贝到 dist 根目录的静态资源
│   ├── favicon.ico
│   └── favicon.svg
└── src/
    ├── consts.ts             # 全站常量：站点标题、描述 ★常改
    ├── content.config.ts     # 博客内容集合的 schema（frontmatter 字段定义）★常改
    ├── assets/               # 会被 Astro 优化的图片与字体
    │   ├── blog-placeholder-{1..5}.jpg
    │   ├── blog-placeholder-about.jpg
    │   └── fonts/atkinson-{regular,bold}.woff
    ├── components/
    │   ├── BaseHead.astro     # <head> 全部内容：meta / OG / canonical / RSS ★常改
    │   ├── Header.astro       # 站点头部 + 导航链接 + 社交图标 ★常改
    │   ├── HeaderLink.astro   # 导航项（自动高亮当前页）
    │   ├── Footer.astro       # 页脚版权 ★常改
    │   └── FormattedDate.astro# 日期格式化（en-us 格式）★常改
    ├── layouts/
    │   └── BlogPost.astro     # 博客文章页布局（同时也是 about 页的布局）★常改
    ├── pages/                 # 路由：文件路径 = URL
    │   ├── index.astro        # /            首页 ★常改
    │   ├── about.astro        # /about       关于页 ★常改
    │   ├── rss.xml.js         # /rss.xml     RSS 订阅源
    │   └── blog/
    │       ├── index.astro    # /blog        文章列表 ★常改
    │       └── [...slug].astro# /blog/xxx/   文章详情（动态路由，一篇内容一个页面）
    ├── content/
    │   └── blog/              # ★所有博客文章都放这里
    │       ├── first-post.md
    │       ├── second-post.md
    │       ├── third-post.md
    │       ├── markdown-style-guide.md
    │       └── using-mdx.mdx
    └── styles/
        └── global.css         # 全站样式与主题变量（配色、字号）★常改
```

### 路由表

| URL | 生成来源 |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/about/` | `src/pages/about.astro` |
| `/blog/` | `src/pages/blog/index.astro` |
| `/blog/<文章名>/` | `src/pages/blog/[...slug].astro` 为 `src/content/blog/` 下每个文件生成一页 |
| `/rss.xml` | `src/pages/rss.xml.js` |
| `/sitemap-index.xml` | 构建时由 `@astrojs/sitemap` 生成 |

### 渲染链路（博客文章）

```
src/content/blog/xxx.md
   ↓ content.config.ts 中的 schema 校验 frontmatter
   ↓ src/pages/blog/[...slug].astro  getStaticPaths() 用 post.id 当 URL
   ↓ src/layouts/BlogPost.astro      渲染标题/日期/封面图
   ↓ <BaseHead> 写入 <head> 的 title / description / OG
   → dist/blog/xxx/index.html
```

---

## 二、初始模板备份

备份已完成，共两份，互为冗余：

### 1. Git 标签（仓库内，永久）

```
template-baseline  →  提交 bb68ccf "Initial commit from Astro"
```

这是你加任何自定义**之前**的纯净模板。

```bash
# 查看备份内容与当前代码的差异
git diff template-baseline HEAD

# 单独取出某个原始文件（不会改变工作区）
git show template-baseline:src/components/Header.astro

# 把某个文件恢复成模板原样
git checkout template-baseline -- src/components/Header.astro

# 整个工程恢复到模板状态（⚠️ 会覆盖所有未提交改动）
git checkout template-baseline -- .

# 想对比着看，可以开一个工作树，在另一个目录里打开模板
git worktree add ../proper-photon-template template-baseline
# 用完删除： git worktree remove ../proper-photon-template
```

### 2. 完整文件快照（仓库外）

```
/mnt/e/Documents/Webpages/my/proper-photon-template-backup/
```

共 38 个文件，是模板的完整源码拷贝（不含 `.git`、`node_modules`、`dist`）。
不受本仓库 git 操作影响，即使误删仓库也能从这里恢复。

> 当前代码相对模板的改动**只有两处**：
> - `src/consts.ts`：`SITE_TITLE` 由 `'Astro Blog'` 改为 `'Updating...'`
> - `package.json`：末尾多了几个空行
>
> 也就是说，模板的示例内容（5 篇文章、占位图、导航、页脚、配色）**全部还在**，需要按下面的清单逐项替换。

---

## 三、一次性初始化清单（建议按顺序做完）

打开本地开发服务器（见第七节），边改边看。

### ① 站点地址 —— `astro.config.mjs`

```js
export default defineConfig({
  site: 'https://yyyns.github.io',   // ← 改这里，当前是占位的 https://example.com
  integrations: [mdx(), sitemap()],
  // ...
});
```

**必须改。** 它决定 canonical 链接、`sitemap-index.xml` 和 RSS 里的绝对地址。
用自定义域名 `hylu.top` 就写 `https://hylu.top`。

### ② 站点标题与描述 —— `src/consts.ts`

```ts
export const SITE_TITLE = '你的站点名';
export const SITE_DESCRIPTION = '一句话描述，用于 SEO 和 RSS';
```

`SITE_TITLE` 会出现在浏览器标签、头部站点名、RSS 标题。

### ③ 头部导航与社交链接 —— `src/components/Header.astro`

- **导航项**：第 10–12 行，增删 `<HeaderLink>`：

  ```astro
  <HeaderLink href="/">首页</HeaderLink>
  <HeaderLink href="/blog">博客</HeaderLink>
  <HeaderLink href="/about">关于</HeaderLink>
  <!-- 新增页面就在这里加一行 -->
  <HeaderLink href="/projects">项目</HeaderLink>
  ```

  路径要和 `src/pages/` 里实际存在的文件对应，`HeaderLink` 会自动高亮当前页。

- **社交图标**：第 15–41 行，三个 `<a>` 分别是 Mastodon / Twitter / GitHub。
  把 `href` 换成你的主页；不需要的直接删掉整个 `<a>...</a>`。
  想换成别的平台，从 [simple-icons](https://simpleicons.org/) 取 SVG 的 `<path d="...">` 替换即可，`viewBox="0 0 16 16"` 的图标可直接沿用。注意 `aria-hidden="true"` 要保留，文字说明写在 `<span class="sr-only">` 里。

### ④ 页脚版权 —— `src/components/Footer.astro`

第 6 行：

```astro
&copy; {today.getFullYear()} 你的名字. All rights reserved.
```

年份是自动取的，只需改名字。社交图标同 ③ 处理。

### ⑤ `<head>` 元信息 —— `src/components/BaseHead.astro`

- 第 6 行 `FallbackImage`：没有指定封面图时 OG 分享图用它，建议换成自己的图。
- 第 49 行 OG 图片路径、第 52 行 Twitter card 类型，一般不用动。

### ⑥ 全站语言与配色

- **语言**：所有页面硬编码了 `<html lang="en">`，中文站建议改成 `zh-CN`。
  位置：`src/pages/index.astro:9`、`src/pages/blog/index.astro:16`、`src/layouts/BlogPost.astro:14`。
- **配色与字号**：`src/styles/global.css` 顶部 `:root` 里的变量：

  ```css
  :root {
    --accent: #2337ff;        /* 链接、引用条、导航高亮色 */
    --accent-dark: #000d8a;
    --black: 15, 18, 25;      /* 注意是 R, G, B 三个数字，不是十六进制 */
    --gray: 96, 115, 159;
    --gray-light: 229, 233, 240;
    --gray-dark: 34, 41, 57;
  }
  ```

  改这些变量就能整体换肤。深色模式目前**没有**，需要自己加。

### ⑦ 日期格式 —— `src/components/FormattedDate.astro`

第 11 行的 `'en-us'` 改成 `'zh-CN'`，并调整 `month: 'short'` 等选项，即可输出「2026年10月10日」这类格式。

### ⑧ 字体（可选）—— `astro.config.mjs` + `src/styles/global.css`

当前用本地 Atkinson 字体，第 11–34 行配置。`cssVariable: '--font-atkinson'` 通过 `<Font cssVariable="--font-atkinson" preload />`（在 `BaseHead.astro:35`）注入，`global.css:20` 用 `var(--font-atkinson)` 引用。

换字体有两种做法：

- **用 Google 字体**：把 `provider: fontProviders.local()` 换成 `fontProviders.google()`，`name` 改成字体名，删掉 `options.variants` 里的本地路径。
- **用自己的字体文件**：把 woff 放进 `src/assets/fonts/`，改 `src` 路径。

改完记得同步 `global.css` 里的 `var(--font-atkinson)`（或保留 `cssVariable` 名不变，就不用改 CSS）。

### ⑨ 清理示例内容

- 删除 `src/content/blog/` 下的 5 篇示例文章（`first-post.md`、`second-post.md`、`third-post.md`、`markdown-style-guide.md`、`using-mdx.mdx`）。
- 用真实图片替换 `src/assets/blog-placeholder-*.jpg`，或直接删掉（但 `BaseHead.astro` 引用了 `blog-placeholder-1.jpg`，删之前先改掉那一行）。
- 重写 `src/pages/about.astro` 的正文。
- 重写 `src/pages/index.astro` 的 `<main>` 内容（目前是「🧑🚀 Hello, Astronaut!」欢迎语）。
- 替换 `public/favicon.svg` 和 `public/favicon.ico`。

---

## 四、修改各个页面的全流程

### 关键概念：本模板**没有**全站通用布局

`src/layouts/` 里只有 `BlogPost.astro`，而且它是给**博客文章**用的。
`index.astro`、`about.astro`、`blog/index.astro` 各自**完整重复**了下面这个骨架：

```astro
---
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
---

<!doctype html>
<html lang="en">
	<head>
		<BaseHead title={SITE_TITLE} description={SITE_DESCRIPTION} />
	</head>
	<body>
		<Header />
		<main>
			<!-- 页面内容 -->
		</main>
		<Footer />
	</body>
</html>
```

**所以新建页面时必须自己写全这一套**，否则页面会没有 `<head>`、导航和页脚。

> 💡 想省事可以自己抽一个 `src/layouts/BaseLayout.astro`，把 `<BaseHead>/<Header>/<main><slot/></main>/<Footer>` 包起来，让所有页面都用它。这是本模板最值得做的一次重构。

---

### 场景 A：修改首页 `/`

**文件**：`src/pages/index.astro`

改 `<main>` 里的内容即可（第 15–46 行）。可以自由使用 HTML / Astro 语法，
例如想展示最新 3 篇文章：

```astro
---
import { getCollection } from 'astro:content';
const posts = (await getCollection('blog'))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3);
---
<!-- 在 <main> 里 -->
<ul>
  {posts.map((post) => (
    <li><a href={`/blog/${post.id}/`}>{post.data.title}</a></li>
  ))}
</ul>
```

### 场景 B：修改关于页 `/about`

**文件**：`src/pages/about.astro`

它复用了 `BlogPost.astro` 布局，所以顶部有 `title` / `description` / `pubDate` / `heroImage` 四个属性（第 6–11 行）。
正文直接写在 `<Layout>...</Layout>` 之间，支持 Markdown 之外的任意 HTML。
不想要封面图就删掉 `heroImage` 那一行。

### 场景 C：修改博客列表页 `/blog`

**文件**：`src/pages/blog/index.astro`

- **数据**：第 10–12 行 `getCollection('blog')` 取全部文章，按 `pubDate` 倒序。
- **布局规则**（写在 `<style>` 里）：**第一篇（最新一篇）会占满整行、大标题显示**，其余两列排布。这是在 `ul li:first-child` 里定义的。
- **卡片内容**：第 95–107 行。想改摘要就加 `<p>{post.data.description}</p>`。
- **只显示部分文章**：在 `.map()` 前加 `.slice(0, 10)`，或按 tag / 日期过滤。

### 场景 D：新建一个页面（例：`/projects`）

1. **建文件** `src/pages/projects.astro`，写全骨架（见本节开头）。
2. **加导航**：在 `src/components/Header.astro` 的 `.internal-links` 里加
   `<HeaderLink href="/projects">项目</HeaderLink>`。
3. **嵌套目录**也行：`src/pages/projects/index.astro` → `/projects/`；
   `src/pages/projects/foo.astro` → `/projects/foo/`。
4. **动态路由**：需要「一个页面渲染多条数据」时用 `[param].astro` + `getStaticPaths()`，
   参考 `src/pages/blog/[...slug].astro`。

> 关于结尾斜杠：默认构建产物是 `dist/projects/index.html`，即 URL 为 `/projects/`。
> 站内链接写成 `/projects/` 最稳妥（模板里博客链接就带尾斜杠）。

### 场景 E：改文章详情页的排版

**文件**：`src/layouts/BlogPost.astro`

- 封面图尺寸在第 63 行：`<Image width={1020} height={510} src={heroImage} alt="" />`
- 正文宽度 `.prose { width: 720px }`（第 33 行）
- 标题区（日期 + 标题 + 分割线）在第 66–79 行
- 想加「返回博客列表」链接、标签、阅读时长等，都在这里加
- ⚠️ 注意 `about.astro` 也用这个布局，改之前想清楚要不要区分

---

## 五、添加博客文章的全流程

### 1. 新建文件

在 `src/content/blog/` 下建一个 `.md`（或 `.mdx`）文件，**文件名就是 URL**：

| 文件 | 生成的 URL |
| --- | --- |
| `src/content/blog/hello-world.md` | `/blog/hello-world/` |
| `src/content/blog/2026/my-trip.md` | `/blog/2026/my-trip/` |

建议文件名用英文小写 + 连字符（如 `my-first-post.md`），避免中文和空格出现在 URL 里。

### 2. 写 frontmatter

字段定义在 `src/content.config.ts`，**写错会直接构建报错**：

```yaml
---
title: '文章标题'                          # 必填，字符串
description: '一句话摘要，用于 SEO 和列表页' # 必填，字符串
pubDate: 'Oct 10 2026'                    # 必填，任何能被 Date 解析的字符串
updatedDate: 'Oct 12 2026'                # 可选，填了就显示「Last updated on ...」
heroImage: '../../assets/my-cover.jpg'    # 可选，封面图
---

这里是正文，用标准 Markdown 写。
```

要点：

- **`heroImage` 的路径相对于这个 `.md` 文件本身**。文章在 `src/content/blog/`，所以要写 `../../assets/xxx.jpg`。图片放 `src/assets/` 下才会被优化（转 webp、压缩、生成多尺寸）。
- **日期格式**：`'Jul 08 2022'`、`'2026-10-10'`、`'2026-10-10T09:00:00Z'` 都可以。**建议统一一种**，否则排序看着乱。`pubDate` 决定列表页和 RSS 的顺序（倒序，新的在前）。
- **不写 `heroImage`**：列表页和详情页就不显示图（模板里有 `{heroImage && ...}` 判断），完全没问题。
- **想加字段**（如 `tags`、`draft`、`author`）：先在 `src/content.config.ts` 的 schema 里声明，再在文章里用。例如加草稿功能：

  ```ts
  // src/content.config.ts
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.optional(image()),
    tags: z.array(z.string()).default([]),   // 新增
    draft: z.boolean().default(false),       // 新增
  }),
  ```

  然后要在 `src/pages/blog/index.astro` 和 `src/pages/rss.xml.js` 里过滤掉草稿：

  ```ts
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)   // 加这一行
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  ```

  ⚠️ **注意**：`src/pages/blog/[...slug].astro` 的 `getStaticPaths()` 也要加同样的过滤，否则草稿仍会生成页面（只是不被链接）。

### 3. 在正文里插图

```markdown
![图片说明](../../assets/图名.jpg)
```

`src/assets/` 下的图片用相对路径引用，Astro 会自动优化。

### 4. 用 MDX（可选）

把文件后缀改成 `.mdx`，就能在正文里直接写 Astro 组件：

```mdx
import HeaderLink from '../../components/HeaderLink.astro';

<HeaderLink href="#">点我</HeaderLink>
```

（示例见 `src/content/blog/using-mdx.mdx`。注意：MDX 里的组件默认是静态 HTML，要交互需加 `client:*` 指令，但那需要额外装 React/Vue 等框架集成。）

### 5. 验证

保存后开发服务器会热更新，打开 `http://localhost:4321/blog/` 应该能看到新文章，点进去能看到详情页。
若报错，多半是 frontmatter 缺字段或 `heroImage` 路径不对。

### 6. ⚠️ 图片放进 `public/` 还是 `src/assets/`？

| | `src/assets/`（推荐） | `public/` |
| --- | --- | --- |
| 引用方式 | `heroImage: '../../assets/x.jpg'` 或 `![](../../assets/x.jpg)` | `/x.jpg` |
| 是否优化 | ✅ 压缩、转 webp、多尺寸 | ❌ 原样输出 |
| 能否被 `image()` schema 校验 | ✅ | ❌ |

**博客配图一律放 `src/assets/`。**

### 7. 数学公式（KaTeX，已配置好）

本工程已经配好数学公式渲染，**你只需要正常写 LaTeX 即可**。配置由三部分组成：

1. `astro.config.mjs` —— 开启 satteri 的数学解析，并挂上渲染插件：

   ```js
   markdown: {
     processor: satteri({
       features: { math: true },
       hastPlugins: [satteriKatex],
     }),
   },
   ```

2. `plugins/satteri-katex.mjs` —— 把 satteri 输出的占位节点替换成 KaTeX 渲染结果。
3. `src/components/BaseHead.astro` —— 引入 `katex/dist/katex.min.css`（**少了这行公式会显示错乱**）。

依赖：`katex`。

#### ⚠️ 块级公式必须多行写，这是最容易踩的坑

Astro 7 默认的 Markdown 引擎是 **satteri**。它的 `features.math` **只负责解析、不负责渲染**，并且对块级公式的判定很严格：

| 写法 | 渲染结果 |
| --- | --- |
| `$ e = a \times b $` | 行内公式 ✅ |
| `$$ x = 1 $$` ← **全在一行** | ⚠️ **仍然是行内公式**，不会居中成块 |
| `$$` ↵ 内容 ↵ `$$` ← **多行** | 块级公式 ✅ |
| `\[ ... \]` | ❌ 不支持，会原样输出文本 |

所以像 `cases` 这种多行公式，**三个 `$$` 必须各占一行**：

````markdown
$$
\begin{cases}
x + y = 1 \\
3x+4y=10
\end{cases}
$$
````

写成一行 `$$ \begin{cases} ... \end{cases} $$` 会被当成行内公式，`cases` 的两行会挤在一起显示。

#### 其他注意点

- **行内公式的 `$` 与内容之间不要加空格**也能解析，但保持一致更好读。
- 数学未解析时，`\\` 会被 Markdown 吃掉一个反斜杠（`\\` → `\`），导致公式出错；本工程已开启解析，正常写 `\\` 即可。
- 公式写错不会让构建失败，KaTeX 会把它渲染成红色（`throwOnError: false`）。若构建输出里出现 `KaTeX 渲染失败` 的警告，检查 LaTeX 括号与命令拼写。
- 深色模式下公式颜色需自行处理：在 `global.css` 里加 `.katex-display { color: inherit; }`。
- 参考实例：`src/content/blog/test.md`。

---

## 六、本地开发与构建命令

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖（`node_modules` 已存在，一般不用跑） |
| `npm run dev` | 开发服务器，默认 http://localhost:4321 |
| `npm run build` | 构建到 `dist/` |
| `npm run preview` | 本地预览构建产物 |
| `npm run astro -- check` | TypeScript / 内容 schema 类型检查（改完 schema 值得跑一次） |

按本仓库 `CLAUDE.md` 的约定，开发服务器用后台模式：

```bash
npm run astro -- dev --background   # 启动
npm run astro -- dev status         # 查看状态
npm run astro -- dev logs           # 查看日志
npm run astro -- dev stop           # 停止
```

> **运行环境提示**：本机 `node` 是 Windows 版（`C:\Program Files\nodejs`），
> 在 WSL 的 bash 里直接跑 `npm run dev` 可能因为找不到 `node` 而失败。
> 建议在 **Windows 的 PowerShell / CMD** 里执行上述命令；
> 若必须在 WSL 里跑，用 `"/mnt/c/Program Files/nodejs/node.exe" node_modules/astro/bin/astro.mjs dev`。
>
> 验证过：本项目在 Astro 7.3.4 + Node 24.15.0 下可以正常构建（8 个页面）。

---

## 七、部署到 GitHub Pages

### 现状（部署已配置完成）

- 远程仓库：`git@github.com:yyyns/yyyns.github.io.git` —— GitHub Pages 的**用户站点**仓库。
- 分支：
  - `master` ← Astro 工程源码（**源码，不是构建产物**）
  - `main` ← 旧版纯 HTML 站点（仅 `index.html` + `CNAME`），已废弃不用
- 自定义域名：`hylu.top`

**为什么不能直接把源码推上去就完事？** GitHub Pages 自己不会构建 Astro，它只能托管现成的 HTML。
所以本项目用「源码分支 + GitHub Actions 构建」模式：Actions 跑 `npm run build` 生成 `dist/`，
再把产物发布到 Pages。源码分支本身不影响托管内容。

以下三项**已经配置好**，无需重复操作：

| 项目 | 位置 | 内容 |
| --- | --- | --- |
| 部署工作流 | `.github/workflows/deploy.yml` | `withastro/action@v6` 构建 + `actions/deploy-pages@v5` 发布 |
| 自定义域名 | `public/CNAME` | `hylu.top`，构建时自动拷贝到 `dist/CNAME` |
| 站点地址 | `astro.config.mjs` | `site: 'https://hylu.top'` |

### ⚠️ 仍需你手动做的一步

**在 GitHub 仓库 Settings → Pages → Build and deployment → Source 选择 "GitHub Actions"**
（不要选 "Deploy from a branch"）。这一步无法用 git 完成，必须点一次网页。

若自定义域名未生效，还需：Settings → Pages → Custom domain 填 `hylu.top`，
并在域名服务商处把 DNS 指向 GitHub Pages（A 记录指向 4 个官方 IP，或 CNAME 指向 `yyyns.github.io`）。

### 工作流内容（已就位，供参考）

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Install, build, and upload site
        uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v5
```

> 版本号以官方 [withastro/action](https://github.com/withastro/action) README 为准；
> `withastro/action@v6` 默认用 Node 24，会自动执行 `npm run build` 并把 `dist/` 上传。
> 网上很多旧教程写的是 `@v3` / `deploy-pages@v4`，已过时。

### 日常发布流程

配好之后，发布就是普通的 git 操作：

```bash
npm run build          # 可选，本地先确认能构建通过
git add -A
git commit -m "post: 新文章"
git push origin master
```

推送后到仓库 **Actions** 标签页看进度，绿色的勾出现后站点即更新。

### 如何确认部署真的生效

```bash
npm run build
cat dist/CNAME                                   # 应为 hylu.top
grep -o 'https://[^<"]*' dist/rss.xml | head -3   # 应为 https://hylu.top/...
grep -o '<link rel="canonical"[^>]*>' dist/index.html
```

这三处都指向 `hylu.top` 才算配置正确（`site` 写错会导致 canonical / sitemap / RSS 全是错的地址，直接影响 SEO）。

> 💡 **为什么不把 `master` 改成 `main`？** GitHub 仓库的默认分支目前是 `main`（旧的 HTML 站点）。
> 如果想统一，把默认分支切到 `master`、或把 `master` 重命名成 `main` 并同步改 workflow 里的 `branches`。
> 不统一也不影响部署，只是别人点进仓库时默认看到的是废弃的旧分支。

---

## 八、常见坑速查

| 现象 | 原因 / 解决 |
| --- | --- |
| 构建报 frontmatter 错误 | `title`/`description`/`pubDate` 是必填；日期要能被 `new Date()` 解析 |
| `heroImage` 找不到图片 | 路径要**相对 `.md` 文件**，即 `../../assets/xxx.jpg` |
| 新页面没有样式/导航/页脚 | 忘记写全 `<BaseHead>/<Header>/<Footer>` 骨架（本模板没有通用布局） |
| 文章不显示 | 文件名/路径是否在 `src/content/blog/` 下；`pubDate` 是否合法 |
| 排序不对 | 列表按 `pubDate` 倒序，检查日期是否写错年份 |
| 站内链接 404 | 链接要带尾斜杠：`/blog/post-name/` |
| RSS / sitemap 里是 `example.com` | `astro.config.mjs` 的 `site` 没改 |
| 中文站但 `<html lang="en">` | 见第三节 ⑥，共 3 处 |
| 部署后样式丢失 | `site` 与实际路径不符；或用了子路径但没配 `base`（用户站点不需要 `base`） |

---

## 九、可选增强（按需）

1. **抽公共布局** `src/layouts/BaseLayout.astro` —— 消除三个页面的重复骨架，最推荐先做。
2. **深色模式** —— `global.css` 的 `:root` 变量加 `@media (prefers-color-scheme: dark)` 覆盖。
3. **文章标签 / 分类** —— schema 加 `tags: z.array(z.string())`，再建 `src/pages/tags/[tag].astro` 动态路由。
4. **草稿功能** —— 见第五节第 2 步。
5. **代码高亮主题** —— Astro 内置 Shiki，在 `astro.config.mjs` 配 `markdown.shikiConfig.theme`。
6. **上一篇 / 下一篇导航** —— 在 `BlogPost.astro` 里基于 `pubDate` 排序计算。
7. **评论系统** —— 接 Giscus（基于 GitHub Discussions）等第三方。
8. **SEO 增强** —— `BaseHead.astro` 里补 `og:site_name`、`og:locale`、JSON-LD 结构化数据。
9. **Tailwind** —— `npx astro add tailwind`。

---

## 十、备份恢复速查

```bash
# 看当前改动 vs 模板
git diff template-baseline HEAD

# 取回模板里的单个文件（不覆盖其它改动）
git checkout template-baseline -- 路径

# 全部恢复成模板（⚠️ 丢弃所有未提交改动）
git checkout template-baseline -- .

# 从仓库外快照恢复
cp -r /mnt/e/Documents/Webpages/my/proper-photon-template-backup/src ./src
```
