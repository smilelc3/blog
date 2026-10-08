# 博客原始资源 git

### 目录结构

| 路径 | 说明 |
| --- | --- |
| `markdown/` | 博客正文 |
| `images/` | 图片等多媒体资源，兼作图床 |
| `deploy/` | hexo 定制化：两个 `yq` 配置脚本 + 自带的 mermaid 插件 |
| `.github/workflows/` | CI：构建与部署 |

### CI 的构建步骤（`deploy.yml`）



### Mermaid：为什么自建了一个插件

NexT 自带的 mermaid 加载器用

```js
document.querySelectorAll('pre > .mermaid')
```

找元素，要求 `.mermaid` 是 `<pre>` 的**子元素**。而社区常用的
`hexo-filter-mermaid-diagrams` 输出的是 `<pre class="mermaid">`（class 在 `<pre>` 上），
选择器命中不到 ⇒ mermaid 库根本不会加载 ⇒ 流程图只显示一段纯文本。

**与其给它打补丁，不如换一个输出结构正确的插件。**
`deploy/hexo-mermaid-diagram` 是本站自带的插件，输出：

```html
<pre><code class="mermaid">flowchart TD …</code></pre>
```

正好命中主题的选择器，于是**主题自带的加载器直接就能渲染**。
它是个标准的 Hexo 插件（`package.json` + `before_post_render` 过滤器），
CI 里用 `npm install ./deploy/hexo-mermaid-diagram` 安装，不是补丁。

> 内容必须是**纯文本**：mermaid 在元素含子元素时读 `innerHTML`、否则读
> `textContent`；`<code>` 里只有文本，走后者，解析正确。
