/**
 * hexo-mermaid-diagram
 *
 * 把标准 ```mermaid 代码围栏转成 **NexT 主题自带加载器可直接渲染** 的 HTML。
 *
 * 为什么需要它（而不是 hexo-filter-mermaid-diagrams）：
 *   NexT 自带的 mermaid 加载器用
 *       document.querySelectorAll('pre > .mermaid')
 *   找元素，要求 .mermaid 是 <pre> 的**子元素**。而 hexo-filter-mermaid-diagrams
 *   输出的是 <pre class="mermaid">（class 在 <pre> 上），选择器命中不到
 *   ⇒ mermaid 库根本不会加载 ⇒ 流程图只显示一段纯文本。
 *
 *   本插件输出的正是主题期望的结构：
 *       <pre><code class="mermaid">flowchart TD …</code></pre>
 *   因此**主题自带的 mermaid.js 直接就能渲染**，无需任何自定义前端 JS、
 *   无需注入模板、无需修改主题或其它插件。
 *
 * 为什么内容是纯文本：
 *   mermaid 在元素含子元素时读 innerHTML、否则读 textContent。
 *   <code> 里只有转义后的文本，走 textContent 路径，解析正确。
 *
 * 为什么放在 before_post_render：
 *   该阶段早于 markdown 渲染。先把围栏换成 HTML 块，markdown 渲染器看到的是
 *   原始 HTML（markdown-it 默认 html:true 会原样输出），不会再去包一层 <code>
 *   或加语法高亮 span。若放到渲染之后处理，就得先剥掉渲染器加的外层标签。
 *
 * 配置（可选，写在 hexo 的 _config.yml）：
 *   mermaid:
 *     enable: true      # 默认 true；设为 false 则完全不处理
 */

'use strict';

// 匹配 ```mermaid ... ``` （允许围栏前有缩进、结尾有额外空行）
const FENCE = /(\s*)(`{3,})[ \t]*mermaid[ \t]*\r?\n([\s\S]+?)\r?\n[ \t]*\2[ \t]*(?=\r?\n|$)/g;

// 这些文件类型不处理（与原 hexo-filter-mermaid-diagrams 保持一致）
const SKIP_EXT = ['.js', '.css', '.html', '.htm'];

function shouldSkip(data) {
  const source = data.source || '';
  const dot = source.lastIndexOf('.');
  if (dot === -1) return false;
  return SKIP_EXT.includes(source.slice(dot).toLowerCase());
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

hexo.extend.filter.register('before_post_render', function (data) {
  const cfg = this.config.mermaid || {};
  if (cfg.enable === false) return data;
  if (!data.content || data.content.indexOf('mermaid') === -1) return data;
  if (shouldSkip(data)) return data;

  data.content = data.content.replace(FENCE, (match, indent, fence, code) => {
    return `${indent}<pre><code class="mermaid">${escapeHtml(code.trim())}</code></pre>`;
  });

  return data;
}, 9); // 与 hexo-filter-mermaid-diagrams 相同的优先级

/**
 * 顺带保护数学公式：把 $…$ / $$…$$ 区间在 markdown 解析阶段整体吃掉，
 * 使其中的 _ ^ { } 不被当成 Markdown 标记（详见 lib/math-guard.js）。
 *
 * hexo-renderer-markdown-it 在构造函数末尾会触发 'markdown-it:renderer' 过滤器，
 * 把 parser 传出来，正好可以在这里挂插件 —— 无需改动或补丁该渲染器。
 *
 * 如果换用其它渲染器（marked 等），这个过滤器不会触发，本段自动失效，
 * 数学公式交回给前端 MathJax 处理（保留原有行为）。
 */
hexo.extend.filter.register('markdown-it:renderer', function (md) {
  md.use(require('./lib/math-guard'));
  return md;
});
