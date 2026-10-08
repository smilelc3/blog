/**
 * markdown-it-math-guard
 *
 * 把 $…$ 与 $$…$$ 区间在 markdown 解析阶段「保护」起来，
 * 使其中的 _ ^ { } 等字符不会被当成 Markdown 标记处理。
 *
 * 存在的理由：
 *   正文里的公式写成 $\sum^{n}_{i=1}$ 这种形式时，`_` 会被 markdown-it 的
 *   emphasis（斜体）规则吃掉，在 MathJax 看到之前就改写成 <em>：
 *
 *       $$ \sum^{n}<em>{i=1}{v</em>{i} x_i} $$     ← $ 配对错乱
 *
 *   一旦配对错乱，从该处起的整块公式都退化成纯文本。
 *
 *   直接 disable('emphasis') 行不通 —— markdown-it 的 emphasis 是**核心规则**，
 *   同时负责 *、_、**、__，关掉会连 **粗体** 一起失效。
 *
 *   本插件改为在 emphasis 之前把数学区间整体吃掉、转成一个纯文本 token，
 *   于是 _ 不再参与标记解析，公式原样留给前端 MathJax 渲染，
 *   而 *斜体* 与 **粗体** 完全不受影响。
 *
 * 无需任何配置：正文按标准 Markdown 写 $…$ / $$…$$ 即可。
 */

'use strict';

const DOLLAR = 0x24;

module.exports = function mathGuard(md) {
  function mathRule(state, silent) {
    const src = state.src;
    const start = state.pos;

    if (src.charCodeAt(start) !== DOLLAR) return false;

    // 开头连续 $ 的个数：>=2 视为块级公式，否则行内
    let run = 0;
    while (src.charCodeAt(start + run) === DOLLAR) run++;
    const open = run >= 2 ? 2 : 1;

    // 向后找下一个长度足够的 $ 串收尾
    let i = start + open;
    let close = -1;
    while (i < src.length) {
      if (src.charCodeAt(i) === DOLLAR) {
        let r = 0;
        while (src.charCodeAt(i + r) === DOLLAR) r++;
        if (r >= open) { close = i; break; }
        i += r;
        continue;
      }
      i++;
    }
    if (close === -1) return false; // 没有收尾，交给其它规则

    if (!silent) {
      const token = state.push('text', '', 0);
      token.content = src.slice(start, close + open);
    }
    state.pos = close + open;
    return true;
  }

  // 插到 emphasis 之前，保证 _ 先被本规则吃掉
  md.inline.ruler.before('emphasis', 'math_guard', mathRule);

  return md;
};
